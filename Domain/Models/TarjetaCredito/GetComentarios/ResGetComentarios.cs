using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.TarjetaCredito.GetComentarios
{
    public class ResGetComentarios : ResComun
    {
        public List<ComentarioAsesor>? lst_comn_ase_cre {  get; set; }
    }

    public class ComentarioAsesor
    {
        public int int_id_parametro { get; set; }
        public string str_tipo { get; set; } = String.Empty;
        public string str_descripcion { get; set; } = String.Empty;
        public string str_detalle { get; set; } = String.Empty;
    }
}
