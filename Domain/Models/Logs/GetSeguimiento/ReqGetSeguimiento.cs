using Domain.Common;

namespace Domain.Models.Logs.GetSeguimiento {
    public class ReqGetSeguimiento : Header { 
        public string str_url { get; set; } = String.Empty;
        public string str_id_transacccion_search { get; set; } = String.Empty;
    }
}
