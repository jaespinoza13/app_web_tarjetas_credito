using Domain.Common;

namespace Domain.Models.Logs.GetSeguimiento {
    public class ResGetSeguimiento : ResComun {
        public List<object> lst_seguimiento { get; set; } = new List<object>();
    }
}
