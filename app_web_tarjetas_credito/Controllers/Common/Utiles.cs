using Domain.Common;
using System.Diagnostics;
using System.Net;
using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Domain.Common.Interfaces;

namespace plantilla_app_web.Controllers.Common {
    public class Utiles {

        public static string getIP() {
            try {
                string strHostName = Dns.GetHostName();
                IPHostEntry ipEntry = Dns.GetHostEntry(strHostName);
                IPAddress [] addr = ipEntry.AddressList;
                return addr [addr.Length - 1].ToString();
            } catch(Exception ex) {
                Debug.WriteLine(ex.Message);
                Console.WriteLine(ex.Message);
                return "0.0.0.0";
            }
        }

        public static IHeaderDictionary generateKey( IHeaderDictionary headers ) {
            string str_acp = headers ["aceptar"]!;
            string str_sen = headers ["sender"]!;
            var dto = new {
                usr = Utiles.getIP(),
                ts = long.Parse(str_acp),
                lgn = Encoding.UTF8.GetString(Base32Crypt.Decode(str_sen)),
                nav = headers.UserAgent [0],
            };
            byte [] byt32 = Encoding.ASCII.GetBytes(JsonSerializer.Serialize(dto));
            string key = Base32Crypt.Encode(byt32);
            headers ["secret"] = GetSecure16Bits(key);
            return headers;
        }

        public static string generateSecret( string v1, string v2 ) {
            string v1_cript = Base32Crypt.EncodeString(v1);
            string v2_cript = Base32Crypt.EncodeString(v2);
            string maximo = v2_cript.Length > v1_cript.Length ? v2_cript : v1_cript;
            string minimo = v2_cript.Length > v1_cript.Length ? v1_cript : v2_cript;
            double div = maximo.Length / minimo.Length;
            int espacios = int.Parse(Math.Floor(div).ToString());
            char [] max = maximo.Length.ToString().PadLeft(3, '0').ToCharArray();

            char [] lstMax = maximo.ToCharArray();
            char [] lstMin = minimo.ToCharArray();
            string [] lstFinal = new string [lstMax.Length + lstMin.Length + max.Length];

            int j = 0;
            int k = 0;
            int e = espacios;
            for(int i = 0; i < lstMax.Length + lstMin.Length; i++) {
                if(e == i && j < lstMin.Length) {
                    lstFinal [i] = lstMin [j].ToString();
                    j++;
                    i++;
                    e = i + espacios;
                }
                if(k < lstMax.Length) {
                    lstFinal [i] = lstMax [k].ToString();
                }
                k++;
            }
            lstFinal [lstFinal.Length - 1] = lstFinal [16];
            lstFinal [lstFinal.Length - 2] = lstFinal [18];
            lstFinal [lstFinal.Length - 3] = lstFinal [21];
            lstFinal [16] = max [0].ToString();
            lstFinal [18] = max [1].ToString();
            lstFinal [21] = max [2].ToString();
            return string.Join(String.Empty, lstFinal);
        }

        private static byte [] EncryptStringToBytes( string plainText, byte [] key, byte [] iv ) {
            // Check arguments.
            if(plainText == null || plainText.Length <= 0) {
                throw new ArgumentNullException("plainText");
            }
            if(key == null || key.Length <= 0) {
                throw new ArgumentNullException("key");
            }
            if(iv == null || iv.Length <= 0) {
                throw new ArgumentNullException("iv");
            }
            byte [] encrypted;
            // Create a Aes object
            // with the specified key and IV.
            using(Aes aes = Aes.Create()) {
                aes.Key = key;
                aes.IV = iv;
                aes.Mode = CipherMode.CBC;
                aes.Padding = PaddingMode.PKCS7;
                aes.FeedbackSize = 128;
                // Create a decrytor to perform the stream transform.
                var encryptor = aes.CreateEncryptor();

                // Create the streams used for encryption.
                using(var msEncrypt = new MemoryStream()) {
                    using(var csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write)) {
                        using(var swEncrypt = new StreamWriter(csEncrypt)) {
                            //Write all data to the stream.
                            swEncrypt.Write(plainText);
                        }
                        encrypted = msEncrypt.ToArray();
                    }
                }
            }
            // Return the encrypted bytes from the memory stream.
            return encrypted;
        }

        public static string DecryptStringFromBytes( byte [] cipherText, byte [] key, byte [] iv ) {
            // Check arguments.
            if(cipherText == null || cipherText.Length <= 0) {
                throw new ArgumentNullException("cipherText");
            }
            if(key == null || key.Length <= 0) {
                throw new ArgumentNullException("key");
            }
            if(iv == null || iv.Length <= 0) {
                throw new ArgumentNullException("iv");
            }
            // Declare the string used to hold
            // the decrypted text.
            string plaintext = "";
            // Create an Aes object
            // with the specified key and IV.
            using(Aes aes = Aes.Create()) {
                aes.Key = key;
                aes.IV = iv;
                aes.Mode = CipherMode.CBC;
                aes.Padding = PaddingMode.PKCS7;
                aes.FeedbackSize = 128;
                var decryptor1 = aes.CreateDecryptor();
                try {
                    using(var msDecrypt = new MemoryStream(cipherText)) {
                        using(var csDecrypt = new CryptoStream(msDecrypt, decryptor1, CryptoStreamMode.Read)) {
                            using(var srDecrypt = new StreamReader(csDecrypt)) {
                                // Read the decrypted bytes from the decrypting stream
                                // and place them in a string.
                                plaintext = srDecrypt.ReadToEnd();
                            }
                        }
                    }
                } catch {
                    plaintext = "keyError";
                }
            }
            var s = plaintext;
            if(plaintext.Length > 16) {
                s = plaintext.Substring(16);
            }
            return s;
        }

        public static ResCrypt crypt( Object resComun, IHeaderDictionary headers ) {
            string str_identificador = headers ["aceptar"]!;
            string str_secreto = headers ["remitente"]!;
            string ivStr = GetSecure16Bits(Base32Crypt.Encode(Encoding.UTF8.GetBytes(JsonSerializer.Serialize(new { ts = str_identificador, clt = Base32Crypt.Decode(str_secreto) }))));
            var iv = Encoding.UTF8.GetBytes(ivStr);
            ResCrypt res = new ResCrypt();
            res.data = Convert.ToBase64String(EncryptStringToBytes(Encoding.UTF8.GetString(iv) + JsonSerializer.Serialize(resComun), Encoding.UTF8.GetBytes(headers ["secret"]!), iv));
            return res;
        }

        public static ResCrypt crypt( Object resComun, string v1, string v2 ) {
            if(v2.Length > v1.Length) {
                string aux = v2;
                v2 = v1;
                v1 = aux;
            }
            var iv = Encoding.UTF8.GetBytes(GetSecure16Bits(Base32Crypt.Encode(Encoding.UTF8.GetBytes(JsonSerializer.Serialize(new { ts = v1, clt = v2 })))));
            ResCrypt res = new ResCrypt();
            string key = GetSecure16Bits(Base32Crypt.EncodeString(JsonSerializer.Serialize(new { v1 = v1, v2 = v2 })));
            res.data = Convert.ToBase64String(EncryptStringToBytes(Encoding.UTF8.GetString(iv) + JsonSerializer.Serialize(resComun), Encoding.UTF8.GetBytes(key), iv));
            return res;
        }

        public static string GetSecure16Bits( string str ) {
            string salida = "";
            char [] chars = str.ToCharArray();
            if(chars.Length > 16) {
                int mid = int.Parse(Math.Floor((double) (chars.Length / 2)).ToString());
                int ini = mid - (16 / 2);
                int fin = mid + (16 / 2);
                for(int i = ini; i < fin; i++) {
                    salida += chars [i].ToString();
                }
            } else {
                salida = str;
            }
            return salida;
        }

        public static string GenerateToken( string login, string perfil, string host, string crypt, string key, IParametersInMemory _parameters, AppSettings _settings, int iteraciones ) {
            byte [] btyKey = Encoding.UTF8.GetBytes(key);
            if(btyKey.Length < 256) {
                byte [] btyKeyA = new byte [260];
                btyKey.CopyTo(btyKeyA, 0);
                int iBty = 0;
                for(int i = btyKey.Length; i < 256 - btyKey.Length; i++) {
                    btyKeyA [i] = btyKey [iBty];
                    iBty++;
                    if(iBty == btyKey.Length) {
                        iBty = 0;
                    }
                }
                btyKey = btyKeyA;
            }
            var securityKey = new SymmetricSecurityKey(btyKey);
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            int t_inactividad = Int32.Parse(_parameters.FindParametroNemonico("TCDS")!.valorIni);
            t_inactividad = (t_inactividad <= 0) ? _settings.minutos_inactividad : t_inactividad;
            t_inactividad += 5;

            var claims = new []
            {
                new Claim("login", login),
                new Claim("rol", perfil),
                new Claim("web", host),
                new Claim("data", crypt),
                new Claim("jti", Guid.NewGuid().ToString()),
            };

            var token = new JwtSecurityToken("CoopMego",
                host,
                claims,
                notBefore: DateTime.Now,
                expires: DateTime.Now.AddMinutes(t_inactividad),
                signingCredentials: credentials);
            string str_token = new JwtSecurityTokenHandler().WriteToken(token);

            try {
                for(int i = 0; i < iteraciones; i++) {
                    byte [] myByte = Encoding.UTF8.GetBytes(str_token);
                    str_token = Convert.ToBase64String(myByte);
                }
            } catch(Exception ex) {
                Console.WriteLine(ex.Message);
            }
            return str_token;
        }

        public static bool ValidateToken( string token, string key, string host, string validate ) {
            byte [] btyKey = Encoding.UTF8.GetBytes(key);
            if(btyKey.Length < 256) {
                byte [] btyKeyA = new byte [260];
                btyKey.CopyTo(btyKeyA, 0);
                int iBty = 0;
                for(int i = btyKey.Length; i < 256 - btyKey.Length; i++) {
                    btyKeyA [i] = btyKey [iBty];
                    iBty++;
                    if(iBty == btyKey.Length) {
                        iBty = 0;
                    }
                }
                btyKey = btyKeyA;
            }
            var mySecurityKey = new SymmetricSecurityKey(btyKey);

            var myIssuer = "CoopMego";
            var myAudience = host;

            var tokenHandler = new JwtSecurityTokenHandler();
            try {
                tokenHandler.ValidateToken(token, new TokenValidationParameters {
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidIssuer = myIssuer,
                    ValidAudience = myAudience,
                    IssuerSigningKey = mySecurityKey
                }, out SecurityToken validatedToken);
            } catch {
                return false;
            }
            var securityToken = new JwtSecurityToken(token);
            var arr = securityToken.Claims.Select(x => x.Type == "data" && x.Value == validate);
            if(securityToken != null && arr.Contains(true)) {
                return true;
            }
            return false;
        }
    }
}
