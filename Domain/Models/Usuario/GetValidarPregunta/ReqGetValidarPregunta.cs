namespace Domain.Models.Usuario.GetValidarPregunta {
    public class ReqGetValidarPregunta {
        public int id_usuario { get; set; }
        public int id_sistema { get; set; } = 0;
        public string login { get; set; }
        public string pregunta { get; set; }
        public string respuesta { get; set; }
        public string terminal { get; set; }
        public string str_mac_dispositivo {
            get {
                return terminal?? "";
            }
            set {
                terminal = value;
            }
        }
    }
}
