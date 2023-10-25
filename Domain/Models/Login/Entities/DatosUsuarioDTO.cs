namespace Domain.Models.Login.Entities {
    public class DatosUsuarioDTO {
        public int id_usuario { get; set; }
        public int id_persona { get; set; }
        public string nombre { get; set; }
        public string login { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        public int id_oficina { get; set; }
        public int nro_perfiles { get; set; }
        public int id_perfil { get; set; }
        public string nombre_perfil { get; set; }
    }
}
