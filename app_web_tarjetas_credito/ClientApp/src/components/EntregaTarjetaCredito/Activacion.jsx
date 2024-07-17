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


function Activacion(props) {

    const navigate = useHistory();
    const dispatch = useDispatch();

    const [inputBusqueda, setInputBusqueda] = useState([]);
    const [ordenItemsCheckTotal, setOrdenItemsCheckTotal] = useState([]);
    const [totalTarjetasEnviar, setTotalTarjetasEnviar] = useState(0);
    const [modalEnviarPersonalizacion, setModalEnviarPersonalizacion] = useState(false);

    const headersTarjetas = [{ key: 0, nombre: "Ente" }, { key: 1, nombre: "Fecha recepción" }, { key: 2, nombre: "Identificación" }, { key: 3, nombre: "Nombre del titular" }, { key: 4, nombre: "Tipo de tarjeta" }, { key: 5, nombre: "Tipo de producto" }, { key: 6, nombre: "Acciones" }]

    const tarjetas = [                   
        { ente: "1111", cedula: "1306543210", nombres: "JORGE SANCHEZ", tipo_producto: "ESTANDAR", fecha_recepcion: "14/07/2024 15:30", oficina_solicita: "EL VALLE",  tipo_tarjeta: "Principal" },
        { ente: "2222", cedula: "1001234567", nombres: "PATRICIA LOPEZ", tipo_producto: "GOLDEN", fecha_recepcion: "14/07/2024 15:30", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
        { ente: "3333", cedula: "1203456789", nombres: "CLAUDIA HERRERA", tipo_producto: "BLACK", fecha_recepcion: "14/07/2024 15:30", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
        { ente: "4443", cedula: "0509876543", nombres: "PEDRO RAMOS", tipo_producto: "GOLDEN", fecha_recepcion: "14/07/2024 15:35", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
   
       
    ]



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


                <div className="contentTableOrden mt-3 mb-3">
                    <Table headers={headersTarjetas}>
                        {/*BODY*/}
                        {tarjetas.map((tarjeta, index) => {
                            return (
                                <tr key={tarjeta.ente}>
                                    <td>{tarjeta.ente}</td>
                                    <td>{tarjeta.fecha_recepcion}</td>
                                    <td>{tarjeta.cedula}</td>
                                    <td>{tarjeta.nombres}</td>
                                    <td>{tarjeta.tipo_tarjeta}</td>
                                    <td>{tarjeta.tipo_producto}</td>                      
                                    <td>
                                        <AccionesTarjeta />
                                    </td>
                                </tr>
                            );
                        })}
                    </Table>
                </div>
              

            </div>

        </div>
    )




}


const AccionesTarjeta = () => {
    return (
        <div className="f-row" style={{ gap: "6px", justifyContent: "center" }}>

            <button className="btn_mg_icons noborder"  title="Visualizar documentos">
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

export default connect(mapStateToProps, {})(Activacion);