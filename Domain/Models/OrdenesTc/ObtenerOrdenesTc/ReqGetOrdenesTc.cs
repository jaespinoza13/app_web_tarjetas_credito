using Domain.Common;

namespace Domain.Models.OrdenesTc.ObtenerOrdenesTc
{
    public class ReqGetOrdenesTc: Header
    {
        public int int_estado_orden { get; set; }
    }
}
