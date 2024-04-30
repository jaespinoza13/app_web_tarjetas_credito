using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.TarjetaCredito.GetComentarios
{
    public class ReqGetComentarios : Header
    {
        public int int_id_est_sol {  get; set; }
        public int int_id_sol {  get; set; }
    }
}
