using Domain.Common;

namespace Domain.Models.Logs.GetLogsTexto {
    public class ReqGetLogsTexto : Header {
        public String str_web_service { get; set; } = String.Empty;
    }
}
