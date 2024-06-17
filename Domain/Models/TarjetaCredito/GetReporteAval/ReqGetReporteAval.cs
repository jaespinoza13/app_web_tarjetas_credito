using Domain.Common;

namespace Domain.Models.TarjetaCredito.GetReporteAval
{
    public class ReqGetReporteAval: Header
    {
        public int int_cliente { set; get; }
        public int int_id_con { set; get; } = -1;

    }
}
