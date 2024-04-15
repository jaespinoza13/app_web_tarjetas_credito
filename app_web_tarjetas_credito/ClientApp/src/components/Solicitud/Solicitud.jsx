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
    const [accionesSolicitud, setAccionesSolicitud] = useState(
        [
            { image: "", textPrincipal: `Solicitudes`, textSecundario: "", key: 1 },
            { image: "", textPrincipal: `Prospectos`, textSecundario: "", key: 2 }
        ]);


    //Headers tablas
    const headerTableSolicitantes = ['Identificación', 'Ente', 'Nombre solicitante',
        'Producto TC', 'Monto', 'Calificación', 'Estado', 'Oficina Crea',
        'Oficial', 'Usuario', 'Fecha modificación', 'Acciones'];

    const headerTableProspectos = ['Id', 'Cédula', 'Nombres',
        'Celular', 'Correo', 'Cupo solicitado', 'Usuario Crea'];


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
                    <Table headers={headerTableSolicitantes} data={lstSolicitudes} tipo={"Solicitudes"}></Table>
                </div>
            }
            {isLstProspecciones &&
                <div id="listado_solicitudes">
                    <Table headers={headerTableProspectos} data={lstProstectos} tipo={"Prospectos"}></Table>
                </div>
            }
            
        </div>
    </div>);

}

export default connect(mapStateToProps, {})(Solicitud);