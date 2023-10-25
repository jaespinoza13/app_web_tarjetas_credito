using Domain.Common;
using Domain.Models.Config.Entities;

namespace Domain.Models.Config.GetParametros {
    public class ResGetParametros : ResComun{
        public List<ParametroDTO> lstParametros { get; set; }
    }
}
