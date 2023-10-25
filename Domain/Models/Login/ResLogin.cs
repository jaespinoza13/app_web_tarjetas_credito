using Domain.Common;
using Domain.Models.Login.Entities;
using Domain.Models.Usuario.Entities;

namespace Domain.Models.Login {
    public class ResLogin : ResComun {
        public object T { get; set; }
        public string codigo { get; set; }
        public string[] mensajes { get; set; }
        public DatosUsuarioDTO datosUsuario { get; set; } = new DatosUsuarioDTO();
        public List<PerfilDTO>? lst_perfiles { get; set; } = null;
    }
}
