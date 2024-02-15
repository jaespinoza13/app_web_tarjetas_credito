using Domain.Common;
using Domain.Common.Interfaces;
using Domain.Models.TarjetaCredito.GetInfoSocio;
using Domain.Models.TarjetaCredito.GetScore;
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
            ResGetScore resGetScore = new ResGetScore();
            string ip = Utiles.getIP();
            ResGetScore res = tarjetaCreditoDat.getScore(req);
            resGetScore.response = res.response;
            resGetScore.str_res_codigo = res.str_res_codigo;
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
    }
}
