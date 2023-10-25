using plantilla_app_web.Controllers.Common;
using Domain.Common;
using Domain.Common.Interfaces;
using Microsoft.Extensions.Options;
using System.Text;
using System.Text.Json;

namespace plantilla_app_web.Middleware {
    public static class AuthorizationExtensions {
        public static IApplicationBuilder UseAuthotizationMego( this IApplicationBuilder app ) {
            return app.UseMiddleware<Authorization>();
        }
    }

    public class Authorization {
        private readonly RequestDelegate _next;
        private readonly AppSettings _settings;
        private readonly IParametersInMemory _parameters;

        public Authorization( RequestDelegate next, IOptionsMonitor<AppSettings> settings, IParametersInMemory parameters ) {
            _next = next;
            _settings = settings.CurrentValue;
            this._parameters = parameters;
        }

        public async Task Invoke( HttpContext httpContext ) {
            try {
                string str_timestamp_inicial = httpContext.Request.Headers ["receiver"]!;
                string str_timestamp = httpContext.Request.Headers ["aceptar"]!;
                string str_login = httpContext.Request.Headers ["sender"]!;
                string str_ip_cliente = httpContext.Request.Headers ["remitente"]!;
                bool canRequest = false;

                if(httpContext.Request.Path.Value == "/favicon.ico" || httpContext.Request.Path.Value == "/manifest.json" || httpContext.Request.Path.Value == "/" || httpContext.Request.Path.Value == "/ManualLogs.pdf" || (httpContext.Request.Path.Value ?? "").StartsWith("/static/") || (httpContext.Request.Path.Value ?? "").StartsWith("/Imagenes/")) {
                    await _next(httpContext);
                    return;
                }

                if(httpContext.Request.Path.Value == "/config") {
                    canRequest = true;
                    str_login = String.IsNullOrWhiteSpace(str_login) || str_login == "null" ? Base32Crypt.EncodeString("Param") : str_login;
                    str_ip_cliente = String.IsNullOrWhiteSpace(str_ip_cliente) ? Base32Crypt.EncodeString(Utiles.getIP()) : str_ip_cliente;
                }
                if(httpContext.Request.Path.Value == "/login") {
                    str_login = Base32Crypt.EncodeString("Param");
                }

                byte [] str_login_decode;
                byte [] str_ip_decode;
                try {
                    str_login_decode = Base32Crypt.Decode(str_login);
                    str_ip_decode = Base32Crypt.Decode(str_ip_cliente);
                } catch(Exception ex) {
                    Console.Error.WriteLine(ex.Message);
                    Console.WriteLine(httpContext.Request.Path.Value);
                    str_login_decode = new byte [0];
                    str_ip_decode = new byte [0];
                    httpContext.Response.Redirect("/");
                    return;
                }

                bool exProcess = false;
                bool.TryParse(httpContext.Request.Headers ["Proceso"]!.ToString(), out exProcess);
                string key = Utiles.generateSecret((exProcess ? "Param" : Encoding.UTF8.GetString(str_login_decode)), Encoding.UTF8.GetString(str_ip_decode));
                string data = Base32Crypt.EncodeString((exProcess ? Base32Crypt.EncodeString("Param") : str_login) + Base32Crypt.EncodeString(Utiles.getIP()));
                if(httpContext.Request.Path.Value != "/config") {
                    string headerHabilitador = httpContext.Request.Headers ["Enabling-Data"]!;
                    canRequest = Utiles.ValidateToken(headerHabilitador, key, httpContext.Request.Host.Value, data);
                    if(httpContext.Request.Path.Value != "/login") {
                        string headerTokenUsr = httpContext.Request.Headers ["Habilitar"]!;
                        canRequest = !String.IsNullOrWhiteSpace(headerTokenUsr) && canRequest;
                        var sesion = _parameters.GetSesion(Encoding.UTF8.GetString(str_login_decode), Utiles.getIP());
                        if(!exProcess) {
                            if(sesion.id_usuario != -1 && sesion.finaliza > DateTime.Now) {
                                _parameters.AddTimeSesion(sesion.id_usuario, sesion.ip);
                            } else {
                                if(sesion.id_usuario != -1) {
                                    _parameters.RemoveSesion(sesion.id_usuario, sesion.ip);
                                }
                                canRequest = false;
                            }
                        }
                    }
                }
                if(httpContext.Request.Path.Value == "/login") {
                    str_login = httpContext.Request.Headers ["sender"]!;
                    key = Utiles.generateSecret(Encoding.UTF8.GetString(Base32Crypt.Decode(str_login)), Encoding.UTF8.GetString(Base32Crypt.Decode(str_ip_cliente)));
                    data = Base32Crypt.EncodeString(str_login + Base32Crypt.EncodeString(Utiles.getIP()));
                }
                if(canRequest) {
                    if(httpContext.Response.StatusCode == StatusCodes.Status200OK || httpContext.Response.StatusCode == 220) {
                        int ran = 2;
                        if(httpContext.Request.Path.Value == "/config") {
                            str_timestamp = DateTime.Now.ToFileTimeUtc().ToString();
                            var seed = Environment.TickCount;
                            var random = new Random(seed);
                            ran = random.Next(2, 6);
                            httpContext.Request.Headers ["validity"] = ran.ToString() + str_timestamp;
                        } else if(String.IsNullOrWhiteSpace(str_timestamp)) {
                            ran = Convert.ToInt32(str_timestamp.Substring(0, 1));
                        }
                        string token = Utiles.GenerateToken(str_login, "0", httpContext.Request.Host.Value, data, key, _parameters, _settings, ran);
                        httpContext.Response.Headers ["Grand-Tok"] = token;
                    }
                    string authHeader = httpContext.Request.Headers ["Authorization-Mego"]!;
                    if(authHeader != null && authHeader.StartsWith("Auth-middleware")) {
                        string encodeAuthorization = authHeader.Substring("Auth-middleware ".Length).Trim();
                        if(encodeAuthorization.Equals(_settings.auth_basic)) {
                            await _next(httpContext);
                        } else {
                            Console.WriteLine("No autorizado en 1 " + httpContext.Request.Path.Value);
                            await ResException(httpContext, "No autorizado", Convert.ToInt32(System.Net.HttpStatusCode.Unauthorized), System.Net.HttpStatusCode.Unauthorized.ToString());
                        }
                    } else {
                        if(httpContext.Request.Host.ToString() == _settings.dominio) {
                            await _next(httpContext);
                        } else {
                            Console.WriteLine("No autorizado en 2 " + httpContext.Request.Path.Value + " - " + httpContext.Request.Host.ToString() + " == " + _settings.dominio);
                            await ResException(httpContext, "No autorizado", Convert.ToInt32(System.Net.HttpStatusCode.Unauthorized), System.Net.HttpStatusCode.Unauthorized.ToString());
                        }
                    }
                } else {
                    Console.WriteLine("No autorizado en 3 " + httpContext.Request.Path.Value);
                    await ResException(httpContext, "No autorizado", Convert.ToInt32(System.Net.HttpStatusCode.Unauthorized), System.Net.HttpStatusCode.Unauthorized.ToString());
                }
            } catch(Exception ex) {
                Console.WriteLine("No autorizado en catch " + httpContext.Request.Path.Value);
                Console.Error.WriteLine(ex);
                await ResException(httpContext, "Error", Convert.ToInt32(System.Net.HttpStatusCode.InternalServerError), System.Net.HttpStatusCode.InternalServerError.ToString());
            }
        }

        internal async Task ResException( HttpContext httpContext, String infoAdicional, int statusCode, string str_res_id_servidor ) {
            RespuestaComun respuesta = new();

            httpContext.Response.ContentType = "application/json; charset=UTF-8";
            httpContext.Response.StatusCode = statusCode;

            respuesta.codigo = "001";
            respuesta.mensaje = str_res_id_servidor + " - " + infoAdicional;

            string str_respuesta = JsonSerializer.Serialize(respuesta);

            await httpContext.Response.WriteAsync(str_respuesta);
        }
    }
}
