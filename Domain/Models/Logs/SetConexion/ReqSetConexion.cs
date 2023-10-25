using Domain.Common;
using Domain.Models.Logs.GetConexiones.Common;

namespace Domain.Models.Logs.SetConexion {
    public class ReqSetConexion : Header{
        public ConexionDTO obj_conexion { get; set; } = new ConexionDTO();
        public string str_nombre { get; set; } = String.Empty;
    }
}
