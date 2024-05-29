using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.TarjetaCredito.ObtenerOrdenReporte
{
    public class ReqGetReporteOrden : Header
    {
        public string str_numero_orden { get; set; }

    }
}
