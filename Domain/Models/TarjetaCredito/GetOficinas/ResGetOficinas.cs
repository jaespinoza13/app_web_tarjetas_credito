using Domain.Common;
using System;

namespace Domain.Models.TarjetaCredito.GetOficinas
{
    public class ResGetOficinas: ResComun
    {
        public List<Oficinas> lst_oficinas { get; set; } = new List<Oficinas> { };
        public class Oficinas
        {
            public int id_oficina { get; set; }
            public string agencia { get; set; } = string.Empty;
        }
    }
}
