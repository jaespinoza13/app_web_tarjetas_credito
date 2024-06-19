using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.TarjetaCredito.GetScore
{
    public class ReqGetScore : Header
    {
        public string str_ingresos { get; set; } = string.Empty;
        public string str_gastosPersonales { get; set; } = string.Empty;
        public string str_restaGastoFinanciero { get; set; } = string.Empty;
        public string str_nombres { get; set; } = string.Empty;
        public string str_oficial { get; set; } = string.Empty;
        public string str_cargo { get; set; } = string.Empty;
        public string str_lugar { get; set; } = string.Empty;
        public string str_estado { get; set; } = string.Empty;
        public int int_consulta_ext { get; set; }
        public string str_tipo_identificacion { get; set; } = string.Empty;
        public string str_identificacion { set; get; } = string.Empty;
        public int int_cliente { set; get; }

        //DATOS A LLENAR CUANDO REALIZA NUEVA SIMULACION

        public bool bln_cupo_sugerido { get; set; } //0 para consulta normal, 1 para nueva simulacion
        public decimal dcm_total_ingresos { get; set; }
        public decimal dcm_total_egresos { get; set; }
        public decimal dcm_gastos_financieros { get; set; }
        public decimal dcm_gastos_finan_codeudor { get; set; }
    }
}
