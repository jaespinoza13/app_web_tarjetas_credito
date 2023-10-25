namespace Domain.Models.Usuario.SetPassPrimeraVez {
    public class ReqSetPassPrimeraVez {
        public int id_usuario { get; set; } = 0;
        public int id_sistema { get; set; } = 0;
        public string login { get; set; }
        public string password { get; set; }
        public string terminal { get; set; }
        public string js_prg_rsp { get; set; } = String.Empty;
        public string [] preguntas { get; set; }
        public string [] respuestas { get; set; }
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
                return login.ToString();
            }
            set {
                if(String.IsNullOrWhiteSpace(login)) {
                    login = value;
                }
            }
        }
        public string str_mac_dispositivo {
            get {
                return terminal.ToString();
            }
            set {
                terminal = value;
            }
        }
    }
}
