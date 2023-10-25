using Domain.Common;

namespace Domain.Models.Logs.GetSeguimiento.Internal {
    public class ResponseGetSeguimiento : RespuestaComun{
        public List<object> lst_seguimiento { get; set; } = new List<object>();
    }
}
