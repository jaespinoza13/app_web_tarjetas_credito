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
       public List<FlujoSolicitudes>? flujo_solicitudes { get; set; } = null;
    }
    


    public class FlujoSolicitudes
    {
        public int int_estado_flujo { get; set; }
        public int int_estado { get; set; }
        public int int_flujo_id { get; set; }
        public int int_id { get; set; }
        public string str_estado_flujo { get; set; } = string.Empty;
        public string str_estado_actual { get; set; } = string.Empty;
        public string str_cupo_solicitado { get; set; } = string.Empty;
        public string str_cupo_sugerido_aval { get; set; } = string.Empty;
        public string str_cupo_sugerido_coopmego { get; set; } = string.Empty;
        public string str_cupo_aprobado { get; set; } = string.Empty;
        public int int_microcredito { get; set; }
        public string str_usuario_proc { get; set; } = string.Empty;
        public DateTime dtt_fecha_actualizacion { get; set; }
        public string str_decision_solicitud { get; set; } = string.Empty;
        public string str_comentario_proceso { get; set; } = string.Empty;
        public bool bl_microcredito { get; set; }
    }
}
