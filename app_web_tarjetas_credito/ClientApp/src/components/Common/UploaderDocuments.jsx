import { Fragment, createRef, useEffect, useState } from 'react';
import '../../css/Components/UploaderDocuments.css';
import Input from './UI/Input';
import Modal from './Modal/Modal';

const UploadDocumentos = (props) => {


    const cabeceraTabla = [{ id: 0, texto: "Separador" }, { id: 1, texto: "Publicar" }, { id: 2, texto: "Actor" }, { id: 3, texto: "Ord" },
    { id: 4, texto: "Grupo Documental" }, { id: 5, texto: "Propietario Documentación" }, { id: 6, texto: "Abrir archivo" },
    { id: 7, texto: "Usuario carga" }, { id: 8, texto: "Fecha subida" }, { id: 9, texto: "Version" }, { id: 10, texto: "Ver" }, { id: 11, texto: "Descargar" }]

    const [tablaContenido, setTablaContenido] = useState([
        { id: 0, actor: "T", ord: "", grupo_documental: "SOLICITUD DE CREDITO", propiedad_doc: "VASQUEZ DANNY", ruta: "", usu_carga: "", fecha_subida: "", version: "", nombre_archivo: "1_SOLICITUD_DE_CREDITO" },
        { id: 1, actor: "G", ord: "1", grupo_documental: "DOCUMENTOS DE IDENTIDAD", propiedad_doc: "VASQUEZ DANNY", ruta: "", usu_carga: "", fecha_subida: "", version: "", nombre_archivo: "3_DOCUMENTOS_DE_IDENTIDAD" },
        { id: 2, actor: "T", ord: "", grupo_documental: "SUSTENTO DE CAPACIDAD DE PAGO", propiedad_doc: "VASQUEZ DANNY", ruta: "", usu_carga: "", fecha_subida: "", version: "", nombre_archivo: "7_SUSTENTO_DE_CAPACIDAD_DE_PAGO" },
    ])

    const grupoDocumental = [
        { id: 0, actor: "T", ord: "", grupo_documental: "SOLICITUD DE CREDITO", nombre_archivo: "1_SOLICITUD_DE_CREDITO" },
        { id: 1, actor: "T", ord: "", grupo_documental: "DOCUMENTOS DE IDENTIDAD", nombre_archivo: "3_DOCUMENTOS_DE_IDENTIDAD" },
        { id: 2, actor: "T", ord: "", grupo_documental: "SUSTENTO DE CAPACIDAD DE PAGO", nombre_archivo: "7_SUSTENTO_DE_CAPACIDAD_DE_PAGO" },
    ]

    const [docsBase64, setDocsBase64] = useState("");
    const [totalRegistros, setTotalRegistros] = useState(0);
    const [isSelectAllSeparador, setIsSelectAllSeparador] = useState(false);
    const [separadorCheckBox, setSeparadorCheckBox] = useState([]);

    const [isSelectAllPublicar, setIsSelectAllPublicar] = useState(false);
    const [publicadorCheckBox, setPublicadorCheckBox] = useState([]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSelectAllDocumental, setIsSelectAllDocumental] = useState(false);
    const [documentalCheckBox, setDocumentalheckBox] = useState([]);

    const inputCargaRef = createRef(null);


    const openModalSeparadores = () => {
        setIsModalVisible(true);
    }

    const hideModalSeparadores = () => {
        setIsModalVisible(false);
    }


    const seleccionMultipleSeparador = (e) => {
        toggleSelectAllSeparador();
        setIsSelectAllSeparador(!isSelectAllSeparador);
    }

    const toggleSelectAllSeparador = () => {
        setIsSelectAllSeparador(!isSelectAllSeparador);
        if (!isSelectAllSeparador) {
            const resultado = tablaContenido.map((doc, indexOrden) => {
                return doc.id
            }).flat();
            //console.log("RESULT FLAT ", resultado)
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
        //console.log("TOTAL R", totalRegistros)
        //console.log("Separador Check ", separadorCheckBox.length)
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
                return doc.id
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
                return doc.id
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
        const conteoRegistros = tablaContenido.length;
        //console.log("TOTAL REG ",conteoRegistros)
        setTotalRegistros(conteoRegistros);

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
            if (element.ruta !== "") checkDocCargados = [...checkDocCargados, element.id];
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

        archivosLimpieza.forEach(element => {
            let indexArchivo;
            indexArchivo = tablaContenido.findIndex(fila => fila.nombre_archivo === element.name.split('.')[0])
            //console.log(indexArchivo);
            tablaContenido[indexArchivo].ruta = element.webkitRelativePath;
            tablaContenido[indexArchivo].usu_carga = "dvvasquez";
        })
        setValidadorCambio(true);
        setTablaContenido([...tablaContenido]);
    }




    return (
        <div className="content_uploader">

            <div className='border_content'>
                <div style={{ display: "flex" }}>
                    <p className='normal'>Socio: </p>
                    <p className="negrita">Danny Vasquez</p>
                </div>

                <section className='elements_tres_column mt-3'>

                    <div style={{ display: "flex" }}>
                        <p>TIPO DOCUMENTO: </p>
                        <p className="negrita">CÉDULA</p>
                    </div>

                    <div style={{ display: "flex" }}>
                        <p className='normal'>Fecha Ult. Modificación: </p>
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
                        <p className='normal'>Estado Calificación: </p>
                        <p className="negrita"> </p>
                    </div>

                    <div style={{ display: "flex" }}>
                        <p className='normal'>Trámite Nro: </p>
                        <p className="negrita">0</p>
                    </div>

                </section>

                <section className='elements_tres_column mt-3'>
                    <div style={{ display: "flex" }}>
                        <p className='normal'>Oficina: </p>
                        <p className="negrita">Matriz</p>
                    </div>

                    <div style={{ display: "flex" }}>
                        <p className='normal'>Estado de la Solicitud: </p>
                        <p className="negrita">POR DIGITAR </p>
                    </div>

                    <div style={{ display: "flex" }}>
                        <p className='normal'>Monto: </p>
                        <p className="negrita">100,000</p>
                    </div>

                </section>

                <section className='elements_tres_column mt-3'>
                    <div style={{ display: "flex" }}>
                        <p className='normal'>Oficial: </p>
                        <p className="negrita">xnojeda1</p>
                    </div>

                    <div style={{ display: "flex" }}>
                        <p className='normal'>Producto Crédito: </p>
                        <p className="negrita">CREDI PYMES </p>
                    </div>

                    <div style={{ display: "flex" }}>
                        <p className='normal'>Ente aprobador: </p>
                        <p className="negrita">COMITE GENERAL DE CRÉDITO</p>
                    </div>
                </section>

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
                                    <Fragment key={documentacion.id}>
                                        <tr key={documentacion.id}>

                                            <td style={{ width: "2px" }} >
                                                <Input disabled={false} type="checkbox" setValueHandler={() => ckeckSelector(documentacion.id)} checked={separadorCheckBox.includes(documentacion.id)}  ></Input>
                                            </td>

                                            <td style={{ width: "2px" }} >
                                                <Input disabled={false} type="checkbox" setValueHandler={() => ckeckPublicador(documentacion.id)} checked={publicadorCheckBox.includes(documentacion.id)}   ></Input>
                                            </td>

                                            <td style={{ width: "2px", justifyContent: "left" }} >
                                                {documentacion.actor}
                                            </td>
                                            <td style={{ width: "2%", justifyContent: "left" }} >
                                                {documentacion.ord}
                                            </td>
                                            <td style={{ width: "20%", justifyContent: "left" }} >
                                                {documentacion.grupo_documental}
                                            </td>
                                            <td style={{ width: "20%", justifyContent: "left" }} >
                                                {documentacion.propiedad_doc}
                                            </td>
                                            <td style={{ width: "10%", justifyContent: "left" }} >
                                                <div style={{ whiteSpace: "nowrap" }}>{documentacion.ruta}</div>
                                            </td>
                                            <td style={{ width: "10%", justifyContent: "left" }} >
                                                {documentacion.usu_carga}
                                            </td>
                                            <td style={{ width: "10%", justifyContent: "left" }} >
                                                {documentacion.fecha_subida}
                                            </td>
                                            <td style={{ width: "3%", justifyContent: "left" }} >
                                                {documentacion.version}
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
                            <img style={{ marginLeft: "10px" }} src="icons/Axentria/barcode.png" alt="" />
                        </div>
                    </div>
                </div>


            </section>

            <section className='mt-2 f-row' style={{ display: "flex", alignItems: "right", justifyContent: "right" }} >
                <div style={{ marginRight: "5px" }} className=" f-row uploader_arc" onClick={handleUpload}>
                    <div className={"btn_arch btn_arch__toggler "} >
                        <div className='f-row w-100 center_text_items'>
                            <h3 > Examinar </h3>
                            <img style={{ marginLeft: "10px" }} src="icons/Axentria/carpeta-de-búsqueda.png" alt="" />
                            <input type="file" accept={".pdf"} style={{ display: 'none' }} ref={inputCargaRef} directory="" webkitdirectory="" onChange={cargarArchivosHandler} />
                        </div>
                    </div>
                </div>

                <div style={{ marginRight: "5px" }} className="f-row uploader_arc" >
                    <div className={"btn_arch btn_arch__toggler "} >
                        <div className='f-row w-100 center_text_items'>
                            <h3 > Publicar </h3>
                            <img style={{ marginLeft: "10px" }} src="icons/Axentria/subir-carpeta.png" alt="" />
                        </div>
                    </div>
                </div>

                <div style={{ marginRight: "5px" }} className="f-row uploader_arc">
                    <div className={"btn_arch btn_arch__toggler"} >
                        <div className='f-row w-100 center_text_items'>
                            <h3 > Búsqueda </h3>
                            <img style={{ marginLeft: "10px" }} src="icons/Axentria/carpeta-de-documentos.png" alt="" />
                        </div>
                    </div>
                </div>

                <div className="f-row uploader_arc">
                    <div className={"btn_arch btn_arch__toggler "} >
                        <div className='f-row w-100 center_text_items'>
                            <h3 > Salir</h3>
                            <img style={{ marginLeft: "10px" }} src="icons/close.svg" alt="" />
                        </div>
                    </div>
                </div>

            </section>


            <Modal modalIsVisible={isModalVisible} type="md" onCloseClick={hideModalSeparadores} onNextClick={(e) => console.log("Sig Generar")} mainText="Generar" titulo="Generar Separadores">

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

                        {grupoDocumental.map(separador => {

                            return (
                                <tr key={separador.id}>
                                    <td style={{ width: "21px" }} >
                                        <Input disabled={false} type="checkbox" setValueHandler={() => ckeckDocumental(separador.id)} checked={documentalCheckBox.includes(separador.id)}  ></Input>
                                    </td>
                                    <td style={{ width: "5px" }} >
                                        {separador.actor}
                                    </td>
                                    <td style={{ width: "37%", justifyContent: "left" }} >
                                        {separador.grupo_documental}
                                    </td>
                                    <td style={{ width: "37%", justifyContent: "left" }} >
                                        {separador.nombre_archivo}
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