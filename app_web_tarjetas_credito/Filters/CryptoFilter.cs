using plantilla_app_web.Controllers.Common;
using Domain.Common;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Options;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace plantilla_app_web.Filters {
    public class CryptoFilter : IAuthorizationFilter {
        private readonly AppSettings _settings;

        public CryptoFilter( IOptionsMonitor<AppSettings> options ) {
            this._settings = options.CurrentValue;
        }

        private bool isUserCookieCorrect( AuthorizationFilterContext context, string idUsuario, string idPerfil )   {
            string str_timestamp = context.HttpContext.Request.Headers ["aceptar"]!;
            string str_timestamp_inicial = context.HttpContext.Request.Headers ["receiver"]!;
            string str_ip_cliente = context.HttpContext.Request.Headers ["remitente"]!;
            string str_login = context.HttpContext.Request.Headers ["sender"]!;
            bool sessionON = false;
            bool dataUserIsCorrect = false;
            bool exProcess = false;
            bool.TryParse(context.HttpContext.Request.Headers ["Proceso"]!.ToString(), out exProcess);
            if(exProcess) {
                sessionON = true;
                dataUserIsCorrect = true;
            } else {
                string ivStr = Utiles.GetSecure16Bits(Base32Crypt.Encode(Encoding.UTF8.GetBytes(JsonSerializer.Serialize(new { ts = str_timestamp_inicial, clt = Base32Crypt.Decode(str_ip_cliente) }))));
                var iv = Encoding.UTF8.GetBytes(ivStr);
                var dto = new {
                    usr = Utiles.getIP(),
                    ts = long.Parse(str_timestamp_inicial),
                    lgn = Encoding.UTF8.GetString(Base32Crypt.Decode(str_login)),
                    nav = context.HttpContext.Request.Headers.UserAgent [0],
                };
                byte [] byt32 = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(dto));
                string key = Utiles.GetSecure16Bits(Base32Crypt.Encode(byt32));
                foreach(var cook in context.HttpContext.Request.Headers.Cookie) {
                    string cookieSession = cook!;
                    if(cookieSession != null && cookieSession.Contains("SESSION_STORAGE=")) {
                        cookieSession = cookieSession.Trim().Split("SESSION_STORAGE=") [1];
                        cookieSession = cookieSession.Trim().Replace("%22", "\"").Replace("%2C", ",");
                        var resultCookie = JsonSerializer.Deserialize<Dictionary<string, object>>(cookieSession);
                        if(resultCookie != null) {
                            foreach(var keyD in resultCookie.Keys) {
                                if(keyD == "user") {
                                    var cookieUser = JsonSerializer.Deserialize<Dictionary<string, string>>(resultCookie [keyD].ToString() ?? "{\"data\": \"\"}");
                                    if(cookieUser != null) {
                                        string dataUser = cookieUser ["data"];
                                        if(dataUser != null) {
                                            dataUser = dataUser.Trim();
                                            var dataUserByt = Convert.FromBase64String(dataUser);
                                            string str_data = Utiles.DecryptStringFromBytes(dataUserByt, Encoding.UTF8.GetBytes(key), iv);
                                            var userData = JsonSerializer.Deserialize<Dictionary<string, object>>(str_data);
                                            string comparar = idUsuario + idPerfil + str_timestamp_inicial.Substring(0, str_timestamp_inicial.Length - 4);
                                            string headerTokenUsr = context.HttpContext.Request.Headers ["Habilitar"]!;
                                            string JwtHabilitar = headerTokenUsr.Split('.') [0] + "." + headerTokenUsr.Split('.') [1];

                                            string keyToken = Base32Crypt.EncodeString(JsonSerializer.Serialize(new { ts = long.Parse(str_timestamp), sender = Encoding.UTF8.GetString(Base32Crypt.Decode(str_login)) }));
                                            var keyByte = Encoding.UTF8.GetBytes(keyToken);
                                            using(var hmacsha256 = new HMACSHA256(keyByte)) {
                                                hmacsha256.ComputeHash(Encoding.UTF8.GetBytes(JwtHabilitar));
                                                string hashGen = ByteToString(hmacsha256.Hash!);
                                                string hashJwt = Encoding.UTF8.GetString(Convert.FromBase64String(headerTokenUsr.Split('.') [2])).ToUpper();
                                                string payloadJwt = Encoding.UTF8.GetString(Convert.FromBase64String(headerTokenUsr.Split('.') [1]));
                                                var dataJwt = JsonSerializer.Deserialize<Dictionary<string, string>>(payloadJwt);
                                                if(userData != null && userData ["str_sesion"].ToString()!.StartsWith(comparar) && hashGen == hashJwt && dataJwt != null && dataJwt ["iss"] == "CoopMego" && dataJwt ["aud"] == context.HttpContext.Request.Host.Value && dataJwt ["jti"] == userData ["str_sesion"].ToString()) {
                                                    dataUserIsCorrect = true;
                                                } else {
                                                    if(userData != null) {
                                                        Console.WriteLine(userData ["str_sesion"].ToString() + " = " + comparar + " / " + hashGen + " = " + hashJwt + " / " + payloadJwt + " / Host: " + context.HttpContext.Request.Host.Value);
                                                    } else {
                                                        Console.WriteLine("no userData");
                                                    }
                                                }
                                            }

                                        } else {
                                            Console.WriteLine("no dataUser");
                                        }
                                    } else {
                                        Console.WriteLine("no cookieUser");
                                    }
                                } else {
                                    sessionON = Convert.ToBoolean(resultCookie [keyD].ToString());
                                }
                            }
                        } else {
                            Console.WriteLine("no resultCookie");
                        }
                    }
                }


            }
            return sessionON && dataUserIsCorrect;
        }

        private string ByteToString( byte [] buff ) {
            string sbinary = "";
            for(int i = 0; i < buff.Length; i++)
                sbinary += buff [i].ToString("X2"); /* hex format */
            return sbinary;
        }

        public void OnAuthorization( AuthorizationFilterContext context ) {
            try {
                string str_timestamp = context.HttpContext.Request.Headers ["aceptar"]!;
                string str_ip_cliente = context.HttpContext.Request.Headers ["remitente"]!;
                string str_login = context.HttpContext.Request.Headers ["sender"]!;

                context.HttpContext.Request.EnableBuffering();
                var streaming = new StreamReader(context.HttpContext.Request.Body);
                string str_data = streaming.ReadToEndAsync().Result;
                context.HttpContext.Request.Body.Position = 0;

                var dyn_request = JsonSerializer.Deserialize<Dictionary<string, object>>(str_data)!;
                string ivStr = Utiles.GetSecure16Bits(Base32Crypt.Encode(Encoding.UTF8.GetBytes(JsonSerializer.Serialize(new { ts = str_timestamp, clt = Base32Crypt.Decode(str_ip_cliente) }))));
                var iv = Encoding.UTF8.GetBytes(ivStr);
                var dto = new {
                    usr = Utiles.getIP(),
                    ts = long.Parse(str_timestamp),
                    lgn = Encoding.UTF8.GetString(Base32Crypt.Decode(str_login)),
                    nav = context.HttpContext.Request.Headers.UserAgent [0],
                };

                byte [] byt32 = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(dto));
                string key = Utiles.GetSecure16Bits(Base32Crypt.Encode(byt32));
                context.HttpContext.Request.Headers ["secret"] = key;

                string ciphertext = dyn_request ["data"].ToString()!;
                var encrypted = Convert.FromBase64String(ciphertext);
                str_data = Utiles.DecryptStringFromBytes(encrypted, Encoding.UTF8.GetBytes(key), iv);
                Header headerData = JsonSerializer.Deserialize<Header>(str_data)!;

                if(isUserCookieCorrect(context, headerData.str_id_usuario, headerData.str_id_perfil)) {
                    context.HttpContext.Request.Body = new MemoryStream(Encoding.UTF8.GetBytes(str_data));
                } else {
                    Console.WriteLine("Cookie invalida " + str_login + " " + str_ip_cliente + " " + str_timestamp + " " + headerData.str_id_usuario + " " + headerData.str_id_perfil);
                    context.HttpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
                }
            } catch(Exception ex) {
                Console.WriteLine(ex);
                context.HttpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
            }
            return;
        }
    }
}
