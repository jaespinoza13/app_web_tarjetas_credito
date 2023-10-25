using Domain.Common;
using Domain.Models.Logs.GetConexiones.Common;

namespace Domain.Models.Logs.GetConexiones.Internal {
    public class ResponseGetConexiones : RespuestaComun {
        public List<ConexionDTO> lst_conexiones { get; set; } = new List<ConexionDTO>();
    }
}
