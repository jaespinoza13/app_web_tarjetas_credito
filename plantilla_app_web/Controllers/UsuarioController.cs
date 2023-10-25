using plantilla_app_web.Controllers.Common;
using plantilla_app_web.Filters;
using Domain.Common;
using Domain.Models.Usuario.Entities;
using Domain.Models.Usuario.GetPreguntaUsuario;
using Domain.Models.Usuario.GetValidarPregunta;
using Domain.Models.Usuario.SetPassPrimeraVez;
using Domain.Models.Usuario.SetPassword;
using Domain.Models.Usuario.SetPreguntas;
using Infrastructure.Usuario;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace plantilla_app_web.Controllers {
    [ApiController]
    [Route("[controller]")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public class UsuarioController : ControllerBase {
        private readonly AppSettings _settings;
        private readonly UsuarioDat usuarioDat;
        private readonly ILogger<UsuarioController> _logger;

        public UsuarioController( ILogger<UsuarioController> logger, IOptionsMonitor<AppSettings> settings ) {
            _logger = logger;
            _settings = settings.CurrentValue;
            usuarioDat = new UsuarioDat(_settings);
        }

        #region SET
        [Route("set/preguntas")]
        [ServiceFilter(typeof(CryptoFilter))]
        [HttpPost]
        public ResCrypt setPreguntas( ReqSetPreguntas reqSetPreguntas ) {
            List<Dictionary<string, string>> lst = new List<Dictionary<string, string>>();
            for(int i = 0; i < reqSetPreguntas.preguntas.Length; i++) {
                Dictionary<string, string> dict = new Dictionary<string, string>();
                dict.Add(reqSetPreguntas.preguntas [i].Trim(), reqSetPreguntas.respuestas [i].Trim());
                lst.Add(dict);
            }
            reqSetPreguntas.js_prg_rsp = JsonConvert.SerializeObject(lst);
            ResSetPreguntas res = usuarioDat.setPreguntas(reqSetPreguntas);
            return Utiles.crypt(res, Request.Headers);
        }

        [Route("set/password")]
        [ServiceFilter(typeof(CryptoFilter))]
        [HttpPost]
        public ResCrypt setPassword( ReqSetPassword reqSetPassword ) {
            reqSetPassword.id_sistema = _settings.id_sistema;
            ResSetPassword res = usuarioDat.setPassword(reqSetPassword);
            return Utiles.crypt(res, Request.Headers);
        }

        [Route("reset/password")]
        [ServiceFilter(typeof(CryptoFilter))]
        [HttpPost]
        public ResCrypt resetPassword( ReqSetPassword reqSetPassword ) {
            reqSetPassword.id_sistema = _settings.id_sistema;
            ResSetPassword res = usuarioDat.resetPassword(reqSetPassword);
            return Utiles.crypt(res, Request.Headers);
        }

        [Route("set/password/primera")]
        [ServiceFilter(typeof(CryptoFilter))]
        [HttpPost]
        public ResCrypt resetPassword( ReqSetPassPrimeraVez reqSetPassPrimeraVez ) {
            reqSetPassPrimeraVez.id_sistema = _settings.id_sistema;
            List<Dictionary<string, string>> lst = new List<Dictionary<string, string>>();
            for(int i = 0; i < reqSetPassPrimeraVez.preguntas.Length; i++) {
                Dictionary<string, string> dict = new Dictionary<string, string>();
                dict.Add(reqSetPassPrimeraVez.preguntas [i].Trim(), reqSetPassPrimeraVez.respuestas [i].Trim());
                lst.Add(dict);
            }
            reqSetPassPrimeraVez.js_prg_rsp = JsonConvert.SerializeObject(lst);
            ResSetPassPrimeraVez res = usuarioDat.setPassPrimeraVez(reqSetPassPrimeraVez);
            return Utiles.crypt(res, Request.Headers);
        }
        #endregion

        #region GET
        [Route("get/preguntas")]
        [HttpGet]
        public ResCrypt getPreguntas() {
            Preguntas res = usuarioDat.getPreguntas();
            return Utiles.crypt(res, Utiles.generateKey(Request.Headers));
        }

        [Route("get/pregunta/usuario/{login?}")]
        [HttpGet]
        public ResCrypt getPreguntas( string login ) {
            ResGetPreguntaUsuario res = usuarioDat.getPreguntaUsuario(login);
            return Utiles.crypt(res, Utiles.generateKey(Request.Headers));
        }

        [Route("get/validar/pregunta")]
        [ServiceFilter(typeof(CryptoFilter))]
        [HttpPost]
        public ResCrypt getValidarPregunta( ReqGetValidarPregunta reqGetValidarPregunta ) {
            reqGetValidarPregunta.id_sistema = _settings.id_sistema;
            ResComunWsSistemas res = usuarioDat.getValidarPregunta(reqGetValidarPregunta);
            RespuestaComun respuestaComun = new RespuestaComun();
            respuestaComun.codigo = (res.codigo == "RP3") ? "0000" : "0001";
            respuestaComun.mensaje = (res.codigo != "RP3") ? res.mensajes [0] : "OK";
            return Utiles.crypt(respuestaComun, Request.Headers);
        }
        #endregion
    }
}