import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import '../../scss/main.css';
import '../../scss/components/solicitud.css';
import { useState, useEffect, useReducer } from "react";
import { fetchValidacionSocio, fetchScore, fetchInfoSocio, fetchInfoEconomica, fetchAddAutorizacion, fetchGetSolicitudes, fetchAddSolicitud } from "../../services/RestServices";
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


const mapStateToProps = (state) => {
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
    const navigate = useHistory();
    const dispatch = useDispatch();

    //Inicio
    const [isLstSolicitudes, setIsLstSolicitudes] = useState(true);
    const [isLstProspecciones, setIsLstProspecciones] = useState(false);
    const [isModalComentarios, setisModalComentarios] = useState(false);
    const [accionesSolicitud, setAccionesSolicitud] = useState(
        [
            { image: "", textPrincipal: `Solicitudes`, textSecundario: "", key: 1 },
            { image: "", textPrincipal: `Prospectos`, textSecundario: "", key: 2 }
        ]);

 

    //Headers tablas Solicitudes y Prospectos
    const headerTableSolicitantes = [
        { nombre: 'Identificación', key: 1 }, { nombre: 'Ente', key: 2 }, { nombre: 'Nombre solicitante', key: 3 },
        { nombre: 'Producto TC', key: 4 }, { nombre: 'Monto', key: 5 }, { nombre: 'Calificación', key: 6 },
        { nombre: 'Estado', key: 7 }, { nombre: 'Oficina Crea', key: 8 }, { nombre: 'Oficial', key: 9 },
        { nombre: 'Usuario', key: 10 }, { nombre: 'Fecha modificación', key: 11 }, { nombre: 'Acciones', key: 12 },
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

    const bodyTable_with_Text_Area = [
        { tipo: "DESCRIPCION GENERAL DEL SOCIO", descripcion: "Descripción general socio", detalle: "Socio se desempeña como Cbo. Primero...", key: 98 },
        { tipo: "CARACTER", descripcion: "Antecedentes crediticios...", detalle: "Socio y conyugue cuentan con historial crediticio...", key: 50 },
        { tipo: "CAPACIDAD", descripcion: "Fuentes de ingreso...", detalle: "Socio y conyugue perciben ingresos por sueldo...", key: 7 }
    ]


    const [valoresTextArea, setvaloresTextArea] = useState(bodyTable_with_Text_Area)

    const textAreaHandler = (valor, index) => {
        console.log("EL KEY ACTUALIZAR ES", index)
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
        fetchGetSolicitudes(props.token, (data) => {
            stLstProspectos(data.prospectos);
            stLstSolicitudes(data.solicitudes);
        }, dispatch)
    }, []);
    
    const handleSelectedToggle = (index) => {
        const lstSeleccionada = accionesSolicitud.find((acciones) => acciones.key === index);
        console.log(lstSeleccionada.textPrincipal);
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

    return (<div className="f-row">
        <Sidebar></Sidebar>
        <div className="container_mg">
            <div className="consulta_buro">
                <Item xs={2} sm={2} md={2} lg={2} xl={2}>
                    <Card>
                        <img style={{ width: "15%" }} src="Imagenes/credit_card_FILL0_wght300_GRAD0_opsz24.svg"></img>
                        <h4 className="mt-2">Solicitud / Prospección</h4>
                        <h5 className="mt-2">Genera una nueva solicitud o prospección de tarjeta de crédito</h5>
                        <Button autoWidth tabIndex="3" className={["btn_mg btn_mg__primary mt-2"]} disabled={false} onClick={irNuevaSolicitud}>Siguiente</Button>
                    </Card>

                </Item>
            </div>
            <Toggler className="mt-2" toggles={accionesSolicitud}
                selectedToggle={handleSelectedToggle}>
            </Toggler>

            {isLstSolicitudes &&
                <div id="listado_solicitudes" className="mt-3">
                    <Table headers={headerTableSolicitantes}>
                        {/*BODY*/}
                        {lstSolicitudes.map((solicitud) => {
                            return (
                                <tr key={solicitud.int_id}>
                                    <td>{solicitud.str_identificacion}</td>
                                    <td>{solicitud.int_ente}</td>
                                    <td>{solicitud.str_nombres}</td>
                                    <td><Chip type="black">Black</Chip></td>
                                    <td>{`$ ${Number(solicitud.dec_cupo_solicitado).toLocaleString('en-US')}`}</td>
                                    <td>{"AA"}</td>
                                    <td>{solicitud.str_estado}</td>
                                    <td>{"Matriz"}</td>
                                    <td>{solicitud.str_usuario_crea}</td>
                                    <td>{solicitud.str_usuario_crea}</td>
                                    <td>{solicitud.dtt_fecha_solicitud}</td>
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
                        {lstProstectos.map((prospecto) => {
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


       

    </div>);

}

export default connect(mapStateToProps, {})(Solicitud);