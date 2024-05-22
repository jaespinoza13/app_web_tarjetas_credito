using Domain.Common;

namespace Domain.Models.Config.Entities {
    public class Configuraciones : RespuestaComun {
        public string nombre_sistema { get; set; }
        public string version { get; set; }
        public string f_actualizacion { get; set; }
        public string remitente { get; set; }
        public string t_aceptar { get; set; }
        public int t_inactividad { get; set; }
        public int nro_caracteres_pass { get; set; }
        public int nro_preguntas { get; set; }
        public List<ParametroDTO> parametros_estados_solicitudes { get; set; }
        public List<ParametroDTO> parametros_imprime_medio { get; set; }
        public List<String> mejoras { get; set; }
        public List<String> urls { get; set; }
    }
}
