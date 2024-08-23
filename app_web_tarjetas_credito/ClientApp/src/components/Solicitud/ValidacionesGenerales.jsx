import '../../scss/components/ValidacionesGenerales.css';
import { useState, Fragment, useEffect } from "react";
import Button from "../Common/UI/Button";
import { fetchGetOficina, fetchScore } from "../../services/RestServices";
import { useDispatch, connect } from 'react-redux';
import Uploader from "../Common/UI/Uploader";
import { base64ToBlob, descargarArchivo, generarFechaHoy, verificarPdf, conversionBase64, IsNullOrWhiteSpace } from "../../js/utiles";
import Accordion from "../Common/UI/Accordion";


const mapStateToProps = (state) => {
    var bd = state.GetWebService.data;
    if (IsNullOrWhiteSpace(bd) || Array.isArray(state.GetWebService.data)) {
        bd = sessionStorage.getItem("WSSELECTED");
    }
    return {
        token: state.tokenActive.data,
        parametrosTC: state.GetParametrosTC.data
    };
};



const ValidacionesGenerales = (props) => {
    const dispatch = useDispatch();
    const [isGenerandoAutorizacion, setIsGenerandoAutorizacion] = useState(false);
    const [archivoAutorizacion, setArchivoAutorizacion] = useState('');
    const [isDocCargado, setIsDocCargado] = useState(false);
    const [oficinas, setOficinas] = useState([]);
    const [ciudadDeOficina, setCiudadDeOficina] = useState("");

    //Accordion Alertas No Validas
    const [contentReadyAlertasNoValidas, setContentReadyAlertasNoValidas] = useState(true);
    const [estadoAccordionAlertasNoValidas, setEstadoAccordionAlertasNoValidas] = useState(true);
    const [estadoLoadingAlertasNoValidas, setEstadoLoadingAlertasNoValidas] = useState(false);


    //Accordion Alertas  Validas
    const [contentReadyAlertasValidas, setContentReadyAlertasValidas] = useState(props?.lst_validaciones?.lst_validaciones_err?.length !== 0 ? false: true);
    const [estadoAccordionAlertasValidas, setEstadoAccordionAlertasValidas] = useState(props?.lst_validaciones?.lst_validaciones_err?.length !== 0 ? false : true);
    const [estadoLoadingAlertasValidas, setEstadoLoadingAlertasValidas] = useState(false);

    useEffect(() => {

        //Obtener oficinas parametrizadas
        let ParametrosTC = props.parametrosTC.lst_parametros;
        let oficinasParametrosTC = ParametrosTC
            .filter(param => param.str_nombre === 'OFICINAS_TC')
            .map(estado => ({
                prm_id: estado.int_id_parametro,
                prm_valor_fin: estado.str_valor_fin,
                prm_descripcion: estado.str_descripcion
            }));
        setOficinas(oficinasParametrosTC)


    }, []);

    useEffect(() => {
        if (props.datosUsuario?.length > 0) {
            fetchGetOficina(props.token, (data) => {
                setCiudadDeOficina(data.lst_oficinas[0].ciudad);
            }, dispatch)
        }
    }, [props.datosUsuario]);


    useEffect(() => {
        if (!props.onShowAutorizacion) {
            setIsGenerandoAutorizacion(false);
        }
    }, [props.onShowAutorizacion]);

    const getDocAutorizacion = () => {
        props.onSetShowAutorizacion(true);
    }

    const descargarArchivoConsulta = (data) => {
        try {
            if (data.file_bytes.length > 0 && verificarPdf(data.file_bytes)) {
                const blob = base64ToBlob(data.file_bytes, 'application/pdf');
                let fechaHoy = generarFechaHoy();
                const nombreArchivo = `AprobacionConsultaBuro_${(fechaHoy)}`;
                descargarArchivo(blob, nombreArchivo, 'pdf', false);
            }

        } catch (error) {
            console.error("Error ak descargar el PDF:", error);
        }
    }


    const getContrato = async () => {
        const nombresApellidos = props.infoSocio.str_nombres + " " + props.infoSocio.str_apellido_paterno + " " + props.infoSocio.str_apellido_materno;

        //const oficinaFormato = oficinas.find(ofic => Number(ofic.prm_valor_fin) === Number(props.datosUsuario[0].strUserOficina))

        await fetchScore("C", props.infoSocio.cedula, nombresApellidos.toUpperCase(), ciudadDeOficina, props.datosUsuario[0].strOficial, props.datosUsuario[0].strCargo, props.token, (data) => {
            descargarArchivoConsulta(data);
        }, dispatch);
    }

    const handleFileChange = async (event) => {
        const base64 = await conversionBase64(event);
        props.onFileUpload(base64.split(',')[1]);
    };


    const removeFile = () => {
        setArchivoAutorizacion('');
        setIsDocCargado(false);
    }

    const toggleAccordionAlertasNoValidas = () => {
        setContentReadyAlertasNoValidas(!contentReadyAlertasNoValidas);
        setEstadoAccordionAlertasNoValidas(!estadoAccordionAlertasNoValidas);
    }
    const toggleAccordionAlertasValidas = () => {
        setContentReadyAlertasValidas(!contentReadyAlertasValidas);
        setEstadoAccordionAlertasValidas(!estadoAccordionAlertasValidas);
    }

    return (
        <div className="f-col justify-content-center">

            {props.onShowAutorizacion
                ?
                <Fragment>
                    <div className="f-row w-100">
                        <h2 className="mt-4 ">Requisito previo a la Consulta al Buro de Crédito</h2>
                    </div>
                    <div className="f-row w100 mt-4 justify-content-space-evenly">
                        <Button className="btn_mg__toggler active w-40" onClick={getContrato}><img src="Imagenes/download.svg" alt="Archivo de autorización"></img> Descargar archivo</Button>
                        <Uploader onClick={handleFileChange} onRemoveFile={removeFile}>Subir archivo</Uploader>
                    </div>
                </Fragment>
                :
                <div className="f-col">
                    <h3 className={`strong ml-2 mb-1`}>VALIDACIONES</h3>
                    {props.lst_validaciones && props.lst_validaciones?.lst_validaciones_err?.length > 0 &&

                        <Accordion title="Faltantes" contentReady={contentReadyAlertasNoValidas} rotate={estadoAccordionAlertasNoValidas} loading={estadoLoadingAlertasNoValidas} toggleAccordion={toggleAccordionAlertasNoValidas}>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                {props.lst_validaciones.lst_validaciones_err.map((validacion, index) => {
                                    return (
                                        <div key={index} className="mt-1" style={{ display: "flex", flexDirection: "row", width: "80%", marginLeft: "40px", marginRight: "40px" }}>
                                            <div className="f-row validacion mt-1 mb-2" key={validacion.str_descripcion_alerta}>
                                                <img className="btn_mg mr-3" style={{ width: "15px", height: "15px" }} src="/Imagenes/statusBlocked.png" alt="Se requiere cumplir"></img>
                                                <h3>{validacion.str_descripcion_alerta}</h3>
                                                {(validacion.str_nemonico === "ALERTA_SOLICITUD_TC_090" && validacion.str_estado_alerta === "False") &&
                                                    <button className="btn_mg_icons" onClick={getDocAutorizacion}>
                                                        <img src="/Imagenes/right.svg" alt="Cumplir requisito"></img>
                                                    </button>
                                                }
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Accordion>
                    }

                    <div className={`${props.lst_validaciones?.lst_validaciones_err?.length > 0 ? 'mt-3' : ''}`}>
                        {props.lst_validaciones && props.lst_validaciones?.lst_validaciones_ok?.length > 0 &&

                            <Accordion title="Correctas" contentReady={contentReadyAlertasValidas} rotate={estadoAccordionAlertasValidas} loading={estadoLoadingAlertasValidas} toggleAccordion={toggleAccordionAlertasValidas}>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    {props.lst_validaciones.lst_validaciones_ok.map((validacion, index) => {
                                        return (
                                            <div key={index} className="mt-1" style={{ display: "flex", flexDirection: "row", width: "80%", marginLeft: "40px", marginRight: "40px" }}>
                                                <div className="f-row validacion mt-1 mb-2" key={validacion.str_descripcion_alerta}>
                                                    <img className="btn_mg mr-3" style={{ width: "15px", height: "15px" }} src="Imagenes/statusActive.png" alt="Validación OK"></img>
                                                    <h3>{validacion.str_descripcion_alerta}</h3>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Accordion>                 
                        }
                    </div>
                </div>
            }
        </div>
    );
}
export default connect(mapStateToProps, {})(ValidacionesGenerales);