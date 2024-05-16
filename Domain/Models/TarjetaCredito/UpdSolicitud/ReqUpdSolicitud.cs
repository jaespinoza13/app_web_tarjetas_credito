using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.TarjetaCredito.UpdSolicitud
{
    public class ReqUpdSolicitud : Header
    {
        public int int_id_solicitud { get; set; }
        public int int_id_flujo_sol { get; set; }
        public int int_estado { get; set; }

        public decimal dec_cupo_solicitado { get; set; }
    }
}
