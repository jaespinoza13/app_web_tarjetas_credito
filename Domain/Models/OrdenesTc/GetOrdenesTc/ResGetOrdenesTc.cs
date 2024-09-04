using Domain.Common;
namespace Domain.Models.OrdenesTc.GetOrdenesTc
{
    public class ResGetOrdenesTc: ResComun
    {
        public List<OficinaGrupo> lst_ordenes_tc { get; set; } = new();

        public class OficinaGrupo
        {
            public string str_oficina_entrega { get; set; } = string.Empty;
            public int int_total_tarjetas { get; set; } = 0;
            public List<Ordenes> lst_ord_ofi { get; set; } = new();
        }
        public class Ordenes
        {
            public int int_seg_id { get; set; } = 0;
            public int int_sol_id { get; set; } = 0;
            public string str_identificacion { get; set; } = string.Empty;
            public string str_denominacion_socio { get; set; } = string.Empty;
            public DateTime dtt_fecha_entrega { get; set; }
            public string str_tipo_propietario { get; set; } = string.Empty;
            public string str_tipo_tarjeta { get; set; } = string.Empty;
            public int int_id_oficina { get; set; } = 0;
            public string str_oficina_entrega { get; set; } = string.Empty;
            public string str_num_tarjeta { get; set; } = string.Empty;

        }
    }
}
