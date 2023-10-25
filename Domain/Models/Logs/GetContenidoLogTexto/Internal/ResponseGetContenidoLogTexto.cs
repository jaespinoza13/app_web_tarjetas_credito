using Domain.Common;

namespace Domain.Models.Logs.GetContenidoLogTexto.Internal {
    public class ResponseGetContenidoLogTexto : RespuestaComun {
        public String str_body { get; set; } = String.Empty;
        public double dbl_megas { get; set; }
        public int int_total_registros { get; set; }
    }
}
