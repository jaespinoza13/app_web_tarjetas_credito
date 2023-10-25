using Application.GetDocumentos;
using Application.GetListaBases;
using Application.GetListaColecciones;
using Domain.Common;
using Domain.Models.Logs.AddConexion;
using Domain.Models.Logs.GetConexiones;
using Domain.Models.Logs.GetContenidoLogTexto;
using Domain.Models.Logs.GetLogsTexto;
using Domain.Models.Logs.GetSeguimiento;
using Domain.Models.Logs.SetConexion;
using RestSharp;
using System.Diagnostics;
using System.Net;
using System.Text;
using System.Text.Json;

namespace Infrastructure.Logs {
    public class LogsDat {
        private readonly AppSettings _settings;

        public LogsDat( AppSettings settings ) {
            _settings = settings;
        }

        #region ADD
        public ResAddConexion addConexiones( ReqAddConexion req ) {
            ResAddConexion res = new ResAddConexion();
            try {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_add_conexion;
                var options = new RestClientOptions(_settings.gw_logs + _settings.service_add_conexion) {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };
                var client = new RestClient(options);

                string auth_basic = Convert.ToBase64String(ASCIIEncoding.ASCII.GetBytes(_settings.auth_user_gw_logs + ":" + _settings.auth_pass_gw_logs));

                var request = new RestRequest()
                    .AddHeader("Authorization-Gateway", "Auth-Gateway " + auth_basic)
                    .AddHeader("Content-Type", "application/json")
                    .AddParameter("application/json", req, ParameterType.RequestBody);

                request.Method = Method.Post;
                var response = new RestResponse();
                response = client.Post(request);
                if(response.StatusCode == HttpStatusCode.OK) {
                    res = JsonSerializer.Deserialize<ResAddConexion>(response.Content!)!;
                }
            } catch(Exception ex) {
                Debug.WriteLine(ex.ToString());
                Console.WriteLine(ex.ToString());
            }
            return res;
        }
        #endregion

        #region GET
        public ResGetConexion getConexiones( ReqGetConexion req ) {
            ResGetConexion res = new ResGetConexion();
            try {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_get_conexiones;
                var options = new RestClientOptions(_settings.gw_logs + _settings.service_get_conexiones) {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };
                var client = new RestClient(options);

                string auth_basic = Convert.ToBase64String(ASCIIEncoding.ASCII.GetBytes(_settings.auth_user_gw_logs + ":" + _settings.auth_pass_gw_logs));

                var request = new RestRequest()
                    .AddHeader("Authorization-Gateway", "Auth-Gateway " + auth_basic)
                    .AddHeader("Content-Type", "application/json")
                    .AddParameter("application/json", req, ParameterType.RequestBody);

                request.Method = Method.Post;
                var response = new RestResponse();
                response = client.Post(request);
                if(response.StatusCode == HttpStatusCode.OK) {
                    res = JsonSerializer.Deserialize<ResGetConexion>(response.Content!)!;
                }
            } catch(Exception ex) {
                Debug.WriteLine(ex.ToString());
                Console.WriteLine(ex.ToString());
            }
            return res;
        }

        public ResGetLogsTexto getLogsTexto( ReqGetLogsTexto req ) {
            ResGetLogsTexto res = new ResGetLogsTexto();
            try {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_get_logs_texto;
                var options = new RestClientOptions(_settings.gw_logs + _settings.service_get_logs_texto) {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };
                var client = new RestClient(options);

                string auth_basic = Convert.ToBase64String(ASCIIEncoding.ASCII.GetBytes(_settings.auth_user_gw_logs + ":" + _settings.auth_pass_gw_logs));

                var request = new RestRequest()
                    .AddHeader("Authorization-Gateway", "Auth-Gateway " + auth_basic)
                    .AddHeader("Content-Type", "application/json")
                    .AddParameter("application/json", req, ParameterType.RequestBody);

                request.Method = Method.Post;
                var response = new RestResponse();
                response = client.Post(request);
                if(response.StatusCode == HttpStatusCode.OK) {
                    res = JsonSerializer.Deserialize<ResGetLogsTexto>(response.Content!)!;
                }
            } catch(Exception ex) {
                Debug.WriteLine(ex.ToString());
                Console.WriteLine(ex.ToString());
            }
            return res;
        }

        public ResGetContenidoLogTexto getContenidoLogTexto( ReqGetContenidoLogTexto req ) {
            ResGetContenidoLogTexto res = new ResGetContenidoLogTexto();
            try {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_get_body_logs_texto;
                var options = new RestClientOptions(_settings.gw_logs + _settings.service_get_body_logs_texto) {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };
                var client = new RestClient(options);

                string auth_basic = Convert.ToBase64String(ASCIIEncoding.ASCII.GetBytes(_settings.auth_user_gw_logs + ":" + _settings.auth_pass_gw_logs));

                var request = new RestRequest()
                    .AddHeader("Authorization-Gateway", "Auth-Gateway " + auth_basic)
                    .AddHeader("Content-Type", "application/json")
                    .AddParameter("application/json", req, ParameterType.RequestBody);

                request.Method = Method.Post;
                var response = new RestResponse();
                response = client.Post(request);
                if(response.StatusCode == HttpStatusCode.OK) {
                    res = JsonSerializer.Deserialize<ResGetContenidoLogTexto>(response.Content!)!;
                }
            } catch(Exception ex) {
                Debug.WriteLine(ex.ToString());
                Console.WriteLine(ex.ToString());
            }
            return res;
        }

        public RestResponse downloadLogsTexto( ReqGetContenidoLogTexto req ) {
            try {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_download_logs_texto;
                var options = new RestClientOptions(_settings.gw_logs + _settings.service_download_logs_texto) {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };
                var client = new RestClient(options);

                string auth_basic = Convert.ToBase64String(ASCIIEncoding.ASCII.GetBytes(_settings.auth_user_gw_logs + ":" + _settings.auth_pass_gw_logs));

                var request = new RestRequest()
                    .AddHeader("Authorization-Gateway", "Auth-Gateway " + auth_basic)
                    .AddHeader("Content-Type", "application/json")
                    .AddParameter("application/json", req, ParameterType.RequestBody);

                request.Method = Method.Post;
                var response = new RestResponse();
                response = client.Post(request);
                if(response.StatusCode == HttpStatusCode.OK) {
                    return response;
                } else {
                    Console.WriteLine("wsLogs status code " + response.StatusCode.ToString());
                    Console.WriteLine(response.Content);
                }
            } catch(Exception ex) {
                Console.WriteLine("Error al desscargar el archivo desde wsLogs");
                Console.WriteLine(ex.ToString());
            }
            return new RestResponse();
        }

        public ResGetListaBases getListaBases( ReqGetListaBases req ) {
            ResGetListaBases res = new ResGetListaBases();
            try {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_get_lista_bases;
                var options = new RestClientOptions(_settings.gw_logs + _settings.service_get_lista_bases) {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };
                var client = new RestClient(options);

                string auth_basic = Convert.ToBase64String(ASCIIEncoding.ASCII.GetBytes(_settings.auth_user_gw_logs + ":" + _settings.auth_pass_gw_logs));

                var request = new RestRequest()
                    .AddHeader("Authorization-Gateway", "Auth-Gateway " + auth_basic)
                    .AddHeader("Content-Type", "application/json")
                    .AddParameter("application/json", req, ParameterType.RequestBody);

                request.Method = Method.Post;
                var response = new RestResponse();
                response = client.Post(request);
                if(response.StatusCode == HttpStatusCode.OK) {
                    res = JsonSerializer.Deserialize<ResGetListaBases>(response.Content!)!;
                    if(res == null) {
                        res = new ResGetListaBases();
                    }
                }
            } catch(Exception ex) {
                Debug.WriteLine(ex.ToString());
                Console.WriteLine(ex.ToString());
            }
            return res;
        }

        public ResGetListaColecciones getListaColecciones( ReqGetListaColecciones req ) {
            ResGetListaColecciones res = new ResGetListaColecciones();
            try {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_get_lista_colecciones;
                var options = new RestClientOptions(_settings.gw_logs + _settings.service_get_lista_colecciones) {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };
                var client = new RestClient(options);

                string auth_basic = Convert.ToBase64String(ASCIIEncoding.ASCII.GetBytes(_settings.auth_user_gw_logs + ":" + _settings.auth_pass_gw_logs));

                var request = new RestRequest()
                    .AddHeader("Authorization-Gateway", "Auth-Gateway " + auth_basic)
                    .AddHeader("Content-Type", "application/json")
                    .AddParameter("application/json", req, ParameterType.RequestBody);

                request.Method = Method.Post;
                var response = new RestResponse();
                response = client.Post(request);
                if(response.StatusCode == HttpStatusCode.OK) {
                    res = JsonSerializer.Deserialize<ResGetListaColecciones>(response.Content!)!;
                }
            } catch(Exception ex) {
                Debug.WriteLine(ex.ToString());
                Console.WriteLine(ex.ToString());
            }
            return res;
        }

        public ResGetDocumentos getDocumentos( ReqGetDocumentos req ) {
            ResGetDocumentos res = new ResGetDocumentos();
            try {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_get_lista_documentos;
                var options = new RestClientOptions(_settings.gw_logs + _settings.service_get_lista_documentos) {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };
                var client = new RestClient(options);

                string auth_basic = Convert.ToBase64String(ASCIIEncoding.ASCII.GetBytes(_settings.auth_user_gw_logs + ":" + _settings.auth_pass_gw_logs));

                var request = new RestRequest()
                    .AddHeader("Authorization-Gateway", "Auth-Gateway " + auth_basic)
                    .AddHeader("Content-Type", "application/json")
                    .AddParameter("application/json", req, ParameterType.RequestBody);

                request.Method = Method.Post;
                var response = new RestResponse();
                response = client.Post(request);
                if(response.StatusCode == HttpStatusCode.OK) {
                    res = JsonSerializer.Deserialize<ResGetDocumentos>(response.Content!)!;
                }
            } catch(Exception ex) {
                Debug.WriteLine(ex.ToString());
                Console.WriteLine(ex.ToString());
            }
            return res;
        }

        public ResGetSeguimiento getSeguimiento( ReqGetSeguimiento req ) {
            ResGetSeguimiento res = new ResGetSeguimiento();
            try {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_get_seguimiento;
                var options = new RestClientOptions(_settings.gw_logs + _settings.service_get_seguimiento) {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };
                var client = new RestClient(options);

                string auth_basic = Convert.ToBase64String(ASCIIEncoding.ASCII.GetBytes(_settings.auth_user_gw_logs + ":" + _settings.auth_pass_gw_logs));

                var request = new RestRequest()
                    .AddHeader("Authorization-Gateway", "Auth-Gateway " + auth_basic)
                    .AddHeader("Content-Type", "application/json")
                    .AddParameter("application/json", req, ParameterType.RequestBody);

                request.Method = Method.Post;
                var response = new RestResponse();
                response = client.Post(request);
                if(response.StatusCode == HttpStatusCode.OK) {
                    res = JsonSerializer.Deserialize<ResGetSeguimiento>(response.Content!)!;
                }
            } catch(Exception ex) {
                Debug.WriteLine(ex.ToString());
                Console.WriteLine(ex.ToString());
            }
            return res;
        }
        #endregion

        #region SET
        public ResSetConexion setConexiones( ReqSetConexion req ) {
            ResSetConexion res = new ResSetConexion();
            try {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_set_conexion;
                var options = new RestClientOptions(_settings.gw_logs + _settings.service_set_conexion) {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };
                var client = new RestClient(options);

                string auth_basic = Convert.ToBase64String(ASCIIEncoding.ASCII.GetBytes(_settings.auth_user_gw_logs + ":" + _settings.auth_pass_gw_logs));

                var request = new RestRequest()
                    .AddHeader("Authorization-Gateway", "Auth-Gateway " + auth_basic)
                    .AddHeader("Content-Type", "application/json")
                    .AddParameter("application/json", req, ParameterType.RequestBody);

                request.Method = Method.Post;
                var response = new RestResponse();
                response = client.Post(request);
                if(response.StatusCode == HttpStatusCode.OK) {
                    res = JsonSerializer.Deserialize<ResSetConexion>(response.Content!)!;
                }
            } catch(Exception ex) {
                Debug.WriteLine(ex.ToString());
                Console.WriteLine(ex.ToString());
            }
            return res;
        }
        #endregion
    }
}
