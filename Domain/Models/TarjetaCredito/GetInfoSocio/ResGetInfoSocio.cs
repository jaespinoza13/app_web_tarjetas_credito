using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.TarjetaCredito.GetInfoSocio
{
    public class ResGetInfoSocio : ResComun
    {
        public List<DatosCliente>? datos_cliente { get; set; }
    }

    public class DatosCliente
    {
        public string nombres { get; set; } = String.Empty;
        public string apellido_paterno { get; set; } = String.Empty;
        public string apellido_materno { get; set; } = String.Empty;
        public string fecha_nacimiento { get; set; } = String.Empty;
        public string nivel_educacion { get; set; } = String.Empty;
        public string codigo_profesion { get; set; } = String.Empty;
        public string actividad_economica { get; set; } = String.Empty;
        public string ocupacion { get; set; } = String.Empty;
        public string estado_civil { get; set; } = String.Empty;
        public string nacionalidad { get; set; } = String.Empty;
        public string sexo { get; set; } = String.Empty;
        public string sector { get; set; } = String.Empty;
        public string subsector { get; set; } = String.Empty;
        public string tipo_persona { get; set; } = String.Empty;
        public string medio_informacion { get; set; } = String.Empty;
        public string calificacion_riesgo { get; set; } = String.Empty;
    }
}
