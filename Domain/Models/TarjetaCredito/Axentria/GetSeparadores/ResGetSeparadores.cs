using Domain.Common;

namespace Domain.Models.TarjetaCredito.Axentria.GetSeparadores
{
    public class ResGetSeparadores: ResComun
    {
        public List<Separadores> lst_separadores { get; set; }

        public class Separadores
        {
            //public string str_ord { get; set; } = string.Empty;
            public int int_id_separador { get; set; }
            public string str_separador { get; set; } = string.Empty;
            public string str_nombre_separador { get; set; } = string.Empty;
            public string str_ruta_arc { get; set; } = string.Empty;
            public string str_nombre_socio { get; set; } = string.Empty;
            public string str_referencia { get; set; } = string.Empty;
            public string str_login_carga { get; set; } = string.Empty;

            //TEMPORALES
            public string str_ord { get; set; } = "1";
            public string str_actor { get; set; } = "T";
            public DateTime? dtt_fecha_sube { get; set; }
            //public string dtt_fecha_sube { get; set; }
            public string str_version { get; set; } = string.Empty;

            public int int_valida_separador { get; set; } = 0;
            public int int_valida_publicacion { get; set; } = 0;
            public int int_id_doc_relacionado { get; set; } = 0;

        }
    }
}
