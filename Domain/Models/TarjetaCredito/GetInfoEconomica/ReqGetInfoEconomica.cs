using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.TarjetaCredito.GetInfoEconomica
{
    public class ReqGetInfoEconomica : Header
    {
        public string str_ente {  get; set; }
    }
}
