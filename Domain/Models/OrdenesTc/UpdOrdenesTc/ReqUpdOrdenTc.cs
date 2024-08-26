using Domain.Common;

namespace Domain.Models.OrdenesTc.UpdOrdenesTc
{
    public class ReqUpdOrdenTc: Header
    {
        public int int_estado { get; set; } = 0;
        public int[] int_ids_array { get; set; } = new int[0];
        public string str_ids_array { get; set; } = string.Empty;
    }
}
