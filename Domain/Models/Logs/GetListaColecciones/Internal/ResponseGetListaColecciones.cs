using Domain.Common;

namespace Domain.Models.Logs.GetListaBases.Internal {
    public class ResponseGetListaColecciones : RespuestaComun {
        public List<String> lst_coleccones { get; set; } = new List<String>();
    }
}
