using Domain.Common;
using Domain.Models.Logs.GetConexiones.Common;

namespace Domain.Models.Logs.AddConexion.Internal {
    public class RequestAddConexion : RequestComun {
        public string str_server { get; set; } = String.Empty;
        public string str_usuario { get; set; } = String.Empty;
        public string str_clave { get; set; } = String.Empty;
        public DateTime dtt_ceacion { get; set; }
        public DateTime dtt_ult_con { get; set; }
        
    }
}
