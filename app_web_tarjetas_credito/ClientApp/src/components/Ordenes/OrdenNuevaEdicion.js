import { useState, useEffect } from 'react';
import Sidebar from '../Common/Navs/Sidebar';
import Card from '../Common/Card';
import { useHistory } from 'react-router-dom';
import Table from '../Common/Table';
import Chip from '../Common/UI/Chip'
import Input from '../Common/UI/Input'
import { IsNullOrWhiteSpace } from '../../js/utiles';
import { connect } from 'react-redux';
import { ObjSolicitudesAprob, objConfirmacionRecepcionTarjetas } from './ObjetosMock';

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


function OrdenNuevaEdicion(props) {

    const headersTarjetasAprobadas = [
        { nombre: 'Seleccionar', key: 0 }, { nombre: 'Oficina Recepta', key: 1 }, { nombre: 'Cuenta', key: 2 },
        { nombre: 'Identificación', key: 3 }, { nombre: 'Ente', key: 4 }, { nombre: 'Nombre impreso', key: 5 },
        { nombre: 'Producto TC.', key: 6 }, { nombre: 'Cupo solicitado', key: 7 }, 
    ]


    const [lstOrdenTarjetas, setLstOrdenTarjetas] = useState([]);
    
    const navigate = useHistory();
    const [accion, setAccion] = useState();
    const [accionBtn, setAccionBtn] = useState();
    const [tipoProducto, setTipoProducto] = useState("-1");
    const [desactivarCheckEditar, setDesactivarCheckEditar] = useState();

    const [nrOrnden, setNrOrden] = useState("");
    const [prefijo, setPrefijo] = useState("");
    const [costoEmision, setCostoEmision] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [enableCostoEmision, setEnableCostoEmision] = useState(false); //TODO: MODIFICAR EN CASO QUIERA PARAMETRIZACION

    const [tarjetasAprobadasCheckBox, setTarjetasAprobadasCheckBox] = useState([]);
    const [isSelectAll, setIsSelectAll] = useState(false);

    const seleccionMultiple = (e) => {
        toggleSelectAll();
        setIsSelectAll(!isSelectAll);
    }


    const toggleSelectAll = () => {
        setIsSelectAll(!isSelectAll);
        if (!isSelectAll) {
            setTarjetasAprobadasCheckBox(lstOrdenTarjetas.map(tarjeta => tarjeta.identificacion));
        } else {
            setTarjetasAprobadasCheckBox([]);
        }
    };


    const checkTarjeta = (identificacion) => {
        if (tarjetasAprobadasCheckBox.includes(identificacion)) {
            setTarjetasAprobadasCheckBox(tarjetasAprobadasCheckBox.filter(tarjeta_identificacion => tarjeta_identificacion !== identificacion));
        } else {
            setTarjetasAprobadasCheckBox([...tarjetasAprobadasCheckBox, identificacion]);
        }

        //Deseleccionar todas las opciones
        if (isSelectAll && tarjetasAprobadasCheckBox.length !== lstOrdenTarjetas.length) {
            setIsSelectAll(false);
        }
    }

    const setNrOrdenHandler = (e) => {
        setNrOrden(e);
    }

    const setCostoEmisionHandler = (e) => {
        setCostoEmision(e);
    }

    const setPrefijoHandler = (e) => {
        setPrefijo(e);
    }

    const setDescripcionHandler = (e) => {
        setDescripcion(e);
    }

    useEffect(() => {
        setIsSelectAll(tarjetasAprobadasCheckBox.length === lstOrdenTarjetas.length && tarjetasAprobadasCheckBox.length !== 0);
    }, [tarjetasAprobadasCheckBox]);



    useEffect(() => {

        if (props.location.pathname === '/orden/nueva' && (props.location?.state?.numOrdenEditar === null || props.location?.state?.numOrdenEditar === undefined || props.location?.state?.numOrdenEditar === -1)) {
            setAccion("Crear Orden")
            setAccionBtn("Registrar nueva orden")
            //Estado de check table
            setDesactivarCheckEditar(false);

         
        }
        else {
            //Control para evitar saltarse al editar, sin tener el numero de Orden
            if (props.location.pathname === '/orden/editar' && props.location?.state?.numOrdenEditar === undefined) {
                navigate.push('/orden');
            }
            else {
                
                setAccion("Editar Orden");
                setAccionBtn("Modificar orden");

                //LlAMAR METODO API
                /// TODO: traer data desde el back por peticion O VER SI DESDE LISTA ORDEN ENVIAR EL OBJETO YA A EDITAR
                setLstOrdenTarjetas(objConfirmacionRecepcionTarjetas[1].orden_tarjetaDet);
                setNrOrden(objConfirmacionRecepcionTarjetas[1].orden);
                setCostoEmision(objConfirmacionRecepcionTarjetas[1].cost_emision);
                setDescripcion(objConfirmacionRecepcionTarjetas[1].descripcion);
                setPrefijo(objConfirmacionRecepcionTarjetas[1].prefijo_tarjeta);
                setTarjetasAprobadasCheckBox(objConfirmacionRecepcionTarjetas[1].orden_tarjetaDet.map(tarjeta => tarjeta.identificacion));

                //Estado para select de agencia
                setTipoProducto(objConfirmacionRecepcionTarjetas[1].oficina_solicita);
                //Estado de check para editar
                setDesactivarCheckEditar(true);
                
            }
        }
    }, [])

    const tipoProductoHandler = (e) => {
        setTipoProducto(e.target.value);
        setTarjetasAprobadasCheckBox([]);
        setIsSelectAll(false);
        // TODO: llamado a back para todas las tarjetas
        // llamar al fetch correspondiente
        const tarjetasDisponibles = ObjSolicitudesAprob.filter(tarjetaSolicitud => tarjetaSolicitud.tipo === e.target.value)
        setLstOrdenTarjetas(tarjetasDisponibles);
    }

    const conversionTipoTC = (tipo) => {
        let chipType = '';
        switch (tipo) {
            case 'BLACK':
                chipType = 'black'
                break;
            case 'GOLDEN':
                chipType = 'gold'
                break;
            case 'ESTÁNDAR':
                chipType = 'standar'
                break;
            default:
                break;
        }
        return chipType;
    }
    

    const onSubmitOrden = (e) => {
        e.preventDefault();
        if (tarjetasAprobadasCheckBox.length === 0) {
            window.alert("SELECCIONE ALMENOS UNA TARJETA PARA CREAR LA ORDEN");
        } else {
            window.alert("SE GUARDO CORRECTAMENTE LA ORDEN");
            navigate.push('/orden');
        }
    };

    return (
        <div className="f-row">
            <Sidebar enlace={props.location.pathname }></Sidebar>
            <div className="container_mg">


                <Card className={["m-max justify-content-space-between align-content-center"]}> 
                    <h2 className="mt-1 mb-5">{accion}</h2>


                    <form className="form_mg" onSubmit={onSubmitOrden} autoComplete="off">
                        <section className="elements_two_column">
                            <div>

                                <div className="form_mg_row">
                                    <label htmlFor="numOrdenTarjetas" className="pbmg1 lbl-input label_horizontal">Número de orden</label>
                                    <div className="form_mg__item ptmg1">

                                        <Input id="numOrdenTarjetas" name="numOrdenTarjetas" esRequerido={true} type="text" value={nrOrnden} placeholder="Número de orden" setValueHandler={setNrOrdenHandler}></Input>
                                    </div>
                                </div>

                            </div>

                            <div>

                                <div className="form_mg_row">
                                    <label id="label">Costo de emisión</label>
                                   <div className="form_mg__item">

                                        <div style={{ display: 'flex' }}>
                                            <div className=''>
                                                <input type="radio" id="cobro_emision" name="cobro_tarjeta" value="cobro_emision" checked={costoEmision === "cobro_emision"} onChange={() => setCostoEmisionHandler("cobro_emision")} disabled={enableCostoEmision} />
                                                <label htmlFor="cobro_emision" style={{ lineHeight: "1.5" }}>Si</label>
                                            </div>
                                            <div className=''>
                                                <input type="radio" id="no_cobro_emision" name="cobro_tarjeta" value="no_cobro_emision" checked={costoEmision === "no_cobro_emision"} onChange={() => setCostoEmisionHandler("no_cobro_emision")} disabled={enableCostoEmision} required />
                                                <label htmlFor="no_cobro_emision">No *</label>
                                            </div>
                                        </div>
                                        {costoEmision === "" && <div className='text_error_validacion'>Escoja una opción.</div>}

                                    </div>
                                </div>

                            </div>

                            <div>

                                <div className="form_mg_row">
                                    <label htmlFor="tipoTC" className="pbmg1 lbl-input label_horizontal">Prefijo</label>
                                    <div className="form_mg__item ptmg1">
                                        <Input id="prefijo" name="prefijo" esRequerido={true} type="number" value={prefijo} min={0} setValueHandler={setPrefijoHandler}></Input>
                                    </div>
                                </div>

                            </div>

                            <div>

                                <div className="form_mg_row">
                                    <label htmlFor="descripcion" className="pbmg1 lbl-input label_horizontal">Descripción de la orden</label>
                                    <div className="form_mg__item ptmg1">
                                        <Input id="descripcion" name="descripcion" esRequerido={true} type="text" value={descripcion} placeholder="Ingrese alguna descripción de la orden" setValueHandler={setDescripcionHandler}></Input>
                                    </div>
                                </div>

                            </div>

                            <div>

                                <div className="form_mg_row">
                                    <label htmlFor="oficina_solicita" className="pbmg1 lbl-input label_horizontal">Seleccione el tipo de producto</label>
                                    <div className="form_mg__item ptmg1">
                                        <select id="oficina_solicita" name="oficina_solicita" defaultValue={"-1"} onChange={tipoProductoHandler} value={tipoProducto} disabled={desactivarCheckEditar }>
                                            <option value="-1" disabled={true}>----- SELECCIONE UN PRODUCTO -----</option>
                                            <option value="BLACK">BLACK</option>
                                            <option value="GOLDEN">GOLDEN</option>
                                            <option value="ESTANDAR">ESTANDAR</option>
                                        </select>
                                    </div>
                                </div>

                            </div>

                        </section>

                        {lstOrdenTarjetas.length > 0 &&
                            <div id="listado_ordenes" className="mt-3">
                                <Table headers={headersTarjetasAprobadas} multipleOpcion={true} onChangeCheckBox={seleccionMultiple} isSelectAll={isSelectAll} indexCheckbox={0}
                                    desactivarCheckEditar={desactivarCheckEditar}>
                                    {/*BODY*/}
                                    {lstOrdenTarjetas.map((tarjeta, index) => {
                                        return (
                                            <tr key={tarjeta.ente}>
                                                <td>
                                                    <Input key={tarjeta.identificacion} disabled={desactivarCheckEditar} type="checkbox" checked={tarjetasAprobadasCheckBox.includes(tarjeta.identificacion)} setValueHandler={() => checkTarjeta(tarjeta.identificacion)}></Input>

                                                </td>
                                                <td>{tarjeta.oficina_recepta}</td>
                                                <td>{tarjeta.cuenta}</td>
                                                <td>{tarjeta.identificacion}</td>
                                                <td>{tarjeta.ente}</td>
                                                <td>{tarjeta.nombre}</td>
                                                <td><Chip type={conversionTipoTC(tarjeta.tipo)}>{tarjeta.tipo}</Chip></td>
                                                <td>{`$ ${Number(tarjeta.cupo).toLocaleString('en-US')}`}</td>

                                            </tr>
                                        );
                                    })}

                                </Table>
                            </div>
                        }

                        {lstOrdenTarjetas.length === 0 &&
                            <p style={{ fontSize: '18px' }}> <strong> No existe tarjetas aprobadas con ese tipo de producto. </strong> </p> 
                        }

                        <div className="center_text_items">
                            <button className="btn_mg btn_mg__primary" style={{ width: "200px" }} disabled={false} type="submit">
                                {accionBtn}</button>
                        </div>
                    </form>

                </Card>



            </div>


        </div>
    )

}

export default connect(mapStateToProps, {})(OrdenNuevaEdicion); 