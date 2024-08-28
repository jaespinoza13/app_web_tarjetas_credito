using Domain.Common.Interfaces;
using Domain.Common;
using Infrastructure.TarjetaCredito;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using plantilla_app_web.Controllers.Common;
using plantilla_app_web.Filters;
using Domain.Models.OrdenesTc.GetOrdenesTc;
using Domain.Models.OrdenesTc.UpdOrdenesTc;

namespace app_web_tarjetas_credito.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class OrdenesTcController : ControllerBase
    {
        private readonly AppSettings _settings;
        private readonly OrdenesTcDat _ordenesTcDat;
        private readonly ILogger<OrdenesTcController> _logger;
        private readonly IParametersInMemory _parametros;

        public OrdenesTcController(IOptionsMonitor<AppSettings> settings, ILogger<OrdenesTcController> logger, IParametersInMemory parametros)
        {
            _settings = settings.CurrentValue;
            _logger = logger;
            _ordenesTcDat = new OrdenesTcDat(_settings);
            _parametros = parametros;
        }

        [Route("getOrdenes")]
        [ServiceFilter(typeof(CryptoFilter))]
        [HttpPost]
        public ResCrypt Post(ReqGetOrdenesTc req)
        {
            ResGetOrdenesTc res = _ordenesTcDat.getOrdenesTC(req);
            return Utiles.crypt(res, Request.Headers);
        }


        [Route("updOrdenesTc")]
        [ServiceFilter(typeof(CryptoFilter))]
        [HttpPost]
        public ResCrypt Post(ReqUpdOrdenTc req)
        {
            ResUpdOrdenTc res = _ordenesTcDat.updOrdenesTC(req);
            return Utiles.crypt(res, Request.Headers);
        }



    }
}
