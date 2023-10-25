using Domain.Common;

namespace Domain.Models.Usuario.GetPreguntaUsuario {
    public class ResGetPreguntaUsuario : RespuestaComun {
        public int idUsr { get; set; }
        public string pregunta { get; set;}
    }
}
