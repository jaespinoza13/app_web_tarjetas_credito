using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.TarjetaCredito.GetFlujoSolicitud
{
    public class ResGetFlujoSolicitud : ResComun
    {
        public List<FlujoSolicitude>? flujo_solicitudes { get; set; }
    }

    public class FlujoSolicitude
    {
        public int slw_estado { get; set; }
        public int slw_id { get; set; }
        public string str_estado { get; set; } = String.Empty;
        public string slw_cupo_solicitado { get; set; } = String.Empty;
        public string slw_cupo_sugerido { get; set; } = String.Empty;
        public string slw_cupo_aprobado { get; set; } = String.Empty;
        public string slw_fecha_solicitud { get; set; } = String.Empty;
        public string slw_fecha_actualizacion { get; set; } = String.Empty;
        public string slw_fecha_aprobacion { get; set; } = String.Empty;
        public string slw_fecha_rechazo { get; set; } = String.Empty;
        public string slw_usuario_proc { get; set; } = String.Empty;
        public int slw_oficina_proc { get; set; }
        public int slw_oficina_entrega { get; set; }
        public int slw_ente_aprobador { get; set; }
        public string slw_codigo_producto { get; set; } = String.Empty;
        public int slw_codigo_sucursal { get; set; }
        public int slw_modelo_tratamiento { get; set; }
        public string slw_codigo_afinidad { get; set; } = String.Empty;
        public int slw_num_promotor { get; set; }
        public string slw_habilitada_compra { get; set; } = String.Empty;
        public int slw_max_compra { get; set; }
        public string slw_denominacion_socio { get; set; } = String.Empty;
        public string slw_denominacion_tarjeta { get; set; } = String.Empty;
        public string slw_tipo_tarjeta { get; set; } = String.Empty;
        public string slw_tipo_registro { get; set; } = String.Empty;
        public string slw_tipo_cuenta_banc { get; set; } = String.Empty;
        public string slw_cod_lim_compra { get; set; } = String.Empty;
        public string slw_marca_graba { get; set; } = String.Empty;
        public string slw_calle_num_puerta { get; set; } = String.Empty;
        public string slw_barrio { get; set; } = String.Empty;
        public string slw_cod_prov { get; set; } = String.Empty;
        public string slw_cod_postal { get; set; } = String.Empty;
        public string slw_zona_geo { get; set; } = String.Empty;
        public string slw_comentario_proceso { get; set; } = String.Empty;
        public string slw_id_doc_aut_consulta_buro { get; set; } = String.Empty;
        public string slw_id_doc_tratamiento_datos_per { get; set; } = String.Empty;
        public string slw_id_doc_adicional { get; set; } = String.Empty;
    }
}
