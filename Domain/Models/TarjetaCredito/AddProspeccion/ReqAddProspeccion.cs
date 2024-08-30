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
        public string mny_cupo_solicitado {  get; set; } = String.Empty;
        public string str_id_autoriza_cons_buro { get; set; } = String.Empty;
        public string str_id_autoriza_datos_per { get; set; } = String.Empty;
        public string str_comentario { get; set; } = String.Empty;
        public string str_comentario_adicional { get; set; } = String.Empty;
        public string mny_total_ingresos { get; set; } = string.Empty;
        public string mny_total_egresos { get; set; } = string.Empty;
        public string mny_gastos_codeudor { get; set; } = string.Empty;
        public string mny_cupo_sug_coopmego { get; set; } = string.Empty;
        public string str_score { get; set; } = string.Empty;
        public string str_calificacion_buro { get; set; } = string.Empty;
        public string str_decision_buro { get; set; } = string.Empty;
        public string mny_gastos_financiero_titular { get; set; } = string.Empty;
        public string mny_resta_gastos_financiero { get; set; } = string.Empty;
        public decimal mny_cupo_sug_aval { get; set; }


    }
}
