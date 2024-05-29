using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.TarjetaCredito.GetOrdenes
{
    public class ReqGetOrdenes : Header
    {
        public string str_orden_tipo { get; set; } = String.Empty;

    }
}
