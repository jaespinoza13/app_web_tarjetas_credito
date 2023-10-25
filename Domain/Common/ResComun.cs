namespace Domain.Common {
    public class ResComun : Header {
        public int int_total_filas { get; set; }
        public string str_res_original_id_msj { get; set; } = String.Empty;
        public string str_res_original_id_servicio { get; set; } = String.Empty;
        public DateTime dt_res_fecha_msj_crea { get; set; } = DateTime.Now;
        public string str_res_estado_transaccion { get; set; } = String.Empty;
        public string str_res_codigo { get; set; } = String.Empty;
        public string str_res_id_servidor { get; set; } = String.Empty;
        public int int_res_id_servidor { get; set; }
        public string str_res_info_adicional { get; set; } = String.Empty;
    }
}
