using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.TarjetaCredito.GetSolicitudes
{
    public class ResGetSolicitudes : ResComun
    {
        List<Solicitud>? lst_solicitudes {  get; set; }
    }

    public class Solicitud
    {
        public int int_id { get; set; }
        public int int_ente { get; set; }
        public string str_tipo_tarjeta { get; set; } = String.Empty;
        public double dec_cupo_solicitado { get; set; }
        public DateTime dtt_fecha_solicitud { get; set; }
        public string str_usuario_crea { get; set; } = String.Empty;
        public int int_oficina_crea { get; set; }
        public string str_estado { get; set; } = String.Empty;
        public int int_estado { get; set; }
    }
}
