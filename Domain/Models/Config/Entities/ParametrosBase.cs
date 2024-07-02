
namespace Domain.Models.Config.Entities
{
    public class ParametrosBase
    {
        public int int_id_parametro { get; set; }
        public string str_nombre { get; set; } = string.Empty;
        public string str_nemonico { get; set; } = string.Empty;
        public string str_descripcion { get; set; } = string.Empty;
        public string str_valor_ini { get; set; } = string.Empty;
        public string str_valor_fin { get; set; } = string.Empty;
        public string str_error { get; set; } = string.Empty;
    }
}
