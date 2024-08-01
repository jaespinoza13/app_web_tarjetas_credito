using Domain.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.TarjetaCredito.GetMedioAprobacion
{
    public class ReqGetMedAprob: Header
    {
        public int int_id_sol { get; set; }
        public string str_est_sol { get; set; } = string.Empty;
        public string str_num_documento { get; set; } = string.Empty;
    }
}
