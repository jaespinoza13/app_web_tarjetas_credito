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
        public List<string>? lst_validaciones {  get; set; }
        public object? cuerpo { get; set; }
    }
}
