namespace Domain.Models.Config.Entities {
    public class MenuPrincipalDTO {
        public int id { get; set; }
        public string nombre { get; set; }
        public string url { get; set; }
        public List<FunHijasDTO> funcionesHijas { get; set; } = new List<FunHijasDTO>();
        public string icon { get; set; } = String.Empty;
    }
}
