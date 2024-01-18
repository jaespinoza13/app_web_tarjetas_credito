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
        public string str_documento {  get; set; }
    }
}
