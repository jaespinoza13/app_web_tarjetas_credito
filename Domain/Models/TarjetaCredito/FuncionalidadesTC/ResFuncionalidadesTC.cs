using Domain.Common;
using System;
namespace Domain.Models.TarjetaCredito.FuncionalidadesTC
{
    public class ResFuncionalidadesTC: ResComun
    {
        //List<BotonesAccion> botones_accion_ver_solicitud { get; set; } = new();

        public Dictionary<string, string> lst_funcionalidades { get; set; } = new Dictionary<string, string>();

    
    }


}
