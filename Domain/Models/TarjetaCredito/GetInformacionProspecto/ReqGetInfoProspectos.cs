using Domain.Common;

namespace Domain.Models.TarjetaCredito.GetInformacionProspecto
{
    public class ReqGetInfoProspectos: Header
    {
        public string str_num_documento { get; set; } = string.Empty;
        public int int_id_prospecto { get; set; }

    }
}
