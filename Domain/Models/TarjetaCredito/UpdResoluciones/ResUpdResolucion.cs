using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.TarjetaCredito.UpdResoluciones
{
    public class ResUpdResolucion : ResComun
    {
        public int int_id_sol { get; set; }
        public decimal dec_cupo_solicitado { get; set; }
        public decimal dec_cupo_sugerido { get; set; }
        public string str_decision_solicitud { get; set; } = string.Empty;
        public string str_comentario_proceso { get; set; } = string.Empty;
        public int int_rss_id { get; set; }
        
    }
}
