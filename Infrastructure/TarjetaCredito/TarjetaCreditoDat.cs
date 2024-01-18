using Domain.Common;
using Domain.Models.TarjetaCredito.GetValidaciones;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Infrastructure.TarjetaCredito
{
    public class TarjetaCreditoDat
    {
        private readonly AppSettings _settings;

        public TarjetaCreditoDat(AppSettings settings)
        {
            _settings = settings;
        }

        #region GET
        public ResGetValidaciones getValidaciones(ReqGetValidaciones req)
        {
            ResGetValidaciones res = new ResGetValidaciones();
            try
            {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_get_validaciones;
                var options = new RestClientOptions(_settings.ws_personas + _settings.service_get_validaciones)
                {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };
                var client = new RestClient(options);

                string auth_basic = Convert.ToBase64String(ASCIIEncoding.ASCII.GetBytes(_settings.auth_user_ws_personas + ":" + _settings.auth_pass_ws_personas));

                var request = new RestRequest();
                request.AddHeader("Authorization", "Basic " + auth_basic);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/json", req, ParameterType.RequestBody);

                request.Method = Method.Post;
                var response = new RestResponse();
                response = client.Post(request);
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    res = JsonSerializer.Deserialize<ResGetValidaciones>(response.Content!)!;
                }
            } catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return res;
        }
        #endregion
    }
}
