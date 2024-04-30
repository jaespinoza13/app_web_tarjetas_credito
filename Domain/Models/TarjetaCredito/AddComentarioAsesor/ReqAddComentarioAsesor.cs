using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.TarjetaCredito.AddComentarioAsesor
{
    public class ReqAddComentarioAsesor : Header
    {
        public int int_id_sol {  get; set; }
        public int int_id_est_sol { get; set; }
        public List<LstCmntAseCre>? lst_informe { get; set; }
    }

    public class LstCmntAseCre
    {
        public int int_id_parametro { get; set; }
        public string str_tipo { get; set; } = string.Empty;
        public string str_descripcion { get; set; } = string.Empty;
        public string str_detalle { get; set; } = string.Empty;
    }
}
