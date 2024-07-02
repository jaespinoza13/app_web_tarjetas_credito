using Domain.Common;

namespace Domain.Models.TarjetaCredito.Axentria.ObtenerDocumentos
{
    public class ReqGetDocumentos: Header
    {
        //public int id_documento { get; set; }
        public int id_solicitud { get; set; }
        //public int id_flujo { get; set; }
    }
}
