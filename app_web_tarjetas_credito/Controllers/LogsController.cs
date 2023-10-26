using plantilla_app_web.Controllers.Common;
using plantilla_app_web.Filters;
using Application.GetDocumentos;
using Application.GetListaBases;
using Application.GetListaColecciones;
using Domain.Common;
using Domain.Common.Interfaces;
using Domain.Models.Logs.AddConexion;
using Domain.Models.Logs.AddConexion.Internal;
using Domain.Models.Logs.GetConexiones;
using Domain.Models.Logs.GetConexiones.Common;
using Domain.Models.Logs.GetConexiones.Internal;
using Domain.Models.Logs.GetContenidoLogTexto;
using Domain.Models.Logs.GetContenidoLogTexto.Internal;
using Domain.Models.Logs.GetListaBases.Internal;
using Domain.Models.Logs.GetLogsTexto;
using Domain.Models.Logs.GetLogsTexto.Internal;
using Domain.Models.Logs.GetSeguimiento;
using Domain.Models.Logs.GetSeguimiento.Internal;
using Domain.Models.Logs.SetConexion;
using Domain.Models.Logs.SetConexion.Internal;
using Infrastructure.Logs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using RestSharp;

namespace plantilla_app_web.Controllers {
    [ApiController]
    [Route("[controller]")]
    [ServiceFilter(typeof(CryptoFilter))]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public class LogsController : ControllerBase {
        private readonly AppSettings _settings;
        private readonly ILogger<LogsController> _logger;
        private readonly IParametersInMemory _parametros;
        private readonly LogsDat configDat;

        public LogsController( ILogger<LogsController> logger, IOptionsMonitor<AppSettings> settings, IParametersInMemory parametros ) {
            _logger = logger;
            _settings = settings.CurrentValue;
            _parametros = parametros;
            _parametros.ValidaParametros();
            configDat = new LogsDat(_settings);
        }

        #region ADD
        [Route("add/conexion")]
        [HttpPost]
        public ResponseAddConexion AddConexion( RequestAddConexion request ) {
            ResponseAddConexion res = new ResponseAddConexion();
            ReqAddConexion req = new ReqAddConexion();
            req.str_mac_dispositivo = request.str_mac_dispositivo;
            req.str_login = request.str_login;
            req.str_sesion = request.str_sesion;
            req.str_id_usuario = request.str_id_usuario;
            req.str_id_oficina = request.str_id_oficina;
            req.str_id_perfil = request.str_id_perfil;
            req.str_ip_dispositivo = Utiles.getIP();
            foreach(var item in _settings.lst_urls) {
                if(item.str_nombre == request.str_server) {
                    req.obj_conexion = new ConexionDTO() {
                        str_usuario = request.str_usuario,
                        str_clave = request.str_clave,
                        str_id_usuario = request.str_id_usuario,
                        str_protocolo = item.str_protocolo,
                        str_servidor = item.str_url,
                        str_nombre = request.str_usuario + "@" + item.str_nombre,
                        dtt_ceacion = request.dtt_ceacion,
                        dtt_ult_con = request.dtt_ult_con
                    };
                    break;
                }
            }
            ResAddConexion response = configDat.addConexiones(req);
            res.mensaje = response.str_res_info_adicional;
            res.codigo = response.str_res_codigo;
            return res;
        }
        #endregion

        #region GET
        [Route("get/conexiones")]
        [HttpPost]
        public ResCrypt GetConexiones( RequestGetConexiones request ) {
            ResponseGetConexiones res = new ResponseGetConexiones();
            ReqGetConexion req = new ReqGetConexion();
            req.str_mac_dispositivo = request.str_mac_dispositivo;
            req.str_login = request.str_login;
            req.str_sesion = request.str_sesion;
            req.str_id_usuario = request.str_id_usuario;
            req.str_id_oficina = request.str_id_oficina;
            req.str_id_perfil = request.str_id_perfil;
            req.str_ip_dispositivo = Utiles.getIP();
            ResGetConexion response = configDat.getConexiones(req);
            res.mensaje = response.str_res_info_adicional;
            res.codigo = response.str_res_codigo;
            res.lst_conexiones = response.lst_conexiones;
            if(res.lst_conexiones.Count > 0) {
                for(int i = 0; i < res.lst_conexiones.Count; i++) {
                    res.lst_conexiones [i].str_id_con = "SAVED_" + (i + 1);
                }
                res.codigo = "000";
            } else {
                res.codigo = "000";
                res.mensaje = "No existen datos";
            }
            return Utiles.crypt(res, Request.Headers);
        }

        [Route("get/archivos")]
        [HttpPost]
        public ResCrypt GetLogsTexto( RequestGetLogsTexto request ) {
            ResponseGetLogsTexto res = new ResponseGetLogsTexto();
            ReqGetLogsTexto req = new ReqGetLogsTexto();
            req.str_mac_dispositivo = request.str_mac_dispositivo;
            req.str_login = request.str_login;
            req.str_sesion = request.str_sesion;
            req.str_id_usuario = request.str_id_usuario;
            req.str_id_oficina = request.str_id_oficina;
            req.str_id_perfil = request.str_id_perfil;
            req.str_web_service = request.str_ws;
            req.str_ip_dispositivo = Utiles.getIP();
            ResGetLogsTexto response = configDat.getLogsTexto(req);
            res.mensaje = response.str_res_info_adicional;
            res.codigo = response.str_res_codigo;
            res.lst_logs = response.lst_logs;
            return Utiles.crypt(res, Request.Headers);
        }

        [Route("get/contenido")]
        [HttpPost]
        public ResCrypt GetLogsTexto( RequestGetContenidoLogTexto request ) {
            ResponseGetContenidoLogTexto res = new ResponseGetContenidoLogTexto();
            ReqGetContenidoLogTexto req = new ReqGetContenidoLogTexto();
            req.str_mac_dispositivo = request.str_mac_dispositivo;
            req.str_login = request.str_login;
            req.str_sesion = request.str_sesion;
            req.str_id_usuario = request.str_id_usuario;
            req.str_id_oficina = request.str_id_oficina;
            req.str_id_perfil = request.str_id_perfil;
            req.str_web_service = request.str_ws;
            req.str_nombre_archivo = request.str_file;
            req.int_desde = request.int_desde;
            req.int_hasta = request.int_hasta;
            req.str_ip_dispositivo = Utiles.getIP();
            ResGetContenidoLogTexto response = configDat.getContenidoLogTexto(req);
            res.dbl_megas = response.dbl_megas;
            res.int_total_registros = response.int_total_registros;
            res.mensaje = response.str_res_info_adicional;
            res.codigo = response.str_res_codigo;
            res.str_body = response.str_contenido.Replace("\r", "").Replace("\n", "<br/><br/>");
            return Utiles.crypt(res, Request.Headers);
        }

        [Route("download/contenido")]
        [HttpPost]
        public ActionResult DownloadLogsTexto( RequestGetContenidoLogTexto request ) {
            RespuestaComun res = new RespuestaComun();
            try {
                ReqGetContenidoLogTexto req = new ReqGetContenidoLogTexto();
                req.str_mac_dispositivo = request.str_mac_dispositivo;
                req.str_login = request.str_login;
                req.str_sesion = request.str_sesion;
                req.str_id_usuario = request.str_id_usuario;
                req.str_id_oficina = request.str_id_oficina;
                req.str_id_perfil = request.str_id_perfil;
                req.str_web_service = request.str_ws;
                req.str_nombre_archivo = request.str_file;
                req.int_desde = request.int_desde;
                req.int_hasta = request.int_hasta;
                req.str_ip_dispositivo = Utiles.getIP();
                RestResponse r = configDat.downloadLogsTexto(req);
                if(r != null && r.IsSuccessStatusCode) {
                    if(r.RawBytes != null) {
                        return File(r.RawBytes, "text/plain", request.str_file);
                    } else {
                        res.codigo = "001";
                        res.mensaje = "Archivo Vacío";
                        Console.WriteLine(r.Content);
                        return StatusCode(220, Utiles.crypt(res, Request.Headers));
                    }
                } else {
                    if(r != null) {
                        Console.WriteLine(r.ErrorMessage);
                    }
                    res.codigo = "001";
                    res.mensaje = "No se pudo extraer el archivo";
                    return StatusCode(220, Utiles.crypt(res, Request.Headers));
                }
            } catch(Exception ex) {
                Console.WriteLine("Error al enviar el archivo");
                Console.WriteLine(ex.ToString());
                res.codigo = "001";
                res.mensaje = "No se pudo descargar el archivo";
                return StatusCode(220, Utiles.crypt(res, Request.Headers));
            }
        }

        [Route("get/bds")]
        [HttpPost]
        public ResCrypt getListaBases( RequestGetListaBases request ) {
            ResponseGetListaBases res = new ResponseGetListaBases();
            ReqGetListaBases req = new ReqGetListaBases();
            req.str_mac_dispositivo = request.str_mac_dispositivo;
            req.str_login = request.str_login;
            req.str_sesion = request.str_sesion;
            req.str_id_usuario = request.str_id_usuario;
            req.str_id_oficina = request.str_id_oficina;
            req.str_id_perfil = request.str_id_perfil;
            req.str_ip_dispositivo = Utiles.getIP();
            string str_url_con = "";
            if(String.IsNullOrWhiteSpace(request.str_protcol)) {
                foreach(var item in _settings.lst_urls) {
                    if(item.str_nombre == request.str_server) {
                        str_url_con = item.str_protocolo + request.str_user + ":" + request.str_password + item.str_url;
                        break;
                    }
                }
            } else {
                str_url_con = request.str_protcol + request.str_user + ":" + request.str_password + request.str_server;
            }
            req.str_url = str_url_con;
            ResGetListaBases response = configDat.getListaBases(req);
            res.mensaje = response.str_res_info_adicional;
            res.codigo = response.str_res_codigo;
            res.lst_bds = response.lst_bases;
            return Utiles.crypt(res, Request.Headers);
        }

        [Route("get/colecciones")]
        [HttpPost]
        public ResCrypt getListaColecciones( RequestGetListaColecciones request ) {
            ResponseGetListaColecciones res = new ResponseGetListaColecciones();
            ReqGetListaColecciones req = new ReqGetListaColecciones();
            req.str_mac_dispositivo = request.str_mac_dispositivo;
            req.str_login = request.str_login;
            req.str_sesion = request.str_sesion;
            req.str_id_usuario = request.str_id_usuario;
            req.str_id_oficina = request.str_id_oficina;
            req.str_id_perfil = request.str_id_perfil;
            req.str_nombre_bd = request.str_bd;
            req.str_ip_dispositivo = Utiles.getIP();
            ResGetListaColecciones response = configDat.getListaColecciones(req);
            res.mensaje = response.str_res_info_adicional;
            res.codigo = response.str_res_codigo;
            res.lst_coleccones = response.lst_colecciones;
            return Utiles.crypt(res, Request.Headers);
        }

        [Route("get/documentos")]
        [HttpPost]
        public ResCrypt getDocumentos( RequestGetDocumentos request ) {
            ResponseGetDocumentos res = new ResponseGetDocumentos();
            ReqGetDocumentos req = new ReqGetDocumentos();
            req.str_mac_dispositivo = request.str_mac_dispositivo;
            req.str_login = request.str_login;
            req.str_sesion = request.str_sesion;
            req.str_id_usuario = request.str_id_usuario;
            req.str_id_oficina = request.str_id_oficina;
            req.str_id_perfil = request.str_id_perfil;
            req.str_nombre_bd = request.str_bd;
            req.str_nombre_coleccion = request.str_coleccion;
            req.int_nro_registros = request.int_registros;
            req.str_ultimo_registro = request.str_referencia;
            req.str_ip_dispositivo = Utiles.getIP();
            req.str_filtro_buscar = request.str_filtro_buscar;
            ResGetDocumentos response = configDat.getDocumentos(req);
            res.int_total_registros = response.int_total_registros;
            res.mensaje = response.str_res_info_adicional;
            res.codigo = response.str_res_codigo;
            res.lst_docs = response.lst_documentos;
            return Utiles.crypt(res, Request.Headers);
        }

        [Route("get/seguimiento")]
        [HttpPost]
        public ResCrypt getSeguimiento( RequestGetSeguimiento request ) {
            ResponseGetSeguimiento res = new ResponseGetSeguimiento();
            ReqGetSeguimiento req = new ReqGetSeguimiento();
            req.str_mac_dispositivo = request.str_mac_dispositivo;
            req.str_login = request.str_login;
            req.str_sesion = request.str_sesion;
            req.str_id_usuario = request.str_id_usuario;
            req.str_id_oficina = request.str_id_oficina;
            req.str_id_perfil = request.str_id_perfil;
            string str_url_con = "";
            if(String.IsNullOrWhiteSpace(request.str_protcol)) {
                foreach(var item in _settings.lst_urls) {
                    if(item.str_nombre == request.str_server) {
                        str_url_con = item.str_protocolo + request.str_user + ":" + request.str_password + item.str_url;
                        break;
                    }
                }
            } else {
                str_url_con = request.str_protcol + request.str_user + ":" + request.str_password + request.str_server;
            }
            req.str_url = str_url_con;
            req.str_id_transacccion_search = request.str_id_transacccion_search;
            req.str_ip_dispositivo = Utiles.getIP();
            ResGetSeguimiento response = configDat.getSeguimiento(req);
            res.mensaje = response.str_res_info_adicional;
            res.codigo = response.str_res_codigo;
            res.lst_seguimiento = response.lst_seguimiento;
            return Utiles.crypt(res, Request.Headers);
        }
        #endregion
        #region SET
        [Route("set/conexion")]
        [HttpPost]
        public ResCrypt SetConexion( RequestSetConexion request ) {
            ResponseSetConexion res = new ResponseSetConexion();
            ReqSetConexion req = new ReqSetConexion();
            req.str_mac_dispositivo = request.str_mac_dispositivo;
            req.str_login = request.str_login;
            req.str_sesion = request.str_sesion;
            req.str_id_usuario = request.str_id_usuario;
            req.str_id_oficina = request.str_id_oficina;
            req.str_id_perfil = request.str_id_perfil;
            req.str_nombre = request.str_nombre_buscar;
            req.str_ip_dispositivo = Utiles.getIP();
            foreach(var item in _settings.lst_urls) {
                if(item.str_nombre == request.str_server) {
                    req.obj_conexion = new ConexionDTO() {
                        str_usuario = request.str_usuario,
                        str_clave = request.str_clave,
                        str_id_usuario = request.str_id_usuario,
                        str_protocolo = item.str_protocolo,
                        str_servidor = item.str_url,
                        str_nombre = request.str_usuario + "@" + item.str_nombre,
                        dtt_ceacion = request.dtt_ceacion,
                        dtt_ult_con = request.dtt_ult_con
                    };
                    break;
                }
            }
            ResSetConexion response = configDat.setConexiones(req);
            res.mensaje = response.str_res_info_adicional;
            res.codigo = response.str_res_codigo;
            return Utiles.crypt(res, Request.Headers);
        }
        #endregion
    }
}