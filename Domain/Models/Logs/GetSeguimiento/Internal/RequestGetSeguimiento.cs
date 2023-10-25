using Domain.Common;

namespace Domain.Models.Logs.GetSeguimiento.Internal {
    public class RequestGetSeguimiento : RequestComun {
        public string str_user { get; set; } = String.Empty;
        public string str_password { get; set; } = String.Empty;
        public string str_protcol { get; set; } = String.Empty;
        public string str_server { get; set; } = String.Empty;
        public string str_id_transacccion_search { get; set; } = String.Empty;
    }
}
