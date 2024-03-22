using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.TarjetaCredito.GetValidaciones
{
    public class ResGetValidaciones : ResComun
    {
        public List<Validaciones>? lst_datos_alerta_true {  get; set; }
        public List<Validaciones>? lst_datos_alerta_false {  get; set; }
        public string str_nombres { get; set; } = String.Empty;
        public string str_apellido_paterno { get; set; } = String.Empty;
        public string str_apellido_materno { get; set; } = String.Empty;
        public string str_ente {  get; set; } = String.Empty;
        public string str_email { get; set; } = String.Empty;
        public string str_celular { get; set;} = String.Empty;
    }
}
