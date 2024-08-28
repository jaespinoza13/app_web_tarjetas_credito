using Domain.Common;
using System;
namespace Domain.Models.TarjetaCredito.FuncionalidadesTC
{
    public class ResFuncionalidadesTC: ResComun
    {
        //public List<string> lst_funcSettings { get; set; } = new();
        //public Dictionary<string, FuncionalidadDTO> lst_funcSettings2 { get; set; }
        public List<FuncionalidadDTO> lst_funcSettings2 { get; set; }
        public List<FuncionalidadDTO> lst_func_seguimiento_settings{ get; set; }

        public class FuncionalidadDTO
        {
            public string keyTexto { get; set; } = string.Empty;
            public string funcionalidad { get; set; } = string.Empty;
        }

    }


}
