import "../../css/Components/DatosSocio.css";
import Accordion from "../Common/UI/Accordion";
import { Fragment, useState } from "react";
import { useDispatch, connect } from 'react-redux';
import Item from "../Common/UI/Item";
import { fetchGetAlertasCliente, fetchValidacionSocio, fetchGetInfoFinan, fetchReporteAval, fetchScore, fetchGetInfoProspecto } from "../../services/RestServices";
import Toggler from "../Common/UI/Toggler";
import Button from "../Common/UI/Button";
import { IsNullOrWhiteSpace, base64ToBlob, descargarArchivo, generarFechaHoy, numberFormatMoney, verificarPdf } from "../../js/utiles";
import { useEffect } from "react";
import { get } from "../../js/crypt";
import Card from "../Common/Card";
import ValidacionesGenerales from "../Solicitud/ValidacionesGenerales";

//TODO PENDIENTE TRAER INFORMACION DE DATOS FINANCIEROS Y OROS

const mapStateToProps = (state) => {
    var bd = state.GetWebService.data;
    if (IsNullOrWhiteSpace(bd) || Array.isArray(state.GetWebService.data)) {
        bd = sessionStorage.getItem("WSSELECTED");
    }
    return {
        token: state.tokenActive.data,
        parametrosTC: state.GetParametrosTC.data,
        prospecto: state.prospecto.data,
    };
};



const VerDetalle = (props) => {
    const dispatch = useDispatch();

    const [informacionSocio, setInformacionSocio] = useState([]);
    const [score, setScore] = useState("");
    const [datosUsuario, setDatosUsuario] = useState([]);
    const [dataProspecto, setDataProspecto] = useState([]);
    const [lstValidaciones, setLstValidaciones] = useState([]);




    //Acordeon Score
    const [estadoAccordionScore, setEstadoAccordionScore] = useState(true);
    const [estadoLoadingScore, setEstadoLoadingScore] = useState(false);
    const [contentReadyScore, setContentReadyScore] = useState(true);
    //Acordeon InfoSocio
    const [estadoAccordionInfoSocio, setEstadoAccordionInfoSocio] = useState(false);
    const [estadoAccordionInfoFinan, setEstadoAccordionInfoFinan] = useState(false);
    const [estadoAccordionInfoEco, setEstadoAccordionInfoEco] = useState(false);
    const [estadoLoadingInfoSocio, setEstadoLoadingInfoSocio] = useState(false);
    const [estadoLoadingInfoFinan, setEstadoLoadingInfoFinan] = useState(false);
    const [estadoLoadingInfoEco, setEstadoLoadingInfoEco] = useState(false);
    const [estadoMediosNotif, setEstadoMediosNotif] = useState(false);
    const [contentReadyInfoSocio, setContentReadyInfoSocio] = useState(false);
    const [contentReadyInfoFinan, setContentReadyInfoFinan] = useState(false);
    const [contentReadyInfoEco, setContentReadyInfoEco] = useState(false);


    //ComentarioGestion
    const [deseaTarjeta, setDeseaTarjeta] = useState(false);
    const [comentariosPositivos, setComentariosPositivos] = useState([{ image: "", textPrincipal: "Solicitará en otra IFI", textSecundario: "", key: 1 },
    { image: "", textPrincipal: "Monto muy bajo", textSecundario: "", key: 2 },
    { image: "", textPrincipal: "No desea por el momento", textSecundario: "", key: 3 },
    { image: "", textPrincipal: "Regresará con la documentación", textSecundario: "", key: 4 }]);
    const [comentariosNegativos, setComentariosNegativos] = useState([{ image: "", textPrincipal: "En trámite de ser socio", textSecundario: "", key: 1 },
    { image: "", textPrincipal: "Lorem Ipsum", textSecundario: "", key: 2 },
    { image: "", textPrincipal: "Lorem Ipsum", textSecundario: "", key: 3 },
    { image: "", textPrincipal: "Regresará con la documentación", textSecundario: "", key: 4 }]);
    const [comentarioAdicional, setComentarioAdicional] = useState("");






   


    const getInfoMediosNotif = () => {
        setEstadoMediosNotif(!estadoMediosNotif);
    }

    const consultaAlertas =  () => {
        fetchValidacionSocio(props.prospecto.prospecto_cedula, '', props.token, (data) => {

            fetchGetAlertasCliente(props.prospecto.prospecto_cedula, '', data.str_fecha_nacimiento, props.prospecto.prospecto_nombres, props.prospecto.prospecto_apellidos, props.token, (data) => {

                let alertasIniciales_Validas = [...data.alertas_iniciales.lst_datos_alerta_true];
                let alertasIniciales_Invalidas = [...data.alertas_iniciales.lst_datos_alerta_false];
                let alertasRestriccion_Validas = [...data.alertas_restriccion.lst_datos_alerta_true];
                let alertasRestriccion_Invalidas = [...data.alertas_restriccion.lst_datos_alerta_false];

                let lst_validaciones_ok = [];
                if (alertasIniciales_Validas.length > 0) {
                    alertasIniciales_Validas.forEach(alertaN1 => {
                        lst_validaciones_ok.push(alertaN1)
                    });
                }
                if (alertasRestriccion_Validas.length > 0) {
                    alertasRestriccion_Validas.forEach(alertaN2 => {
                        lst_validaciones_ok.push(alertaN2)
                    });
                }

                let lst_validaciones_err = [];
                if (alertasIniciales_Invalidas.length > 0) {
                    alertasIniciales_Invalidas.forEach(alertaN3 => {
                        lst_validaciones_err.push(alertaN3)
                    });
                }
                if (alertasRestriccion_Invalidas.length > 0) {
                    alertasRestriccion_Invalidas.forEach(alertaN4 => {
                        lst_validaciones_err.push(alertaN4)
                    });
                }

                const objValidaciones = {
                    lst_validaciones_ok: [...lst_validaciones_ok],
                    lst_validaciones_err: [...lst_validaciones_err]
                }
                setLstValidaciones(objValidaciones);



            }, dispatch);
            

        }, dispatch);
        
    }

    const consultaInfoProspeccion = () => {

        fetchGetInfoProspecto(props.prospecto.prospecto_cedula, props.prospecto.prospecto_id, props.token, (data) => {
            setDataProspecto(data.info_prospecto?.[0]);
        }, dispatch);

    }



    useEffect(() => {
        const strOficial = get(localStorage.getItem("sender_name"));
        const strRol = get(localStorage.getItem("role"));

        const userOficial = get(localStorage.getItem('sender'));
        const userOficina = get(localStorage.getItem('office'));
        setDatosUsuario([{ strCargo: strRol, strOficial: strOficial, strUserOficial: userOficial, strUserOficina: userOficina }]);

        setComentarioAdicional(props.comentarioAdicionalValor);
        //consultarInformacionGeneral();


        //Obtener alertas
        consultaAlertas();

        //Consulta info Prospecto
        consultaInfoProspeccion();



    }, [])

    const toggleAccordionScore = () => {
        setEstadoAccordionScore(!estadoAccordionScore);
    }

    const descargarReporte = async () => {

        //TODO CAMBIAR EL ID DEL CLIENTE PARA DESCARGAR REPORTE DEL AVAL A props.idClienteScore 189554
        await fetchReporteAval(Number(props.idClienteScore), props.token, (data) => {
            if (data.file_bytes.length > 0 && verificarPdf(data.file_bytes)) {
                const blob = base64ToBlob(data.file_bytes, 'application/pdf');
                let fechaHoy = generarFechaHoy();
                const nombreArchivo = `ReporteAval_Prueba${(fechaHoy)}`;
                descargarArchivo(blob, nombreArchivo, 'pdf', false);
            }
        }, dispatch);

    }

    return (
        <div className="f-row w-100" >
            <Card className={["marginTopLeftProsp w-40 justify-content-space-between align-content-center"]}>
                <ValidacionesGenerales token={props.token}
                    lst_validaciones={lstValidaciones}
                    onShowAutorizacion={false}
                ></ValidacionesGenerales>


            </Card>

            <Card className={["marginTopProsp w-40 justify-content-space-between align-content-center"]}>
                <div className="f-col w-100 mb-3">
                    <Card className={[" mt-5 justify-content-space-between align-content-center"]}>
                        <section className="f-col w-100">
                            <h3 className="strong mb-2">Datos Personales</h3>

                            <div className="f-row w-90 justify-content-space-between">
                                <label>Cédula:</label>
                                <h4 className="strong">{dataProspecto.str_num_identificacion}</h4>
                            </div> 
                            <hr className="dashed"></hr>
                            <div className="f-row w-90 justify-content-space-between">
                                <label>Nombre:</label>
                                <h4 className="strong">{dataProspecto.str_nombre} {dataProspecto.str_apellidos}</h4>
                            </div>
                            <hr className="dashed"></hr>
                            <div className="f-row w-90 justify-content-space-between">
                                <label>Correo:</label>
                                <h4 className="strong">{dataProspecto.str_email}</h4>
                            </div>   
                        </section>
                    </Card>

                    <Card className={["mt-2 justify-content-space-between align-content-center"]}>
                        <section className="f-col w-100">
                            <h3 className="strong  mb-2">Datos Financieros</h3>
                            <div className="f-row w-90 justify-content-space-between">
                                <label>Ingresos:</label>
                                <h4 className="strong">{numberFormatMoney(dataProspecto.mny_ingresos)}</h4>
                            </div>
                            <hr className="f-row dashed"></hr>
                            <div className="f-row w-90 justify-content-space-between">
                                <label>Egresos:</label>
                                <h4 className="strong">{numberFormatMoney(dataProspecto.mny_egresos)}</h4>
                            </div>
                            <hr className="dashed"></hr>
                            <div className="f-row w-90 justify-content-space-between">
                                <label>Resta Gasto Financiero:</label>
                                <h4 className="strong">{numberFormatMoney(dataProspecto.mny_gastos_financieros)}</h4>
                            </div>
                            <hr className="dashed"></hr>
                            <div className="f-row w-90 justify-content-space-between">
                                    <label>Gasto Financiero CoDeudor:</label>
                                    <h4 className="strong">{numberFormatMoney(dataProspecto.mny_gastos_codeudor)}</h4>

                                
                            </div>
                            <hr className="dashed"></hr>
                            <div className="f-row w-90 justify-content-space-between">
                                <label>Cupo solicitado:</label>
                                <h4 className="strong">{numberFormatMoney(dataProspecto.mny_cupo_solicitado)}</h4>
                            </div>
                            <hr className="dashed"></hr>
                            <div className="f-row w-90 justify-content-space-between">
                                <label>Cupo Sugerido Aval:</label>
                                <h4 className="strong">{numberFormatMoney(dataProspecto.mny_cupo_sugerido_aval)}  </h4>
                            </div>
                            <hr className="dashed"></hr>
                            <div className="f-row w-90 justify-content-space-between">
                                <label>Cupo Sugerido Coopmego:</label>
                                <h4 className="strong">{numberFormatMoney(dataProspecto.mny_cupo_sugerido_coopmego)}</h4>
                            </div>
                            <hr className="dashed w-100"></hr>
                            <div className="f-row w-90 justify-content-space-between">
                                <label>Score:</label>
                                <h4 className="strong">{dataProspecto.str_score_buro}</h4>
                            </div>
                        </section>
                    </Card>

                    <Card className={["mt-2 justify-content-space-between align-content-center"]}>
                        <section className="f-col w-100">
                            <h3 className="strong  mb-2">Información adicional</h3>
                            <div className="f-row w-90 justify-content-space-between">
                                <label>Comentario de la gestión:</label>
                                <h4 className="strong">{dataProspecto.str_comentario_proceso}</h4>
                            </div>
                            <hr className="f-row dashed w-100"></hr>
                            <div className="f-row w-90 justify-content-space-between">
                                <label>Observación:</label>
                                <h4 className="strong">{dataProspecto.str_comentario_adicional}</h4>
                            </div>                            
                        </section>
                    </Card>

                </div>
            </Card>


            

        </div>

       
    );


}

export default connect(mapStateToProps, {})(VerDetalle);






