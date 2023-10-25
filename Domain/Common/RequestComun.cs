using System.ComponentModel.DataAnnotations;

namespace Domain.Common {
    public class RequestComun {
        [Required(ErrorMessage = "La Mac es Requerida")]
        public string str_mac_dispositivo { get; set; } = String.Empty;

        [Required(ErrorMessage = "El Login es Requerido")]
        public string str_login { get; set; } = String.Empty;

        [Required(ErrorMessage = "La Sesion es Requerida")]
        public string str_sesion { get; set; } = String.Empty;

        [Required(ErrorMessage = "El Usuario es Requerido")]
        public string str_id_usuario { get; set; } = String.Empty;

        [Required(ErrorMessage = "La Oficina es Requerida")]
        public string str_id_oficina { get; set; } = String.Empty;

        [Required(ErrorMessage = "El Perfil es Requerido")]
        public string str_id_perfil { get; set; } = String.Empty;
    }
}
