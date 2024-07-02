using Domain.Common;
using Domain.Models.Config.Entities;

namespace Domain.Models.TarjetaCredito.GetMotivos
{
    public class ResGetMotivos: ResComun
    {
        public List<ParametrosBase> lst_motivos { get; set; } = new List<ParametrosBase> { };
    }
}
