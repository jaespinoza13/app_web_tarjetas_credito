namespace Domain.Models.Usuario.SetPassword {
    public class ReqSetPassword {
        public int id_usuario { get; set; }
        public int id_sistema { get; set; } = 0;
        public string login { get; set; }
        public string password { get; set; }
        public string terminal { get; set; }
        public string str_id_usuario {
            get {
                return id_usuario.ToString();
            }
            set {
                id_usuario = Int32.Parse(value);
            }
        }
        public string str_login {
            get {
                return login ?? "";
            }
            set {
                if(String.IsNullOrWhiteSpace(login)) {
                    login = value;
                }
            }
        }
        public string str_mac_dispositivo {
            get {
                return terminal ?? "";
            }
            set {
                terminal = value;
            }
        }
    }
}
