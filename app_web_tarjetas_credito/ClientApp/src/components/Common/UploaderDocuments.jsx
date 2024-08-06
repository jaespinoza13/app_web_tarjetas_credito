import { Fragment, createRef, useEffect, useRef, useState } from 'react';
import '../../css/Components/UploaderDocuments.css';
import Input from './UI/Input';
import Modal from './Modal/Modal';
import { fetchCrearSeparadoresAxentria, fetchAddDocumentosAxentria, fetchGetDocumentosAxentria, fetchDescargarDocumentoAxentria } from "../../services/RestServices";
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { base64ToBlob, verificarPdf, descargarArchivo, conversionBase64 } from '../../js/utiles';

const UploadDocumentos = (props) => {

    const navigate = useHistory();
    const cabeceraTabla = [{ id: 0, texto: "Separador" }, { id: 1, texto: "Publicar" }, { id: 2, texto: "Actor" }, { id: 3, texto: "Ord" },
    { id: 4, texto: "Grupo Documental" }, { id: 5, texto: "Propietario Documentación" }, { id: 6, texto: "Abrir archivo" },
    { id: 7, texto: "Usuario carga" }, { id: 8, texto: "Fecha subida" }, { id: 9, texto: "Version" }, { id: 10, texto: "Ver" }, { id: 11, texto: "Descargar" }]

    //Principales arreglos
    const [tablaContenido, setTablaContenido] = useState([]);
    const [documentosSolicitudBusqueda, setDocumentosSolicitudBusqueda] = useState([]);
    const [documentosSolicitudCruce, setDocumentosSolicitudCruce] = useState([]);



    const dispatch = useDispatch();
    const inputCargaRef = createRef(null);
    const contadorPublicacion = useRef(0);
    const [base64SeparadorGenerado, setBase64SeparadorGenerado] = useState("");
    const [descargaDocumento, setDescargaDocumento] = useState("");
    const [nombreDocumento, setNombreDocumento] = useState("");
    const [lstArchivosParaPublicar, setLstArchivosParaPublicar] = useState([]);

    const visualizarArchivo = useRef(false);


    const [totalRegistros, setTotalRegistros] = useState(0);

    //Check para seleccionar si tiene o no separadores
    const [isSelectAllSeparador, setIsSelectAllSeparador] = useState(false);
    const [separadorCheckBox, setSeparadorCheckBox] = useState([]);

    //Check para publicacion de archivos
    const [isSelectAllPublicar, setIsSelectAllPublicar] = useState(false);
    const [publicadorCheckBox, setPublicadorCheckBox] = useState([]);


    //Propiedades para modal para descargar Separadores
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSelectAllDocumental, setIsSelectAllDocumental] = useState(false);
    const [documentalCheckBox, setDocumentalheckBox] = useState([]);

    // Activacion modal para busqueda de documentos
    const [isModalBusqVisible, setIsModalBusqVisible] = useState(false);


    //Control de archivos subidos
    //const [controlArchivosSubidosOK, setControlArchivosSubidosOK] = useState([]);
    const controlArchivosSubidosOK = useRef([]);
    const controlArchivosSubidosErr = useState([]);
    const controlTerminaSubirDocs = useRef(false);

    //Input para modal de busqueda
    const [inputSolicitud, setInputSolicitud] = useState("");


    const resetCargarArchivos = () => {
        //console.log("RESETEAR")
        //console.log(controlArchivosSubidosOK)

        setIsSelectAllSeparador(false);
        setIsSelectAllPublicar(false);
        setSeparadorCheckBox([]);
        setPublicadorCheckBox([]);
        controlArchivosSubidosOK.current = []
        controlArchivosSubidosErr.current = []
        //setLstArchivosParaPublicar([]);
        //contadorPublicacion.current = 0;
        //console.log(props.contenido)
        //console.log(tablaContenido)
        //console.log(tablaContenido === props.contenido)
        let resultaSeparadores = structuredClone(props.contenido)
        setTablaContenido([...resultaSeparadores])

    }

    const generarSeparadores = () => {

        let resum = [];
        documentalCheckBox.forEach(element => {
            let resultadoEscoge = props.grupoDocumental.find(grupo => grupo.int_id_separador === element);
            resum = [...resum, resultadoEscoge.str_nombre_separador];
        });

        fetchCrearSeparadoresAxentria(resum, props.token, (data) => {
            setBase64SeparadorGenerado(data.separadores);
        }, dispatch);
    }

    useEffect(() => {
        if (base64SeparadorGenerado !== "" && verificarPdf(base64SeparadorGenerado)) {
            const blob = base64ToBlob(base64SeparadorGenerado, 'application/pdf');
            descargarArchivo(blob, "Separadores", 'pdf', false);
            setBase64SeparadorGenerado("");
        }
    }, [base64SeparadorGenerado])

    useEffect(() => {
        if (descargaDocumento !== "" && verificarPdf(descargaDocumento)) {
            const blob = base64ToBlob(descargaDocumento, 'application/pdf');
            descargarArchivo(blob, nombreDocumento, 'pdf', visualizarArchivo.current);
            visualizarArchivo.current = false;
            setDescargaDocumento("");
        }
    }, [descargaDocumento])


    const descargarDocAxentriaHandler = (IdDocDescargar, requiereVisualizar) => {

        let busquedaArchivo = null;
        if (documentosSolicitudBusqueda.length > 0) {
            busquedaArchivo = documentosSolicitudBusqueda.find(document => document.int_id_doc === IdDocDescargar);
        } else if (documentosSolicitudCruce.length > 0) {
            busquedaArchivo = documentosSolicitudCruce.find(document => document.int_id_doc === IdDocDescargar);
        }

        //Control si se encuentra archivo cargado, permite descargar 
        if (busquedaArchivo?.str_nombre_doc) {
            setNombreDocumento(busquedaArchivo.str_nombre_doc)

            fetchDescargarDocumentoAxentria(IdDocDescargar, props.token, (data) => {
                if (requiereVisualizar) visualizarArchivo.current = true;
                setDescargaDocumento(data.file_bytes);
            }, dispatch);
        }
    }



    const openModalSeparadores = () => {
        setIsModalVisible(true);
    }

    const hideModalSeparadores = () => {
        setIsModalVisible(false);
    }

    const openModalBusqueda = () => {
        setIsModalBusqVisible(true);
    }

    const hideModalBusqueda = () => {
        setIsModalBusqVisible(false);
    }


    const seleccionMultipleSeparador = (e) => {
        toggleSelectAllSeparador();
        setIsSelectAllSeparador(!isSelectAllSeparador);
    }

    const toggleSelectAllSeparador = () => {
        setIsSelectAllSeparador(!isSelectAllSeparador);
        if (!isSelectAllSeparador) {
            const resultado = tablaContenido.map((doc, indexOrden) => {
                return doc.int_id_separador
            }).flat();
            setSeparadorCheckBox(resultado);
        } else {
            setSeparadorCheckBox([]);
        }
    };

    const ckeckSelector = (valor) => {

        if (separadorCheckBox.includes(valor)) {
            setSeparadorCheckBox(separadorCheckBox.filter(fila => fila !== valor));

        } else {
            setSeparadorCheckBox([...separadorCheckBox, valor]);
        }
        //Deseleccionar todas las opciones
        if (isSelectAllSeparador && separadorCheckBox.length !== totalRegistros) {
            setIsSelectAllSeparador(false);
        }



    }
    useEffect(() => {
        setIsSelectAllSeparador(separadorCheckBox.length === totalRegistros && separadorCheckBox.length !== 0);
    }, [separadorCheckBox]);



    ///// SECCION PARA SELECCIONAR TODOS LOS ARCHIVOS A PUBLICARSE

    const seleccionMultiplePublicador = (e) => {
        toggleSelectAllPublicador();
        setIsSelectAllPublicar(!isSelectAllPublicar);
    }

    const toggleSelectAllPublicador = () => {
        setIsSelectAllPublicar(!isSelectAllPublicar);
        if (!isSelectAllPublicar) {
            const resultado = tablaContenido.map((doc, indexOrden) => {
                return doc.int_id_separador
            }).flat();
            setPublicadorCheckBox(resultado);
        } else {
            setPublicadorCheckBox([]);
        }
    };


    const ckeckPublicador = (valor) => {

        if (publicadorCheckBox.includes(valor)) {
            setPublicadorCheckBox(publicadorCheckBox.filter(fila => fila !== valor));
        } else {
            setPublicadorCheckBox([...publicadorCheckBox, valor]);
        }
        //Deseleccionar todas las opciones
        if (isSelectAllPublicar && publicadorCheckBox.length !== totalRegistros) {
            setIsSelectAllPublicar(false);
        }
    }

    useEffect(() => {
        setIsSelectAllPublicar(publicadorCheckBox.length === totalRegistros && publicadorCheckBox.length !== 0);
    }, [publicadorCheckBox]);

    ///// FIN SECCION PARA SELECCIONAR TODOS LOS ARCHIVOS A PUBLICARSE


    ///// SECCION MODAL PARA DESCARGAR SEPARADORES - DOCUMENTAL
    const seleccionMultipleDocumental = (e) => {
        toggleSelectAllDocumental();
        setIsSelectAllDocumental(!isSelectAllDocumental);
    }

    const toggleSelectAllDocumental = () => {
        setIsSelectAllDocumental(!isSelectAllDocumental);
        if (!isSelectAllDocumental) {
            const resultado = tablaContenido.map((doc, indexOrden) => {
                return doc.int_id_separador
            }).flat();
            setDocumentalheckBox(resultado);
        } else {
            setDocumentalheckBox([]);
        }
    };


    const ckeckDocumental = (valor) => {

        if (documentalCheckBox.includes(valor)) {
            setDocumentalheckBox(documentalCheckBox.filter(fila => fila !== valor));
        } else {
            setDocumentalheckBox([...documentalCheckBox, valor]);
        }
        //Deseleccionar todas las opciones
        if (isSelectAllDocumental && documentalCheckBox.length !== totalRegistros) {
            setIsSelectAllDocumental(false);
        }
    }


    useEffect(() => {
        setIsSelectAllDocumental(documentalCheckBox.length === totalRegistros && documentalCheckBox.length !== 0);
    }, [documentalCheckBox]);

    ///// FIN SECCION MODAL PARA DESCARGAR SEPARADORES - DOCUMENTAL


    //////SEPARADORES
    const handleUpload = (event) => {
        inputCargaRef.current.click();

    }

    //Inicializador
    useEffect(() => {
        const conteoRegistros = props.contenido.length;
        //console.log("TOTAL REG ",conteoRegistros)
        setTotalRegistros(conteoRegistros);

        /* EN caso se requiera solo seleccionar las filas q tenga cargado el archivo
        let checkDocCargados = filasDocsCargados();
        if(checkDocCargados.length > 0){
            setTotalRegistros(conteoRegistros);
        }
        */

        if (props.solicitud) {
            setInputSolicitud(props.solicitud)
            fetchGetDocumentosAxentria(props.solicitud, props.token, (data) => {
                setDocumentosSolicitudCruce(data.lst_documentos)
            }, dispatch);
        }



    }, [])

    useEffect(() => {

        if (documentosSolicitudCruce.length > 0 && props.contenido) {

            //Se realiza una clonacion del objeto para no modificar el original
            let resultaSeparadores = structuredClone(props.contenido)
            documentosSolicitudCruce.forEach(documento => {
                let grupoSeparadorIndex = resultaSeparadores.findIndex(grupoDoc => grupoDoc.str_separador === documento.str_grupo);
                resultaSeparadores[grupoSeparadorIndex].str_login_carga = documento.str_usuario_carga;
                resultaSeparadores[grupoSeparadorIndex].dtt_fecha_sube = documento.dtt_ult_modificacion;
                resultaSeparadores[grupoSeparadorIndex].str_version = documento.str_version_doc;
                resultaSeparadores[grupoSeparadorIndex].int_id_doc_relacionado = documento.int_id_doc;
            })
            setTablaContenido([...resultaSeparadores]);
        } else if (documentosSolicitudCruce.length === 0 && props.contenido) {
            setTablaContenido([...props.contenido]);
        }
    }, [documentosSolicitudCruce, props.contenido])

    const [validadorCambio, setValidadorCambio] = useState(false);


    function filasDocsCargados() {
        let checkDocCargados = [];
        tablaContenido.forEach(element => {
            if (element.str_ruta_arc !== "") checkDocCargados = [...checkDocCargados, element.int_id_separador];
        })
        return checkDocCargados;
    }

    useEffect(() => {
        if (validadorCambio) {
            let checkDocCargados = filasDocsCargados();
            setPublicadorCheckBox(checkDocCargados)
            setSeparadorCheckBox(checkDocCargados)
            setValidadorCambio(false);
        }

    }, [validadorCambio])

    const [archivosCargados, setCarchivosCargados] = useState([]);

    const cargarArchivosHandler = (event) => {
        //REALIZAR LA LIMPIEZA DE TABLA PARA EVITAR ERRORES EN LOS CHECK
        //resetCargarArchivos();

        let archivosLimpieza = [...event.target.files];
        archivosLimpieza = archivosLimpieza.filter(doc => doc.type === "application/pdf")

        let arregloArchivos = [];
        if (archivosLimpieza.length > 0) {
            archivosLimpieza.forEach(element => {
                let indexArchivo;
                indexArchivo = tablaContenido.findIndex(fila => fila.str_nombre_separador === element.name.split('.')[0])
                tablaContenido[indexArchivo].str_ruta_arc = element.webkitRelativePath;
                tablaContenido[indexArchivo].str_login_carga = props.datosUsuario[0].strUserOficial;
                arregloArchivos.push({ id_separador: tablaContenido[indexArchivo].int_id_separador, archivo: element });
            })

            //Se actualiza los arreglos haciendo un filtrado de archivos que se han cargado hasta el momento
            setValidadorCambio(true);
            setTablaContenido([...tablaContenido]);
            setCarchivosCargados([...arregloArchivos]);
        }
        //Se obtiene el arreglo final donde constan los documentos que estan cargados.
        setLstArchivosParaPublicar(tablaContenido.filter(docum => docum.str_ruta_arc !== ""));
    }


    const convertorArchivo = async (archivoSub) => {
        let base64Archivo = await conversionBase64(archivoSub);
        return base64Archivo.split(',')[1];
    }

    const publicarDocumentos = async () => {

        //Obtener secuencia de publicacion
        let CheckPublidadorId = publicadorCheckBox[contadorPublicacion.current];
        let archivoPub = lstArchivosParaPublicar.filter(documento => documento.int_id_separador === CheckPublidadorId)[0];

        if (contadorPublicacion.current === publicadorCheckBox.length && publicadorCheckBox.length !== 0) {
            controlTerminaSubirDocs.current = true;

            if (contadorPublicacion.current === controlArchivosSubidosOK.current.length && controlArchivosSubidosOK.current.length > 0 && controlTerminaSubirDocs.current === true) {

                let mensaje_ok = '';
                controlArchivosSubidosOK.current.map(doc => {
                    return (
                        mensaje_ok += doc.documento.toString() + '\n'
                    )
                });
                let mensaje = 'SE SUBIERON CORRECTAMENTE LOS ARCHIVOS';

                window.alert(mensaje);

                //Se resetea
                contadorPublicacion.current = 0;
                controlTerminaSubirDocs.current = false;

                props.seleccionToogleSolicitud(1);

            } else if (controlArchivosSubidosErr.current?.length > 0 && controlTerminaSubirDocs.current === true) {

                let mensaje_error = '';
                controlArchivosSubidosOK.current.map(error => {
                    return (
                        mensaje_error += error.documento.toString() + '\n'
                    )
                })
                let mensaje = 'LOS SIGUIENTES ARCHIVOS TUVIERON ERROR AL SUBIRLOS: \n' + mensaje_error;

                console.log("Error al cargar lo siguientes documentos ", mensaje);
                window.alert(mensaje);

                //Se resetea
                contadorPublicacion.current = 0;
                controlTerminaSubirDocs.current = false;
            }
            else {
                let mensaje = 'Error en la publicación del archivo. Consulte con el adminitrador: \n';
                console.log("mensaje ", mensaje)
                window.alert(mensaje);
            }

            //resetCargarArchivos();
            return;
        }

        if (contadorPublicacion.current < lstArchivosParaPublicar.length && CheckPublidadorId !== undefined && archivoPub !== undefined) {
            let validarSeparador = separadorCheckBox.includes(archivoPub.int_id_separador);
            let validarPublicacion = publicadorCheckBox.includes(archivoPub.int_id_separador);

            if (validarPublicacion) {
                //Obtener el archivo en base64
                let busquedaArchivo = archivosCargados.find(arch => arch.id_separador === archivoPub.int_id_separador);
                convertorArchivo(busquedaArchivo.archivo).then(
                    archivoABase64 => {
                        let versionSubirNuevo = archivoPub?.str_version ? (Number(archivoPub?.str_version) + 1) : 1;
                        publicarAxentriaHandler(validarSeparador, versionSubirNuevo, archivoPub.str_ruta_ar, archivoPub.str_nombre_separador, archivoPub.str_separador, archivoABase64).then(data => {

                            if (data?.str_res_codigo === "000") {
                                let archivoOK = [{
                                    documento: archivoPub.str_separador,
                                    codigo: '',
                                    informacionAdicional: ''
                                }]
                                let lstOk = [...controlArchivosSubidosOK.current, ...archivoOK]
                                controlArchivosSubidosOK.current = lstOk;
                            }
                            else if (data?.str_res_codigo) {

                                let archivoErr = {
                                    documento: archivoPub?.str_separador,
                                    codigo: data?.str_res_codigo,
                                    informacionAdicional: data?.str_res_info_adicional
                                }
                                let lstErr = [...controlArchivosSubidosOK.current, ...archivoErr]
                                console.log("lstErr ", lstErr)
                                controlArchivosSubidosOK.current = lstErr;
                            }

                            contadorPublicacion.current = contadorPublicacion.current + 1;
                            publicarDocumentos();
                        })

                    }
                )
            }
        } else {
            contadorPublicacion.current = 0;
            return;
        }
    }

    const publicarAxentriaHandler = async (validarSeparador, version, rutaArchivo, nombreSeparador, grupoSeparador, archivoABase64) => {
        let respuesta = null;
        await fetchAddDocumentosAxentria(props.solicitud, version, validarSeparador, rutaArchivo, nombreSeparador, props.cedulaSocio, props.datosUsuario[0].strUserOficial,
            props.datosSocio?.str_nombres + ' ' + props.datosSocio?.str_apellido_paterno + ' ' + props.datosSocio?.str_apellido_materno,
            grupoSeparador, '', archivoABase64, props.token, (data) => {
                respuesta = data;
            }, dispatch);
        return respuesta;
    }


    const obtenerDocumentosAxentriaHandler = () => {
        fetchGetDocumentosAxentria(inputSolicitud, props.token, (data) => {
            setDocumentosSolicitudBusqueda(data.lst_documentos)
        }, dispatch);
    }

    return (
        <div className="content_uploader">
            <h4 className='strong mb-1'>Información General</h4>
            <div className='border_content'>
                <div className='m-2'>
                    <div style={{ display: "flex" }}>
                        <p className='normal'>SOCIO: </p>
                        <p className="negrita">{props.datosSocio?.str_nombres} {props.datosSocio?.str_apellido_paterno} {props.datosSocio?.str_apellido_materno}</p>
                    </div>

                    <section className='elements_tres_column mt-3'>

                        <div style={{ display: "flex" }}>
                            <p className='normal'>TIPO DOCUMENTO: </p>
                            <p className="negrita">CÉDULA</p>
                        </div>

                        {/*<div style={{ display: "flex" }}>*/}
                        {/*    <p className='normal'>FECHA ULT. MODIF.: </p>*/}
                        {/*    <p className="negrita">-</p>*/}
                        {/*</div>*/}

                        <div style={{ display: "flex" }}>
                            <p className='normal'>SOLICITUD NRO: </p>
                            <p className="negrita"> {props.solicitud}</p>
                        </div>

                        <div style={{ display: "flex" }}>
                            <p className='normal'>OFICIAL: </p>
                            <p className="negrita">{props.oficialSolicitud}</p>
                        </div>

                    </section>

                    <section className='elements_tres_column mt-3'>
                        <div style={{ display: "flex" }}>
                            <p className='normal'>DOCUMENTO: </p>
                            <p className="negrita">{props.cedulaSocio}</p>
                        </div>

                        <div style={{ display: "flex" }}>
                            <p className='normal'>ESTADO CALIFICACION: </p>
                            <p className="negrita">{props.calificacionRiesgo} </p>
                        </div>

                        {/*<div style={{ display: "flex" }}>*/}
                        {/*    <p className='normal'>TRAMITE NRO: </p>*/}
                        {/*    <p className="negrita"> </p>*/}
                        {/*</div>*/}


                        <div style={{ display: "flex" }}>
                            <p className='normal'>MONTO SOLICITADO: </p>
                            <p className="negrita">{`$ ${Number(props.cupoSolicitado).toLocaleString("en-US") || Number('0.00').toLocaleString("en-US")}`} </p>
                        </div>

                    </section>

                    <section className='elements_tres_column mt-3'>
                        <div style={{ display: "flex" }}>
                            <p className='normal'>OFICINA: </p>
                            <p className="negrita">{props.oficinaSolicitud}</p>
                        </div>

                        <div style={{ display: "flex" }}>
                            <p className='normal'>ESTADO DE LA SOLICITUD: </p>
                            <p className="negrita">{props.estadoSolicitud}</p>
                        </div>


                        <div style={{ display: "flex" }}>
                            <p className='normal'>ENTE APROBADOR: </p>
                            <p className="negrita">COMITE GENERAL DE CRÉDITO</p>
                        </div>

                    </section>

                    <section className='elements_tres_column mt-3'>

                        {/*<div style={{ display: "flex" }}>*/}
                        {/*    <p className='normal'>PRODUCTO </p>*/}
                        {/*    <p className="negrita">TARJETA DE CRÉDITO </p>*/}
                        {/*</div>*/}

                    </section>

                </div>
            </div>

            <div className='f-row center_text_items' style={{ width: "100%" }}>

                <div className="content_table">
                    <table className='archivos'>
                        <thead>
                            <tr>
                                {cabeceraTabla.map(header => {
                                    const valor = header.id;
                                    if (valor === 0) return (<th style={{ width: "2px" }} key={header.id}>{header.texto} <br /> <input type='checkbox' checked={isSelectAllSeparador} onChange={seleccionMultipleSeparador} /> </th>)
                                    if (valor === 1) return (<th style={{ width: "2px" }} key={header.id}>{header.texto} <br /> <input type='checkbox' checked={isSelectAllPublicar} onChange={seleccionMultiplePublicador} /> </th>)
                                    else {
                                        return (
                                            <th key={header.id}>{header.texto}</th>
                                        )
                                    }


                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {tablaContenido.map((documentacion) => {
                                let fecha = "";
                                if (documentacion?.dtt_fecha_sube) {
                                    fecha = new Date(documentacion?.dtt_fecha_sube);
                                }
                                let opciones = {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit"
                                };

                                return (
                                    <Fragment key={documentacion.int_id_separador}>
                                        <tr key={documentacion.int_id_separador}>

                                            <td style={{ width: "2px" }} >
                                                <Input disabled={false} type="checkbox" setValueHandler={() => ckeckSelector(documentacion.int_id_separador)} checked={separadorCheckBox.includes(documentacion.int_id_separador)}  ></Input>
                                            </td>

                                            <td style={{ width: "2px" }} >
                                                <Input disabled={false} type="checkbox" setValueHandler={() => ckeckPublicador(documentacion.int_id_separador)} checked={publicadorCheckBox.includes(documentacion.int_id_separador)}   ></Input>
                                            </td>

                                            <td style={{ width: "2px", justifyContent: "left" }} >
                                                {documentacion.str_actor}
                                            </td>
                                            <td style={{ width: "2%", justifyContent: "left" }} >
                                                {documentacion.str_ord}
                                            </td>
                                            <td style={{ width: "20%", justifyContent: "left" }} >
                                                {documentacion.str_separador}
                                            </td>
                                            <td style={{ width: "20%", justifyContent: "left" }} >
                                                {documentacion.str_nombre_socio}
                                            </td>
                                            <td style={{ width: "10%", wordBreak: "break-word", fontSize: "10px" }} >
                                                {documentacion.str_ruta_arc}
                                            </td>
                                            <td style={{ width: "10%", justifyContent: "left" }} >
                                                {documentacion.str_login_carga}
                                            </td>
                                            <td style={{ width: "10%", justifyContent: "left" }} >
                                                {fecha !== "" ? (fecha.toLocaleDateString('en-US', opciones)) : ""}
                                            </td>
                                            <td style={{ width: "3%", justifyContent: "left" }} >
                                                {documentacion.str_version}
                                            </td>
                                            <td style={{ width: "2%", justifyContent: "center" }} >
                                                <div className="f-row justify-content-center align-content-center">
                                                    <button className="btn_mg_icons custom-icon-button" onClick={() => descargarDocAxentriaHandler(documentacion.int_id_doc_relacionado, true)} title="Visualizar Documento">
                                                        <img className="img-icons-acciones" src="Imagenes/view.svg" alt="Visualizar Documento"></img>
                                                    </button>
                                                </div>
                                            </td>
                                            <td style={{ width: "2%", justifyContent: "left" }} >
                                                <div className="f-row justify-content-center align-content-center">
                                                    <button className="btn_mg_icons custom-icon-button" onClick={() => descargarDocAxentriaHandler(documentacion.int_id_doc_relacionado, false)} title="Descargar Documento">
                                                        <img className="img-icons-acciones" src="Imagenes/download.svg" alt="Descargar Documento"></img>
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>
                                    </Fragment>
                                )

                            })}
                        </tbody>

                    </table>
                </div>
            </div>



            <section className='mt-3 f-row'>
                <div className="f-row uploader_arc" onClick={openModalSeparadores}>
                    <div className={"btn_arch btn_arch__toggler "} >
                        <div className='f-row w-100 center_text_items'>
                            <h3 > Separadores </h3>
                            <img style={{ marginLeft: "10px" }} src="Imagenes/icons_axentria/barcode.png" alt="" />
                        </div>
                    </div>
                </div>


            </section>

            <section className='mt-2 f-row' style={{ display: "flex", alignItems: "right", justifyContent: "right" }} >
                <div style={{ marginRight: "5px" }} className=" f-row uploader_arc" onClick={handleUpload}>
                    <div className={"btn_arch btn_arch__toggler "} >
                        <div className='f-row w-100 center_text_items'>
                            <h3 > Examinar </h3>
                            <img style={{ marginLeft: "10px" }} src="Imagenes/icons_axentria/carpeta-de-búsqueda.png" alt="" />
                            <input type="file" accept={".pdf"} style={{ display: 'none' }} ref={inputCargaRef} directory="" webkitdirectory="" onChange={cargarArchivosHandler} />
                        </div>
                    </div>
                </div>

                <div style={{ marginRight: "5px" }} className="f-row uploader_arc" onClick={publicarDocumentos} >
                    <div className={"btn_arch btn_arch__toggler "} >
                        <div className='f-row w-100 center_text_items'>
                            <h3 > Publicar </h3>
                            <img style={{ marginLeft: "10px" }} src="Imagenes/icons_axentria/subir-carpeta.png" alt="" />
                        </div>
                    </div>
                </div>

                <div style={{ marginRight: "5px" }} className="f-row uploader_arc" onClick={openModalBusqueda}>
                    <div className={"btn_arch btn_arch__toggler"} >
                        <div className='f-row w-100 center_text_items'>
                            <h3 > Búsqueda </h3>
                            <img style={{ marginLeft: "10px" }} src="Imagenes/icons_axentria/carpeta-de-documentos.png" alt="" />
                        </div>
                    </div>
                </div>

                {/*<div className="f-row uploader_arc">*/}
                {/*    <div className={"btn_arch btn_arch__toggler "} >*/}
                {/*        <div className='f-row w-100 center_text_items'>*/}
                {/*            <h3 > Salir</h3>*/}
                {/*            <img style={{ marginLeft: "10px" }} src="Imagenes/close.svg" alt="" />*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

            </section>


            <Modal modalIsVisible={isModalVisible} type="lg" onCloseClick={hideModalSeparadores} onNextClick={generarSeparadores} mainText="Generar" titulo="Generar Separadores">

                <table className='archivos mt-4'>
                    <thead>
                        <tr>
                            <th style={{ width: "21px" }} > <input type='checkbox' checked={isSelectAllDocumental} onChange={seleccionMultipleDocumental} className='mr-1' /> Generar </th>
                            <th style={{ width: "5px" }}  >Actor</th>
                            <th style={{ width: "37%", justifyContent: "left" }}>Grupo Documental</th>
                            <th style={{ width: "37%", justifyContent: "left" }}>Nombre de Archivo</th>

                        </tr>
                    </thead>
                    <tbody>

                        {props.grupoDocumental.map(separador => {

                            return (
                                <tr key={separador.int_id_separador}>
                                    <td style={{ width: "21px" }} >
                                        <Input disabled={false} type="checkbox" setValueHandler={() => ckeckDocumental(separador.int_id_separador)} checked={documentalCheckBox.includes(separador.int_id_separador)}  ></Input>
                                    </td>
                                    <td style={{ width: "5px" }} >
                                        {separador.str_actor}
                                    </td>
                                    <td style={{ width: "37%", justifyContent: "left" }} >
                                        {separador.str_separador}
                                    </td>
                                    <td style={{ width: "37%", justifyContent: "left" }} >
                                        {separador.str_nombre_separador}
                                    </td>
                                </tr>

                            )

                        })}

                    </tbody>

                </table>


            </Modal>


            <Modal modalIsVisible={isModalBusqVisible} type="md" onCloseClick={hideModalBusqueda} onNextClick={obtenerDocumentosAxentriaHandler} mainText="Buscar" titulo="Buscar">

                <section className="elements_two_column mt-2 mb-2">
                    {/*<div style={{ display: "flex", alignItems: "center" }}>*/}
                    {/*    <p>IDENTIFICACION: </p>*/}
                    {/*    <Input className="w-60 ml-2" id='identificacion' name='identificacion' esRequerido={true} type="text" placeholder="1150214375"></Input>*/}
                    {/*</div>*/}
                    {/*<div style={{ display: "flex", alignItems: "center" }}>*/}
                    {/*    <p>ENTE: </p>*/}
                    {/*    <Input className="w-60 ml-2" id='ente' name='ente' esRequerido={true} type="text" placeholder="455428"></Input>*/}
                    {/*</div>*/}

                    <div style={{ display: "flex", alignItems: "center" }}>
                        <p style={{ marginRight: "42px" }}>SOLICITUD: </p>
                        <Input className="w-60" id='flujo' name='flujo' esRequerido={true} type="number" value={inputSolicitud} setValueHandler={(e) => setInputSolicitud(e)} />
                    </div>

                </section>

                <div style={{ height: "370px", overflowY: 'auto' }}>

                    <table className='archivos mt-4'>
                        <thead>
                            <tr>
                                <th>Nombre Archivo</th>
                                <th >Usuario Carga</th>
                                <th  >Version</th>
                                <th  >Ult. Modificación</th>
                                <th >Ver Documento</th>

                            </tr>
                        </thead>
                        <tbody>

                            {documentosSolicitudBusqueda.length > 0 &&

                                documentosSolicitudBusqueda.map(doc => {
                                    const fecha = new Date(doc?.dtt_ult_modificacion);
                                    const opciones = {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit"
                                    };
                                    return (
                                        <tr key={doc.int_id_doc}>
                                            <td style={{ justifyContent: "left", width: "30%", fontSize: "14px" }} >
                                                {doc.str_nombre_doc}
                                            </td>
                                            <td style={{ justifyContent: "left" }} >
                                                {doc.str_usuario_carga}
                                            </td>
                                            <td style={{ justifyContent: "left" }} >
                                                {doc.str_version_doc}
                                            </td>
                                            <td style={{ justifyContent: "left" }} >
                                                {(fecha.toLocaleDateString('en-US', opciones))}
                                            </td>
                                            <td style={{ justifyContent: "left" }} >
                                                <div className="f-row justify-content-center align-content-center">
                                                    <button className="btn_mg_icons custom-icon-button" onClick={() => descargarDocAxentriaHandler(doc.int_id_doc, false)} title="Visualizar Documento">
                                                        <img className="img-icons-acciones" src="Imagenes/view.svg" alt="Visualizar Documento"></img>
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>
                                    )
                                })
                            }

                        </tbody>
                    </table>
                </div>
            </Modal>


        </div>
    )
}



export default UploadDocumentos;