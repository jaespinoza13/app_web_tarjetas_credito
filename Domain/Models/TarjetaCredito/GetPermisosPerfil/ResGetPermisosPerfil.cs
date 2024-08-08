using Domain.Common;
using Domain.Models.Config.Entities;

namespace Domain.Models.TarjetaCredito.GetPermisosPerfil
{
    public class ResGetPermisosPerfil : ResComun
    {
        public List<PermisosPerfil> lst_funcionalidades { get; set; } = new List<PermisosPerfil>();
    }
    public class PermisosPerfil
    {
        public int fun_id { get; set; }
        public string fun_nombre { get; set; } = string.Empty;
    }

}
