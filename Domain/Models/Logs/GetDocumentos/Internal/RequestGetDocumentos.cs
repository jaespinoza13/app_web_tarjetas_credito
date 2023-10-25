using Domain.Common;

namespace Domain.Models.Logs.GetListaBases.Internal {
    public class RequestGetDocumentos : RequestComun {
        public string str_bd { get; set; } = String.Empty;
        public string str_coleccion { get; set; } = String.Empty;
        public int int_registros { get; set; }
        public string str_referencia { get; set; } = String.Empty;
        public string str_filtro_buscar { get; set; } = String.Empty;
    }
}
