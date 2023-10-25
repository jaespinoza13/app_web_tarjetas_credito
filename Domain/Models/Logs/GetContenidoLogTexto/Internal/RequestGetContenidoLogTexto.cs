using Domain.Common;

namespace Domain.Models.Logs.GetContenidoLogTexto.Internal {
    public class RequestGetContenidoLogTexto : RequestComun {
        public String str_ws { get; set; } = String.Empty;
        public String str_file { get; set; } = String.Empty;
        public int int_desde { get; set; }
        public int int_hasta { get; set; }
    }
}
