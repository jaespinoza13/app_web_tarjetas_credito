using Domain.Common;

namespace Domain.Models.Logs.GetListaBases.Internal {
    public class ResponseGetDocumentos : RespuestaComun {
        public List<object> lst_docs { get; set; } = new List<object>();
        public int int_total_registros { get; set; }
    }
}
