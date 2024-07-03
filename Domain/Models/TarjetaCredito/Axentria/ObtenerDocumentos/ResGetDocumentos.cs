using Domain.Common;

namespace Domain.Models.TarjetaCredito.Axentria.ObtenerDocumentos
{
    public class ResGetDocumentos: ResComun
    {
        public List<Documentos> lst_documentos { get; set; } = new List<Documentos> { };

        public class Documentos
        {
            public int int_id_doc { get; set; }
            public string str_nombre_doc { get; set; } = string.Empty;
            public string str_grupo { get; set; } = string.Empty;
            public string str_usuario_carga { get; set; } = string.Empty;
            public string str_version_doc { get; set; } = string.Empty;
            public DateTime dtt_ult_modificacion { get; set; }
        }
    }
}
