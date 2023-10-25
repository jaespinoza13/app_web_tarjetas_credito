using Domain.Common;
using Domain.Models.Logs.GetListaBases.Common;

namespace Application.GetListaBases {
    public class ResGetListaBases : ResComun {
        public List<BaseDatosDTO> lst_bases { get; set; } = new List<BaseDatosDTO>();
    }
}
