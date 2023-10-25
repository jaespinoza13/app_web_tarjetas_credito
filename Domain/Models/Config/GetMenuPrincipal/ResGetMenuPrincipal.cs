using Domain.Common;
using Domain.Models.Config.Entities;

namespace Domain.Models.Config.GetMenuPrincipal {
    public class ResGetMenuPrincipal : RespuestaComun{
        public List<MenuPrincipalDTO> menus { get; set; }
    }
}
