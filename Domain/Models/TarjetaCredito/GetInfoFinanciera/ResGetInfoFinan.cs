using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.TarjetaCredito.GetInfoFinanciera
{
    public class ResGetInfoFinan : ResComun
    {
        public List<Captaciones>? lst_captaciones { get; set; }
        public List<LstCreditosHistorico>? lst_creditos_historicos { get; set; }


        
    }
    public class LstCreditosHistorico
    {
        public int int_operacion { get; set; }
        public string str_tipo { get; set; } = String.Empty;
        public string str_operacion_cred { get; set; } = String.Empty;
        public double dcm_monto_aprobado { get; set; }
        public DateTime dtt_fecha_vencimiento { get; set; }
        public DateTime dtt_fecha_concesion { get; set; }
        public int int_cuotas_vencidas { get; set; }
        public int int_dias_mora { get; set; }
        public int int_orden { get; set; }
    }

    public class Captaciones
    {
        public int int_id_cuenta { get; set; }
        public string str_num_cuenta { get; set; } = String.Empty;
        public double dcm_ahorro { get; set; }
        public DateTime dtt_fecha_movimiento { get; set; }
        public double dcm_promedio { get; set; }
        public string str_tipo_cta { get; set; } = String.Empty;
        public string str_estado { get; set; } = String.Empty;
        public int int_orden { get; set; }
    }
}
