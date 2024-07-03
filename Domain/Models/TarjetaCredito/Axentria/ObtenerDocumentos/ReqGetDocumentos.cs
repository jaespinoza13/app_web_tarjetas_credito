using Domain.Common;

namespace Domain.Models.TarjetaCredito.Axentria.ObtenerDocumentos
{
    public class ReqGetDocumentos: Header
    {
        public int id_solicitud { get; set; }
        public int int_id_doc { get; set; }
    }
}
