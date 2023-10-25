using Domain.Common;

namespace Application.GetDocumentos {
    public class ResGetDocumentos : ResComun {
        public List<object> lst_documentos { get; set; } = new List<object>();
        public int int_total_registros { get; set; }
    }
}
