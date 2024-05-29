using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.TarjetaCredito.GetTarjetasCredito
{
    public class ReqGetTarjetasCredito: Header
    {
        public string str_nem_prod { get; set; } = string.Empty;
        public string str_tipo_prod { get; set; } = string.Empty;
        public string str_estado_tc { get; set; } = string.Empty;
    }
}
