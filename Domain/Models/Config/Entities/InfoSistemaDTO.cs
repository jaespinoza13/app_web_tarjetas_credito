using System.Globalization;

namespace Domain.Models.Config.Entities {
    public class InfoSistemaDTO {
        public string version { get; set; }
        public string fecha_actualizacion { get; set; }
        public DateTime dtt_fecha_actualizacion { 
            get {
                try { 
                CultureInfo provider = CultureInfo.GetCultureInfo("es-ES");
                DateTime t = DateTime.ParseExact(this.fecha_actualizacion, "d/M/yyyy H:mm:ss", provider);
                return t;
                } catch (Exception e) {
                    Console.WriteLine(e);
                    return DateTime.Now;
                }
            } 
        }
    }
}
