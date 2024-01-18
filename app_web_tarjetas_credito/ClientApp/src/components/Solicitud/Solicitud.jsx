import { connect, useDispatch } from 'react-redux';
import '../../scss/main.css';
import '../../scss/components/solicitud.css';
import { useState, useEffect } from "react";
import { fetchValidacionSocio } from "../../services/RestServices";
import { IsNullOrWhiteSpace } from '../../js/utiles';
import Modal from '../Common/Modal/Modal';

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
    const dispatch = useDispatch();
    const [accion, setAccion] = useState("");
    const [tipoDoc, setTipoDoc] = useState("");
    const [documento, setDocumento] = useState("");
    const [validaciones, setValidaciones] = useState([]);
    const [openModal, setOpenModal] = useState(false);


    const accionHandler = (e) => {
        setAccion(e.target.value);
    }

    const tipoDocHandler = (e) => {
        setTipoDoc(e.target.value);
    }

    const documentoHandler = (e) => {
        setDocumento(e.target.value);
    }
    const submitConsultaValidaciones = async (event) => {
        event.preventDefault();
        await fetchValidacionSocio(documento, props.token, (data) => {

            setValidaciones([...data.cuerpo]);
            
        }, dispatch)
    }

    const closeModalHandler = () => {
        setOpenModal(false);
    }

    useEffect(() => {
        if (validaciones.length > 0) {
            setOpenModal(true);
        }
    }, [validaciones]);

    return (<div className="container_mg">
        <div className="consulta_buro">
            <form class="form_mg form_mg__md" onSubmit={submitConsultaValidaciones}>
                <div class="form_mg__item form_mg__item_row">
                    

                    <label for="tipo_accion">Seleccione acción...</label>
                    <select tabIndex="1" id="tipo_accion" onChange={accionHandler}>
                        <option value="solicitud">Solicitud</option>
                        <option value="prospeccion">Prospección</option>
                    </select>

                    <label for="tipo_documento">Seleccione tipo documento...</label>
                    <select tabIndex="2" id="tipo_documento" onChange={tipoDocHandler}>
                        <option value="cc">Cédula</option>
                        <option value="ruc">R.U.C</option>
                        <option value="pasaporte">Pasaporte</option>
                    </select>

                    <label for="username" class="pbmg1"></label>
                    <input tabIndex="3" type="text" name="username" placeholder="Número de cédula" id="username" autoComplete="off" onChange={documentoHandler} />
                </div>
                <button class="btn_mg btn_mg__primary">Siguiente</button>

            </form>
        </div>
        <div id="listado_solicitudes">
            <table>
                <thead>
                    <tr>
                        <th>Identificación</th>
                        <th>Nombre solicitante</th>
                        <th>Producto TC</th>
                        <th>Monto</th>
                        <th>Calificación</th>
                        <th>Estado</th>
                        <th>Oficina Crea</th>
                        <th>Oficial</th>
                        <th>Usuario</th>
                        <th>Fecha modificación</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1106546468</td>
                        <td>Edison José Villamagua Mendieta</td>
                        <td>Black</td>
                        <td>$3600</td>
                        <td>OK</td>
                        <td>Aprobada</td>
                        <td>Matriz</td>
                        <td>xnojeda</td>
                        <td>xnojeda</td>
                        <td>09/01/2023</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>1186549865</td>
                        <td>Janeth del Cisne Lojan</td>
                        <td>Black</td>
                        <td>$3600</td>
                        <td>OK</td>
                        <td>Aprobada</td>
                        <td>Matriz</td>
                        <td>xnojeda</td>
                        <td>xnojeda</td>
                        <td>09/01/2023</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>

        {openModal && <Modal>            
            <table>
                <thead>
                    <tr>
                        <th>Validación</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        validaciones.map((validacion) => {
                            console.log(validacion);
                            return (<tr>
                                <td>{validacion.str_descripcion_alerta}</td>
                                <td>{validacion.str_estado_alerta}</td>
                            </tr>);
                        })
                    }
                </tbody>
            </table>
            <button className="btn_mg btn_mg__secondary" onClick={closeModalHandler}>Cerrar</button>
            <button className="btn_mg btn_mg__primary">Siguiente</button>            
        </Modal>}        
    </div>);

}

export default connect(mapStateToProps, {})(Solicitud);