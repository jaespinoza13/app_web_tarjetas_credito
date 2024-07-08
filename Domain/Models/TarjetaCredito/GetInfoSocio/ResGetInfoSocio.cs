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
        public List<Direccion>? lst_dir_domicilio { get; set; }
        public List<Direccion>? lst_dir_trabajo { get; set; }
    }

    public class DatosCliente
    {
        public string str_nombres { get; set; } = String.Empty;
        public string str_apellido_paterno { get; set; } = String.Empty;
        public string str_apellido_materno { get; set; } = String.Empty;
        public string str_fecha_nacimiento { get; set; } = String.Empty;
        public string str_nivel_educacion { get; set; } = String.Empty;
        public string str_codigo_profesion { get; set; } = String.Empty;
        public string str_actividad_economica { get; set; } = String.Empty;
        public string str_ocupacion { get; set; } = String.Empty;
        public string str_estado_civil { get; set; } = String.Empty;
        public string str_nacionalidad { get; set; } = String.Empty;
        public string str_sexo { get; set; } = String.Empty;
        public string str_tipo_persona { get; set; } = String.Empty;
        public string str_medio_informacion { get; set; } = String.Empty;
        public string str_calificacion_riesgo { get; set; } = String.Empty;
    }
    public class Direccion
    {
        public string str_dir_ciudad { get; set; } = String.Empty;
        public string str_dir_sector { get; set; } = String.Empty;
        public string str_dir_barrio { get; set; } = String.Empty;
        public string str_dir_descripcion_dom { get; set; } = String.Empty;
        public string str_dir_num_casa { get; set; } = String.Empty;
        public int int_dir_direccion { get; set; }
        public int int_codigo_postal { get; set; }
        public string str_dir_tipo {  get; set; } = String.Empty;
    }
}
