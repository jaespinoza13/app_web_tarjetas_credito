using Domain.Common;
using Domain.Common.Interfaces;
using Domain.Models.Config.Entities;
using Domain.Models.Login.Entities;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using RestSharp;
using System.Net;
using System.Text;
using System.Text.Json;

namespace Infrastructure.MemoryCache;

public class ParametersInMemory : IParametersInMemory {
    public readonly AppSettings _settings;
    public readonly IMemoryCache _memoryCache;
    public static DateTime dt_fecha_codigos { get; set; }

    public ParametersInMemory( IOptionsMonitor<AppSettings> options, IMemoryCache memoryCache ) {
        this._settings = options.CurrentValue;
        this._memoryCache = memoryCache;
    }

    public List<Parametros> LoadParameters() {
        List<Parametros> res = new List<Parametros>();
        try {
            for(int i = 0; i < _settings.lst_ids_sistemas.Count; i++) {
                var options = new RestClientOptions(_settings.gw_logs + _settings.service_get_parametros + "/" + _settings.lst_ids_sistemas [i] + "/" + _settings.lst_nemonicos_parametros [i]) {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };
                var client = new RestClient(options);

                string auth_basic = Convert.ToBase64String(ASCIIEncoding.ASCII.GetBytes(_settings.auth_user_gw_logs + ":" + _settings.auth_pass_gw_logs));

                var request = new RestRequest()
                    .AddHeader("Authorization-Gateway", "Auth-Gateway " + auth_basic)
                    .AddHeader("Content-Type", "application/json");

                request.Method = Method.Get;
                var response = new RestResponse();
                response = client.Get(request);
                if(response.StatusCode == HttpStatusCode.OK) {
                    List<ParametroDTO> resGet = JsonSerializer.Deserialize<List<ParametroDTO>>(response.Content!)!;
                    if(resGet.Count > 0) {
                        if(res.Find(x => x.lista == "Parametros") != null) {
                            res.Find(x => x.lista == "Parametros")!.parametros.AddRange(resGet.FindAll(x => x.nombre != "CODIGOS_ERROR"));
                            _memoryCache.Set("Parametros", res.Find(x => x.lista == "Parametros")!.parametros);
                        } else {
                            res.Add(new Parametros("Parametros", resGet.FindAll(x => x.nombre != "CODIGOS_ERROR")));
                            _memoryCache.Set("Parametros", resGet.FindAll(x => x.nombre != "CODIGOS_ERROR"));
                        }
                        if(res.Find(x => x.lista == "CodigosError") != null) {
                            res.Find(x => x.lista == "CodigosError")!.parametros.AddRange(resGet.FindAll(x => x.nombre == "CODIGOS_ERROR"));
                            _memoryCache.Set("CodigosError", res.Find(x => x.lista == "CodigosError")!.parametros);
                        } else {
                            res.Add(new Parametros("CodigosError", resGet.FindAll(x => x.nombre == "CODIGOS_ERROR")));
                            _memoryCache.Set("CodigosError", resGet.FindAll(x => x.nombre == "CODIGOS_ERROR"));
                        }
                        dt_fecha_codigos = DateTime.Now.Date;
                    }
                }
            }
        } catch(Exception ex) {
            throw new ArgumentException("Sin parametros. ", ex.Message);
        }
        return res;
    }

    public void ValidaParametros() {
        if(DateTime.Compare(DateTime.Now, dt_fecha_codigos.AddDays(1)) > 0) {
            LoadParameters();
        }
    }

    public List<ParametroDTO> FindParametros( string str_tipo_parametro ) {
        var lst_parametros = _memoryCache.Get<List<ParametroDTO>>(str_tipo_parametro);
        if(lst_parametros is null || lst_parametros.Count == 0) {
            lst_parametros = LoadParameters().Find(x => x.lista == str_tipo_parametro)!.parametros;
        }
        return lst_parametros;
    }

    public ParametroDTO FindParametroNemonico( string str_nemonico ) {
        var lst_parametros = _memoryCache.Get<List<ParametroDTO>>("Parametros");
        if(lst_parametros is null || lst_parametros.Count == 0) {
            lst_parametros = LoadParameters().Find(x => x.lista == "Parametros")!.parametros;
        }
        return lst_parametros.Find(x => x.nemonico == str_nemonico)!;
    }

    public List<ParametroDTO> FindParametrosNombre( string str_nombre ) {
        var lst_parametros = _memoryCache.Get<List<ParametroDTO>>("Parametros");
        if(lst_parametros is null || lst_parametros.Count == 0) {
            lst_parametros = LoadParameters().Find(x => x.lista == "Parametros")!.parametros;
        }
        return lst_parametros.FindAll(x => x.nombre == str_nombre)!;
    }

    public ParametroDTO FindParametroValorFin( string str_valor_fin ) {
        var lst_parametros = _memoryCache.Get<List<ParametroDTO>>("Parametros");
        if(lst_parametros is null || lst_parametros.Count == 0) {
            lst_parametros = LoadParameters().Find(x => x.lista == "Parametros")!.parametros;
        }
        return lst_parametros.Find(x => x.valorFin == str_valor_fin)!;
    }

    public string getMensajeProceso( string str_codigo, int int_tipo ) {
        var lst_codigos = _memoryCache.Get<List<ParametroDTO>>("CodigosError");
        if(lst_codigos is null || lst_codigos.Count == 0) {
            lst_codigos = LoadParameters().Find(x => x.lista == "Parametros")!.parametros;
        }
        if(int_tipo == 1) {
            return lst_codigos.Find(x => x.valorIni == str_codigo)!.valorFin;
        } else {
            return lst_codigos.Find(x => x.valorIni == str_codigo)!.descripcion;
        }
    }

    public void AddSesion( int id_usuario, string login, string password, string ip ) {
        SesionDTO ses = GetSesion(login, ip);
        if(ses.id_usuario != -1) {
            RemoveSesion(ses.id_usuario, ip);
        }
        var lst_sesiones = _memoryCache.Get<List<SesionDTO>>("SESIONES");
        if(lst_sesiones is null || lst_sesiones.Count == 0) {
            lst_sesiones = new List<SesionDTO>();
        }
        int t_inactividad = Int32.Parse(FindParametroNemonico("TCDS").valorIni);
        t_inactividad = (t_inactividad <= 0) ? _settings.minutos_inactividad : t_inactividad;
        lst_sesiones.Add(new SesionDTO(id_usuario, login, password, ip, DateTime.Now.AddMinutes(t_inactividad)));
        _memoryCache.Set("SESIONES", lst_sesiones);
    }

    public SesionDTO GetSesion( string login, string ip ) {
        var lst_sesiones = _memoryCache.Get<List<SesionDTO>>("SESIONES");
        if(lst_sesiones is null || lst_sesiones.Count == 0) {
            return new SesionDTO(-1, "", "", "", DateTime.Now);
        }
        return lst_sesiones.Find(x => x.login == login && x.ip == ip) ?? new SesionDTO(-1, "", "", "", DateTime.Now);
    }

    public void RemoveSesion( int id_usuario, string ip ) {
        var lst_sesiones = _memoryCache.Get<List<SesionDTO>>("SESIONES");
        if(lst_sesiones != null && lst_sesiones.Count > 0) {
            SesionDTO? sesion = lst_sesiones.Find(x => x.id_usuario == id_usuario && x.ip == ip);
            if(sesion != null) {
                _memoryCache.Set("SESIONES", lst_sesiones.FindAll(x => x != sesion));
            }
        }
    }

    public void AddTimeSesion( int id_usuario, string ip ) {
        var lst_sesiones = _memoryCache.Get<List<SesionDTO>>("SESIONES");
        if(lst_sesiones != null && lst_sesiones.Count > 0) {
            SesionDTO? sesion = lst_sesiones.Find(x => x.id_usuario == id_usuario && x.ip == ip);
            if(sesion != null) {
                AddSesion(sesion.id_usuario, sesion.login, sesion.password, sesion.ip);
            }
        }
    }
}