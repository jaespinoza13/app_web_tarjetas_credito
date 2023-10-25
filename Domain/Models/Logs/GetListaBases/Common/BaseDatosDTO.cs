namespace Domain.Models.Logs.GetListaBases.Common {
    public class BaseDatosDTO {
        public string str_nombre { get; set; } = String.Empty;
        public string str_ip { get; set; } = String.Empty;
        public string str_host { get; set; } = String.Empty;
        public bool bln_isError { get; set; } = false;
        public DateTime dtt_fecha_registro { get; set; }
    }
}
