using Domain.Common;

namespace Domain.Models.TarjetaCredito.GetAlertasCliente
{
    public class ReqGetAlertasCliente: Header
    {
        public string str_identificacion { get; set; } = string.Empty;
        public string str_nemonico_alerta { get; set; } = string.Empty;
        public string dtt_fecha_nacimiento { get; set; }
    }
}
