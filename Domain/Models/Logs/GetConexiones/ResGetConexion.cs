using Domain.Common;
using Domain.Models.Logs.GetConexiones.Common;

namespace Domain.Models.Logs.GetConexiones {
    public class ResGetConexion : ResComun {
        public List<ConexionDTO> lst_conexiones { get; set; } = new List<ConexionDTO>();
    }
}
