using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.TarjetaCredito.GetOrdenes
{
    public class ResGetOrdenes : ResComun {
        public List<OrdenesTC> lst_ordenes { get; set; } = new List<OrdenesTC>();
    }

    public class OrdenesTC
    {
        public int int_num_orden { get; set; }
        public string str_tipo_requerido { get; set; } = string.Empty;
        public string str_tipo_producto { get; set; } = string.Empty;
        public string str_estado { get; set; } = string.Empty;
        public string str_usuario_crea { get; set; } = string.Empty;
        public string str_usuario_recibe { get; set; } = string.Empty;
        public DateTime dtt_fecha_creacion { get; set; }
        public DateTime dtt_fecha_envia_oficina { get; set; }
        public DateTime dtt_fecha_recepcion { get; set; }
        public int int_cantidad { get; set; }
        public string str_oficina_solicita { get; set; } = string.Empty;
        public string str_oficina_destino { get; set; } = string.Empty;
        public string str_descripcion_recepta { get; set; } = string.Empty;
    }
}
