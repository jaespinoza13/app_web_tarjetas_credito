using Domain.Common;

namespace Application.GetListaColecciones {
    public class ReqGetListaColecciones : Header {
        public string str_nombre_bd { get; set; } = string.Empty;
    }
}
