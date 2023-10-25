using Domain.Common;
using Domain.Models.Logs.GetConexiones.Common;

namespace Domain.Models.Logs.AddConexion {
    public class ReqAddConexion : Header{
        public ConexionDTO obj_conexion { get; set; } = new ConexionDTO();
    }
}
