using Domain.Models.Config.Entities;

namespace Domain.Models.Config.GetInfoSistema {
    public class ResGetInfoSistema {
        public InfoSistemaDTO datos { get; set; }
        public List<String> mejoras { get; set; }
    }
}
