using Domain.Common;

namespace Domain.Models.TarjetaCredito.Axentria.CrearSeparadores
{
    public class ReqCrearSeparadores: Header
    {
        public List<string> lst_separadores_gen { get; set; } = new List<string>();
    }
}
