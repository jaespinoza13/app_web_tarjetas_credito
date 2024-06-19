using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.TarjetaCredito.GetScore
{
    public class ResGetScore : ResComun
    {
        // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
        public string file_bytes { get; set; }
        public int int_cliente { get; set; }
        public string str_gastos_codeudor { get; set; }
        public string str_cupo_sugerido { get; set; }
        public Response response { get; set; }
        
    }

    // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
    public class DetalleTarjetaCredito
    {
        public DateTime fechaCorte { get; set; }
        public string sistemaCrediticio { get; set; }
        public string clasificacin { get; set; }
        public string codigoInstitucionFinanciera { get; set; }
        public string marcaTarjeta { get; set; }
        public string tipoIdentificacionSujeto { get; set; }
        public string identificacionSujeto { get; set; }
        public string razonSocial { get; set; }
        public string numeroTarjeta { get; set; }
        public string marcaTarjetaDescripcion { get; set; }
        public string tipoCreditoDescripcion { get; set; }
        public string claseTarjetaDescripcion { get; set; }
        public string formaPagoDescripcion { get; set; }
        public DateTime fechaEmisin { get; set; }
        public DateTime fechaVencimiento { get; set; }
        public object fechaCancelacion { get; set; }
        public string estadoOperacionDescripcion { get; set; }
        public double saldoTotal { get; set; }
        public double capitalxVencerTotal { get; set; }
        public double saldoVencido { get; set; }
        public double valorNoDevengaInteresTotal { get; set; }
        public double valorDemandaJudicial { get; set; }
        public double carteraCastigada { get; set; }
        public double diasMorosidad { get; set; }
        public double capitalxVencer1a30 { get; set; }
        public double capitalxVencer31a90 { get; set; }
        public double capitalxVencer91a180 { get; set; }
        public double capitalxVencer181a360 { get; set; }
        public double capitalxVencerMas360 { get; set; }
        public double valorNoDevengaInteres1a30 { get; set; }
        public double valorNoDevengaInteres31a90 { get; set; }
        public double valorNoDevengaInteres91a180 { get; set; }
        public double valorNoDevengaInteres181a360 { get; set; }
        public double valorNoDevengaInteresMas360 { get; set; }
        public double capitalVencido1a30 { get; set; }
        public double capitalVencido31a90 { get; set; }
        public double capitalVencido91a180 { get; set; }
        public double capitalVencido181a360 { get; set; }
        public double capitalVencidoMas360 { get; set; }
        public double capitalVencido181a270 { get; set; }
        public double capitalVencidoMas270 { get; set; }
        public double interesVencido1a30 { get; set; }
        public double interesVencido31a60 { get; set; }
        public double interesVencido61a90 { get; set; }
        public double interesVencido91a180 { get; set; }
        public double interesVencido181a270 { get; set; }
        public double interesVencidoMas270 { get; set; }
        public double interesSobreMora { get; set; }
        public double totalCostoOperativoVencido { get; set; }
        public double valorPagado { get; set; }
        public double valorMinimoPagar { get; set; }
    }

    public class DetalleTarjetaSaldoVigente
    {
        public DateTime fechaCorte { get; set; }
        public string razonSocial { get; set; }
        public string marcaTarjetaDescripcion { get; set; }
        public double antiguedadTarjetaMeses { get; set; }
        public DateTime fechaVencimiento { get; set; }
        public object fechaCancelacion { get; set; }
        public string peorEdadVencidoTarjetas { get; set; }
    }

    public class DeudaVigenteTotal
    {
        public string sistemaCrediticio { get; set; }
        public double valorPorVencer { get; set; }
        public double noDevengaIntereses { get; set; }
        public double valorVencido { get; set; }
        public double valorDemandaJudicial { get; set; }
        public double carteraCastigada { get; set; }
        public double totalDeuda { get; set; }
    }

    public class EstructuraOperacionBancosDetalle
    {
        public DateTime fechaCorte { get; set; }
        public string clasificacin { get; set; }
        public string codigoInstitucionFinanciera { get; set; }
        public string sistemaCrediticio { get; set; }
        public string tipoIdentificacionSujetoDescripcion { get; set; }
        public string tipoIdentificacionSujeto { get; set; }
        public string identificacionSujeto { get; set; }
        public string razonSocial { get; set; }
        public string tipoDeudorDescripcion { get; set; }
        public string tipoCreditoDescripcion { get; set; }
        public string numeroOperacion { get; set; }
        public string tipoOperacionDescripcion { get; set; }
        public DateTime fechaConcesion { get; set; }
        public DateTime fechaVencimiento { get; set; }
        public object fechaCancelacion { get; set; }
        public string estadoOperacionDescripcion { get; set; }
        public string situacionOperacionDescripcion { get; set; }
        public double valorOperacion { get; set; }
        public double saldoTotalCalculado { get; set; }
        public double valorxVencerTotal { get; set; }
        public double valorVencidoTotal { get; set; }
        public double valorNoDevengaInteresTotal { get; set; }
        public double valorDemandaJudicial { get; set; }
        public double carteraCastigada { get; set; }
        public double diasMorosidad { get; set; }
        public double valorxVencer1a30 { get; set; }
        public double valorxVencer31a90 { get; set; }
        public double valorxVencer91a180 { get; set; }
        public double valorxVencer181a360 { get; set; }
        public double valorxVencerMas360 { get; set; }
        public double valorNoDevengaInteres1a30 { get; set; }
        public double valorNoDevengaInteres31a90 { get; set; }
        public double valorNoDevengaInteres91a180 { get; set; }
        public double valorNoDevengaInteres181a360 { get; set; }
        public double valorNoDevengaInteresMas360 { get; set; }
        public double valorVencido1a30 { get; set; }
        public double valorVencido31a90 { get; set; }
        public double valorVencido91a180 { get; set; }
        public double valorVencido181a360 { get; set; }
        public double valorVencidoMas360 { get; set; }
        public double valorVencido181a270 { get; set; }
        public double valorVencidoMas270 { get; set; }
        public double valorVencido91a270 { get; set; }
        public double valorVencido271a360 { get; set; }
        public double valorVencido361a720 { get; set; }
        public double valorVencidoMas720 { get; set; }
    }

    public class EvolucionScoreFinanciero
    {
        public DateTime fechaCorte { get; set; }
        public string diasVencido { get; set; }
        public double ejeY { get; set; }
        public double ejeX { get; set; }
        public double radio { get; set; }
        public string color { get; set; }
    }

    public class FactoresScore
    {
        public string factor { get; set; }
        public double valor { get; set; }
        public string efecto { get; set; }
    }

    public class GastoFinanciero
    {
        public double cuotaEstimadaTitular { get; set; }
        public double cuotaTotalOperaciones { get; set; }
        public double cuotaTotalTarjeta { get; set; }
        public double cuotaTotalServicios { get; set; }
        public double cuotaVencidos { get; set; }
        public double numOperacionesExcluidasCuota { get; set; }
        public double saldoExcluidoCuota { get; set; }
    }

    public class IdentificacionTitular
    {
        public string tipoIdentificacionSujetoDescripcion { get; set; }
        public string identificacionSujeto { get; set; }
        public string nombreRazonSocial { get; set; }
        public string tipoCompania { get; set; }
        public object fechaConstitucion { get; set; }
        public string objetoSocial { get; set; }
        public string estadoSocial { get; set; }
    }

    public class IndicadoresDeudum
    {
        public double saldoPromedio36M { get; set; }
        public double saldoPromedioTarjetas36M { get; set; }
        public double maxMontoDeuda { get; set; }
        public string peorEdadVencidoDirecta36M { get; set; }
        public double maySaldoVencDirecta36M { get; set; }
        public DateTime? fechaUltimoVencido { get; set; }
    }

    public class IndicadoresTarjetum
    {
        public double numTarjetasVigentes { get; set; }
    }

    public class OperacionesHistoricasBanco
    {
        public string codigoInstitucionFinanciera { get; set; }
        public string sistemaCrediticio { get; set; }
        public DateTime fechaCorte { get; set; }
        public string razonSocial { get; set; }
        public string tipoDeudorDescripcion { get; set; }
        public string tipoCreditoDescripcion { get; set; }
        public string numeroOperacion { get; set; }
        public double saldoTotalCalculado { get; set; }
        public double valorxVencerTotal { get; set; }
        public double valorVencidoTotal { get; set; }
        public double valorNoDevengaInteresTotal { get; set; }
        public double valorDemandaJudicial { get; set; }
        public double carteraCastigada { get; set; }
        public double plazoXOpPendiente { get; set; }
        public double diasMorosidad { get; set; }
        public double cuotaEstimadaOperacion { get; set; }
    }

    public class OperacionesHistoricasCooperativa
    {
        public string sistemaCrediticio { get; set; }
        public string codigoInstitucionFinanciera { get; set; }
        public DateTime fechaCorte { get; set; }
        public string razonSocial { get; set; }
        public string tipoDeudorDescripcion { get; set; }
        public string tipoCreditoDescripcion { get; set; }
        public string numeroOperacion { get; set; }
        public double saldoTotalCalculado { get; set; }
        public double valorxVencerTotal { get; set; }
        public double valorVencidoTotal { get; set; }
        public double valorNoDevengaInteresTotal { get; set; }
        public double valorDemandaJudicial { get; set; }
        public double carteraCastigada { get; set; }
        public double plazoXOpPendiente { get; set; }
        public string peorEdadVenXOp119 { get; set; }
        public double cuotaEstimadaOperacion { get; set; }
    }

    public class OperacionesHistoricasEmpresa
    {
        public DateTime fechaCorte { get; set; }
        public string razonSocial { get; set; }
        public string tipoDeudorDescripcion { get; set; }
        public string numeroOperacion { get; set; }
        public double saldoTotalCalculado { get; set; }
        public double valorxVencerTotal { get; set; }
        public double valorVencidoTotal { get; set; }
        public double valorNoDevengaInteresTotal { get; set; }
        public double valorDemandaJudicial { get; set; }
        public double carteraCastigada { get; set; }
        public double diasVencido { get; set; }
        public double cuotaEstimadaOperacion { get; set; }
    }

    public class OperacionesHistoricasTarjetum
    {
        public string clasificacin { get; set; }
        public string sistemaCrediticio { get; set; }
        public string codigoInstitucionFinanciera { get; set; }
        public string marcaTarjeta { get; set; }
        public string numeroTarjeta { get; set; }
        public DateTime fechaCorte { get; set; }
        public string razonSocial { get; set; }
        public string marcaTarjetaDescripcion { get; set; }
        public double rankingTarjetas { get; set; }
        public double porcentajeUso { get; set; }
        public double cupoTarjeta { get; set; }
        public double capitalConsumo { get; set; }
        public double saldoTotal { get; set; }
        public double capitalxVencerTotal { get; set; }
        public double saldoVencido { get; set; }
        public double valorNoDevengaInteresTotal { get; set; }
        public double valorDemandaJudicial { get; set; }
        public double carteraCastigada { get; set; }
        public double diasMorosidad { get; set; }
        public double valorPagado { get; set; }
        public double valorMinimoPagar { get; set; }
        public double cuotaEstimadaTarjetas { get; set; }
    }

    public class OperacionesVigentesBanco
    {
        public string sistemaCrediticio { get; set; }
        public string codigoInstitucionFinanciera { get; set; }
        public DateTime fechaCorte { get; set; }
        public string razonSocial { get; set; }
        public string tipoDeudorDescripcion { get; set; }
        public string tipoCreditoDescripcion { get; set; }
        public string numeroOperacion { get; set; }
        public double valorOperacion { get; set; }
        public double plazoXOperacion { get; set; }
        public double plazoXOpPendiente { get; set; }
        public double saldoTotalCalculado { get; set; }
        public double valorxVencerTotal { get; set; }
        public double valorVencidoTotal { get; set; }
        public double valorNoDevengaInteresTotal { get; set; }
        public double valorDemandaJudicial { get; set; }
        public double carteraCastigada { get; set; }
        public double diasMorosidad { get; set; }
        public double cuotaEstimadaOperacion { get; set; }
    }

    public class OperacionesVigentesTarjetum
    {
        public DateTime fechaCorte { get; set; }
        public string sistemaCrediticio { get; set; }
        public string clasificacion { get; set; }
        public string marcaTarjeta { get; set; }
        public string codigoInstitucionFinanciera { get; set; }
        public string razonSocial { get; set; }
        public string marcaTarjetaDescripcion { get; set; }
        public double rankingTarjetas { get; set; }
        public double porcentajeUso { get; set; }
        public double cupoTarjeta { get; set; }
        public double capitalConsumo { get; set; }
        public double saldoTotal { get; set; }
        public double capitalxVencerTotal { get; set; }
        public double saldoVencido { get; set; }
        public double valorNoDevengaInteresTotal { get; set; }
        public double valorDemandaJudicial { get; set; }
        public double carteraCastigada { get; set; }
        public double diasMorosidad { get; set; }
        public double valorPagado { get; set; }
        public double valorMinimoPagar { get; set; }
        public double cuotaEstimadaTarjetas { get; set; }
    }

    public class Response
    {
        public string time { get; set; }
        public string responseCode { get; set; }
        public string message { get; set; }
        public string transactionNumber { get; set; }
        public Result result { get; set; }
    }

    public class Result
    {
        public List<IdentificacionTitular> identificacionTitular { get; set; }
        public List<ScoreFinanciero> scoreFinanciero { get; set; }
        public List<FactoresScore> factoresScore { get; set; }
        public List<object> manejoCuentasCorrientes { get; set; }
        public List<DeudaVigenteTotal> deudaVigenteTotal { get; set; }
        public List<GastoFinanciero> gastoFinanciero { get; set; }
        public List<object> operacionesCodeudorGarante { get; set; }
        public List<object> informacionComoRUC { get; set; }
        public List<OperacionesVigentesTarjetum> operacionesVigentesTarjeta { get; set; }
        public List<DetalleTarjetaSaldoVigente> detalleTarjetaSaldoVigente { get; set; }
        public List<IndicadoresTarjetum> indicadoresTarjeta { get; set; }
        public List<DetalleTarjetaCredito> detalleTarjetaCredito { get; set; }
        public List<OperacionesVigentesBanco> operacionesVigentesBanco { get; set; }
        public List<EstructuraOperacionBancosDetalle> estructuraOperacionBancosDetalle { get; set; }
        public List<object> operacionesVigentesCooperativa { get; set; }
        public List<object> estructuraOperacionCooperativaDetalle { get; set; }
        public List<object> operacionesVigentesEmpresa { get; set; }
        public List<object> operacionesVigentesServicio { get; set; }
        public List<object> operacionesVigentesCobranza { get; set; }
        public List<EvolucionScoreFinanciero> evolucionScoreFinanciero { get; set; }
        public List<SemaforoMaximoDiasVencido> semaforoMaximoDiasVencido { get; set; }
        public List<TendenciaDeudum> tendenciaDeuda { get; set; }
        public List<IndicadoresDeudum> indicadoresDeuda { get; set; }
        public List<OperacionesHistoricasTarjetum> operacionesHistoricasTarjeta { get; set; }
        public List<OperacionesHistoricasBanco> operacionesHistoricasBanco { get; set; }
        public List<OperacionesHistoricasCooperativa> operacionesHistoricasCooperativa { get; set; }
        public List<OperacionesHistoricasEmpresa> operacionesHistoricasEmpresa { get; set; }
        public List<object> operacionesHistoricasServicio { get; set; }
        public List<object> operacionesHistoricasCobranza { get; set; }
        public List<object> relacionEmpresas { get; set; }
        public List<object> datosContacto { get; set; }
        public List<TitularConsultado12Mese> titularConsultado12Meses { get; set; }
    }

    public class Root
    {
        public string str_url_contrato { get; set; }
        public int int_cliente { get; set; }
        public Response response { get; set; }
        public string str_res_original_id_msj { get; set; }
        public string str_res_original_id_servicio { get; set; }
        public DateTime dt_res_fecha_msj_crea { get; set; }
        public string str_res_estado_transaccion { get; set; }
        public string str_res_codigo { get; set; }
        public string str_res_id_servidor { get; set; }
        public string str_res_info_adicional { get; set; }
        public string str_res_token { get; set; }
        public string str_id_transaccion { get; set; }
        public object str_ente { get; set; }
        public string str_nemonico_canal { get; set; }
        public string str_id_sistema { get; set; }
        public string str_app { get; set; }
        public string str_id_servicio { get; set; }
        public string str_version_servicio { get; set; }
        public string str_id_usuario { get; set; }
        public string str_mac_dispositivo { get; set; }
        public string str_ip_dispositivo { get; set; }
        public string str_remitente { get; set; }
        public string str_receptor { get; set; }
        public string str_tipo_peticion { get; set; }
        public string str_id_msj { get; set; }
        public DateTime dt_fecha_operacion { get; set; }
        public bool bl_posible_duplicado { get; set; }
        public string str_prioridad { get; set; }
        public string str_login { get; set; }
        public string str_latitud { get; set; }
        public string str_longitud { get; set; }
        public string str_firma_digital { get; set; }
        public string str_num_sim { get; set; }
        public string str_clave_secreta { get; set; }
        public string str_pais { get; set; }
        public string str_sesion { get; set; }
        public string str_id_oficina { get; set; }
        public string str_id_perfil { get; set; }
        public string str_identificador { get; set; }
    }

    public class ScoreFinanciero
    {
        public double score { get; set; }
        public double clientesPeorScore { get; set; }
        public string tasaMalos { get; set; }
    }

    public class SemaforoMaximoDiasVencido
    {
        public DateTime fechaCorte { get; set; }
        public string diasVencido { get; set; }
        public double ejeY { get; set; }
        public double ejeX { get; set; }
        public double radio { get; set; }
        public string color { get; set; }
    }

    public class TendenciaDeudum
    {
        public DateTime fechaCorte { get; set; }
        public double totalDeuda { get; set; }
        public double valorVencidoTotal { get; set; }
    }

    public class TitularConsultado12Mese
    {
        public DateTime fechaConsulta { get; set; }
        public string nombreComercial { get; set; }
        public string nombreUsuario { get; set; }
    }


}
