using Domain.Common;
using Domain.Common.Interfaces;
using Domain.Models.TarjetaCredito.AddAutorizacion;
using Domain.Models.TarjetaCredito.AddComentarioAsesor;
using Domain.Models.TarjetaCredito.AddComentarioSolicitud;
using Domain.Models.TarjetaCredito.AddProcesoEspecifico;
using Domain.Models.TarjetaCredito.AddProspeccion;
using Domain.Models.TarjetaCredito.AddResolucion;
using Domain.Models.TarjetaCredito.AddSolicitud;
using Domain.Models.TarjetaCredito.GetComentarios;
using Domain.Models.TarjetaCredito.GetContrato;
using Domain.Models.TarjetaCredito.GetContratos;
using Domain.Models.TarjetaCredito.GetFlujoSolicitud;
using Domain.Models.TarjetaCredito.GetInfoEconomica;
using Domain.Models.TarjetaCredito.GetInfoFinanciera;
using Domain.Models.TarjetaCredito.GetInfoSocio;
using Domain.Models.TarjetaCredito.GetParamatrosSistema;
using Domain.Models.TarjetaCredito.GetResoluciones;
using Domain.Models.TarjetaCredito.GetScore;
using Domain.Models.TarjetaCredito.GetSolicitudes;
using Domain.Models.TarjetaCredito.GetValidaciones;
using Domain.Models.TarjetaCredito.UpdResoluciones;
using Domain.Models.TarjetaCredito.ObtenerOrdenReporte;
using Domain.Models.TarjetaCredito.UpdSolicitud;
using Infrastructure.Login;
using Infrastructure.TarjetaCredito;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using plantilla_app_web.Controllers.Common;
using plantilla_app_web.Filters;
using Domain.Models.TarjetaCredito.GetOrdenes;
using Domain.Models.TarjetaCredito.GetTarjetasCredito;
using Domain.Models.TarjetaCredito.GetMedioAprobacion;
using Domain.Models.TarjetaCredito.Axentria.GetSeparadores;
using Domain.Models.TarjetaCredito.Axentria.AddDocumentos;
using Domain.Models.TarjetaCredito.Axentria.ObtenerDocumentos;

namespace plantilla_app_web.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TarjetaCreditoController : ControllerBase
    {
        private readonly AppSettings _settings;
        private readonly TarjetaCreditoDat tarjetaCreditoDat;
        private readonly ILogger<TarjetaCreditoController> _logger;
        private readonly IParametersInMemory _parametros;
        public TarjetaCreditoController(IOptionsMonitor<AppSettings> settings, ILogger<TarjetaCreditoController> logger, IParametersInMemory parametros)
        {
            _settings = settings.CurrentValue;
            _logger = logger;
            tarjetaCreditoDat = new TarjetaCreditoDat(_settings);
            _parametros = parametros;
        }

        [Route("validacion")]
         [ServiceFilter(typeof(CryptoFilter))]
        [HttpPost]
        public ResCrypt Post(ReqGetValidaciones req)
        {
            ResGetValidaciones resGetValidaciones = new ResGetValidaciones();
            string ip = Utiles.getIP();
            ResGetValidaciones res = tarjetaCreditoDat.getValidaciones(req);
            return Utiles.crypt(res, Request.Headers);            
        }

        [Route("score")]
        [ServiceFilter(typeof(CryptoFilter))]
        [HttpPost]
        public ResCrypt Post(ReqGetScore req)
        {
            ReqGetScore reqGetScore = new ReqGetScore();
            reqGetScore.str_login = req.str_login;
            reqGetScore.str_mac_dispositivo = req.str_mac_dispositivo;
            reqGetScore.str_sesion = req.str_sesion;
            reqGetScore.str_id_oficina = req.str_id_oficina;
            reqGetScore.str_id_perfil = req.str_id_perfil;
            reqGetScore.str_ip_dispositivo = Utiles.getIP();
            reqGetScore.str_tipo_identificacion = req.str_tipo_identificacion;
            reqGetScore.str_identificacion = req.str_identificacion;
            reqGetScore.str_nombres = req.str_nombres;
            reqGetScore.str_lugar = req.str_lugar;
            reqGetScore.str_oficial = req.str_oficial;
            reqGetScore.str_cargo = req.str_cargo;
            string ip = Utiles.getIP();
            ResGetScore res = tarjetaCreditoDat.getScore(reqGetScore);
            return Utiles.crypt(res, Request.Headers);
        }

        [Route("infoEco")]
        [ServiceFilter(typeof(CryptoFilter))]
        [HttpPost]
        public ResCrypt Post(ReqGetInfoEconomica req)
        {
            ResGetInfoEconomica res = tarjetaCreditoDat.getInfoEconomica(req);
            return Utiles.crypt(res, Request.Headers);            
        }

        [Route("infoSocio")]
        [ServiceFilter(typeof(CryptoFilter))]
        [HttpPost]
        public ResCrypt Post(ReqGetInfoSocio req)
        {
            ResGetInfoSocio resGetInfoSocio = new ResGetInfoSocio();
            resGetInfoSocio = tarjetaCreditoDat.getInfoSocio(req);
            return Utiles.crypt(resGetInfoSocio, Request.Headers);
        }

        [Route("getContrato")]
        [ServiceFilter(typeof(CryptoFilter))]
        [HttpPost]
        public ResCrypt Post(ReqGetContrato req)
        {
            ResGetContrato res = tarjetaCreditoDat.getContrato(req);
            return Utiles.crypt(res, Request.Headers);
        }

        [Route("addAutorizacion")]
        [ServiceFilter(typeof(CryptoFilter))]
        [HttpPost]
        public ResCrypt Post(ReqAddAutorizacion req)
        {
            ResAddAutorizacion res = tarjetaCreditoDat.addAutorizacion(req);
            return Utiles.crypt(res, Request.Headers);
        }

        [Route("getSolicitudes")]
        [ServiceFilter(typeof(CryptoFilter))]
        [HttpPost]
        public ResCrypt Post(ReqGetSolicitudes req)
        {
            ResGetSolicitudes res = tarjetaCreditoDat.getSolicitudes(req);
            return Utiles.crypt(res, Request.Headers);
        }

        [Route("addSolicitud")]
        [ServiceFilter(typeof(CryptoFilter))]
        [HttpPost]
        public ResCrypt Post(ReqAddSolicitud req)
        {
            ResAddSolicitud res = tarjetaCreditoDat.addSolicitud(req);
            return Utiles.crypt (res, Request.Headers);
        }

        [Route("getInfoFinan")]
        [ServiceFilter(typeof(CryptoFilter))]
        [HttpPost]
        public ResCrypt Post(ReqGetInfoFinan req)
        {
            ResGetInfoFinan res = tarjetaCreditoDat.getInfoFinan(req);
            return Utiles.crypt(res, Request.Headers);
        }

        [Route("addProspecto")]
        [ServiceFilter(typeof(CryptoFilter))]
        [HttpPost]
        public ResCrypt Post(ReqAddProspeccion req)
        {
            ResAddProspeccion res = tarjetaCreditoDat.addProspeccion(req);
            return Utiles.crypt(res, Request.Headers);
        }

        [Route("getInforme")]
        [ServiceFilter(typeof(CryptoFilter))]
        [HttpPost]
        public ResCrypt Post(ReqGetComentarios req)
        {
            ResGetComentarios res = tarjetaCreditoDat.getComentarios(req);
            return Utiles.crypt(res, Request.Headers);
        }

        [Route("getFlujoSolicitud")]
        [ServiceFilter(typeof(CryptoFilter))]
        [HttpPost]
        public ResCrypt Post(ReqGetFlujoSolicitud req)
        {
            ResGetFlujoSolicitud res = tarjetaCreditoDat.getFlujoSolicitud(req);
            return Utiles.crypt(res, Request.Headers);
        }

        [Route("addComentarioAsesor")]
        [ServiceFilter(typeof(CryptoFilter))]
        [HttpPost]
        public ResCrypt Post(ReqAddComentarioAsesor req)
        {
            ResAddComentarioAsesor res = tarjetaCreditoDat.addComentarioAsesor(req);
            return Utiles.crypt(res, Request.Headers);
        }

        [Route("addComentarioSolicitud")]
        [ServiceFilter(typeof(CryptoFilter))]
        [HttpPost]
        public ResCrypt Post(ReqAddComentarioSolicitud req)
        {
            ResAddComentarioSolicitud res = tarjetaCreditoDat.addComentarioSolicitud(req);
            return Utiles.crypt(res, Request.Headers);
        }

        [Route("getResoluciones")]
        [ServiceFilter(typeof(CryptoFilter))]
        [HttpPost]
        public ResCrypt Post(ReqGetResolucion req)
        {
            ResGetResolucion res = tarjetaCreditoDat.addGetResoluciones(req);
            return Utiles.crypt(res, Request.Headers);
        }

        [Route("addResolucion")]
        [ServiceFilter(typeof(CryptoFilter))]
        [HttpPost]
        public ResCrypt Post(ReqAddResolucion req)
        {
            ResAddResolucion res = tarjetaCreditoDat.addResolucion(req);
            return Utiles.crypt(res, Request.Headers);
        }

        [Route("updResolucion")]
        [ServiceFilter(typeof(CryptoFilter))]
        [HttpPost]
        public ResCrypt Post(ReqUpdResolucion req)
        {
            ResUpdResolucion res = tarjetaCreditoDat.addUpdResolucion(req);
            return Utiles.crypt(res, Request.Headers);
        }


        [Route("getReporteOrden")]
        [ServiceFilter(typeof(CryptoFilter))]
        [HttpPost]
        public ResCrypt Post(ReqGetReporteOrden req)
        {
            ResGetReporteOrden res = tarjetaCreditoDat.getReporteOrden(req);
            return Utiles.crypt(res, Request.Headers);
        }

        [Route("getMedioAprobacion")]
        [ServiceFilter(typeof(CryptoFilter))]
        [HttpPost]
        public ResCrypt Post(ReqGetMedAprob req)
        {
            ResGetMedAprob res = tarjetaCreditoDat.getMedioAprobacion(req);
            return Utiles.crypt(res, Request.Headers);
        }

        [Route("getOrdenes")]
        [ServiceFilter(typeof(CryptoFilter))]
        [HttpPost]
        public ResCrypt Post(ReqGetOrdenes req)
        {
            ResGetOrdenes res = tarjetaCreditoDat.getOrdenes(req);
            return Utiles.crypt(res, Request.Headers);
        }


        [Route("getTarjetasCredito")]
        [ServiceFilter(typeof(CryptoFilter))]
        [HttpPost]
        public ResCrypt Post(ReqGetTarjetasCredito req)
        {
            ResGetTarjetasCredito res = tarjetaCreditoDat.getTarjetasCredito(req);
            return Utiles.crypt(res, Request.Headers);
        }


        [Route("addProcEspecifico")]
        [ServiceFilter(typeof(CryptoFilter))]
        [HttpPost]
        public ResCrypt Post(ReqAddProcesoEspecifico req)
        {
            ResAddProcesoEspecifico res = tarjetaCreditoDat.addProcesoEspecifico(req);
            return Utiles.crypt(res, Request.Headers);
        }

        [Route("updSolicitud")]
        [ServiceFilter(typeof(CryptoFilter))]
        [HttpPost]
        public ResCrypt Post(ReqUpdSolicitud req)
        {
            ResUpdSolicitud res = tarjetaCreditoDat.updSolicitud(req);
            return Utiles.crypt(res, Request.Headers);
        }

        [Route("getSeparadores")]
        [ServiceFilter(typeof(CryptoFilter))]
        [HttpPost]
        public ResCrypt Post(ReqGetSeparadores req)
        {
            ResGetSeparadores res = tarjetaCreditoDat.getSeparadores(req);
            return Utiles.crypt(res, Request.Headers);
        }

        [Route("addDocumentosAxentria")]
        [ServiceFilter(typeof(CryptoFilter))]
        [HttpPost]
        public ResCrypt Post(ReqAddDocumentos req)
        {
            ResAddDocumentos res = tarjetaCreditoDat.addDocumentosAxentria(req);
            return Utiles.crypt(res, Request.Headers);
        }

        [Route("getDocumentosAxentria")]
        [ServiceFilter(typeof(CryptoFilter))]
        [HttpPost]
        public ResCrypt Post(ReqGetDocumentos req)
        {
            ResGetDocumentos res = tarjetaCreditoDat.getDocumentosAxentria(req);
            return Utiles.crypt(res, Request.Headers);
        }

        [Route("getParametros")]
        [ServiceFilter(typeof(CryptoFilter))]
        [HttpPost]
        public ResCrypt Post(ReqGetParametrosSistema req)
        {
            ResGetParametrosSistema res = tarjetaCreditoDat.getParametros(req);
            return Utiles.crypt(res, Request.Headers);
        }
    }
}
