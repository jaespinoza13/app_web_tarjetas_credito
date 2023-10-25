using Domain.Common;

namespace Domain.Models.Logs.GetLogsTexto {
    public class ResGetLogsTexto : ResComun {
        public List<LogDTO> lst_logs { get; set; } = new List<LogDTO>();
    }
}
