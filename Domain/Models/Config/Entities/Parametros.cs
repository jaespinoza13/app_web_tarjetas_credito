namespace Domain.Models.Config.Entities {
    public class Parametros {
        public Parametros(string lista, List<ParametroDTO> parametros) {
            this.lista = lista;
            this.parametros = parametros;
        }

        public string lista { get; set; }
        public List<ParametroDTO> parametros { get; set; }
    }
}
