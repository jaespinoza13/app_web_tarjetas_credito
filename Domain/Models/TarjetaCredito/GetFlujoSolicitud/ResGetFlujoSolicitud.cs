using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.TarjetaCredito.GetFlujoSolicitud
{
    public class ResGetFlujoSolicitud : ResComun
    {
        public List<FlujoSolicitude>? flujo_solicitudes { get; set; }
    }

    public class FlujoSolicitude
    {
        public int int_estado { get; set; }
        public string str_estado { get; set; } = String.Empty;
        public decimal dec_cupo_solicitado { get; set; } 
        public decimal dec_cupo_sugerido { get; set; } 
        public string str_usuario_proc { get; set; } = String.Empty;
        public string str_fecha_actualizacion { get; set; } = String.Empty;
        public string str_decision_solicitud { get; set; } = String.Empty;
        public string str_comentario_proceso { get; set; } = String.Empty;
    }
}
