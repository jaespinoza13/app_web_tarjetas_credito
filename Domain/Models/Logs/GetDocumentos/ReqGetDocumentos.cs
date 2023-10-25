using Domain.Common;

namespace Application.GetDocumentos {
    public class ReqGetDocumentos : Header {
        public string str_nombre_bd { get; set; } = string.Empty;
        public string str_nombre_coleccion { get; set; } = string.Empty;
        public int int_nro_registros { get; set; }
        public string str_ultimo_registro { get; set; } = String.Empty;
        public string str_filtro_buscar { get; set; } = String.Empty;
    }
}
