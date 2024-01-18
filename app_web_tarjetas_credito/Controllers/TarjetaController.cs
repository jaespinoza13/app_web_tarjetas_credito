using Domain.Common;
using Domain.Common.Interfaces;
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
    public class TarjetaController : ControllerBase
    {
        private readonly AppSettings _settings;
        private readonly TarjetaCreditoDat tarjetaCreditoDat;
        private readonly ILogger<TarjetaController> _logger;
        private readonly IParametersInMemory _parametros;
        public TarjetaController(IOptionsMonitor<AppSettings> settings, ILogger<TarjetaController> logger, IParametersInMemory parametros)
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
            resGetValidaciones.lst_validaciones = res.lst_validaciones;
            return Utiles.crypt(res, Request.Headers);            
        }
    }
}
