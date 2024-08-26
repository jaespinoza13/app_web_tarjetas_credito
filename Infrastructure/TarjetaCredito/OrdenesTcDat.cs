using Domain.Common;
using Domain.Models.OrdenesTc.GetOrdenesTc;
using Domain.Models.OrdenesTc.UpdOrdenesTc;
using RestSharp;
using System.Net;
using System.Text.Json;

namespace Infrastructure.TarjetaCredito
{
    public class OrdenesTcDat
    {
        private readonly AppSettings _settings;
        public OrdenesTcDat(AppSettings settings) {
            _settings = settings;
        }
        
        public ResGetOrdenesTc getOrdenesTC(ReqGetOrdenesTc req)
        {
            ResGetOrdenesTc res = new ResGetOrdenesTc();
            try
            {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_get_ordenes;
                var options = new RestClientOptions(_settings.ws_ordenes_tc + _settings.service_get_ordenes)
                {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };

                var client = new RestClient(options);
                var request = new RestRequest();
                request.AddHeader("Authorization-Mego", "Auth-Mego " + _settings.auth_ws_tarjeta_credito);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/json", req, ParameterType.RequestBody);
                request.Method = Method.Post;

                var response = new RestResponse();
                response = client.Post(request);

                if (response.StatusCode == HttpStatusCode.OK)
                {
                    res = JsonSerializer.Deserialize<ResGetOrdenesTc>(response.Content!)!;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return res;
        }
        
        public ResUpdOrdenTc updOrdenesTC(ReqUpdOrdenTc req)
        {
            ResUpdOrdenTc res = new ResUpdOrdenTc();
            try
            {
                req.llenarDatosConfig(_settings);
                req.str_id_servicio = "REQ_" + _settings.service_get_ordenes;
                var options = new RestClientOptions(_settings.ws_ordenes_tc + _settings.service_get_ordenes)
                {
                    ThrowOnAnyError = true,
                    MaxTimeout = _settings.time_out
                };

                var client = new RestClient(options);
                var request = new RestRequest();
                request.AddHeader("Authorization-Mego", "Auth-Mego " + _settings.auth_ws_tarjeta_credito);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/json", req, ParameterType.RequestBody);
                request.Method = Method.Post;

                var response = new RestResponse();
                response = client.Post(request);

                if (response.StatusCode == HttpStatusCode.OK)
                {
                    res = JsonSerializer.Deserialize<ResUpdOrdenTc>(response.Content!)!;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return res;
        }

    }
}
