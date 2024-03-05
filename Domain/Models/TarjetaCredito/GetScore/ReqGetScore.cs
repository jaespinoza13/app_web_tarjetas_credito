using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.TarjetaCredito.GetScore
{
    public class ReqGetScore : Header
    {
        public string str_tipo_identificacion { get; set; } = string.Empty;
        public string str_identificacion { get; set; } = string.Empty;
        public string str_nombres {  get; set; } = string.Empty;
        public string str_lugar {  get; set; } = string.Empty;
        public string str_oficial {  get; set; } = string.Empty;
        public string str_cargo {  get; set; } = string.Empty;
    }
}
