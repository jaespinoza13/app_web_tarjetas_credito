using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.TarjetaCredito.AddSolicitud
{
    public class ReqAddSolicitud : Header
    {
        public int int_ente_aprobador { get; set; }
        public string str_tipo_documento { get; set; } = String.Empty;
        public string str_num_documento { get; set; } = String.Empty;
        public string str_nombres { get; set; } = String.Empty;
        public string str_primer_apellido { get; set; } = String.Empty;
        public string str_segundo_apellido { get; set; } = String.Empty;
        public string dtt_fecha_nacimiento { get; set; } = String.Empty;
        public string str_sexo { get; set; } = String.Empty;
        public int dec_cupo_solicitado { get; set; }
        public string str_ente { get; set; } = String.Empty;
        public int dec_cupo_sugerido { get; set; }
        public string str_correo { get; set; } = String.Empty;
        public string str_usuario_proc { get; set; } = String.Empty;
        public int int_oficina_proc { get; set; }
        public string str_denominacion_tarjeta { get; set; } = String.Empty;
        public string str_comentario_proceso { get; set; } = String.Empty;
        public string str_comentario_adicional { get; set; } = String.Empty;
    }
}
