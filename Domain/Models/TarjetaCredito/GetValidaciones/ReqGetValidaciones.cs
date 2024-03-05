using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.TarjetaCredito.GetValidaciones
{
    public class ReqGetValidaciones : Header
    {
        public string str_identificacion { get; set; } = string.Empty;
        public string str_nemonico_alerta { get; set; } = string.Empty;
    }
}
