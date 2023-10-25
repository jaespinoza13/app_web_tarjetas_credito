using Domain.Common;
using Domain.Models.Config.Entities;
using Domain.Models.Config.GetFuncionalidades;
using Domain.Models.Config.GetInfoSistema;
using Domain.Models.Config.GetMenuPrincipal;
using RestSharp;
using System.Diagnostics;
using System.Net;
using System.Text;
using System.Text.Json;

namespace Infrastructure.Configuraciones {
    public class ConfiguracionDat {
        private readonly AppSettings _settings;

        public ConfiguracionDat(AppSettings settings) {
            _settings = settings;
        }

        #region GET
        public ResGetInfoSistema getInfoSistema() {
            ResGetInfoSistema res = new ResGetInfoSistema();
            try {
                var options = new RestClientOptions(_settings.gw_logs + _settings.service_get_info_sistema) {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };
                var client = new RestClient(options);

                var raw = new { 
                    nombre = _settings.nombre_sistema
                };

                string auth_basic = Convert.ToBase64String(ASCIIEncoding.ASCII.GetBytes(_settings.auth_user_gw_logs + ":" + _settings.auth_pass_gw_logs));

                var request = new RestRequest()
                    .AddHeader("Authorization-Gateway", "Auth-Gateway " + auth_basic)
                    .AddHeader("Content-Type", "application/json")
                    .AddParameter("application/json", raw, ParameterType.RequestBody);

                request.Method = Method.Post;
                var response = new RestResponse();
                response = client.Post(request);
                if (response.StatusCode == HttpStatusCode.OK) {
                    res = JsonSerializer.Deserialize<ResGetInfoSistema>(response.Content!)!;
                }
            } catch (Exception ex) {
                Debug.WriteLine(ex.ToString());
                Console.WriteLine(ex.ToString());
            }
            return res;
        }

        public ResGetMenuPrincipal getMenuPrincipal( int id_perfil ) {
            ResGetMenuPrincipal res = new ResGetMenuPrincipal();
            try {
                var options = new RestClientOptions(_settings.gw_logs + _settings.service_get_menu_principal + "/" + id_perfil + "/" + _settings.id_sistema) {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };
                var client = new RestClient(options);

                string auth_basic = Convert.ToBase64String(ASCIIEncoding.ASCII.GetBytes(_settings.auth_user_gw_logs + ":" + _settings.auth_pass_gw_logs));

                var request = new RestRequest().AddHeader("Authorization-Gateway", "Auth-Gateway " + auth_basic);

                var response = new RestResponse();
                response = client.Get(request);
                if(response.StatusCode == HttpStatusCode.OK) {
                    res.codigo = "0000";
                    res.mensaje = "OK";
                    res.menus = JsonSerializer.Deserialize<List<MenuPrincipalDTO>>(response.Content!)!;
                    if(res.menus != null && res.menus.Count > 0) {
                        res.menus.ForEach(item => {
                            item.funcionesHijas = getFunHijas(item.id, id_perfil);
                        });
                    }
                } else {
                    res.codigo = "0001";
                    res.mensaje = response.StatusCode + " - " + response.ErrorException;
                }
            } catch(Exception ex) {
                Debug.WriteLine(ex.ToString());
                Console.WriteLine(ex.ToString());
                res.codigo = "0001";
                res.mensaje = "Ocurrió un error al recuperar el menu principal";
            }
            return res;
        }

        private List<FunHijasDTO> getFunHijas( int id_fun_padre, int id_perfil ) {
            List<FunHijasDTO> res = new List<FunHijasDTO>();
            try {
                var options = new RestClientOptions(_settings.gw_logs + _settings.service_get_funciones_hijas + "/" + id_fun_padre + "/" + id_perfil) {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };
                var client = new RestClient(options);

                string auth_basic = Convert.ToBase64String(ASCIIEncoding.ASCII.GetBytes(_settings.auth_user_gw_logs + ":" + _settings.auth_pass_gw_logs));

                var request = new RestRequest().AddHeader("Authorization-Gateway", "Auth-Gateway " + auth_basic);

                var response = new RestResponse();
                response = client.Get(request);
                if(response.StatusCode == HttpStatusCode.OK) {
                    res = JsonSerializer.Deserialize<List<FunHijasDTO>>(response.Content!)!;
                }
            } catch(Exception ex) {
                Console.WriteLine(id_fun_padre.ToString() + " - " + id_perfil.ToString());
                Debug.WriteLine(ex.ToString());
                Console.WriteLine(ex.ToString());
            }
            return res;
        }

        public ResGetFuncionalidades getFuncionalidades( ReqGetFuncionalidades reqGetFuncionalidades ) {
            ResGetFuncionalidades res = new ResGetFuncionalidades();
            try {
                var options = new RestClientOptions(_settings.gw_logs + _settings.service_get_funcionalidades) {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };
                var client = new RestClient(options);

                string auth_basic = Convert.ToBase64String(ASCIIEncoding.ASCII.GetBytes(_settings.auth_user_gw_logs + ":" + _settings.auth_pass_gw_logs));

                var request = new RestRequest()
                    .AddHeader("Authorization-Gateway", "Auth-Gateway " + auth_basic)
                    .AddHeader("Content-Type", "application/json")
                    .AddParameter("application/json", reqGetFuncionalidades, ParameterType.RequestBody);

                request.Method = Method.Post;
                var response = new RestResponse();
                response = client.Post(request);
                if(response.StatusCode == HttpStatusCode.OK) {
                    res.codigo = "0000";
                    res.mensaje = "OK";
                    res.fucionalidades = JsonSerializer.Deserialize<List<FuncionalidadDTO>>(response.Content!)!;
                } else {
                    res.codigo = "0001";
                    res.mensaje = response.StatusCode + " - " + response.ErrorException;
                }
            } catch(Exception ex) {
                Debug.WriteLine(ex.ToString());
                Console.WriteLine(ex.ToString());
                res.codigo = "0001";
                res.mensaje = "Ocurrió un error, por favor intentelo nuevamente";
            }
            return res;
        }
        #endregion
    }
}
