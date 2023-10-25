using Domain.Common;
using Domain.Models.Usuario.Entities;
using Domain.Models.Usuario.GetPerfiles;
using Domain.Models.Usuario.GetPreguntaUsuario;
using Domain.Models.Usuario.GetValidarPregunta;
using Domain.Models.Usuario.SetPassPrimeraVez;
using Domain.Models.Usuario.SetPassword;
using Domain.Models.Usuario.SetPreguntas;
using RestSharp;
using System.Diagnostics;
using System.Net;
using System.Text;
using System.Text.Json;

namespace Infrastructure.Usuario {
    public class UsuarioDat {
        private readonly AppSettings _settings;

        public UsuarioDat( AppSettings settings ) {
            _settings = settings;
        }

        #region SET
        public ResSetPreguntas setPreguntas( ReqSetPreguntas reqSetPreguntas ) {
            ResSetPreguntas res = new ResSetPreguntas();
            try {
                var options = new RestClientOptions(_settings.gw_logs + _settings.service_set_preguntas) {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };
                var client = new RestClient(options);

                string auth_basic = Convert.ToBase64String(ASCIIEncoding.ASCII.GetBytes(_settings.auth_user_gw_logs + ":" + _settings.auth_pass_gw_logs));

                var request = new RestRequest()
                    .AddHeader("Authorization-Gateway", "Auth-Gateway " + auth_basic)
                    .AddHeader("Content-Type", "application/json")
                    .AddParameter("application/json", reqSetPreguntas, ParameterType.RequestBody);

                request.Method = Method.Post;
                var response = new RestResponse();
                response = client.Post(request);
                if(response.StatusCode == HttpStatusCode.OK) {
                    res = JsonSerializer.Deserialize<ResSetPreguntas>(response.Content!)!;
                    res.codigo = res.codigo == "CPR1" ? "0000" : "0001";

                } else {
                    res.codigo = "0001";
                    res.mensajes = new string [1];
                    res.mensajes [0] = response.StatusCode + " - " + response.ErrorException;
                }
            } catch(Exception ex) {
                Debug.WriteLine(ex.ToString());
                Console.WriteLine(ex.ToString());
                res.codigo = "0001";
                res.mensajes = new string [1];
                res.mensajes [0] = "Ocurrió un error al cambiar las preguntas";
            }
            return res;
        }

        public ResSetPassword setPassword( ReqSetPassword reqSetPassword ) {
            ResSetPassword res = new ResSetPassword();
            try {
                var options = new RestClientOptions(_settings.gw_logs + _settings.service_set_cambiar_password) {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };
                var client = new RestClient(options);

                string auth_basic = Convert.ToBase64String(ASCIIEncoding.ASCII.GetBytes(_settings.auth_user_gw_logs + ":" + _settings.auth_pass_gw_logs));

                var request = new RestRequest()
                    .AddHeader("Authorization-Gateway", "Auth-Gateway " + auth_basic)
                    .AddHeader("Content-Type", "application/json")
                    .AddParameter("application/json", reqSetPassword, ParameterType.RequestBody);

                request.Method = Method.Post;
                var response = new RestResponse();
                response = client.Post(request);
                if(response.StatusCode == HttpStatusCode.OK) {
                    res = JsonSerializer.Deserialize<ResSetPassword>(response.Content!)!;
                    res.codigo = res.codigo == "CP1" ? "0000" : "0001";
                } else {
                    res.codigo = "0001";
                    res.mensajes = new string [1];
                    res.mensajes [0] = response.StatusCode + " - " + response.ErrorException;
                }
            } catch(Exception ex) {
                Debug.WriteLine(ex.ToString());
                Console.WriteLine(ex.ToString());
                res.codigo = "0001";
                res.mensajes = new string [1];
                res.mensajes [0] = "Ocurrió un error al cambiar la clave";
            }
            return res;
        }

        public ResSetPassword resetPassword( ReqSetPassword reqSetPassword ) {
            ResSetPassword res = new ResSetPassword();
            try {
                var options = new RestClientOptions(_settings.gw_logs + _settings.service_set_resetear_password) {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };
                var client = new RestClient(options);

                string auth_basic = Convert.ToBase64String(ASCIIEncoding.ASCII.GetBytes(_settings.auth_user_gw_logs + ":" + _settings.auth_pass_gw_logs));

                var request = new RestRequest()
                    .AddHeader("Authorization-Gateway", "Auth-Gateway " + auth_basic)
                    .AddHeader("Content-Type", "application/json")
                    .AddParameter("application/json", reqSetPassword, ParameterType.RequestBody);

                request.Method = Method.Post;
                var response = new RestResponse();
                response = client.Post(request);
                if(response.StatusCode == HttpStatusCode.OK) {
                    res = JsonSerializer.Deserialize<ResSetPassword>(response.Content!)!;
                    res.codigo = res.codigo == "RP1" ? "0000" : "0001";
                } else {
                    res.codigo = "0001";
                    res.mensajes = new string [1];
                    res.mensajes [0] = response.StatusCode + " - " + response.ErrorException;
                }
            } catch(Exception ex) {
                Debug.WriteLine(ex.ToString());
                Console.WriteLine(ex.ToString());
                res.codigo = "0001";
                res.mensajes = new string [1];
                res.mensajes [0] = "Ocurrió un error al cambiar la clave";
            }
            return res;
        }

        public ResSetPassPrimeraVez setPassPrimeraVez( ReqSetPassPrimeraVez reqSetPassPrimeraVez ) {
            ResSetPassPrimeraVez res = new ResSetPassPrimeraVez();
            try {
                var options = new RestClientOptions(_settings.gw_logs + _settings.service_set_pass_primera_vez) {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };
                var client = new RestClient(options);

                string auth_basic = Convert.ToBase64String(ASCIIEncoding.ASCII.GetBytes(_settings.auth_user_gw_logs + ":" + _settings.auth_pass_gw_logs));

                var request = new RestRequest()
                    .AddHeader("Authorization-Gateway", "Auth-Gateway " + auth_basic)
                    .AddHeader("Content-Type", "application/json")
                    .AddParameter("application/json", reqSetPassPrimeraVez, ParameterType.RequestBody);

                request.Method = Method.Post;
                var response = new RestResponse();
                response = client.Post(request);
                if(response.StatusCode == HttpStatusCode.OK) {
                    res = JsonSerializer.Deserialize<ResSetPassPrimeraVez>(response.Content!)!;
                    res.codigo = res.codigo == "CPP1" ? "0000" : "0001";
                } else {
                    res.codigo = "0001";
                    res.mensajes = new string [1];
                    res.mensajes [0] = response.StatusCode + " - " + response.ErrorException;
                }
            } catch(Exception ex) {
                Debug.WriteLine(ex.ToString());
                Console.WriteLine(ex.ToString());
                res.codigo = "0001";
                res.mensajes = new string [1];
                res.mensajes [0] = "Ocurrió un error al cambiar la clave";
            }
            return res;
        }
        #endregion

        #region GET
        public ResGetPerfiles getPerfilesUsuario( int id_usuario, int id_sistema ) {
            ResGetPerfiles res = new ResGetPerfiles();
            try {
                var options = new RestClientOptions(_settings.gw_logs + _settings.service_get_perfiles + "/" + id_usuario + "/" + id_sistema) {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };
                var client = new RestClient(options);

                string auth_basic = Convert.ToBase64String(ASCIIEncoding.ASCII.GetBytes(_settings.auth_user_gw_logs + ":" + _settings.auth_pass_gw_logs));

                var request = new RestRequest().AddHeader("Authorization-Gateway", "Auth-Gateway " + auth_basic);

                var response = new RestResponse();
                response = client.Get(request);
                if(response.StatusCode == HttpStatusCode.OK) {
                    List<PerfilDTO> lst_perfles = JsonSerializer.Deserialize<List<PerfilDTO>>(response.Content!)!;
                    res.lst_perfiles = lst_perfles;
                }
            } catch(Exception ex) {
                Debug.WriteLine(ex.ToString());
            }
            return res;
        }

        public Preguntas getPreguntas() {
            Preguntas res = new Preguntas();
            try {
                var options = new RestClientOptions(_settings.gw_logs + _settings.service_get_preguntas) {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };
                var client = new RestClient(options);

                string auth_basic = Convert.ToBase64String(ASCIIEncoding.ASCII.GetBytes(_settings.auth_user_gw_logs + ":" + _settings.auth_pass_gw_logs));

                var request = new RestRequest().AddHeader("Authorization-Gateway", "Auth-Gateway " + auth_basic);

                var response = new RestResponse();
                response = client.Get(request);
                if(response.StatusCode == HttpStatusCode.OK) {
                    List<PreguntaDTO> lst_perfles = JsonSerializer.Deserialize<List<PreguntaDTO>>(response.Content!)!;
                    res.preguntas = lst_perfles;
                    res.codigo = "0000";
                    res.mensaje = "OK";
                } else {
                    res.codigo = "0001";
                    res.mensaje = response.StatusCode.ToString() + " - " + response.ErrorMessage;
                }
            } catch(Exception ex) {
                Debug.WriteLine(ex.ToString());
                Console.WriteLine(ex.ToString());
                res.codigo = "0001";
                res.mensaje = "Ocurrió un error, por favor intentelo nuevamente";
            }
            return res;
        }

        public ResGetPreguntaUsuario getPreguntaUsuario( string login ) {
            ResGetPreguntaUsuario res = new ResGetPreguntaUsuario();
            try {
                var options = new RestClientOptions(_settings.gw_logs + _settings.service_get_pregunta_usuario + "/" + login) {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };
                var client = new RestClient(options);

                string auth_basic = Convert.ToBase64String(ASCIIEncoding.ASCII.GetBytes(_settings.auth_user_gw_logs + ":" + _settings.auth_pass_gw_logs));

                var request = new RestRequest().AddHeader("Authorization-Gateway", "Auth-Gateway " + auth_basic);

                var response = new RestResponse();
                response = client.Get(request);
                if(response.StatusCode == HttpStatusCode.OK) {
                    ResComunWsSistemas respuestaWs = JsonSerializer.Deserialize<ResComunWsSistemas>(response.Content!)!;
                    if(respuestaWs.codigo == "RP1") {
                        JsonElement jsonElement = (JsonElement) respuestaWs.T;
                        res = jsonElement.Deserialize<ResGetPreguntaUsuario>()!;
                        if(res is null) {
                            res = new ResGetPreguntaUsuario();
                            res.codigo = "0001";
                            res.mensaje = "Ocurrió un error";
                        } else {
                            res.codigo = "0000";
                            res.mensaje = "OK";
                        }
                    } else if(respuestaWs.codigo == "RP6") {
                        res.codigo = "0002";
                        res.mensaje = respuestaWs.mensajes [0];
                    } else {
                        res.codigo = "0001";
                        res.mensaje = respuestaWs.mensajes [0];
                    }
                } else {
                    res.codigo = "0001";
                    res.mensaje = response.StatusCode.ToString() + " - " + response.ErrorMessage;
                }
            } catch(Exception ex) {
                Debug.WriteLine(ex.ToString());
                Console.WriteLine(ex.ToString());
                res.codigo = "0001";
                res.mensaje = "Ocurrió un error, por favor intentelo nuevamente";
            }
            return res;
        }

        public ResComunWsSistemas getValidarPregunta( ReqGetValidarPregunta reqGetValidarPregunta ) {
            ResComunWsSistemas res = new ResComunWsSistemas();
            try {
                var options = new RestClientOptions(_settings.gw_logs + _settings.service_get_validar_respuesta) {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };
                var client = new RestClient(options);

                string auth_basic = Convert.ToBase64String(ASCIIEncoding.ASCII.GetBytes(_settings.auth_user_gw_logs + ":" + _settings.auth_pass_gw_logs));

                var request = new RestRequest()
                    .AddHeader("Authorization-Gateway", "Auth-Gateway " + auth_basic)
                    .AddHeader("Content-Type", "application/json")
                    .AddParameter("application/json", reqGetValidarPregunta, ParameterType.RequestBody);

                request.Method = Method.Post;
                var response = new RestResponse();
                response = client.Post(request);
                if(response.StatusCode == HttpStatusCode.OK) {
                    res = JsonSerializer.Deserialize<ResComunWsSistemas>(response.Content!)!;
                } else {
                    res.codigo = "0001";
                    res.mensajes = new string [1];
                    res.mensajes [0] = response.StatusCode + " - " + response.ErrorException;
                }
            } catch(Exception ex) {
                Debug.WriteLine(ex.ToString());
                Console.WriteLine(ex.ToString());
                res.codigo = "0001";
                res.mensajes = new string [1];
                res.mensajes [0] = "Ocurrió un error al validar la pregnta de seguridad";
            }
            return res;
        }
        #endregion
    }
}
