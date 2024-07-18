import { Fragment, useState } from 'react';
import Sidebar from '../Common/Navs/Sidebar';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import Card from '../Common/Card';
import Button from '../Common/UI/Button';
import { IsNullOrWhiteSpace } from '../../js/utiles';
import "../../css/Components/Reprocesar.css";
import AccordionV2 from '../Common/UI/AccordionV2';
import Input from '../Common/UI/Input';
import ModalDinamico from '../Common/Modal/ModalDinamico';
import Table from '../Common/Table';
import { get } from '../../js/crypt';
import Chip from '../Common/UI/Chip';

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


function EntregaSocio(props) {

    const navigate = useHistory();
    const dispatch = useDispatch();

    const [inputBusqueda, setInputBusqueda] = useState([]);
    const [ordenItemsCheckTotal, setOrdenItemsCheckTotal] = useState([]);
    const [totalTarjetasEnviar, setTotalTarjetasEnviar] = useState(0);
    const [modalEnviarPersonalizacion, setModalEnviarPersonalizacion] = useState(false);


    //Info sesión
    const [datosUsuario, setDatosUsuario] = useState([]);


    useEffect(() => {
        const strOficial = get(localStorage.getItem("sender_name"));
        const strRol = get(localStorage.getItem("role"));

        const userOficial = get(localStorage.getItem('sender'));
        const userOficina = get(localStorage.getItem('office'));

        setDatosUsuario([{ strCargo: strRol, strOficial: strOficial, strUserOficial: userOficial, strUserOficina: userOficina }]);
    }, [])

    const headersTarjetas = [{ key: 0, nombre: "Ente" }, { key: 1, nombre: "Fecha recepción" }, { key: 2, nombre: "Identificación" }, { key: 3, nombre: "Nombre del titular" }, { key: 4, nombre: "Tipo de tarjeta" }, { key: 5, nombre: "Tipo de producto" }, { key: 6, nombre: "Acciones" }]

    const tarjetas = [                   
        { ente: "15188", cedula: "1101898147", nombres: "NICOLE ALBAN", tipo_producto: "ESTÁNDAR", fecha_proceso: "12/07/2024 22:30", oficina_solicita: "EL VALLE",  tipo_tarjeta: "Principal" },
        { ente: "49456", cedula: "1150214370", nombres: "DANNY VASQUEZ", tipo_producto: "GOLD", fecha_proceso: "12/07/2024 22:30", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
        { ente: "84684", cedula: "0111978465", nombres: "LUIS CONDE", tipo_producto: "GOLD", fecha_proceso: "12/07/2024 22:30", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
        { ente: "95464", cedula: "1106849276", nombres: "SAMANTA CARRION", tipo_producto: "GOLD", fecha_proceso: "13/07/2024 15:35", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
        { ente: "11546", cedula: "0681486841", nombres: "FULANITO CABRERA", tipo_producto: "GOLD", fecha_proceso: "13/07/2024 15:35", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
        { ente: "186424", cedula: "1954984972", nombres: "MARTHA PINEDA", tipo_producto: "ESTÁNDAR", fecha_proceso: "14/07/2024 17:30", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
        { ente: "2298", cedula: "0981864365", nombres: "PIEDA TOLEDO", tipo_producto: "GOLD", fecha_proceso: "14/07/2024 17:30", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
        { ente: "6849", cedula: "1104732936", nombres: "LEO MONTALVAN", tipo_producto: "BLACK", fecha_proceso: "12/07/2024 22:30", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
        { ente: "97678", cedula: "0515846844", nombres: "LUISA VALDEZ",  tipo_producto: "ESTÁNDAR", fecha_proceso: "12/07/2024 16:30", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
        { ente: "15864", cedula: "0849655446", nombres: "MARIA ORTEGA",  tipo_producto: "GOLD", fecha_proceso: "12/07/2024 16:30", oficina_solicita: "EL VALLER", tipo_tarjeta: "Principal" },
       
    ]

    const tarjetasV2 = [
        { ente: "1111", cedula: "1306543210", nombres: "JORGE SANCHEZ", tipo_producto: "ESTÁNDAR", fecha_proceso: "14/07/2024 15:30", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
        { ente: "2222", cedula: "1001234567", nombres: "PATRICIA LOPEZ", tipo_producto: "GOLD", fecha_proceso: "14/07/2024 15:30", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
        { ente: "3333", cedula: "1203456789", nombres: "CLAUDIA HERRERA", tipo_producto: "BLACK", fecha_proceso: "14/07/2024 15:30", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
        { ente: "4443", cedula: "0509876543", nombres: "PEDRO RAMOS", tipo_producto: "GOLD", fecha_proceso: "14/07/2024 15:35", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },


    ]

    const returnItemsHandler = (arrayItems) => {
        console.log("arrayItems ", arrayItems)
    }


    const closeModaEnvioPersonalizacion = () => {
        setModalEnviarPersonalizacion(false);
    }

    const envioPersonalizacionHandler = () => {

    }

    return (
        <div className="f-row">
            <Sidebar enlace={props.location.pathname }></Sidebar>
            <div className="container_mg">          

                <div className="f-row w-100 mt-5" style={{ display: "flex", justifyContent: "right", paddingRight: "30px" }}>
                    <div className="input-wrapper">
                        <Input className="w-20 ml-1 inputBusqueda" id="buscarOrden" type="text" disabled={false} value={inputBusqueda} setValueHandler={(e) => setInputBusqueda(e)} placeholder={"Buscar"}></Input>
                        <img className="input-icon icon" src="Imagenes/search.svg" alt="Buscar"></img>
                    </div>

                    <div className="input-fitro">
                        <img className="input-icon icon" src="Imagenes/filter.svg" alt="Filtrar"></img>
                    </div>
                </div>


                {datosUsuario.length > 0 && datosUsuario[0].strCargo === "ASISTENTE DE PLATAFORMA DE SERVICIOS" &&
                    <div className="contentTableOrden mt-3 mb-3">
                        <Table headers={headersTarjetas}>
                            {/*BODY*/}
                            {tarjetas.map((tarjeta, index) => {
                                return (
                                    <tr key={tarjeta.ente}>
                                        <td>{tarjeta.ente}</td>
                                        <td>{tarjeta.fecha_proceso}</td>
                                        <td>{tarjeta.cedula}</td>
                                        <td>{tarjeta.nombres}</td>
                                        <td>{tarjeta.tipo_tarjeta}</td>
                                        <td><Chip type={tarjeta.tipo_producto}>{tarjeta.tipo_producto}</Chip></td>
                                        <td>
                                            <AccionesTarjeta />
                                        </td>
                                    </tr>
                                );
                            })}
                        </Table>
                    </div>

                }



                {datosUsuario.length > 0 && datosUsuario[0].strCargo === "ASISTENTE DE AGENCIA" &&
                    <div className="contentTableOrden mt-3 mb-3">
                        <Table headers={headersTarjetas}>
                            {/*BODY*/}
                            {tarjetasV2.map((tarjeta, index) => {
                                return (
                                    <tr key={tarjeta.ente}>
                                        <td>{tarjeta.ente}</td>
                                        <td>{tarjeta.fecha_proceso}</td>
                                        <td>{tarjeta.cedula}</td>
                                        <td>{tarjeta.nombres}</td>
                                        <td>{tarjeta.tipo_tarjeta}</td>
                                        <td>{tarjeta.tipo_producto}</td>
                                        <td>
                                            <AccionesTarjetaV2 />
                                        </td>
                                    </tr>
                                );
                            })}
                        </Table>
                    </div>

                }

                


                
                
              

            </div>

            <ModalDinamico
                modalIsVisible={modalEnviarPersonalizacion}
                titulo={`Aviso!!!`}
                onCloseClick={closeModaEnvioPersonalizacion}
                type="sm"
            >
                <div className="pbmg4 ptmg4">
                    <div className="f-row mb-4">
                        {/*<h3 className="">¿Está seguro de realizar el envio de </h3>  <h3 className="strong">&nbsp;{totalTarjetasEnviar}&nbsp;</h3>  <h3>tarjetas a personalizar?</h3>*/}
                        <h3 className="">¿Está seguro de realizar el envio de tarjetas a personalizar?</h3>
                    </div>
                    <div className="center_text_items">
                        <button className="btn_mg btn_mg__primary mt-2" disabled={false} type="submit" onClick={envioPersonalizacionHandler}>Enviar</button>
                        <button className="btn_mg btn_mg__secondary mt-2 " onClick={closeModaEnvioPersonalizacion}>Cancelar</button>
                    </div>

                </div>
            </ModalDinamico>
        </div>
    )




}


const AccionesTarjeta = () => {
    return (
        <div className="f-row" style={{ gap: "6px", justifyContent: "center" }}>

            <button className="btn_mg_icons noborder"  title="Imprimir contrato">
                <img className="img-icons-acciones" src="Imagenes/printIcon.svg" alt="Imprimir contrato"></img>
            </button>

            <button className="btn_mg_icons noborder" title="Subir Doc Escaneado">
                <img className="img-icons-acciones" src="Imagenes/upload_file.svg" alt="Subir Doc Escaneado"></img>
            </button>

            <button className="btn_mg_icons noborder" title="Entregar Tc">
                <img className="img-icons-acciones" src="Imagenes/entregar.svg" alt="Entregar Tc"></img>
            </button>

        </div>
    )
}


const AccionesTarjetaV2 = () => {
    return (
        <div className="f-row" style={{ gap: "6px", justifyContent: "center" }}>

            <button className="btn_mg_icons noborder" title="Visualizar documentos">
                <img className="img-icons-acciones" src="Imagenes/search.svg" alt="Visualizar documentos"></img>
            </button>

            <button className="btn_mg_icons noborder" title="Regresar Tc">
                <img className="img-icons-acciones" src="Imagenes/return.svg" alt="Regresar Tc"></img>
            </button>

            <button className="btn_mg_icons noborder" title="Activar Tc">
                <img className="img-icons-acciones" src="Imagenes/activate.svg" alt="Activar Tc"></img>
            </button>

        </div>
    )
}

export default connect(mapStateToProps, {})(EntregaSocio);