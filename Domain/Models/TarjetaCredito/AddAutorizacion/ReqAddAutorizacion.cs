using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.TarjetaCredito.AddAutorizacion
{
    public class ReqAddAutorizacion : Header
    {
        public string str_tipo_identificacion {  get; set; } = String.Empty;
        public int int_registrar_autorizacion {  get; set; }
        public string str_tipo_autorizacion { get; set; } = String.Empty;
        public string str_identificacion { get; set; } = String.Empty;
        public string str_nombres {  get; set; } = String.Empty;
        public string str_apellido_paterno {  get; set; } = String.Empty;
        public string str_apellido_materno {  get; set; } = String.Empty;
        public Loadfile loadfile { get; set; }
    }

    public class Loadfile
    {
        public string file { get; set; }
    }
}
