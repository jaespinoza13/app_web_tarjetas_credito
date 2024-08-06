using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.TarjetaCredito.GetParamatrosSistema
{
    public class ResGetParametrosSistema : ResComun
    {
        public List<ParametroSistema>? lst_parametros { get; set; }
    }

    public class ParametroSistema
    {
        public int int_id_parametro { get; set; }
        public string str_nombre { get; set; } = string.Empty;
        public string str_nemonico { get; set; } = string.Empty;
        public string str_descripcion { get; set; } = string.Empty;
        public string str_valor_ini { get; set; } = string.Empty;
        public string str_valor_fin { get; set; } = string.Empty;
        public string str_error { get; set; } = string.Empty;
        public bool bl_vigencia { get; set; }
    }
}
