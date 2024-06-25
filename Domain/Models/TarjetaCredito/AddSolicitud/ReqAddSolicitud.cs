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
        /*
        public int int_ente_aprobador { get; set; }
        public string str_tipo_documento { get; set; } = String.Empty;
        public string str_num_documento { get; set; } = String.Empty;
        public string str_nombres { get; set; } = String.Empty;
        public string str_primer_apellido { get; set; } = String.Empty;
        public string str_segundo_apellido { get; set; } = String.Empty;
        public string dtt_fecha_nacimiento { get; set; } = String.Empty;
        public string str_sexo { get; set; } = String.Empty;
        public string str_correo { get; set; } = String.Empty;
        public int int_oficina_proc { get; set; }
        public string str_denominacion_tarjeta { get; set; } = String.Empty;
        public string str_comentario_proceso { get; set; } = String.Empty;
        public string str_comentario_adicional { get; set; } = String.Empty;

        public int dec_cupo_solicitado { get; set; }
        public int dec_cupo_sugerido { get; set; }
        public string str_ente { get; set; } = String.Empty;
        public string str_usuario_proc { get; set; } = String.Empty;
        */



        public string str_tipo_documento { get; set; } = string.Empty;
        public string str_num_documento { get; set; } = string.Empty;
        public int int_ente { get; set; }
        public string str_nombres { get; set; } = string.Empty;
        public string str_primer_apellido { get; set; } = string.Empty;
        public string str_segundo_apellido { get; set; } = string.Empty;
        public DateTime dtt_fecha_nacimiento { get; set; }
        public string str_sexo { get; set; } = string.Empty;

        // tcr_solicitudes
        public string str_codigo_producto { get; set; } = string.Empty;
        public string mny_cupo_solicitado { get; set; }
        public string mny_cupo_sugerido_aval { get; set; }
        public string mny_cupo_sugerido_coopmego { get; set; }
        public int int_entidad_sucursal { get; set; }
        public string str_denominacion_socio { get; set; } = string.Empty;
        public string str_direccion { get; set; } = string.Empty;
        public string str_localidad { get; set; } = string.Empty;
        public string str_barrio { get; set; } = string.Empty;
        public string str_telefono { get; set; } = string.Empty;
        public string str_provincia { get; set; } = string.Empty;
        public string str_cod_postal { get; set; } = string.Empty;
        public string str_zona_geo { get; set; } = string.Empty;
        public string str_grupo_liquidacion { get; set; } = string.Empty;
        public int int_modelo_tratamiento { get; set; }
        public string str_cod_afinidad { get; set; } = string.Empty;
        public int int_num_promotor { get; set; } = 0;
        public string str_habilita_compra { get; set; } = string.Empty;
        public decimal mny_limite_compras { get; set; } = 0;
        public string str_telefono_2 { get; set; } = string.Empty;
        public string str_correo { get; set; } = string.Empty;
        public string str_denominacion_tarjeta { get; set; } = string.Empty;
        public string str_datos_adicionales { get; set; } = string.Empty;
        public string str_marca_graba_tarjeta { get; set; } = string.Empty;
        public string str_estado_civil { get; set; } = string.Empty;
        public string str_codigo_ocupacion { get; set; } = string.Empty;
        public string str_duracion_tarjeta { get; set; } = string.Empty;
        public string str_marca_pin { get; set; } = string.Empty;
        public string str_rfc { get; set; } = string.Empty;
        public string str_marca_tpp { get; set; } = string.Empty;
        public string str_cuarta_linea { get; set; } = string.Empty;
        public long int_cuenta_bancaria { get; set; } = 0;
        public string str_oficial_proc { get; set; } = string.Empty;
        public int int_oficina_proc { get; set; }
        public int int_oficina_entrega { get; set; } = 1;
        public string str_segmento { get; set; } = string.Empty;
        public string mny_total_ingresos { get; set; } = string.Empty;
        public string mny_total_egresos { get; set; } = string.Empty;
        public string mny_excedente { get; set; } = string.Empty;
        public int int_tasa { get; set; } = 0;
        public decimal mny_cuota_estimada { get; set; } = 0;
        public int int_estado_entregado { get; set; } = 0;

        public string str_comentario_proceso { get; set; } = string.Empty;
        public string str_comentario_adicional { get; set; } = string.Empty;

        //Se agrega campos json 
        public string str_act_soc_json { get; set; } = string.Empty;
        public string str_pas_soc_json { get; set; } = string.Empty;
        public string str_dpfs_json { get; set; } = string.Empty;
        public string str_cred_hist_json { get; set; } = string.Empty;
        public string str_ingr_soc_json { get; set; } = string.Empty;
        public string str_egr_soc_json { get; set; } = string.Empty;
        public string str_cred_vig_json { get; set; } = string.Empty;
        public string str_gar_cns_json { get; set; } = string.Empty;

        //TODO DECIRLE A JHONNY Q ME PASE ESA VARIABLE AL HACER CONSULTA DE INGRESOS Y EGRESOS Y GUARDARLA EN SOLICITUD
        public int bl_ingreso_fijo { get; set; }



    }
}
