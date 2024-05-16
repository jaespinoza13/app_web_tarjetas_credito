using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.TarjetaCredito.AddProcesoEspecifico
{
    public class ReqAddProcesoEspecifico : Header
    {
        public int int_id_solicitud { get; set; }
        public string str_comentario { get; set; } = string.Empty;
        public string str_estado { get; set; } = string.Empty;
        public decimal dcc_cupo_aprobado { get; set; }
    }
}
