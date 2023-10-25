using Domain.Models.Config.Entities;
using Domain.Models.Login.Entities;

namespace Domain.Common.Interfaces {
    public interface IParametersInMemory {
        void ValidaParametros();
        List<Parametros> LoadParameters();
        List<ParametroDTO> FindParametros(string str_tipo_parametro);
        ParametroDTO FindParametroNemonico(string str_nemonico);
        List<ParametroDTO> FindParametrosNombre(string str_nombre);
        ParametroDTO FindParametroValorFin(string str_valor_fin);
        string getMensajeProceso(string str_codigo, int int_tipo);
        void AddSesion( int id_usuario, string login, string password, string ip );
        SesionDTO GetSesion( string login, string ip );
        void RemoveSesion( int id_usuario, string ip );
        void AddTimeSesion( int id_usuario, string ip );
    }
}
