namespace Domain.Models.Config.GetParametros {
    public class ReqGetParametros {
        public ReqGetParametros(int id_sistema, string prm_nombre) {
            this.id_sistema = id_sistema;
            this.prm_nombre = prm_nombre;
        }

        public int id_sistema { get; set; }
        public string prm_nombre { get; set; }
    }
}
