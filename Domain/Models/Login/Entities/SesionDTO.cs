namespace Domain.Models.Login.Entities {
    public class SesionDTO {
        public SesionDTO( int id_usuario, string login, string password, string ip, DateTime finaliza ) {
            this.id_usuario = id_usuario;
            this.login = login;
            this.password = password;
            this.ip = ip;
            this.finaliza = finaliza;
        }

        public int id_usuario { get; set; }
        public string login { get; set; }
        public string password { get; set; }
        public string ip { get; set; }
        public DateTime finaliza { get; set; }
    }
}
