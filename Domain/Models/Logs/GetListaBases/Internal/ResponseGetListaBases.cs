using Domain.Common;
using Domain.Models.Logs.GetListaBases.Common;

namespace Domain.Models.Logs.GetListaBases.Internal {
    public class ResponseGetListaBases : RespuestaComun {
        public List<BaseDatosDTO> lst_bds { get; set; } = new List<BaseDatosDTO>();
    }
}
