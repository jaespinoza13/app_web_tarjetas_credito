using Domain.Common;

namespace Domain.Models.Logs.SetConexion.Internal {
    public class RequestSetConexion : RequestComun {
        public string str_server { get; set; } = String.Empty;
        public string str_usuario { get; set; } = String.Empty;
        public string str_clave { get; set; } = String.Empty;
        public string str_nombre_buscar { get; set; } = String.Empty;
        public DateTime dtt_ceacion { get; set; }
        public DateTime dtt_ult_con { get; set; }
        
    }
}
