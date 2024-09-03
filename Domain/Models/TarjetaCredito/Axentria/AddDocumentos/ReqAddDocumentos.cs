using Domain.Common;

namespace Domain.Models.TarjetaCredito.Axentria.AddDocumentos
{
    public class ReqAddDocumentos: Header
    {
        public bool bln_separar { get; set; }
        public int int_id_separador { get; set; }
        public string str_ruta_arc { get; set; } = string.Empty;
        public string str_nombre_arc { get; set; } = string.Empty;
        public string str_identificacion { get; set; } = string.Empty;
        public string str_login_carga { get; set; } = string.Empty;
        public string str_nombre_socio { get; set; } = string.Empty;
        public string str_nombre_grupo { get; set; } = string.Empty;
        public string str_referencia { get; set; } = string.Empty;
        public Loadfile loadfile { get; set; }
        public int int_id_solicitud { get; set; }
        public string str_version_doc { get; set; } = string.Empty;

    }
    public class Loadfile
    {
        public string file { get; set; }
    }
}
