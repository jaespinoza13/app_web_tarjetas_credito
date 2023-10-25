using Domain.Common;

namespace Domain.Models.Logs.GetContenidoLogTexto {
    public class ResGetContenidoLogTexto : ResComun{
        public String str_contenido { get; set; } = String.Empty;
        public double dbl_megas { get; set; }
        public int int_total_registros { get; set; }
    }
}
