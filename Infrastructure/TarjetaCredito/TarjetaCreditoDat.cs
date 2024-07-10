using Domain.Common;
using Domain.Models.Config.GetParametros;
using Domain.Models.TarjetaCredito.AddAutorizacion;
using Domain.Models.TarjetaCredito.AddComentarioAsesor;
using Domain.Models.TarjetaCredito.AddComentarioSolicitud;
using Domain.Models.TarjetaCredito.AddProcesoEspecifico;
using Domain.Models.TarjetaCredito.AddProspeccion;
using Domain.Models.TarjetaCredito.AddResolucion;
using Domain.Models.TarjetaCredito.AddSolicitud;
using Domain.Models.TarjetaCredito.Axentria.AddDocumentos;
using Domain.Models.TarjetaCredito.Axentria.CrearSeparadores;
using Domain.Models.TarjetaCredito.Axentria.GetSeparadores;
using Domain.Models.TarjetaCredito.Axentria.ObtenerDocumentos;
using Domain.Models.TarjetaCredito.GetAlertasCliente;
using Domain.Models.TarjetaCredito.GetComentarios;
using Domain.Models.TarjetaCredito.GetContrato;
using Domain.Models.TarjetaCredito.GetContratos;
using Domain.Models.TarjetaCredito.GetFlujoSolicitud;
using Domain.Models.TarjetaCredito.GetInfoEconomica;
using Domain.Models.TarjetaCredito.GetInfoFinanciera;
using Domain.Models.TarjetaCredito.GetInfoSocio;
using Domain.Models.TarjetaCredito.GetMedioAprobacion;
using Domain.Models.TarjetaCredito.GetMotivos;
using Domain.Models.TarjetaCredito.GetOficinas;
using Domain.Models.TarjetaCredito.GetOrdenes;
using Domain.Models.TarjetaCredito.GetParamatrosSistema;
using Domain.Models.TarjetaCredito.GetReporteAval;
using Domain.Models.TarjetaCredito.GetResoluciones;
using Domain.Models.TarjetaCredito.GetScore;
using Domain.Models.TarjetaCredito.GetSolicitudes;
using Domain.Models.TarjetaCredito.GetTarjetasCredito;
using Domain.Models.TarjetaCredito.GetValidaciones;
using Domain.Models.TarjetaCredito.ObtenerOrdenReporte;
using Domain.Models.TarjetaCredito.UpdResoluciones;
using Domain.Models.TarjetaCredito.UpdSolicitud;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Infrastructure.TarjetaCredito
{
    public class TarjetaCreditoDat
    {
        private readonly AppSettings _settings;

        public TarjetaCreditoDat(AppSettings settings)
        {
            _settings = settings;
        }

        #region GET
        public ResGetValidaciones getValidaciones(ReqGetValidaciones req)
        {
            ResGetValidaciones res = new ResGetValidaciones();
            try
            {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_get_validaciones;
                var options = new RestClientOptions(_settings.ws_personas + _settings.service_get_validaciones)
                {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };
                var client = new RestClient(options);

                string auth_basic = Convert.ToBase64String(ASCIIEncoding.ASCII.GetBytes(_settings.auth_user_ws_personas + ":" + _settings.auth_pass_ws_personas));

                var request = new RestRequest();
                request.AddHeader("Authorization", "Basic " + auth_basic);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/json", req, ParameterType.RequestBody);

                request.Method = Method.Post;
                var response = new RestResponse();
                response = client.Post(request);
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    res = JsonSerializer.Deserialize<ResGetValidaciones>(response.Content!)!;
                }
            } catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return res;
        }

        public ResGetAlertasCliente getAlertasCliente(ReqGetAlertasCliente req)
        {
            ResGetAlertasCliente res = new ResGetAlertasCliente();
            try
            {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_get_alertas_cliente;
                var options = new RestClientOptions(_settings.ws_personas + _settings.service_get_alertas_cliente)
                {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };
                var client = new RestClient(options);

                string auth_basic = Convert.ToBase64String(ASCIIEncoding.ASCII.GetBytes(_settings.auth_user_ws_personas + ":" + _settings.auth_pass_ws_personas));

                var request = new RestRequest();
                request.AddHeader("Authorization", "Basic " + auth_basic);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/json", req, ParameterType.RequestBody);

                request.Method = Method.Post;
                var response = new RestResponse();
                response = client.Post(request);
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    res = JsonSerializer.Deserialize<ResGetAlertasCliente>(response.Content!)!;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return res;
        }

        public ResGetScore getScore(ReqGetScore req)
        {
            ResGetScore res = new ();
            try
            {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_get_score;
                var options = new RestClientOptions(_settings.ws_aval + _settings.service_get_score)
                {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };

                var client = new RestClient(options);

                var request = new RestRequest();
                request.AddHeader("Authorization-Mego", "Auth-Mego " + _settings.auth_ws_aval);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/json", req, ParameterType.RequestBody);
                request.Method = Method.Post;
                var response = new RestResponse();
                response = client.Post(request);
                if(response.StatusCode == HttpStatusCode.OK)
                {
                    res = JsonSerializer.Deserialize<ResGetScore>(response.Content!)!;
                }
            }
            catch (Exception ex)
            {
                res.str_res_codigo = "500";
                res.str_res_info_adicional = "Ocurrió un error al obtener los datos del score";
            }
            return res;
        }

        public ResGetInfoSocio getInfoSocio(ReqGetInfoSocio req)
        {
            ResGetInfoSocio res = new();
            try
            {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_get_info_socio;
                var options = new RestClientOptions(_settings.ws_tarjeta_credito + _settings.service_get_info_socio)
                {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };
                var client = new RestClient(options);

                var request = new RestRequest();
                request.AddHeader("Authorization-Mego", "Auth-Mego " + _settings.auth_ws_tarjeta_credito);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/json", req, ParameterType.RequestBody);
                request.Method = Method.Post;

                var response = new RestResponse();
                response = client.Post(request);
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    res = JsonSerializer.Deserialize<ResGetInfoSocio>(response.Content!)!;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return res;
        }

        public ResGetInfoEconomica getInfoEconomica(ReqGetInfoEconomica req)
        {
            ResGetInfoEconomica res = new ResGetInfoEconomica();
            try
            {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_get_info_economica;
                var options = new RestClientOptions(_settings.ws_tarjeta_credito + _settings.service_get_info_economica)
                {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };
                var client = new RestClient(options);
                var request = new RestRequest();
                request.AddHeader("Authorization-Mego", "Auth-Mego " + _settings.auth_ws_tarjeta_credito);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/json", req, ParameterType.RequestBody);
                request.Method = Method.Post;

                var response = new RestResponse();
                response = client.Post(request);
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    res = JsonSerializer.Deserialize<ResGetInfoEconomica>(response.Content!)!;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }
            return res;
        }

        public ResGetContrato getContrato(ReqGetContrato req)
        {
            ResGetContrato res = new ResGetContrato();
            try
            {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_get_contrato;
                var options = new RestClientOptions(_settings.ws_aval + _settings.service_get_contrato)
                {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };
                var client = new RestClient(options);
                var request = new RestRequest();
                request.AddHeader("Authorization-Mego", "Auth-Mego " + _settings.auth_ws_aval);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/json", req, ParameterType.RequestBody);
                request.Method = Method.Post;

                var response = new RestResponse();
                response = client.Post(request);

                if (response.StatusCode == HttpStatusCode.OK)
                {
                    res = JsonSerializer.Deserialize<ResGetContrato>(response.Content!)!;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return res;
        }

        public ResAddAutorizacion addAutorizacion(ReqAddAutorizacion req)
        {
            ResAddAutorizacion res = new ResAddAutorizacion();
            try
            {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_add_autorizacion;
                var options = new RestClientOptions(_settings.ws_aval + _settings.service_add_autorizacion)
                {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };
                var client = new RestClient(options);
                var request = new RestRequest();
                request.AddHeader("Authorization-Mego", "Auth-Mego " + _settings.auth_ws_aval);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/json", req, ParameterType.RequestBody);
                request.Method = Method.Post;

                Console.WriteLine("SUBIR \n\n");
                Console.WriteLine(req.ToString());

                var response = new RestResponse();
                response = client.Post(request);



                if (response.StatusCode == HttpStatusCode.OK)
                {
                    res = JsonSerializer.Deserialize<ResAddAutorizacion>(response.Content!)!;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return res;
        }

        public ResGetSolicitudes getSolicitudes(ReqGetSolicitudes req)
        {
            ResGetSolicitudes res = new ResGetSolicitudes();
            try
            {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_get_solicitudes;
                var options = new RestClientOptions(_settings.ws_tarjeta_credito + _settings.service_get_solicitudes)
                {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };

                var client = new RestClient(options);
                var request = new RestRequest();
                request.AddHeader("Authorization-Mego", "Auth-Mego " + _settings.auth_ws_tarjeta_credito);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/json", req, ParameterType.RequestBody);
                request.Method = Method.Post;

                var response = new RestResponse();
                response = client.Post(request);

                if (response.StatusCode == HttpStatusCode.OK)
                {
                    res = JsonSerializer.Deserialize<ResGetSolicitudes>(response.Content!)!;
                }
            }
            catch (Exception ex)
            {
                res.str_res_codigo = "500";
                Console.WriteLine(ex.ToString());
            }
            return res;
        }

        public ResAddSolicitud addSolicitud(ReqAddSolicitud req)
        {
            ResAddSolicitud res = new ResAddSolicitud();
            try
            {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_add_solicitud;
                var options = new RestClientOptions(_settings.ws_tarjeta_credito + _settings.service_add_solicitud){
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };

                var client = new RestClient(options);
                var request = new RestRequest();
                request.AddHeader("Authorization-Mego", "Auth-Mego " + _settings.auth_ws_tarjeta_credito);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/json", req, ParameterType.RequestBody);
                request.Method = Method.Post;

                var response = new RestResponse();
                response = client.Post(request);

                if (response.StatusCode == HttpStatusCode.OK)
                {
                    res = JsonSerializer.Deserialize<ResAddSolicitud>(response.Content!)!;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return res;
        }

        public ResGetInfoFinan getInfoFinan(ReqGetInfoFinan req)
        {
            ResGetInfoFinan res = new ResGetInfoFinan();
            try
            {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_get_info_finan;
                var options = new RestClientOptions(_settings.ws_tarjeta_credito + _settings.service_get_info_finan)
                {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };

                var client = new RestClient(options);
                var request = new RestRequest();
                request.AddHeader("Authorization-Mego", "Auth-Mego " + _settings.auth_ws_tarjeta_credito);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/json", req, ParameterType.RequestBody);
                request.Method = Method.Post;

                var response = new RestResponse();
                response = client.Post(request);

                if (response.StatusCode == HttpStatusCode.OK)
                {
                    res = JsonSerializer.Deserialize<ResGetInfoFinan>(response.Content!)!;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return res;
        }

        public ResAddProspeccion addProspeccion(ReqAddProspeccion req)
        {
            ResAddProspeccion res = new ResAddProspeccion();
            try
            {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_add_prospecto;
                var options = new RestClientOptions(_settings.ws_tarjeta_credito + _settings.service_add_prospecto)
                {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };

                var client = new RestClient(options);
                var request = new RestRequest();
                request.AddHeader("Authorization-Mego", "Auth-Mego " + _settings.auth_ws_tarjeta_credito);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/json", req, ParameterType.RequestBody);
                request.Method = Method.Post;

                var response = new RestResponse();
                response = client.Post(request);

                if (response.StatusCode == HttpStatusCode.OK)
                {
                    res = JsonSerializer.Deserialize<ResAddProspeccion>(response.Content!)!;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return res;
        }

        public ResGetComentarios getComentarios(ReqGetComentarios req)
        {
            ResGetComentarios res = new ResGetComentarios();
            try
            {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_get_informe_tc;
                var options = new RestClientOptions(_settings.ws_tarjeta_credito + _settings.service_get_informe_tc)
                {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };

                var client = new RestClient(options);
                var request = new RestRequest();
                request.AddHeader("Authorization-Mego", "Auth-Mego " + _settings.auth_ws_tarjeta_credito);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/json", req, ParameterType.RequestBody);
                request.Method = Method.Post;

                var response = new RestResponse();
                response = client.Post(request);

                if (response.StatusCode == HttpStatusCode.OK)
                {
                    res = JsonSerializer.Deserialize<ResGetComentarios>(response.Content!)!;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return res;
        }

        public ResGetFlujoSolicitud getFlujoSolicitud(ReqGetFlujoSolicitud req)
        {
            ResGetFlujoSolicitud res = new ResGetFlujoSolicitud();
            try
            {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_get_flujo_solicitud;
                var options = new RestClientOptions(_settings.ws_tarjeta_credito + _settings.service_get_flujo_solicitud)
                {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };

                var client = new RestClient(options);
                var request = new RestRequest();
                request.AddHeader("Authorization-Mego", "Auth-Mego " + _settings.auth_ws_tarjeta_credito);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/json", req, ParameterType.RequestBody);
                request.Method = Method.Post;

                var response = new RestResponse();
                response = client.Post(request);

                if (response.StatusCode == HttpStatusCode.OK)
                {
                    
                    res = JsonSerializer.Deserialize<ResGetFlujoSolicitud>(response.Content!)!;
                    Console.WriteLine(res);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return res;
        }
        public ResAddComentarioAsesor addComentarioAsesor(ReqAddComentarioAsesor req)
        {
            ResAddComentarioAsesor res = new ResAddComentarioAsesor();
            try
            {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_add_informe_tc;
                var options = new RestClientOptions(_settings.ws_tarjeta_credito + _settings.service_add_informe_tc)
                {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };

                var client = new RestClient(options);
                var request = new RestRequest();
                request.AddHeader("Authorization-Mego", "Auth-Mego " + _settings.auth_ws_tarjeta_credito);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/json", req, ParameterType.RequestBody);
                request.Method = Method.Post;

                var response = new RestResponse();
                response = client.Post(request);

                if (response.StatusCode == HttpStatusCode.OK)
                {
                    res = JsonSerializer.Deserialize<ResAddComentarioAsesor>(response.Content!)!;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return res;
        }

        public ResAddComentarioSolicitud addComentarioSolicitud(ReqAddComentarioSolicitud req)
        {
            ResAddComentarioSolicitud res = new ResAddComentarioSolicitud();
            try
            {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_add_comentario_solicitud;
                var options = new RestClientOptions(_settings.ws_tarjeta_credito + _settings.service_add_comentario_solicitud)
                {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };

                var client = new RestClient(options);
                var request = new RestRequest();
                request.AddHeader("Authorization-Mego", "Auth-Mego " + _settings.auth_ws_tarjeta_credito);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/json", req, ParameterType.RequestBody);
                request.Method = Method.Post;

                var response = new RestResponse();
                response = client.Post(request);

                if (response.StatusCode == HttpStatusCode.OK)
                {
                    res = JsonSerializer.Deserialize<ResAddComentarioSolicitud>(response.Content!)!;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return res;
        }

        public ResGetResolucion addGetResoluciones(ReqGetResolucion req)
        {
            ResGetResolucion res = new ResGetResolucion();
            try
            {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_get_resolucion;
                var options = new RestClientOptions(_settings.ws_tarjeta_credito + _settings.service_get_resolucion)
                {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };

                var client = new RestClient(options);
                var request = new RestRequest();
                request.AddHeader("Authorization-Mego", "Auth-Mego " + _settings.auth_ws_tarjeta_credito);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/json", req, ParameterType.RequestBody);
                request.Method = Method.Post;

                var response = new RestResponse();
                response = client.Post(request);

                if (response.StatusCode == HttpStatusCode.OK)
                {
                    res = JsonSerializer.Deserialize<ResGetResolucion>(response.Content!)!;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return res;
        }

        public ResAddResolucion addResolucion(ReqAddResolucion req)
        {
            ResAddResolucion res = new ResAddResolucion();
            try
            {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_add_resolucion;
                var options = new RestClientOptions(_settings.ws_tarjeta_credito + _settings.service_add_resolucion)
                {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };

                var client = new RestClient(options);
                var request = new RestRequest();
                request.AddHeader("Authorization-Mego", "Auth-Mego " + _settings.auth_ws_tarjeta_credito);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/json", req, ParameterType.RequestBody);
                request.Method = Method.Post;

                var response = new RestResponse();
                response = client.Post(request);

                if (response.StatusCode == HttpStatusCode.OK)
                {
                    res = JsonSerializer.Deserialize<ResAddResolucion>(response.Content!)!;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return res;
        }

        public ResUpdResolucion addUpdResolucion(ReqUpdResolucion req)
        {
            ResUpdResolucion res = new ResUpdResolucion();
            try
            {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_upd_resolucion;
                var options = new RestClientOptions(_settings.ws_tarjeta_credito + _settings.service_upd_resolucion)
                {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };

                var client = new RestClient(options);
                var request = new RestRequest();
                request.AddHeader("Authorization-Mego", "Auth-Mego " + _settings.auth_ws_tarjeta_credito);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/json", req, ParameterType.RequestBody);
                request.Method = Method.Post;

                var response = new RestResponse();
                response = client.Post(request);

                if (response.StatusCode == HttpStatusCode.OK)
                {
                    res = JsonSerializer.Deserialize<ResUpdResolucion>(response.Content!)!;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return res;
        }

        public ResAddProcesoEspecifico addProcesoEspecifico(ReqAddProcesoEspecifico req)
        {
            ResAddProcesoEspecifico res = new ResAddProcesoEspecifico();
            try
            {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_add_proc_espec;
                var options = new RestClientOptions(_settings.ws_tarjeta_credito + _settings.service_add_proc_espec)
                {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };

                var client = new RestClient(options);
                var request = new RestRequest();
                request.AddHeader("Authorization-Mego", "Auth-Mego " + _settings.auth_ws_tarjeta_credito);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/json", req, ParameterType.RequestBody);
                request.Method = Method.Post;

                var response = new RestResponse();
                response = client.Post(request);

                if (response.StatusCode == HttpStatusCode.OK)
                {
                    res = JsonSerializer.Deserialize<ResAddProcesoEspecifico>(response.Content!)!;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return res;
        }

        public ResUpdSolicitud updSolicitud(ReqUpdSolicitud req)
        {
            ResUpdSolicitud res = new ResUpdSolicitud();
            try
            {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_upd_solicitud;
                var options = new RestClientOptions(_settings.ws_tarjeta_credito + _settings.service_upd_solicitud)
                {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };

                var client = new RestClient(options);
                var request = new RestRequest();
                request.AddHeader("Authorization-Mego", "Auth-Mego " + _settings.auth_ws_tarjeta_credito);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/json", req, ParameterType.RequestBody);
                request.Method = Method.Post;

                var response = new RestResponse();
                response = client.Post(request);

                if (response.StatusCode == HttpStatusCode.OK)
                {
                    res = JsonSerializer.Deserialize<ResUpdSolicitud>(response.Content!)!;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return res;
        }

        public ResGetParametrosSistema getParametros(ReqGetParametrosSistema req)
        {
            ResGetParametrosSistema res = new ResGetParametrosSistema();
            try
            {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_get_parametros_sistema;
                var options = new RestClientOptions(_settings.ws_tarjeta_credito + _settings.service_get_parametros_sistema)
                {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };

                var client = new RestClient(options);
                var request = new RestRequest();
                request.AddHeader("Authorization-Mego", "Auth-Mego " + _settings.auth_ws_tarjeta_credito);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/json", req, ParameterType.RequestBody);
                request.Method = Method.Post;

                var response = new RestResponse();
                response = client.Post(request);

                if (response.StatusCode == HttpStatusCode.OK)
                {
                    res = JsonSerializer.Deserialize<ResGetParametrosSistema>(response.Content!)!;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return res;
        }

        public ResGetMotivos getMotivos(ReqGetMotivos req)
        {
            ResGetMotivos res = new ResGetMotivos();
            try
            {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_get_motivos;
                var options = new RestClientOptions(_settings.ws_tarjeta_credito + _settings.service_get_motivos)
                {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };

                var client = new RestClient(options);
                var request = new RestRequest();
                request.AddHeader("Authorization-Mego", "Auth-Mego " + _settings.auth_ws_tarjeta_credito);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/json", req, ParameterType.RequestBody);
                request.Method = Method.Post;

                var response = new RestResponse();
                response = client.Post(request);

                if (response.StatusCode == HttpStatusCode.OK)
                {
                    res = JsonSerializer.Deserialize<ResGetMotivos>(response.Content!)!;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return res;
        }

        public ResGetReporteOrden getReporteOrden(ReqGetReporteOrden req)
        {
            ResGetReporteOrden res = new ResGetReporteOrden();
            try
            {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_get_reporte_orden;
                var options = new RestClientOptions(_settings.ws_tarjeta_credito + _settings.service_get_reporte_orden)
                {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };

                var client = new RestClient(options);
                var request = new RestRequest();
                request.AddHeader("Authorization-Mego", "Auth-Mego " + _settings.auth_ws_tarjeta_credito);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/json", req, ParameterType.RequestBody);
                request.Method = Method.Post;

                var response = new RestResponse();
                response = client.Post(request);

                if (response.StatusCode == HttpStatusCode.OK)
                {
                    res = JsonSerializer.Deserialize<ResGetReporteOrden>(response.Content!)!;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return res;
        }

        public ResGetMedAprob getMedioAprobacion(ReqGetMedAprob req)
        {
            ResGetMedAprob res = new ResGetMedAprob();
            try
            {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_get_medio_aprobacion;
                var options = new RestClientOptions(_settings.ws_tarjeta_credito + _settings.service_get_medio_aprobacion)
                {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };

                var client = new RestClient(options);
                var request = new RestRequest();
                request.AddHeader("Authorization-Mego", "Auth-Mego " + _settings.auth_ws_tarjeta_credito);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/json", req, ParameterType.RequestBody);
                request.Method = Method.Post;

                var response = new RestResponse();
                response = client.Post(request);

                if (response.StatusCode == HttpStatusCode.OK)
                {
                    res = JsonSerializer.Deserialize<ResGetMedAprob>(response.Content!)!;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return res;
        }

        public ResGetOrdenes getOrdenes(ReqGetOrdenes req)
        {
            ResGetOrdenes res = new ResGetOrdenes();
            try
            {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_get_ordenes;
                var options = new RestClientOptions(_settings.ws_tarjeta_credito + _settings.service_get_ordenes)
                {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };

                var client = new RestClient(options);
                var request = new RestRequest();
                request.AddHeader("Authorization-Mego", "Auth-Mego " + _settings.auth_ws_tarjeta_credito);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/json", req, ParameterType.RequestBody);
                request.Method = Method.Post;

                var response = new RestResponse();
                response = client.Post(request);

                if (response.StatusCode == HttpStatusCode.OK)
                {
                    res = JsonSerializer.Deserialize<ResGetOrdenes>(response.Content!)!;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return res;
        }

        public ResGetTarjetasCredito getTarjetasCredito(ReqGetTarjetasCredito req)
        {
            ResGetTarjetasCredito res = new ResGetTarjetasCredito();
            try
            {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_get_tarjetas_credito;
                var options = new RestClientOptions(_settings.ws_tarjeta_credito + _settings.service_get_tarjetas_credito)
                {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };

                var client = new RestClient(options);
                var request = new RestRequest();
                request.AddHeader("Authorization-Mego", "Auth-Mego " + _settings.auth_ws_tarjeta_credito);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/json", req, ParameterType.RequestBody);
                request.Method = Method.Post;

                var response = new RestResponse();
                response = client.Post(request);

                if (response.StatusCode == HttpStatusCode.OK)
                {
                    res = JsonSerializer.Deserialize<ResGetTarjetasCredito>(response.Content!)!;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return res;
        }


        public ResGetSeparadores getSeparadores(ReqGetSeparadores req)
        {
            ResGetSeparadores res = new ResGetSeparadores();
            try
            {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_get_separadores;
                var options = new RestClientOptions(_settings.ws_tarjeta_credito + _settings.service_get_separadores)
                {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };

                var client = new RestClient(options);
                var request = new RestRequest();
                request.AddHeader("Authorization-Mego", "Auth-Mego " + _settings.auth_ws_tarjeta_credito);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/json", req, ParameterType.RequestBody);
                request.Method = Method.Post;

                var response = new RestResponse();
                response = client.Post(request);

                if (response.StatusCode == HttpStatusCode.OK)
                {

                    res = JsonSerializer.Deserialize<ResGetSeparadores>(response.Content!)!;
                    Console.WriteLine(res);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return res;
        }

        public ResAddDocumentos addDocumentosAxentria(ReqAddDocumentos req)
        {
            ResAddDocumentos res = new ResAddDocumentos();
            try
            {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_add_documentos_axentria;
                var options = new RestClientOptions(_settings.ws_tarjeta_credito + _settings.service_add_documentos_axentria)
                {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };

                var client = new RestClient(options);
                var request = new RestRequest();
                request.AddHeader("Authorization-Mego", "Auth-Mego " + _settings.auth_ws_tarjeta_credito);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/json", req, ParameterType.RequestBody);
                request.Method = Method.Post;

                var response = new RestResponse();
                response = client.Post(request);

                if (response.StatusCode == HttpStatusCode.OK)
                {
                    res = JsonSerializer.Deserialize<ResAddDocumentos>(response.Content!)!;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return res;
        }


        public ResGetDocumentos getDocumentosAxentria(ReqGetDocumentos req)
        {
            ResGetDocumentos res = new ResGetDocumentos();
            try
            {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_get_documentos_axentria;
                var options = new RestClientOptions(_settings.ws_tarjeta_credito + _settings.service_get_documentos_axentria)
                {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };

                var client = new RestClient(options);
                var request = new RestRequest();
                request.AddHeader("Authorization-Mego", "Auth-Mego " + _settings.auth_ws_tarjeta_credito);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/json", req, ParameterType.RequestBody);
                request.Method = Method.Post;

                var response = new RestResponse();
                response = client.Post(request);

                if (response.StatusCode == HttpStatusCode.OK)
                {

                    res = JsonSerializer.Deserialize<ResGetDocumentos>(response.Content!)!;
                    Console.WriteLine(res);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return res;
        }

        public ResCrearSeparadores crearSeparadores(ReqCrearSeparadores req)
        {
            ResCrearSeparadores res = new ResCrearSeparadores();
            try
            {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_crear_separadores;
                var options = new RestClientOptions(_settings.ws_tarjeta_credito + _settings.service_crear_separadores)
                {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };

                var client = new RestClient(options);
                var request = new RestRequest();
                request.AddHeader("Authorization-Mego", "Auth-Mego " + _settings.auth_ws_tarjeta_credito);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/json", req, ParameterType.RequestBody);
                request.Method = Method.Post;

                var response = new RestResponse();
                response = client.Post(request);

                if (response.StatusCode == HttpStatusCode.OK)
                {

                    res = JsonSerializer.Deserialize<ResCrearSeparadores>(response.Content!)!;
                    //Console.WriteLine(res);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return res;
        }

        public ResGetReporteAval getReporteAval(ReqGetReporteAval req)
        {
            ResGetReporteAval res = new();
            try
            {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_get_reporte_aval;
                var options = new RestClientOptions(_settings.ws_aval + _settings.service_get_reporte_aval)
                {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };

                var client = new RestClient(options);

                var request = new RestRequest();
                request.AddHeader("Authorization-Mego", "Auth-Mego " + _settings.auth_ws_aval);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/json", req, ParameterType.RequestBody);
                request.Method = Method.Post;
                var response = new RestResponse();
                response = client.Post(request);
                
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    res = JsonSerializer.Deserialize<ResGetReporteAval>(response.Content!)!;
                }
            }
            catch (Exception ex)
            {
                res.str_res_codigo = "500";
                res.str_res_info_adicional = "Ocurrió un error al obtener los datos del score";
            }
            return res;
        }

        public ResGetOficinas getOficinas(ReqGetOficinas req)
        {
            ResGetOficinas res = new ResGetOficinas();
            try
            {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_get_oficinas;
                var options = new RestClientOptions(_settings.ws_tarjeta_credito + _settings.service_get_oficinas)
                {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };

                var client = new RestClient(options);
                var request = new RestRequest();
                request.AddHeader("Authorization-Mego", "Auth-Mego " + _settings.auth_ws_tarjeta_credito);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/json", req, ParameterType.RequestBody);
                request.Method = Method.Post;

                var response = new RestResponse();
                response = client.Post(request);

                if (response.StatusCode == HttpStatusCode.OK)
                {
                    res = JsonSerializer.Deserialize<ResGetOficinas>(response.Content!)!;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return res;
        }

        #endregion
    }
}
