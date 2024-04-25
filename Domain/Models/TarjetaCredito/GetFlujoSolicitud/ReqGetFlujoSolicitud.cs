using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.TarjetaCredito.GetFlujoSolicitud
{
    public class ReqGetFlujoSolicitud : Header
    {
        public int int_id_solicitud {  get; set; }
    }
}
