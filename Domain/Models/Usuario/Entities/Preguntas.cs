using Domain.Common;

namespace Domain.Models.Usuario.Entities {
    public class Preguntas : RespuestaComun {
        public List<PreguntaDTO> preguntas { get; set; } = new List<PreguntaDTO>();
    }
}