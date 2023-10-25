using Domain.Common;

namespace Domain.Models.Logs.GetContenidoLogTexto {
    public class ReqGetContenidoLogTexto : Header {
        public String str_web_service { get; set; } = String.Empty;
        public String str_nombre_archivo { get; set; } = String.Empty;
        public int int_desde { get; set; }
        public int int_hasta { get; set; }
    }
}
