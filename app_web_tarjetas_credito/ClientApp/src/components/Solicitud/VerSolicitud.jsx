﻿import { IsNullOrWhiteSpace } from "../../js/utiles";
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from "react";
import { fetchGetComentarios, fetchGetFlujoSolicitud, fetchAddComentarioAsesor, fetchAddComentarioSolicitud } from "../../services/RestServices";
import Sidebar from "../Common/Navs/Sidebar";
import Card from "../Common/Card";
import Table from "../Common/Table";
import Textarea from "../Common/UI/Textarea";
import Item from "../Common/UI/Item";
import Button from "../Common/UI/Button";
import Modal from "../Common/Modal/Modal";

const mapStateToProps = (state) => {
    var bd = state.GetWebService.data;
    if (IsNullOrWhiteSpace(bd) || Array.isArray(state.GetWebService.data)) {
        bd = sessionStorage.getItem("WSSELECTED");
    }
    return {
        ws: bd,
        listaFuncionalidades: state.GetListaFuncionalidades.data,
        token: state.tokenActive.data,
        solicitud: state.solicitud.data
    };
};

const VerSolicitud = (props) => {
    const dispatch = useDispatch();
    const navigate = useHistory();
    const [comentariosAsesor, setComentariosAsesor] = useState([]);
    const [solicitudTarjeta, setSolicitudTarjeta] = useState([]);
    const [comentarioSolicitud, setComentarioSolicitud] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleOk, setModalVisibleOk] = useState(false);
    const [faltaComentariosAsesor, setFaltaComentariosAsesor] = useState(true);


    const headerTableComentarios = [
        { nombre: 'Tipo', key: 1 }, { nombre: 'Descripción', key: 2 }, { nombre: 'Comentario', key: 3 }
    ];
    
    useEffect(() => {
        fetchGetComentarios(props.solicitud.solicitud, props.token, (data) => {
            setComentariosAsesor(data.lst_comn_ase_cre);
        }, dispatch);
        fetchGetFlujoSolicitud(props.solicitud.solicitud, props.token, (data) => {
            console.log(data);
            setSolicitudTarjeta(...[data.flujo_solicitudes]);
        }, dispatch);
    }, []);

    const comentarioAdicionalHanlder = (data, event) => {
        const id = comentariosAsesor.findIndex((comentario) => { return comentario.int_id_parametro === event });
        comentariosAsesor[id].str_detalle = data;
        
    }

    const getComentarioSolicitudHandler = (data) => {
        setComentarioSolicitud(data);
    }

    const modalHandler = () => {
        setModalVisible(true);
    }

    const siguientePasoHandler = () => {
        fetchAddComentarioAsesor(props.solicitud.solicitud, comentariosAsesor, props.token, (data) => {
            if (data.str_res_codigo === "000") {
                setFaltaComentariosAsesor(false);
                setModalVisible(false);
            }
        }, dispatch);
    }

    const closeModalHandler = () => {
        setModalVisible(false);
    }

    const guardarComentario = () => {
        fetchAddComentarioSolicitud(props.solicitud.solicitud, comentarioSolicitud, solicitudTarjeta[0]?.slw_estado, props.token, (data) => {
            if (data.str_res_codigo === "000") {
                setModalVisibleOk(true);
            }
        }, dispatch);
    }

    const descargarReporte = () => {
        const pdfUrl = "Imagenes/reporteavalhtml.pdf";
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = "document.pdf"; // specify the filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const retornarSolicitud = () => {
        navigate.push('/solicitud');
    }

    const closeModalHandlerOk = () => {

    }

    return <div className="f-row">
        <Sidebar></Sidebar>
        <Card className={["m-max w-100 justify-content-space-between align-content-center"]}>
            <div>
                <h3 className="mb-3">Informacióin de la solicitud</h3>
                <Card className={["f-row"]}>
                    <Item xs={6} sm={6} md={6} lg={6} xl={6}>
                        <div className="values  mb-3">
                            <h5>Socio:</h5>
                            <h5 className="strong">
                                {`$ ${props.montoSugerido || Number('10000.00').toLocaleString("en-US")}`}
                            </h5>
                        </div>
                        <div className="values  mb-3">
                            <h5>Tipo Documento:</h5>
                            <h5 className="strong">
                                {`Cédula`}
                            </h5>
                        </div>
                        <div className="values  mb-3">
                            <h5>Oficina:</h5>
                            <h5 className="strong">
                                {`EL VALLE`}
                            </h5>
                        </div>
                        <div className="values  mb-3">
                            <h5>Oficial:</h5>
                            <h5 className="strong">
                                {`${solicitudTarjeta[0]?.slw_usuario_proc}`}
                            </h5>
                        </div>
                        <div className="values  mb-3">
                            <Button className={["btn_mg btn_mg__primary"]} disabled={false} onClick={descargarReporte}>Descargar reporte</Button>
                        </div>
                        <div className="values  mb-3">
                            <Button className="btn_mg__primary" type="" onClick={modalHandler}>Agregar comentarios</Button>
                        </div>
                    </Item>

                    <Item xs={6} sm={6} md={6} lg={6} xl={6}>
                        <div className="values  mb-3">
                            <h5>Estado de la solicitud:</h5>
                            <h5 className="strong">
                                {`${solicitudTarjeta[0]?.str_estado}`}
                            </h5>
                        </div>
                        <div className="values  mb-3">
                            <h5>Cupo solicitado:</h5>
                            <h5 className="strong">
                                {`$ ${Number(solicitudTarjeta[0]?.slw_cupo_solicitado).toLocaleString("en-US") || Number('10000.00').toLocaleString("en-US")}`}
                            </h5>
                        </div>
                        <div className="values  mb-3">
                            <h5>Cupo sugerido:</h5>
                            <h5 className="strong">
                                {`$ ${Number(solicitudTarjeta[0]?.slw_cupo_sugerido).toLocaleString("en-US") || Number('10000.00').toLocaleString("en-US")}`}
                            </h5>
                        </div>
                        <div className="values  mb-3">
                            <h5>Solicitud Nro:</h5>
                            <h5 className="strong">
                                {`${props.solicitud.solicitud || Number('10000.00').toLocaleString("en-US")}`}
                            </h5>
                        </div>
                    </Item>
                </Card>
                <div className="mt-4">
                    <h3>Comentario del Asesor</h3>
                    <Textarea placeholder="Ingrese su comentario" onChange={getComentarioSolicitudHandler}  esRequerido={true}></Textarea>
                </div>
            </div>
            <div className="f-row justify-content-center">
                <Button className="btn_mg__primary" disabled={faltaComentariosAsesor} onClick={guardarComentario}>Guardar</Button>
            </div>


        </Card>
        <Modal
            modalIsVisible={modalVisible}
            titulo={`Ingrese los comentarios`}
            onNextClick={siguientePasoHandler}
            onCloseClick={closeModalHandler}
            isBtnDisabled={false}
            type="lg"
        >
            {modalVisible && <div>
                <Table headers={headerTableComentarios}>
                    {
                        comentariosAsesor.map((comentario) => {
                            return (
                                <tr key={comentario.int_id_parametro}>
                                    <td style={{ width: "20%" }}>{comentario.str_tipo}</td>
                                    <td style={{ width: "40%" }}>{comentario.str_descripcion}</td>
                                    <td style={{ width: "40%" }}><Textarea placeholder="Ej. Texto de ejemplo" type="textarea" onChange={(event, key = comentario.int_id_parametro) => { comentarioAdicionalHanlder(event, key) }} esRequerido={false} value={comentario.str_detalle}></Textarea></td>
                                </tr>
                            );
                        })
                    }
                </Table>
            </div>}
        </Modal>
        <Modal
            modalIsVisible={modalVisibleOk}
            titulo={`Aviso!`}
            onNextClick={retornarSolicitud}
            onCloseClick={closeModalHandlerOk}
            isBtnDisabled={false}
            type="sm"
        >
            {modalVisibleOk && <div>
                <p>Su comentario se ha guardado correctamente</p>
            </div>}
        </Modal>
    </div>
}

export default connect(mapStateToProps, {})(VerSolicitud);