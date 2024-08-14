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
        public List<Solicitudes>? solicitudes { get; set; }
        public List<Prospecto>? prospectos { get; set; }
    }

    public class Solicitudes
    {
        public int int_id { get; set; }
        public int int_ente { get; set; }
        public string str_identificacion { get; set; } = String.Empty;
        public string str_nombres { get; set; } = String.Empty;
        public string str_apellidos { get; set; } = String.Empty;
        public string str_tipo_tarjeta { get; set; } = String.Empty;
        public string str_calificacion { get; set; } = String.Empty;
        public string dec_cupo_solicitado { get; set; } = String.Empty;
        public string dtt_fecha_solicitud { get; set; } = String.Empty;
        public string str_usuario_crea { get; set; } = String.Empty;
        public string str_analista { get; set; } = String.Empty;
        public int int_oficina_crea { get; set; }
        public string str_estado { get; set; } = String.Empty;
        public int int_estado { get; set; }
        public string str_canal_crea { get; set; } = String.Empty;
    }

    public class Prospecto
    {
        public int pro_id { get; set; }
        public string pro_num_documento { get; set; } = String.Empty;
        public string pro_ente { get; set; } = String.Empty;
        public string pro_nombres { get; set; } = String.Empty;
        public string pro_apellidos { get; set; } = String.Empty;
        public string pro_email { get; set; } = String.Empty;
        public string pro_celular { get; set; } = String.Empty;
        public string pro_cupo_solicitado { get; set; } = String.Empty;
        public string pro_fecha_solicitud { get; set; } = String.Empty;
        public string pro_autoriza_cons_buro { get; set; } = String.Empty;
        public string pro_autoriza_datos_per { get; set; } = String.Empty;
        public string pro_usuario_crea { get; set; } = String.Empty;
        public int pro_oficina_crea { get; set; }
        public string pro_estado { get; set; } = String.Empty;
        public string pro_canal_crea { get; set; } = String.Empty;
    }
}
