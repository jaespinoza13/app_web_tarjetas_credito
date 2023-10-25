namespace Domain.Models.Usuario.SetPreguntas {
    public class ReqSetPreguntas {
        public int id_usuario { get; set; }
        public string str_id_usuario {
            get {
                return id_usuario.ToString();
            }
            set { 
                id_usuario = Int32.Parse(value);
            }
        }
        public string password { get; set; }
        public string js_prg_rsp { get; set; } = String.Empty;
        public string[] preguntas { get; set; }
        public string[] respuestas { get; set; }
    }
}
