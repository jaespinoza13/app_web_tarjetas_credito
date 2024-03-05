using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.TarjetaCredito.GetInfoEconomica
{
    public class ResGetInfoEconomica : ResComun
    {
        public List<IngresoEgreso>? lst_egresos_socio {  get; set; }
        public List<IngresoEgreso>? lst_ingresos_socio {  get; set; }
    }
    public class IngresoEgreso
    {
        public int int_codigo { get; set; }
        public string str_descripcion { get; set; } = string.Empty;
        public double dcm_valor { get; set; }
    }
}
