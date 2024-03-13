using Domain.Common;
using Domain.Common.Interfaces;
using Domain.Models.TarjetaCredito.AddAutorizacion;
using Domain.Models.TarjetaCredito.AddSolicitud;
using Domain.Models.TarjetaCredito.GetInfoEconomica;
using Domain.Models.TarjetaCredito.GetInfoSocio;
using Domain.Models.TarjetaCredito.GetScore;
using Domain.Models.TarjetaCredito.GetSolicitudes;
using Domain.Models.TarjetaCredito.GetValidaciones;
using Infrastructure.Login;
using Infrastructure.TarjetaCredito;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using plantilla_app_web.Controllers.Common;
using plantilla_app_web.Filters;

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
    }
}
