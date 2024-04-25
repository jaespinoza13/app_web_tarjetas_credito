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
        public string str_nem_par_inf {  get; set; } = String.Empty;
        public int int_id_sol {  get; set; }
    }
}
