﻿import Card from "../Common/Card";
import '../../scss/components/ValidacionesGenerales.css';
import { useState, Fragment, useEffect } from "react";
import Button from "../Common/UI/Button";
import { fetchScore } from "../../services/RestServices";
import { useDispatch } from 'react-redux';
import Uploader from "../Common/UI/Uploader";
import { base64ToBlob, descargarArchivo, generarFechaHoy, verificarPdf, conversionBase64 } from "../../js/utiles";

const ValidacionesGenerales = (props) => {
    const dispatch = useDispatch();
    const [isGenerandoAutorizacion, setIsGenerandoAutorizacion] = useState(false);
    const [archivoAutorizacion, setArchivoAutorizacion] = useState('');
    const [isDocCargado, setIsDocCargado] = useState(false);


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
            if(data.file_bytes.length > 0 && verificarPdf(data.file_bytes)) {
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
        await fetchScore("C", props.infoSocio.cedula, nombresApellidos, props.datosUsuario[0].strUserOficial, props.datosUsuario[0].strOficial, props.datosUsuario[0].strCargo, props.token, (data) =>
        {
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
                    <h2>Validaciones</h2>

                    {props.lst_validaciones && props.lst_validaciones?.lst_validaciones_ok?.length > 0 &&
                        <Card className={["w-100"]}>
                            {props.lst_validaciones.lst_validaciones_ok.map((validacion) => {
                                return (
                                    <div className="f-row validacion mb-3" key={validacion.str_descripcion_alerta}>
                                        <img className="btn_mg mr-3" style={{ width: "15px", height: "15px" }} src="Imagenes/statusActive.png" alt="Validación OK"></img>
                                        <h3>{validacion.str_descripcion_alerta}</h3>
                                    </div>
                                );

                            })}
                        </Card>
                    }
                    {props.lst_validaciones && props.lst_validaciones?.lst_validaciones_err?.length > 0 &&
                        <Card className={[`W-100 ${props.lst_validaciones?.lst_validaciones_ok?.length !== 0 ? 'mt-4' : ''}`]}>
                            {props.lst_validaciones.lst_validaciones_err.map((validacion) => {
                                return (
                                    <div className="f-row validacion mt-2" key={validacion.str_descripcion_alerta}>
                                        <img className="btn_mg mr-3" style={{ width: "15px", height: "15px" }} src="/Imagenes/statusBlocked.png" alt="Se requiere cumplir"></img>
                                        <h3>{validacion.str_descripcion_alerta}</h3>
                                        {(validacion.str_nemonico === "ALERTA_SOLICITUD_TC_090" && validacion.str_estado_alerta === "False") &&
                                            <button className="btn_mg_icons" onClick={getDocAutorizacion}>
                                                <img src="/Imagenes/right.svg" alt="Cumplir requisito"></img>
                                            </button>
                                        }
                                    </div>
                                );

                            })}
                        </Card>
                    }

                </div>
                }
        </div>
    );
}

export default ValidacionesGenerales;