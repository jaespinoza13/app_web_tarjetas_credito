using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.TarjetaCredito.GetInfoSocio
{
    public class ReqGetInfoSocio : Header
    {
        public string str_identificacion { get; set; } = String.Empty;
    }
}
