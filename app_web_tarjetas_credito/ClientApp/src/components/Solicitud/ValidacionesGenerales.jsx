import Card from "../Common/Card";
import '../../scss/components/ValidacionesGenerales.css';
import { useState, Fragment, useEffect } from "react";
import Button from "../Common/UI/Button";
import { fetchGetContrato } from "../../services/RestServices";
import { useDispatch } from 'react-redux';
import Uploader from "../Common/UI/Uploader";

const ValidacionesGenerales = (props) => {
    const dispatch = useDispatch();
    const [isGenerandoAutorizacion, setIsGenerandoAutorizacion] = useState(false);
    const [archivoAutorizacion, setArchivoAutorizacion] = useState('');

    useEffect(() => {
        if (isGenerandoAutorizacion) {
            props.onAddAutorizacion(true);
        }
    }, [isGenerandoAutorizacion]);

    useEffect(() => {
        if (!props.onShowAutorizacion) {
            setIsGenerandoAutorizacion(false);
        }
    }, [props.onShowAutorizacion]);

    const getDocAutorizacion = () => {
        props.onSetShowAutorizacion(true);
    }

    const descargarArchivo = (data) => {
        try {
            const pdfData = atob(data.file_bytes);
            const blob = new Blob([pdfData], { type: "application/pdf" });
            const downloadLink = document.createElement("a");
            downloadLink.href = 'data:application/octet-stream;base64,' + pdfData;;

            // Format the current date for the filename
            const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");
            downloadLink.download = "Autorizacion_" + currentDate + ".pdf";

            downloadLink.click();
        } catch (error) {
            console.error("Error downloading PDF:", error);
        }
    }

    const getContrato = () => {
        fetchGetContrato(props.token, (data) => {
            if (data.str_res_codigo === "000") {
                descargarArchivo(data);
            }
        }, dispatch)
    }

    const handleFileChange = (event) => {
        // Get the selected file from the file input element
        props.onFileUpload(event);
        setArchivoAutorizacion(event);       
    };

    const removeFile = () => {
        setArchivoAutorizacion('');
    }

    return (
        <div>
            
            {props.onShowAutorizacion
                ?
                <Fragment>
                    <Card>
                        <p>
                            “EL SOCIO y/o CLIENTE” como titular de la tarjeta de crédito, al usar la tarjeta, personalizar la clave, transaccional o utilizar de cualquier otra forma los servicios o funciones asociadas a la tarjeta de débito, expresa su conformidad con los términos y condiciones para la emisión y uso de la tarjeta de débito bajo, los que se contienen en las siguientes cláusulas. PRIMERA ANTECEDENTES. “LA COOPERATIVA” ha puesto a disposición de sus socios y/o clientes, la TARJETA DE DÉBITO que les permite realizar transacciones y consultas de saldos de la cuenta de ahorros que mantienen en “LA COOPERATIVA”; a través de cajeros automáticos propios de “LA COOPERATIVA”: así como, de cajeros automáticos, puntos de venta (P.O.S), medios de pago electrónicos o botones de pago de la(s) Red(s) Transaccional(es) que “LA COOPERATIVA” mantenga convenio(s). SEGUNDA. ACCESO. “EL SOCIO y/o CLIENTE” como titular de la tarjeta de crédito, al usar la tarjeta, personalizar la clave, transaccional o utilizar de cualquier otra forma los servicios o funciones asociadas a la tarjeta de débito, expresa su conformidad con los términos y condiciones para la emisión y uso de la tarjeta de débito bajo, los que se contienen en las siguientes cláusulas. “EL SOCIO y/o CLIENTE” como titular de la tarjeta de crédito, al usar la tarjeta, personalizar la clave, transaccional o utilizar de cualquier otra forma los servicios o funciones asociadas a la tarjeta de débito, expresa su conformidad con los términos y condiciones para la emisión y uso de la tarjeta de débito bajo, los que se contienen en las siguientes cláusulas. PRIMERA ANTECEDENTES. “LA COOPERATIVA” ha puesto a disposición de sus socios y/o clientes, la TARJETA DE DÉBITO que les permite realizar transacciones y consultas de saldos de la cuenta de ahorros que mantienen en “LA COOPERATIVA”; a través de cajeros automáticos propios de “LA COOPERATIVA”: así como, de cajeros automáticos, puntos de venta (P.O.S), medios de pago electrónicos o botones de pago de la(s) Red(s) Transaccional(es) que “LA COOPERATIVA” mantenga convenio(s). SEGUNDA. ACCESO. “EL SOCIO y/o CLIENTE” como titular de la tarjeta de crédito, al usar la tarjeta, personalizar la clave, transaccional o utilizar de cualquier otra forma los servicios o funciones asociadas a la tarjeta de débito, expresa su conformidad con los términos y condiciones para la emisión y uso de la tarjeta de débito bajo, los que se contienen en las siguientes cláusulas.
                        </p>
                    </Card>
                    <div className="f-row mt-4 justify-content-space-evenly">
                        <Button id="download-btn" className="btn_mg__toggler active" onClick={getContrato}><img src="Imagenes/download.svg"></img> Descargar archivo</Button>
                        <Uploader onClick={handleFileChange} onRemoveFile={removeFile}>Subir archivo</Uploader>
                    </div>
                </Fragment>

                :
                <Fragment>
                    <label>Validaciones</label>
                    {props.lst_validaciones.lst_validaciones_ok.length > 0 &&
                        <Card className={["w-100"]}>
                            {props.lst_validaciones.lst_validaciones_ok.map((validacion) => {
                                return (
                                    <div className="f-row validacion mb-3" key={validacion.str_descripcion_alerta}>
                                        <img className="btn_mg mr-3" style={{ width: "15px", height: "15px" }} src="Imagenes/statusActive.png"></img>
                                        <h3>{validacion.str_descripcion_alerta}</h3>
                                    </div>
                                );

                            })}
                        </Card>
                    }
                    {props.lst_validaciones.lst_validaciones_err.length > 0 &&
                        <Card className={["W-100 mt-4"]}>
                            {props.lst_validaciones.lst_validaciones_err.map((validacion) => {
                                return (
                                    <div className="f-row validacion mt-2" key={validacion.str_descripcion_alerta}>
                                        <img className="btn_mg mr-3" style={{ width: "15px", height: "15px" }} src="/Imagenes/statusBlocked.png"></img>
                                        <h3>{validacion.str_descripcion_alerta}</h3>
                                        {(validacion.str_nemonico === "ALERTA_SOLICITUD_TC_005" && validacion.str_estado_alerta === "False") &&
                                            <button className="btn_mg" onClick={getDocAutorizacion}>
                                                <img src="/Imagenes/right.svg"></img>
                                            </button>
                                        }
                                    </div>
                                );

                            })}
                        </Card>
                    }
                </Fragment>
                }
        </div>
    );
}

export default ValidacionesGenerales;