using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.TarjetaCredito.AddComentarioSolicitud
{
    public class ReqAddComentarioSolicitud : Header
    {
        public bool bl_regresa_estado {  get; set; }
        public int int_estado { get; set; }
        public string str_comentario {  get; set; } = string.Empty;
        public int int_id_solicitud { get; set; }
        public string str_decision_sol {  get; set; } = string.Empty;

        //TODO DECIRLE A JHONNY Q ME PASE ESA VARIABLE AL HACER CONSULTA DE INGRESOS Y EGRESOS Y GUARDARLA EN SOLICITUD
        public bool bl_ingreso_fijo { get; set; }
    }
}
