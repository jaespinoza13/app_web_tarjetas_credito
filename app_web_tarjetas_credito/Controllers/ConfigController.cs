using System.Text;
using plantilla_app_web.Controllers.Common;
using plantilla_app_web.Filters;
using Domain.Common;
using Domain.Common.Interfaces;
using Domain.Models.Config.Entities;
using Domain.Models.Config.GetFuncionalidades;
using Domain.Models.Config.GetInfoSistema;
using Domain.Models.Config.GetMenuPrincipal;
using Infrastructure.Configuraciones;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace plantilla_app_web.Controllers {
    [ApiController]
    [Route("[controller]")]
    public class ConfigController : ControllerBase {
        private readonly AppSettings _settings;
        private readonly ConfiguracionDat configDat;
        private readonly ILogger<ConfigController> _logger;
        private readonly IParametersInMemory _parametros;

        public ConfigController( ILogger<ConfigController> logger, IOptionsMonitor<AppSettings> settings, IParametersInMemory parametros ) {
            _logger = logger;
            _settings = settings.CurrentValue;
            _parametros = parametros;
            try {
                _parametros.ValidaParametros();
            } catch(Exception ex) {
                Console.WriteLine(ex.Message);
            }
            configDat = new ConfiguracionDat(_settings);
        }

        #region GET
        [Route("")]
        [HttpGet]
        public ResCrypt Get() {
            Configuraciones res = new Configuraciones();

            byte [] byt32 = Encoding.ASCII.GetBytes(Utiles.getIP());
            res.remitente = Base32Crypt.Encode(byt32);
            string aceptar = HttpContext.Request.Headers ["validity"]!;
            res.t_aceptar = aceptar;
            string str_secret = Utiles.generateSecret(res.t_aceptar.ToString(), Utiles.getIP());
            Response.Headers ["secret"] = str_secret;

            ResGetInfoSistema resInfosistema = configDat.getInfoSistema();
            if(resInfosistema == null || resInfosistema.datos == null) {
                res.codigo = "0001";
                res.mensaje = "Error en la Obtención de datos";
                return Utiles.crypt(res, res.t_aceptar, Utiles.getIP());
            }
            List<String> lst_url = new List<String>();
            foreach(var item in _settings.lst_urls) {
                lst_url.Add(item.str_nombre);
            }
            res.urls = lst_url;
            res.nombre_sistema = _settings.nombre_sistema;
            res.version = resInfosistema.datos.version;
            res.f_actualizacion = resInfosistema.datos.dtt_fecha_actualizacion.ToString("MMMM dd, yyyy").ToUpper();
            res.mejoras = resInfosistema.mejoras;
            res.t_inactividad = Int32.Parse(_parametros.FindParametroNemonico("TCDS").valorIni);
            res.t_inactividad = (res.t_inactividad <= 0) ? _settings.minutos_inactividad : res.t_inactividad;
            res.nro_caracteres_pass = Int32.Parse(_parametros.FindParametroNemonico("CREP").valorIni);
            res.nro_preguntas = Int32.Parse(_parametros.FindParametroNemonico("NPSC").valorIni);
            res.codigo = "0000";
            res.mensaje = "OK";
            return Utiles.crypt(res, res.t_aceptar, Utiles.getIP());
        }

        [Route("get/menu/{id_perfil?}")]
        [HttpGet]
        public ResCrypt getMenuPrincipal( int id_perfil ) {
            ResGetMenuPrincipal res = configDat.getMenuPrincipal(id_perfil);
            return Utiles.crypt(res, Utiles.generateKey(Request.Headers));
        }

        [Route("get/funcionalidades")]
        [ServiceFilter(typeof(CryptoFilter))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpPost]
        public ResCrypt getFuncionalidades( ReqGetFuncionalidades reqGetFuncionalidades ) {
            Dictionary<string, string> dict = new Dictionary<string, string>();
            dict.Add("VER_LOGS_DE_MONGO", "/logsMongo");
            dict.Add("VER_LOGS_DE_TEXTO", "/logsTexto");
            dict.Add("VER_CONTENIDO_LOGS_DE_TEXTO", "/contenidoLog");
            reqGetFuncionalidades.id_sistema = _settings.id_sistema;
            ResGetFuncionalidades res = configDat.getFuncionalidades(reqGetFuncionalidades);
            res.fucionalidades.ForEach(item => {
                if(dict.ContainsKey(item.nombre)) {
                    item.url = dict [item.nombre];
                }
            });
            return Utiles.crypt(res, Request.Headers);
        }
        #endregion
    }
}