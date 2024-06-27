using Domain.Common;
using Domain.Models.TarjetaCredito.GetValidaciones;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.TarjetaCredito.GetAlertasCliente
{
    public class ResGetAlertasCliente: ResComun
    {
        public AlertasInciales alertas_iniciales { get; set; } = new AlertasInciales();
        public AlertasRestriccion alertas_restriccion { get; set; } = new AlertasRestriccion();
    }
    public class AlertasInciales
    {
        public List<Validaciones> lst_datos_alerta_true { get; set; } = new List<Validaciones>();
        public List<Validaciones> lst_datos_alerta_false { get; set; } = new List<Validaciones>();
    }
    public class AlertasRestriccion
    {
        public List<Validaciones> lst_datos_alerta_true { get; set; } = new List<Validaciones>();
        public List<Validaciones> lst_datos_alerta_false { get; set; } = new List<Validaciones>();
    }
}
