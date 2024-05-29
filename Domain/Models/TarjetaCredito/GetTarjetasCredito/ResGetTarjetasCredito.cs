using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.TarjetaCredito.GetTarjetasCredito
{
    public class ResGetTarjetasCredito : ResComun
    {
        public List<TarjetaCredito> lst_tarj_cred { get; set; } = new List<TarjetaCredito>();
    }  
        
    public class TarjetaCredito
    {
        public int int_id_tc { get; set; }
        public int int_sol_fk_tc { get; set; }
        public string str_num_tarjeta { get; set; } = string.Empty;
        public string str_num_cta { get; set; } = string.Empty;
        public string str_identificacion { get; set; } = string.Empty;
        public int int_ente { get; set; }
        public string str_nom_impreso { get; set; } = string.Empty;
        public string str_tipo { get; set; } = string.Empty;
        public string str_estado { get; set; } = string.Empty;
        public string str_cupo_asignado { get; set; } = string.Empty;
        public DateTime dtt_fecha_creacion { get; set; }
        public DateTime dtt_fecha_ult_mod { get; set; }
        public DateTime dtt_fecha_ult_ren { get; set; }
        public string str_cod_ref { get; set; } = string.Empty;
        public string str_observacion { get; set; } = string.Empty;
    }

    
}
