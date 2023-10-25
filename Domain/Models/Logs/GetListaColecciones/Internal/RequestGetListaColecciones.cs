using Domain.Common;

namespace Domain.Models.Logs.GetListaBases.Internal {
    public class RequestGetListaColecciones : RequestComun {
        public string str_bd { get; set; } = String.Empty;
    }
}
