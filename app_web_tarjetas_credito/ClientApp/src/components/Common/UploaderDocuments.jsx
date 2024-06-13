import { Fragment, createRef, useEffect, useState } from 'react';
import '../../css/Components/UploaderDocuments.css';
import Input from './UI/Input';
import Modal from './Modal/Modal';
import { fetchCrearSeparadoresAxentria } from "../../services/RestServices";
import { useDispatch } from 'react-redux';
import { element } from 'prop-types';
import { base64ToBlob, verificarPdf, descargarArchivo } from '../../js/utiles';

const UploadDocumentos = (props) => {


    const cabeceraTabla = [{ id: 0, texto: "Separador" }, { id: 1, texto: "Publicar" }, { id: 2, texto: "Actor" }, { id: 3, texto: "Ord" },
    { id: 4, texto: "Grupo Documental" }, { id: 5, texto: "Propietario Documentación" }, { id: 6, texto: "Abrir archivo" },
    { id: 7, texto: "Usuario carga" }, { id: 8, texto: "Fecha subida" }, { id: 9, texto: "Version" }, { id: 10, texto: "Ver" }, { id: 11, texto: "Descargar" }]

    const [tablaContenido, setTablaContenido] = useState([]);
    const dispatch = useDispatch();
    const [generarSeparador, setGenerarSeparador] = useState([]);

    /*
    const [tablaContenido, setTablaContenido] = useState([
        { int_id_separador: 0, str_actor: "T", str_ord: "", str_separador: "SOLICITUD DE CREDITO", str_ruta_arc: "VASQUEZ DANNY", ruta: "", str_login_carga: "", dtt_fecha_sube: "", str_version: "", str_nombre_separador: "1_SOLICITUD_DE_CREDITO" },
        { int_id_separador: 1, str_actor: "G", str_ord: "1", str_separador: "DOCUMENTOS DE IDENTIDAD", str_ruta_arc: "VASQUEZ DANNY", ruta: "", str_login_carga: "", dtt_fecha_sube: "", str_version: "", str_nombre_separador: "3_DOCUMENTOS_DE_IDENTIDAD" },
        { int_id_separador: 2, str_actor: "T", str_ord: "", str_separador: "SUSTENTO DE CAPACIDAD DE PAGO", str_ruta_arc: "VASQUEZ DANNY", ruta: "", str_login_carga: "", dtt_fecha_sube: "", str_version: "", str_nombre_separador: "7_SUSTENTO_DE_CAPACIDAD_DE_PAGO" },
    ])
    /*
    const grupoDocumental = [
        { id: 0, actor: "T", ord: "", grupo_documental: "SOLICITUD DE CREDITO", nombre_archivo: "1_SOLICITUD_DE_CREDITO" },
        { id: 1, actor: "T", ord: "", grupo_documental: "DOCUMENTOS DE IDENTIDAD", nombre_archivo: "3_DOCUMENTOS_DE_IDENTIDAD" },
        { id: 2, actor: "T", ord: "", grupo_documental: "SUSTENTO DE CAPACIDAD DE PAGO", nombre_archivo: "7_SUSTENTO_DE_CAPACIDAD_DE_PAGO" },
    ]
    */

   /*
    useEffect(() => {
        //if (props.contenido > 0) {

        /*
        //TODO: eliminar el id no corresponde
        let result = props.contenido;

            result.forEach((elem, index) => {
                result[index].int_id_separador = index;
            })
            

        
        //}
    }, [])
    */
    const separadoresAx = ["1_SOLICITUD_DE_CREDITO", "2_EXCEPCIONES"]
    const [base64SeparadorGenerado, setBase64SeparadorGenerado] = useState("");

    const generarSeparadores = () => {

        let resum = [];
        documentalCheckBox.forEach(element => {
            let resultadoEscoge = props.grupoDocumental.find(grupo => grupo.int_id_separador === element);
            resum = [...resum, resultadoEscoge.str_nombre_separador];
        });

        fetchCrearSeparadoresAxentria(resum, props.token, (data) => {
            console.log("SEPARADORES, ", data.separadores)
            setBase64SeparadorGenerado(data.separadores);
        }, dispatch);
    }


    useEffect(() => {
        if (base64SeparadorGenerado !== "" && verificarPdf(base64SeparadorGenerado)) {
            const blob = base64ToBlob(base64SeparadorGenerado, 'application/pdf');
            descargarArchivo(blob, "Separadores", 'pdf');
        }

        /*
        if (data.file_bytes.length > 0 && verificarPdf(data.file_bytes)) {
            const blob = base64ToBlob(data.file_bytes, 'application/pdf');
            let fechaHoy = generarFechaHoy();
            const nombreArchivo = `AprobacionConsultaBuro_${(fechaHoy)}`;
            descargarArchivo(blob, nombreArchivo, 'pdf');

        }*/

    }, [base64SeparadorGenerado])


    const [docsBase64, setDocsBase64] = useState("");
    const [totalRegistros, setTotalRegistros] = useState(0);
    const [isSelectAllSeparador, setIsSelectAllSeparador] = useState(false);
    const [separadorCheckBox, setSeparadorCheckBox] = useState([]);

    const [isSelectAllPublicar, setIsSelectAllPublicar] = useState(false);
    const [publicadorCheckBox, setPublicadorCheckBox] = useState([]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalBusqVisible, setIsModalBusqVisible] = useState(false);
    const [isSelectAllDocumental, setIsSelectAllDocumental] = useState(false);
    const [documentalCheckBox, setDocumentalheckBox] = useState([]);

    const inputCargaRef = createRef(null);


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
            console.log("RESULT SEPAR ", resultado)
            setSeparadorCheckBox(resultado);
        } else {
            setSeparadorCheckBox([]);
        }
    };

    const ckeckSelector = (valor) => {

        if (separadorCheckBox.includes(valor)) {
            //separadorCheckBox.filter(fila => console.log(fila,valor))
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
        //console.log(`${separadorCheckBox} -->  ${separadorCheckBox.length} `)
        console.log("TOTAL R", totalRegistros)
        console.log("Separador Check ", separadorCheckBox.length)
        setIsSelectAllSeparador(separadorCheckBox.length === totalRegistros && separadorCheckBox.length !== 0);
    }, [separadorCheckBox]);



    ///////////

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
        //console.log(`${separadorCheckBox} -->  ${separadorCheckBox.length} `)
        //console.log("TOTAL R", totalRegistros)
        //console.log("Publicador Check ", publicadorCheckBox)
        setIsSelectAllPublicar(publicadorCheckBox.length === totalRegistros && publicadorCheckBox.length !== 0);
    }, [publicadorCheckBox]);


    ///// DOCUMENTAL
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



    //////SEPARADORES

    const [filename, setFilename] = useState();

    const handleUpload = (event) => {
        //console.log("Arch", event)
        inputCargaRef.current.click();

    }

    useEffect(() => {
        if (docsBase64 !== "") {
            console.log(docsBase64?.split(',')[1]);
        }

    }, [docsBase64])


    useEffect(() => {
        const conteoRegistros = props.contenido.length;
        //console.log("TOTAL REG ",conteoRegistros)
        setTotalRegistros(conteoRegistros);
        setTablaContenido(props.contenido);
        /* EN caso se requiera solo seleccionar las filas q tenga cargado el archivo
        let checkDocCargados = filasDocsCargados();
        if(checkDocCargados.length > 0){
            setTotalRegistros(conteoRegistros);
        }
        */

    }, [])


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
        }

    }, [validadorCambio])


    const cargarArchivosHandler = (event) => {

        let archivosLimpieza = [...event.target.files];
        archivosLimpieza = archivosLimpieza.filter(doc => doc.type === "application/pdf")
        //console.log(archivosLimpieza)

        if (archivosLimpieza.length > 0) {

            archivosLimpieza.forEach(element => {
                let indexArchivo;
                indexArchivo = tablaContenido.findIndex(fila => fila.str_nombre_separador === element.name.split('.')[0])
                //console.log(indexArchivo);
                tablaContenido[indexArchivo].str_ruta_arc = element.webkitRelativePath;
                tablaContenido[indexArchivo].str_login_carga = "dvvasquez";
            })
            setValidadorCambio(true);
            setTablaContenido([...tablaContenido]);
        }

    }




    return (
        <div className="content_uploader">
            <h4 className='strong mb-1'>Información General</h4>
            <div className='border_content'>
                <div className='m-2'>
                    <div style={{ display: "flex" }}>
                        <p className='normal'>SOCIO: </p>
                        <p className="negrita">Danny Vasquez</p>
                    </div>

                    <section className='elements_tres_column mt-3'>

                        <div style={{ display: "flex" }}>
                            <p className='normal'>TIPO DOCUMENTO: </p>
                            <p className="negrita">CÉDULA</p>
                        </div>

                        <div style={{ display: "flex" }}>
                            <p className='normal'>FECHA ULT. MODIF.: </p>
                            <p className="negrita">05/20/2023</p>
                        </div>

                        <div style={{ display: "flex" }}>
                            <p className='normal'>SOLICITUD NRO: </p>
                            <p className="negrita"> 188888</p>
                        </div>

                    </section>

                    <section className='elements_tres_column mt-3'>
                        <div style={{ display: "flex" }}>
                            <p className='normal'>DOCUMENTO: </p>
                            <p className="negrita">1150214983</p>
                        </div>

                        <div style={{ display: "flex" }}>
                            <p className='normal'>ESTADO CALIFICACION: </p>
                            <p className="negrita"> </p>
                        </div>

                        <div style={{ display: "flex" }}>
                            <p className='normal'>TRAMITE NRO: </p>
                            <p className="negrita">0</p>
                        </div>

                    </section>

                    <section className='elements_tres_column mt-3'>
                        <div style={{ display: "flex" }}>
                            <p className='normal'>OFICINA: </p>
                            <p className="negrita">Matriz</p>
                        </div>

                        <div style={{ display: "flex" }}>
                            <p className='normal'>ESTADO DE LA SOLICITUD: </p>
                            <p className="negrita">POR DIGITAR </p>
                        </div>

                        <div style={{ display: "flex" }}>
                            <p className='normal'>MONTO: </p>
                            <p className="negrita">100,000</p>
                        </div>

                    </section>

                    <section className='elements_tres_column mt-3'>
                        <div style={{ display: "flex" }}>
                            <p className='normal'>OFICIAL: </p>
                            <p className="negrita">xnojeda1</p>
                        </div>

                        <div style={{ display: "flex" }}>
                            <p className='normal'>PRODUCTO CRÉDITO: </p>
                            <p className="negrita">CREDI PYMES </p>
                        </div>

                        <div style={{ display: "flex" }}>
                            <p className='normal'>ENTE APROBADOR: </p>
                            <p className="negrita">COMITE GENERAL DE CRÉDITO</p>
                        </div>
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
                                            <td style={{ width: "10%", justifyContent: "left" }} >
                                                <div style={{ whiteSpace: "nowrap" }}>{documentacion.str_ruta_arc}</div>
                                            </td>
                                            <td style={{ width: "10%", justifyContent: "left" }} >
                                                {documentacion.str_login_carga}
                                            </td>
                                            <td style={{ width: "10%", justifyContent: "left" }} >
                                                {documentacion.dtt_fecha_sube}
                                            </td>
                                            <td style={{ width: "3%", justifyContent: "left" }} >
                                                {documentacion.str_version}
                                            </td>
                                            <td style={{ width: "2%", justifyContent: "left" }} >
                                                Ver
                                            </td>
                                            <td style={{ width: "2%", justifyContent: "left" }} >
                                                Down
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

                <div style={{ marginRight: "5px" }} className="f-row uploader_arc" >
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

                <div className="f-row uploader_arc">
                    <div className={"btn_arch btn_arch__toggler "} >
                        <div className='f-row w-100 center_text_items'>
                            <h3 > Salir</h3>
                            <img style={{ marginLeft: "10px" }} src="Imagenes/close.svg" alt="" />
                        </div>
                    </div>
                </div>

            </section>


            <Modal modalIsVisible={isModalVisible} type="md" onCloseClick={hideModalSeparadores} onNextClick={generarSeparadores} mainText="Generar" titulo="Generar Separadores">

                <table className='archivos mt-4'>
                    <thead>
                        <tr>
                            <th style={{ width: "21px" }} > <input type='checkbox' checked={isSelectAllDocumental} onChange={seleccionMultipleDocumental} className='mr-1' /> Generar </th>
                            <th style={{ width: "5px" }}  >Actor</th>
                            <th style={{ width: "37%", justifyContent: "left" }}  >Grupo Documental</th>
                            <th style={{ width: "37%", justifyContent: "left" }} >Nombre de Archivo</th>

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


            <Modal modalIsVisible={isModalBusqVisible} type="md" onCloseClick={hideModalBusqueda} onNextClick={(e) => console.log("Sig Generar")} mainText="Buscar" titulo="Buscar">

                <section className="elements_two_column mt-2 mb-2">
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <p>IDENTIFICACION: </p>
                        <Input className="w-60 ml-2" id='identificacion' name='identificacion' esRequerido={true} type="text" placeholder="1150214375"></Input>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <p>ENTE: </p>
                        <Input className="w-60 ml-2" id='ente' name='ente' esRequerido={true} type="text" placeholder="455428"></Input>
                    </div>

                    <div style={{ display: "flex", alignItems: "center" }}>
                        <p style={{ marginRight: "42px" }}>SOLICITUD: </p>
                        <Input className="w-60" id='flujo' name='flujo' esRequerido={true} type="text"></Input>
                    </div>

                </section>

                <table className='archivos mt-4'>
                    <thead>
                        <tr>
                            <th style={{ width: "30px" }}  >Nombre Archivo</th>
                            <th style={{ width: "15%", justifyContent: "left" }}  >Usuario Carga</th>
                            <th style={{ width: "15%", justifyContent: "left" }} >Solicitud</th>
                            <th style={{ width: "10%", justifyContent: "left" }} >Version</th>
                            <th style={{ width: "15%", justifyContent: "left" }} >Ult. Modificación</th>
                            <th style={{ width: "15%", justifyContent: "left" }} >Ver Documento</th>

                        </tr>
                    </thead>
                    <tbody>

                        {props.grupoDocumental.map(separador => {

                            return (
                                <tr key={separador.id}>
                                    <td style={{ justifyContent: "left" }} >
                                        {separador.str_separador}
                                    </td>
                                    <td style={{ ustifyContent: "left" }} >
                                        dvvasquez
                                    </td>
                                    <td style={{ ustifyContent: "left" }} >
                                        4866846
                                    </td>
                                    <td style={{ ustifyContent: "left" }} >
                                        1
                                    </td>
                                    <td style={{ ustifyContent: "left" }} >
                                        06/11/2024
                                    </td>
                                    <td style={{ ustifyContent: "left" }} >
                                        1
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </Modal>


        </div>
    )
}



export default UploadDocumentos;