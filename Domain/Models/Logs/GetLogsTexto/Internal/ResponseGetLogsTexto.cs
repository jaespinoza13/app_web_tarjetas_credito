using Domain.Common;

namespace Domain.Models.Logs.GetLogsTexto.Internal {
    public class ResponseGetLogsTexto : RespuestaComun{
        public List<LogDTO> lst_logs { get; set; } = new List<LogDTO>();
    }
}
