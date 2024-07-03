import Card from "../Common/Card";
import '../../scss/components/ValidacionesGenerales.css';
import { useState, Fragment, useEffect } from "react";
import Button from "../Common/UI/Button";
import { fetchGetContrato, fetchScore } from "../../services/RestServices";
import { useDispatch } from 'react-redux';
import Uploader from "../Common/UI/Uploader";
import { jsPDF } from "jspdf";
import { base64ToBlob, descargarArchivo, generarFechaHoy, verificarPdf, conversionBase64 } from "../../js/utiles";

const ValidacionesGenerales = (props) => {
    const dispatch = useDispatch();
    const [isGenerandoAutorizacion, setIsGenerandoAutorizacion] = useState(false);
    const [archivoAutorizacion, setArchivoAutorizacion] = useState('');
    const [isDocCargado, setIsDocCargado] = useState(false);



    //useEffect(() => {
    //    if (isGenerandoAutorizacion) {
    //        props.onAddAutorizacion(true);
    //    }
    //}, [isGenerandoAutorizacion]);

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
            // Decode base64 string to binary data
            const pdfData = atob(data.file_bytes);
            const a4WidthPt = 595.28; // A4 width in points
            const a4HeightPt = 841.89; // A4 height in points



            /*
            // Create jsPDF instance with landscape orientation and A4 dimensions
            var doc = new jsPDF('p', 'px', [a4WidthPt, a4HeightPt],false, true);

            doc.html(pdfData, {
                callback: function (doc) {
                    doc.save();
                },
                x: 10,
                y: 10
            })*/

            
            if(data.file_bytes.length > 0 && verificarPdf(data.file_bytes)) {
                const blob = base64ToBlob(data.file_bytes, 'application/pdf');
                let fechaHoy = generarFechaHoy();
                const nombreArchivo = `AprobacionConsultaBuro_${(fechaHoy)}`;
                descargarArchivo(blob, nombreArchivo, 'pdf');

            }
            

            // Create Blob from binary data
            //const blob = new Blob([pdfData], { type: "application/pdf" });

            //// Create download link
            //const downloadLink = document.createElement("a");
            //downloadLink.href = URL.createObjectURL(blob);

            //// Format the current date for the filename
            //const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");
            //downloadLink.download = "Autorizacion_" + currentDate + ".pdf";

            //// Trigger download
            //downloadLink.click();
        } catch (error) {
            console.error("Error downloading PDF:", error);
        }
    }


    function base64ToUtf8WithBom(base64String) {
        // Decode the Base64 string to Uint8Array
        const decodedArray = Uint8Array.from(atob(base64String), c => c.charCodeAt(0));

        // Create a Uint8Array for BOM (UTF-8)
        const bomArray = new Uint8Array([0xEF, 0xBB, 0xBF]);

        // Concatenate the BOM array with the decoded array
        const utf8WithBomArray = new Uint8Array(bomArray.length + decodedArray.length);
        utf8WithBomArray.set(bomArray);
        utf8WithBomArray.set(decodedArray, bomArray.length);

        // Convert Uint8Array to UTF-8 string
        const utf8WithBomString = new TextDecoder('utf-8').decode(utf8WithBomArray);

        return utf8WithBomString;
    }

    const getContrato = () => {
        
        const nombresApellidos = props.infoSocio.str_nombres + " " + props.infoSocio.str_apellido_paterno + " " + props.infoSocio.str_apellido_materno;
        fetchScore("C", props.infoSocio.cedula, nombresApellidos, "Matriz", props.datosUsuario[0].strOficial, props.datosUsuario[0].strCargo, props.token, (data) =>
        {
            descargarArchivoConsulta(data);
        }, dispatch);
    }

    const handleFileChange = async (event) => {
        //console.log("ARCHVIO, ", event.target.result)
        //console.log("ARCHIVO,", event)

        
        //setArchivoAutorizacion(event);


        /*getBase64(event, (result) => {
            setArchivoAutorizacion(result);
        });*/

        const base64 = await conversionBase64(event);
        console.log(base64.split(',')[1]);
        props.onFileUpload(base64.split(',')[1]);

    };

    /*
    const conversionBase64 = file => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            }

            fileReader.onerror = (error) => {
                reject(error);
            }
        })
    }*/


    const removeFile = () => {
        setArchivoAutorizacion('');
        setIsDocCargado(false);
    }

    /*
    useEffect(() => {
        if (archivoAutorizacion !== "" && !isDocCargado) {
            console.log(archivoAutorizacion?.split(',')[1]);
            let val = archivoAutorizacion?.split(',')[1];
            //props.archivoPdf(val);
            props.setDocumento(val)
            setArchivoAutorizacion(val);       
            setIsDocCargado(true)

        }
    }, [archivoAutorizacion, isDocCargado])*/

    return (
        <div className="f-col justify-content-center">
            
            {props.onShowAutorizacion
                ?
                <Fragment>
                    <Card className='f col mt-4'>
                        <p>
                            “EL SOCIO y/o CLIENTE” como titular de la tarjeta de crédito, al usar la tarjeta, personalizar la clave, transaccional o utilizar de cualquier otra forma los servicios o funciones asociadas a la tarjeta de débito, expresa su conformidad con los términos y condiciones para la emisión y uso de la tarjeta de débito bajo, los que se contienen en las siguientes cláusulas. PRIMERA ANTECEDENTES. “LA COOPERATIVA” ha puesto a disposición de sus socios y/o clientes, la TARJETA DE DÉBITO que les permite realizar transacciones y consultas de saldos de la cuenta de ahorros que mantienen en “LA COOPERATIVA”; a través de cajeros automáticos propios de “LA COOPERATIVA”: así como, de cajeros automáticos, puntos de venta (P.O.S), medios de pago electrónicos o botones de pago de la(s) Red(s) Transaccional(es) que “LA COOPERATIVA” mantenga convenio(s). SEGUNDA. ACCESO. “EL SOCIO y/o CLIENTE” como titular de la tarjeta de crédito, al usar la tarjeta, personalizar la clave, transaccional o utilizar de cualquier otra forma los servicios o funciones asociadas a la tarjeta de débito, expresa su conformidad con los términos y condiciones para la emisión y uso de la tarjeta de débito bajo, los que se contienen en las siguientes cláusulas. “EL SOCIO y/o CLIENTE” como titular de la tarjeta de crédito, al usar la tarjeta, personalizar la clave, transaccional o utilizar de cualquier otra forma los servicios o funciones asociadas a la tarjeta de débito, expresa su conformidad con los términos y condiciones para la emisión y uso de la tarjeta de débito bajo, los que se contienen en las siguientes cláusulas. PRIMERA ANTECEDENTES. “LA COOPERATIVA” ha puesto a disposición de sus socios y/o clientes, la TARJETA DE DÉBITO que les permite realizar transacciones y consultas de saldos de la cuenta de ahorros que mantienen en “LA COOPERATIVA”; a través de cajeros automáticos propios de “LA COOPERATIVA”: así como, de cajeros automáticos, puntos de venta (P.O.S), medios de pago electrónicos o botones de pago de la(s) Red(s) Transaccional(es) que “LA COOPERATIVA” mantenga convenio(s). SEGUNDA. ACCESO. “EL SOCIO y/o CLIENTE” como titular de la tarjeta de crédito, al usar la tarjeta, personalizar la clave, transaccional o utilizar de cualquier otra forma los servicios o funciones asociadas a la tarjeta de débito, expresa su conformidad con los términos y condiciones para la emisión y uso de la tarjeta de débito bajo, los que se contienen en las siguientes cláusulas.
                        </p>
                    </Card>
                    <div className="f-row mt-4 justify-content-space-evenly">
                        <Button className="btn_mg__toggler active" onClick={getContrato}><img src="Imagenes/download.svg"></img> Descargar archivo</Button>
                        <Uploader onClick={handleFileChange} onRemoveFile={removeFile}>Subir archivo</Uploader>

                    </div>
                    {/*<div>*/}
                    {/*    <Button className={["btn_mg btn_mg__primary mt-2"]} disabled={archivoAutorizacion !== '' ? false : true} onClick={props.EnvioDoc}>Subir archivo</Button>*/}
                    {/*</div>*/}
                </Fragment>

                :
                <div className="f-col">
                    <h2>Validaciones</h2>

                    {props.lst_validaciones && props.lst_validaciones?.lst_validaciones_ok?.length > 0 &&
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
                    {props.lst_validaciones && props.lst_validaciones?.lst_validaciones_err?.length > 0 &&
                        <Card className={[`W-100 ${props.lst_validaciones?.lst_validaciones_ok?.length !== 0 ? 'mt-4' : ''}`]}>
                            {props.lst_validaciones.lst_validaciones_err.map((validacion) => {
                                return (
                                    <div className="f-row validacion mt-2" key={validacion.str_descripcion_alerta}>
                                        <img className="btn_mg mr-3" style={{ width: "15px", height: "15px" }} src="/Imagenes/statusBlocked.png"></img>
                                        <h3>{validacion.str_descripcion_alerta}</h3>
                                        {(validacion.str_nemonico === "ALERTA_SOLICITUD_TC_090" && validacion.str_estado_alerta === "False") &&
                                            <button className="btn_mg_icons" onClick={getDocAutorizacion}>
                                                <img src="/Imagenes/right.svg"></img>
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