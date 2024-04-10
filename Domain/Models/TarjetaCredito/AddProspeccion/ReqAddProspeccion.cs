using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.TarjetaCredito.AddProspeccion
{
    public class ReqAddProspeccion : Header
    {
        public string str_num_documento {  get; set; } = String.Empty;
        public int int_ente {  get; set; }
        public string str_nombres { get; set; } = String.Empty;
        public string str_apellidos { get; set; } = String.Empty;
        public string str_celular { get; set; } = String.Empty;
        public string str_correo { get; set; } = String.Empty;
        public decimal dec_cupo_solicitado {  get; set; }
        public string str_id_autoriza_cons_buro { get; set; } = String.Empty;
        public string str_id_autoriza_datos_per { get; set; } = String.Empty;
        public string str_comentario { get; set; } = String.Empty;
        public string str_comentario_adicional { get; set; } = String.Empty;
    }
}
