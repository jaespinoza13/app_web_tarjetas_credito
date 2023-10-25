using Domain.Common;
using Domain.Models.Login;
using Domain.Models.Login.Entities;
using Domain.Models.Usuario.GetPerfiles;
using Infrastructure.Usuario;
using RestSharp;
using System.Diagnostics;
using System.Net;
using System.Text;
using System.Text.Json;

namespace Infrastructure.Login {
    public class LoginDat {
        private readonly AppSettings _settings;

        public LoginDat( AppSettings settings ) {
            _settings = settings;
        }

        public ResLogin auth( ReqLogin reqLogin ) {
            ResLogin res = new ResLogin();
            try {
                var options = new RestClientOptions(_settings.gw_logs + _settings.service_autentificar) {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };
                var client = new RestClient(options);

                string auth_basic = Convert.ToBase64String(ASCIIEncoding.ASCII.GetBytes(_settings.auth_user_gw_logs + ":" + _settings.auth_pass_gw_logs));

                var request = new RestRequest()
                    .AddHeader("Authorization-Gateway", "Auth-Gateway " + auth_basic)
                    .AddHeader("Content-Type", "application/json")
                    .AddParameter("application/json", reqLogin, ParameterType.RequestBody);

                request.Method = Method.Post;
                var response = new RestResponse();
                response = client.Post(request);
                if(response.StatusCode == HttpStatusCode.OK) {
                    res = JsonSerializer.Deserialize<ResLogin>(response.Content!)!;
                    if(res.T is not null) {
                        JsonElement json = (JsonElement) res.T;
                        DatosUsuarioDTO dtu = json.Deserialize<DatosUsuarioDTO>()!;
                        //Logueo primera vez
                        if(res.codigo == "L1") {
                            res.codigo = "004";
                            dtu.nro_perfiles = 1;
                            res.datosUsuario = dtu;
                        }
                        //Logueo con contraseña caducada
                        if(res.codigo == "L2") {
                            res.codigo = "003";
                            dtu.nro_perfiles = 1;
                            res.datosUsuario = dtu;
                        }
                        //Logueo exitoso, el usuario solo tiene un perfil
                        if(res.codigo == "L3") {
                            res.codigo = "000";
                            dtu.nro_perfiles = 1;
                            res.datosUsuario = dtu;
                        }
                        //Logueo exitoso, el usuario tiene más de un perfil
                        if(res.codigo == "L4") {
                            UsuarioDat usuarioDat = new UsuarioDat(_settings);
                            ResGetPerfiles resPerfiles = usuarioDat.getPerfilesUsuario(dtu.id_usuario, _settings.id_sistema);
                            if(resPerfiles.lst_perfiles is null || resPerfiles.lst_perfiles.Count <= 0) {
                                res.mensajes = new string [1];
                                res.mensajes [0] = "No tiene asignado acceso a este sistema, solicítelo al Oficial de Seguridad de la Información!!!";
                                res.codigo = "001";
                            } else if(resPerfiles.lst_perfiles.Count == 1) {
                                dtu.nro_perfiles = 1;
                                dtu.id_perfil = resPerfiles.lst_perfiles.First().per_id;
                                dtu.nombre_perfil = resPerfiles.lst_perfiles.First().per_nombre;
                                if(verificar_horario(dtu.id_usuario, _settings.id_sistema, dtu.id_perfil)) {
                                    res.codigo = "000";
                                    res.datosUsuario = dtu;
                                } else {
                                    res.mensajes = new string [1];
                                    res.mensajes [0] = "Disculpe pero en este momento no puede ingresar con el perfil: " + dtu.nombre_perfil + " <br> FUERA DE HORARIO !!!";
                                    res.codigo = "001";
                                }
                            } else {
                                dtu.nro_perfiles = resPerfiles.lst_perfiles.Count;
                                res.datosUsuario = dtu;
                                res.lst_perfiles = resPerfiles.lst_perfiles;
                                res.codigo = "002";
                            }
                        }
                        //LOGUEO_PERMISOS_DENEGADOS = "L5";
                        //LOGUEO_CONTRASENIA_ERRONEA = "L6";
                        //LOGUEO_DISPOSITIVO_NO_REGISTRADO = "L7";
                        //LOGUEO_EXITOSO_FUERA_HORARIO = "L8";
                    }
                } else {
                    res.mensajes = new string [1];
                    res.mensajes [0] = "Datos sin respuesta";
                    res.codigo = "001";
                }
            } catch(Exception ex) {
                Debug.WriteLine(ex.ToString());
                res.mensajes = new string [1];
                res.mensajes [0] = ex.Message;
                res.codigo = "001";
            }
            return res;
        }

        public bool verificar_horario( int id_usuario, int id_sistema, int id_perfil ) {
            try {
                var options = new RestClientOptions(_settings.gw_logs + _settings.service_verificar_horario + "/" + id_usuario + "/" + id_sistema + "/" + id_perfil) {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };
                var client = new RestClient(options);

                string auth_basic = Convert.ToBase64String(ASCIIEncoding.ASCII.GetBytes(_settings.auth_user_gw_logs + ":" + _settings.auth_pass_gw_logs));

                var request = new RestRequest().AddHeader("Authorization-Gateway", "Auth-Gateway " + auth_basic);

                var response = new RestResponse();
                response = client.Get(request);
                if(response.StatusCode == HttpStatusCode.OK) {
                    int status = JsonSerializer.Deserialize<int>(response.Content!)!;
                    return status == 1;
                }
            } catch(Exception ex) {
                Debug.WriteLine(ex.ToString());
            }
            return false;
        }

        public bool cerrar_session( int id_usuario ) {
            try {
                var options = new RestClientOptions(_settings.gw_logs + _settings.service_cerrar_session) {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };
                var client = new RestClient(options);

                string auth_basic = Convert.ToBase64String(ASCIIEncoding.ASCII.GetBytes(_settings.auth_user_gw_logs + ":" + _settings.auth_pass_gw_logs));

                var request = new RestRequest()
                    .AddHeader("Authorization-Gateway", "Auth-Gateway " + auth_basic)
                    .AddHeader("Content-Type", "application/json")
                    .AddParameter("application/json", new { id_usuario = id_usuario }, ParameterType.RequestBody);

                request.Method = Method.Post;
                var response = new RestResponse();
                response = client.Post(request);
                if(response.StatusCode == HttpStatusCode.OK) {
                    int status = JsonSerializer.Deserialize<int>(response.Content!)!;
                    return status == 1;
                }
            } catch(Exception ex) {
                Debug.WriteLine(ex.ToString());
            }
            return false;
        }
    }
}
