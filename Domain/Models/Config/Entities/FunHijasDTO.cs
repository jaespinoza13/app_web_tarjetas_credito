namespace Domain.Models.Config.Entities {
    public class FunHijasDTO {
        public string fun_id { get; set; }
        public string fun_fk_padre { get; set; }
        public string fun_nombre { get; set; }
        public string fun_url { get; set; }
        public string icon { get; set; } = String.Empty;
    }
}
