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
        public string str_ente { get; set; }
        public string str_token { get; set; } = string.Empty;
        public string str_comentario { get; set; } = String.Empty;
        public string str_tipo_documento { get; set; } = String.Empty;
        public string str_num_documento { get; set; } = String.Empty;
        public int int_ente { get; set; }
        public int int_tipo_tarjeta { get; set; }
        public string str_nombres { get; set; } = String.Empty;
        public string str_primer_apellido { get; set; } = String.Empty;
        public string str_segundo_apellido { get; set; } = String.Empty;
        public string dtt_fecha_nacimiento { get; set; } = String.Empty;
        public string str_sexo { get; set; } = String.Empty;
        public int dec_cupo_solicitado { get; set; }
        public int dec_cupo_aprobado { get; set; }
        public string str_celular { get; set; } = String.Empty;
        public string str_correo { get; set; } = String.Empty;
        public string str_usuario_proc { get; set; } = String.Empty;
        public int int_oficina_proc { get; set; }
        public int int_ente_aprobador { get; set; }
        public string str_codigo_producto { get; set; } = String.Empty;
        public int int_codigo_sucursal { get; set; }
        public int int_modelo_tratamiento { get; set; }
        public string str_codigo_afinidad { get; set; } = String.Empty;
        public int int_num_promotor { get; set; }
        public string str_habilitada_compra { get; set; } = String.Empty;
        public int dec_max_compra { get; set; }
        public string str_denominacion_tarjeta { get; set; } = String.Empty;
        public string str_marca_graba { get; set; } = String.Empty;
        public string str_calle_num_puerta { get; set; } = String.Empty;
        public string str_localidad { get; set; } = String.Empty;
        public string str_barrio { get; set; } = String.Empty;
        public string str_codigo_provincia { get; set; } = String.Empty;
        public string str_codigo_postal { get; set; } = String.Empty;
        public string str_zona_geografica { get; set; } = String.Empty;
        public string str_grupo_liquidacion { get; set; } = String.Empty;
        public int dec_imp_lim_compras { get; set; }
        public string str_telefono_2 { get; set; } = String.Empty;
        public string str_datos_adicionales { get; set; } = String.Empty;
        public string str_codigo_ocupacion { get; set; } = String.Empty;
        public string str_duracion { get; set; } = String.Empty;
        public string str_marca_emision { get; set; } = String.Empty;
        public string str_rfc { get; set; } = String.Empty;
        public string str_marca_tpp { get; set; } = String.Empty;
        public string str_rsrv_uso_credencial_1 { get; set; } = String.Empty;
        public string str_rsrv_uso_credencial_2 { get; set; } = String.Empty;
        public string str_cuarta_linea { get; set; } = String.Empty;
        public string str_comentario_proceso { get; set; } = String.Empty; 
        public long int_numero_cuenta { get; set; }
    }
}
