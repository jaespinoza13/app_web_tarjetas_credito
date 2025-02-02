﻿using Domain.Common;

namespace Domain.Models.TarjetaCredito.GetInformacionProspecto
{
    public class ResGetInfoProspectos: ResComun
    {
        public List<InfoProspecto> info_prospecto { get; set; } = new List<InfoProspecto> { };

        public class InfoProspecto
        {
            public int int_id { get; set; }
            public string str_num_identificacion { get; set; } = string.Empty;
            public string str_ente { get; set; } = string.Empty;
            public string str_nombre { get; set; } = string.Empty;
            public string str_apellidos { get; set; } = string.Empty;
            public string str_email { get; set; } = string.Empty;
            public string str_telefono { get; set; } = string.Empty;
            public decimal mny_cupo_solicitado { get; set; }
            public decimal mny_ingresos { get; set; }
            public decimal mny_egresos { get; set; }
            public decimal mny_resta_gastos_financieros { get; set; }
            public decimal mny_gastos_financieros { get; set; }
            public decimal mny_gastos_codeudor { get; set; }
            public decimal mny_cupo_sugerido_coopmego { get; set; }
            public decimal mny_cupo_sugerido_aval { get; set; }
            public string str_score_buro { get; set; } = string.Empty;
            public DateTime dtt_fecha_prospecto { get; set; }
            public string str_comentario_proceso { get; set; } = string.Empty;
            public string str_comentario_adicional { get; set; } = string.Empty;
            public string str_usuario_proc { get; set; } = string.Empty;
            public int int_oficina_proc { get; set; }
            public int int_canal_proc { get; set; }
            public string str_calificacion_buro { get; set; } = string.Empty;
            public string str_decision_buro { get; set; } = string.Empty;
        }
    }
}
