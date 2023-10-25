using Domain.Common;
using Domain.Models.Config.Entities;

namespace Domain.Models.Config.GetFuncionalidades {
    public class ResGetFuncionalidades : RespuestaComun{
        public List<FuncionalidadDTO> fucionalidades { get; set;}
    }
}
