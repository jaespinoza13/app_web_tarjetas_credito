import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import '../../scss/main.css';
import '../../scss/components/solicitud.css';
import { useState, useEffect} from "react";
import { fetchGetSolicitudes} from "../../services/RestServices";
import { IsNullOrWhiteSpace } from '../../js/utiles';
import Modal from '../Common/Modal/Modal';
import Sidebar from '../Common/Navs/Sidebar';
import Card from '../Common/Card';
import Item from '../Common/UI/Item';
import { get } from '../../js/crypt';
import Button from '../Common/UI/Button';
import Toggler from '../Common/UI/Toggler';
import Table from '../Common/Table';
import Chip from '../Common/UI/Chip';
import RateReviewSharpIcon from '@mui/icons-material/RateReviewSharp';
import { IconButton } from '@mui/material';
import TableWithTextArea from '../Common/UI/TableWithTextArea';
import ModalDinamico from '../Common/Modal/ModalDinamico';
import { setSolicitudStateAction } from '../../redux/Solicitud/actions';


const mapStateToProps = (state) => {
    console.log("state, ", state)
    var bd = state.GetWebService.data;
    if (IsNullOrWhiteSpace(bd) || Array.isArray(state.GetWebService.data)) {
        bd = sessionStorage.getItem("WSSELECTED");
    }
    return {
        ws: bd,
        listaFuncionalidades: state.GetListaFuncionalidades.data,
        token: state.tokenActive.data,
    };
};

function Solicitud(props) {
    //console.log("props, ",props)
    const navigate = useHistory();
    const dispatch = useDispatch();

    //Inicio
    const [usuario, setUsuario] = useState("");
    const [rol, setRol] = useState("");
    const [datosUsuario, setDatosUsuario] = useState([]);

    const [isLstSolicitudes, setIsLstSolicitudes] = useState(true);
    const [isLstProspecciones, setIsLstProspecciones] = useState(false);
    const [isModalComentarios, setisModalComentarios] = useState(false);
    const [accionesSolicitud, setAccionesSolicitud] = useState(
        [
            { image: "", textPrincipal: `Solicitudes`, textSecundario: "", key: 1 },
            { image: "", textPrincipal: `Prospectos`, textSecundario: "", key: 2 }
        ]);
    const [modalVisible, setModalVisible] = useState(false);
    const [permisoNuevaSol, setPermisoNuevaSol] = useState(false);

 

    //Headers tablas Solicitudes y Prospectos
    const headerTableSolicitantes = [
        { nombre: 'Nro. Solicitud', key: 0}, { nombre: 'Identificación', key: 1 }, { nombre: 'Ente', key: 2 }, { nombre: 'Nombre solicitante', key: 3 },
        { nombre: 'Monto', key: 5 }, { nombre: 'Calificación', key: 6 },
        { nombre: 'Estado', key: 7 }, { nombre: 'Oficina Crea', key: 8 }, { nombre: 'Acciones', key: 9 },
    ];

    const headerTableProspectos = [
        { nombre: 'Id', key: 1 }, { nombre: 'Cédula', key: 2 }, { nombre: 'Nombres', key: 3 },
        { nombre: 'Celular', key: 4 }, { nombre: 'Correo', key: 5 }, { nombre: 'Cupo solicitado', key: 6 }, { nombre: 'Usuario Crea', key: 7 }
    ];


    //Headers y Body TextArea
    const headersTable_with_Text_Area = [
        { nombre: "Tipo", key: 1 },
        { nombre: "Descripción", key: 2 },
        { nombre: "Detalle", key: 3 }
    ]

    const parametros = [
        { prm_id: "11134", prm_valor_ini: "SOLICITUD CREADA" },
        { prm_id: "11135", prm_valor_ini: "ANALISIS UAC" },
        { prm_id: "11136", prm_valor_ini: "ANALISIS JEFE UAC" },
        { prm_id: "11137", prm_valor_ini: "ANALISIS COMITE" },
        { prm_id: "11138", prm_valor_ini: "APROBADA COMITE" },
        { prm_id: "11140", prm_valor_ini: "NEGADA" },
        { prm_id: "11139", prm_valor_ini: "ANULADA COMITE" },
        { prm_id: "11042", prm_valor_ini: "ENTREGADA" }
    ];

    const validaNombreParam = (id) => {
        console.log(id);
        const parametro = parametros.find((param) => { return param.prm_id === id });
        return parametro.prm_valor_ini;
    }

    const bodyTable_with_Text_Area = [
        { tipo: "DESCRIPCION GENERAL DEL SOCIO", descripcion: "Descripción general socio", detalle: "Socio se desempeña como Cbo. Primero...", key: 98 },
        { tipo: "CARACTER", descripcion: "Antecedentes crediticios...", detalle: "Socio y conyugue cuentan con historial crediticio...", key: 50 },
        { tipo: "CAPACIDAD", descripcion: "Fuentes de ingreso...", detalle: "Socio y conyugue perciben ingresos por sueldo...", key: 7 }
    ]


    const [valoresTextArea, setvaloresTextArea] = useState(bodyTable_with_Text_Area)

    const textAreaHandler = (valor, index) => {
        //console.log("EL KEY ACTUALIZAR ES", index)
        const newData = [...valoresTextArea];
        //newData[index].detalle = valor; // Cambiar propiedad detalle por el que se requiera
        newData.find(comentario => comentario.key === index ? comentario.detalle = valor : '')
        setvaloresTextArea(newData);
    };

    const cancelarComentariosHandler = () => {
        setisModalComentarios(!isModalComentarios);
    }

    const onSubmitComentarios = (e) => {
        e.preventDefault();
        console.log("IMPLEMENTAR GUARDADO COMENTARIOS");
        setisModalComentarios(!isModalComentarios)
    };


    //Prostectos y solicitudes
    const [lstProstectos, stLstProspectos] = useState([]);
    const [lstSolicitudes, stLstSolicitudes] = useState([]);

    //Carga de solicitudes
    useEffect(() => {
        //console.log("TOKEN", props.token);
        fetchGetSolicitudes(props.token, (data) => {
            console.log("ENTRA SOLICITUDES");
            console.log(data);
            stLstProspectos(data.prospectos);
            stLstSolicitudes(data.solicitudes);
        }, dispatch)
        const strOficial = get(localStorage.getItem("sender_name"));
        setUsuario(strOficial);
        const strRol = get(localStorage.getItem("role"));
        //console.log(strRol);
        setRol(strRol);
        setDatosUsuario([{ strCargo: strRol, strOficial: strOficial }]);
    }, []);

    useEffect(() => {
        if (rol) {
            validaPermiso("CREAR SOLICITUD");
        }
    }, [rol]);

    const validaPermiso = (strNombrePermiso) => {
        console.log(rol);
        if (rol) {
            var permisosUusuario = [];
            if (rol === "ASESOR DE CRÉDITO") {
                permisosUusuario = ["CREAR SOLICITUD"];
            }

            var permis = permisosUusuario.includes(strNombrePermiso);
            console.log(permis);
            if (permis) {
                setPermisoNuevaSol(permis);
            }
        }
    }

    const handleSelectedToggle = (index) => {
        const lstSeleccionada = accionesSolicitud.find((acciones) => acciones.key === index);
        if (lstSeleccionada.textPrincipal === "Solicitudes") {
            setIsLstProspecciones(false);
            setIsLstSolicitudes(true);
        } else {
            setIsLstSolicitudes(false);
            setIsLstProspecciones(true);
        }
    }

    const irNuevaSolicitud = () => {
        navigate.push('/solicitud/nueva');
    }

    const closeModalHandler = () => {
        setisModalComentarios(false);
    }

    const moveToSolicitud = (solId) => {
        const solicitudSeleccionada = lstSolicitudes.find((solicitud) => { return solicitud.int_id === solId });
        if (solicitudSeleccionada.str_estado === '11138' || solicitudSeleccionada.str_estado === "11134" && rol === "ASESOR DE CRÉDITO") {
            dispatch(setSolicitudStateAction({ solicitud: solicitudSeleccionada.int_id, cedulaSocio: solicitudSeleccionada.str_identificacion, idSolicitud: solicitudSeleccionada.str_estado, rol: rol }))
            navigate.push('/solicitud/ver');
        }
        else if ((rol === "ANALISTA CREDITO" || rol === "JEFE DE UAC" || rol === "DIRECTOR DE NEGOCIOS") && solicitudSeleccionada.str_estado !== '11134') {
            dispatch(setSolicitudStateAction({ solicitud: solicitudSeleccionada.int_id, cedulaSocio: solicitudSeleccionada.str_identificacion, idSolicitud: solicitudSeleccionada.str_estado, rol: rol }))
            navigate.push('/solicitud/ver');
        }
        else {
            setModalVisible(true);
        }
    }

    const siguientePasoHandler = () => {
        setModalVisible(false);
    }

    const closeModalHandlerMsg = () => {
        setModalVisible(false);
    }

    return (<div className="f-row">
        <Sidebar enlace={props.location.pathname}></Sidebar>
        
        <div className="container_mg mb-4">
            {permisoNuevaSol && 
                <Item xs={2} sm={2} md={2} lg={2} xl={2}>
                    <Card>
                        <img style={{ width: "15%" }} src="Imagenes/credit_card_FILL0_wght300_GRAD0_opsz24.svg"></img>
                        <h4 className="mt-2">Solicitud / Prospección</h4>
                        <h5 className="mt-2">Genera una nueva solicitud o prospección de tarjeta de crédito</h5>
                        <Button autoWidth tabIndex="3" className={["btn_mg btn_mg__primary mt-2"]} disabled={false} onClick={irNuevaSolicitud}>Siguiente</Button>
                    </Card>
                </Item>
            }
            
            <Toggler className="mt-2" toggles={accionesSolicitud}
                selectedToggle={handleSelectedToggle}>
            </Toggler>
            {isLstSolicitudes &&
                <div id="listado_solicitudes" className="mt-3">
                    <Table headers={headerTableSolicitantes}>
                        {/*BODY*/}
                        {lstSolicitudes && lstSolicitudes.map((solicitud) => {
                            return (
                                <tr key={solicitud.int_id} onClick={() => { moveToSolicitud(solicitud.int_id) }}>
                                    <td>{solicitud.int_id}</td>
                                    <td>{solicitud.str_identificacion}</td>
                                    <td>{solicitud.int_ente}</td>
                                    <td>{solicitud.str_nombres}</td>
                                    <td>{`$ ${Number(solicitud.dec_cupo_solicitado).toLocaleString('en-US')}`}</td>
                                    <td>{"AA"}</td>
                                    <td>{validaNombreParam(solicitud.str_estado)}</td>
                                    <td>{"Matriz"}</td>
                                    <td>
                                        <IconButton onClick={() => { setisModalComentarios(!isModalComentarios) }}>
                                            <RateReviewSharpIcon></RateReviewSharpIcon>
                                        </IconButton>
                                        
                                    </td>
                                </tr>
                            );
                        })}
                        
                    </Table>
                </div>
            }
            {isLstProspecciones &&
                <div id="listado_solicitudes">
                    <Table headers={headerTableProspectos}>
                        {/*BODY*/}
                        {lstProstectos && lstProstectos.map((prospecto) => {
                            return (
                                <tr key={prospecto.pro_id}>
                                    <td>{prospecto.pro_id}</td>
                                    <td>{prospecto.pro_num_documento}</td>
                                    <td>{`${prospecto.pro_nombres} ${prospecto.pro_apellidos}`}</td>
                                    <td>{prospecto.pro_celular}</td>
                                    <td>{prospecto.pro_email}</td>
                                    <td>{`$ ${prospecto.pro_cupo_solicitado}`}</td>
                                    <td>{prospecto.pro_usuario_crea}</td>
                                </tr>);
                        })}

                    </Table>
                </div>
            }
            
        </div>

        <ModalDinamico
            //props para Modal
            modalIsVisible={isModalComentarios}
            titulo={'COMENTARIOS DEL ASESOR'}
            onCloseClick={closeModalHandler}
            type="md"
        >
            <TableWithTextArea
                isBtnDisabled={!isModalComentarios}
                headers={headersTable_with_Text_Area}
                body={valoresTextArea}
                onChangeTable={textAreaHandler}
                onSubmitComentarios={onSubmitComentarios}
                onCancelarSubmit={cancelarComentariosHandler}
            >
            </TableWithTextArea>

        </ModalDinamico>

        <Modal
            modalIsVisible={modalVisible}
            titulo={`Aviso`}
            onNextClick={siguientePasoHandler}
            onCloseClick={closeModalHandlerMsg}
            isBtnDisabled={false}
            type="sm"
        >
            {modalVisible && <div>
                <p>No tiene permiso para acceder a esta solicitud</p>
            </div>}
        </Modal>


       

    </div>);

}

export default connect(mapStateToProps, {})(Solicitud);