using plantilla_app_web.Controllers.Common;
using plantilla_app_web.Filters;
using Domain.Common;
using Domain.Common.Interfaces;
using Domain.Models.Login;
using Infrastructure.Login;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace plantilla_app_web.Controllers {
    [ApiController]
    [Route("[controller]")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public class LoginController : ControllerBase {
        private readonly AppSettings _settings;
        private readonly LoginDat loginDat;
        private readonly ILogger<LoginController> _logger;
        private readonly IParametersInMemory _parametros;

        public LoginController( ILogger<LoginController> logger, IOptionsMonitor<AppSettings> settings, IParametersInMemory parametros ) {
            _logger = logger;
            _settings = settings.CurrentValue;
            loginDat = new LoginDat(_settings);
            _parametros = parametros;
        }

        [Route("")]
        [ServiceFilter(typeof(CryptoFilter))]
        [HttpPost]
        public ResCrypt Post( ReqLogin req ) {
            string ip = Utiles.getIP();
            req.id_sistema = _settings.id_sistema;
            req.terminal = ip;
            ResLogin res = loginDat.auth(req);
            if(res.codigo == "000" || res.codigo == "002") {
                _parametros.AddSesion(res.datosUsuario.id_usuario, res.datosUsuario.login, res.datosUsuario.password, ip);
            }
            return Utiles.crypt(res, Request.Headers);
        }

        [Route("logout/{id_usuario?}")]
        [HttpGet]
        public ResCrypt logout( int id_usuario ) {
            _parametros.RemoveSesion(id_usuario, Utiles.getIP());
            return Utiles.crypt(loginDat.cerrar_session(id_usuario), Utiles.generateKey(Request.Headers));
        }

        [Route("{id_usuario?}/{id_perfil?}")]
        [HttpGet]
        public ResCrypt login( int id_usuario, int id_perfil ) {
            bool habilitado = loginDat.verificar_horario(id_usuario, _settings.id_sistema, id_perfil);
            if(!habilitado) {
                _parametros.RemoveSesion(id_usuario, Utiles.getIP());
            }
            return Utiles.crypt(habilitado, Utiles.generateKey(Request.Headers));
        }
    }
}