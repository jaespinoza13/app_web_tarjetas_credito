using Domain.Common;

namespace Domain.Models.TarjetaCredito.Axentria.GetSeparadores
{
    public class ResGetSeparadores: ResComun
    {
        public List<Separadores> lst_separadores { get; set; }

        public class Separadores
        {
            //public string str_ord { get; set; } = string.Empty;
            public string str_ord { get; set; } = "1";
            public string str_actor { get; set; } = "T";
            public string str_separador { get; set; } = string.Empty;
            public string str_nombre_separador { get; set; } = string.Empty;
            public string str_ruta_arc { get; set; } = string.Empty;
            public string str_nombre_socio { get; set; } = string.Empty;
            public string str_referencia { get; set; } = string.Empty;
            public string str_login_carga { get; set; } = string.Empty;
        }
    }
}
