using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.TarjetaCredito.GetParamatrosSistema
{
    public class ReqGetParametrosSistema : Header
    {
        public int int_id_sis { get; set; }
    }
}
