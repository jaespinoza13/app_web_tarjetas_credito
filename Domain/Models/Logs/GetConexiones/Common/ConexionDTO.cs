namespace Domain.Models.Logs.GetConexiones.Common {
    public class ConexionDTO {
        public string str_id_con { get; set; } = String.Empty;
        public string str_usuario { get; set; } = String.Empty;
        public string str_clave { get; set; } = String.Empty;
        public string str_id_usuario { get; set; } = String.Empty;
        public string str_protocolo { get; set; } = String.Empty;
        public string str_servidor { get; set; } = String.Empty;
        public string str_nombre { get; set; } = String.Empty;
        public DateTime dtt_ceacion { get; set; }
        public DateTime dtt_ult_con { get; set; }
    }
}
