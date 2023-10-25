using Domain.Common;

namespace Domain.Models.Logs.GetListaBases.Internal {
    public class RequestGetListaBases : RequestComun {
        public string str_user { get; set; }
        public string str_password { get; set; }
        public string str_server { get; set; }
        public string str_protcol { get; set; }
    }
}
