using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.TarjetaCredito.GetResoluciones
{
    public class ResGetResolucion : ResComun
    {
        public List<Resolucion> lst_resoluciones { get; set; } = new List<Resolucion>();

        public class Resolucion
        {
            public int int_rss_id { get; set; }
            public decimal dec_cupo_solicitado { get; set; } = decimal.Zero;
            public decimal dec_cupo_sugerido { get; set; } = decimal.Zero;
            public string str_usuario_proc { get; set; } = string.Empty;
            public DateTime dtt_fecha_actualizacion { get; set; }
            public string str_decision_solicitud { get; set; } = string.Empty;
            public string str_comentario_proceso { get; set; } = string.Empty;
        }
    }
}
