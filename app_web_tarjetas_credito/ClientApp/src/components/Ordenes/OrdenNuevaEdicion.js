import { useState, useEffect } from 'react';
import Sidebar from '../Common/Navs/Sidebar';
import Card from '../Common/Card';
import { useHistory } from 'react-router-dom';
import Table from '../Common/Table';
import Chip from '../Common/UI/Chip'
import Input from '../Common/UI/Input'
import { IsNullOrWhiteSpace } from '../../js/utiles';
import { connect } from 'react-redux';

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
        { nombre: 'Seleccionar', key: 0 }, { nombre: 'Cuenta', key: 1 }, { nombre: 'Tipo Identificacion', key: 2 },
        { nombre: 'Identificación', key: 3 }, { nombre: 'Ente', key: 4 }, { nombre: 'Nombre', key: 5 },
        { nombre: 'Nombre impreso', key: 6 }, { nombre: 'Producto TC.', key: 7 }, { nombre: 'Cupo solicitado', key: 8 }, 
    ]

    /* LO QUE RETORNARIA DESDE EL BACK */
    const bodyTarjetasAprobadas = [
        { cuenta: "410010064540", tipo_identificacion: "C", identificacion: "1150214375", ente: "189610", nombre: "DANNY VASQUEZ", nombre_impreso: "DANNY VASQUEZ", tipo: "BLACK", cupo: "8000", key: 23, Agencia: { nombre: "MATRIZ",  id: "1"  } },
        { cuenta: "410010026841", tipo_identificacion: "C", identificacion: "1105970717", ente: "515145", nombre: "ROBERTH TORRES", nombre_impreso: "ROBERTH TORRES", tipo: "GOLDEN", cupo: "15000", key: 28, Agencia: { nombre: "CATAMAYO", id: "3" } },
        { cuenta: "410010061199", tipo_identificacion: "R", identificacion: "1105970712001", ente: "515146", nombre: "JUAN TORRES", nombre_impreso: "JUAN TORRES", tipo: "GOLDEN", cupo: "15000", key: 38, Agencia: { nombre: "MATRIZ", id: "1" } }, 
        { cuenta: "410010094684", tipo_identificacion: "P", identificacion: "PL970713", ente: "515147", nombre: "LUIS TORRES", nombre_impreso: "LUIS TORRES", tipo: "ESTÁNDAR", cupo: "15000", key: 48, Agencia: { nombre: "CATAMAYO", id: "3" } }, 
        { cuenta: "410010061514", tipo_identificacion: "R", identificacion: "1105970714001", ente: "515148", nombre: "ROBERTH TORRES", nombre_impreso: "ROBERTH TORRES", tipo: "ESTÁNDAR", cupo: "15000", key: 58, Agencia: { nombre: "MATRIZ", id: "1" } }, 
        { cuenta: "410010064000", tipo_identificacion: "P", identificacion: "PZ970715", ente: "515149", nombre: "ROBERTH TORRES", nombre_impreso: "ROBERTH TORRES", tipo: "GOLDEN", cupo: "15000", key: 68}
    ]

    //OBJETO SIMULADO PARA EDITAR DATOS
    const objetoEditacion = [
        {
            orden: "164",
            prefijo_tarjeta: "53",
            cost_emision: "no_cobro_emision",
            descripcion: "TARJETAS SOLICITADAS PARA MES DE ABRIL",
            tarjetas_solicitadas: [
                bodyTarjetasAprobadas[1],
                bodyTarjetasAprobadas[3]
            ]

        }
    ]

    
    const navigate = useHistory();
    const [lstOrdenTarjetas, setLstOrdenTarjetas] = useState([]);
    const [accion, setAccion] = useState();
    const [accionBtn, setAccionBtn] = useState();
    const [agenciaSolicita, setAgenciaSolicita] = useState("-1");
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
                setAccion("Editar Orden")
                setAccionBtn("Modificar orden")

                /// TODO: traer data desde el back por peticion O VER SI DESDE LISTA ORDEN ENVIAR EL OBJETO YA A EDITAR
                setLstOrdenTarjetas(objetoEditacion[0].tarjetas_solicitadas);
                setNrOrden(objetoEditacion[0].orden);
                setCostoEmision(objetoEditacion[0].cost_emision);
                setDescripcion(objetoEditacion[0].descripcion);
                setPrefijo(objetoEditacion[0].prefijo_tarjeta);
                setTarjetasAprobadasCheckBox(objetoEditacion[0].tarjetas_solicitadas.map(tarjeta => tarjeta.identificacion));

                //Estado para select de agencia
                setAgenciaSolicita(objetoEditacion[0]?.tarjetas_solicitadas[0]?.Agencia?.id);
                //Estado de check para editar
                setDesactivarCheckEditar(true);

            }
        }
    }, [])

    const agenciaHadler = (e) => {
        setAgenciaSolicita(e.target.value)
        // TODO: llamado a back para todas las tarjetas
        // llamar al fetch correspondiente
        const tarjetasDisponibles = bodyTarjetasAprobadas.filter(tarjeta => tarjeta?.Agencia?.id === e.target.value)
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
            console.log("IMPLEMENTAR GUARDADO,", e);
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
                                    <label htmlFor="agencia_solicita" className="pbmg1 lbl-input label_horizontal">Seleccione la Agencia que solicita nueva orden de tarjetas:</label>
                                    <div className="form_mg__item ptmg1">
                                        <select id="agencia_solicita" name="agencia_solicita" defaultValue={"-1"} onChange={agenciaHadler} value={agenciaSolicita} disabled={desactivarCheckEditar }>
                                            <option value="-1" disabled={true}>----- SELECCIONE UNA AGENCIA -----</option>
                                            <option value="1">MATRIZ</option>
                                            <option value="2">SARAGURO</option>
                                            <option value="3">CATAMAYO</option>
                                            <option value="4">CARIAMANGA</option>
                                            <option value="5">ALAMOR</option>
                                            <option value="6">ZAMORA</option>
                                            <option value="7">CUENCA</option>
                                            <option value="8">AGENCIA NORTE</option>
                                            <option value="9">MACARA</option>
                                            <option value="10">AGENCIA SUR</option>
                                            <option value="11">AGENCIA YANTZAZA</option>
                                            <option value="12">BALSAS</option>
                                            <option value="13">CATACOCHA</option>
                                            <option value="14">SANTA ROSA</option>
                                            <option value="15">AGENCIA GUALAQUIZA</option>
                                            <option value="16">AGENCIA CUARTO CENTENARIO</option>
                                            <option value="17">AGENCIA ZUMBA</option>
                                            <option value="18">AGENCIA EL VALLE</option>
                                            <option value="19">AGENCIA MACHALA</option>
                                            <option value="20">AGENCIA EL EJIDO</option>
                                            <option value="21">AGENCIA LATACUNGA</option>
                                            <option value="22">AGENCIA SANTO DOMINGO</option>
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
                                                <td>{tarjeta.cuenta}</td>
                                                <td>{tarjeta.tipo_identificacion}</td>
                                                <td>{tarjeta.identificacion}</td>
                                                <td>{tarjeta.ente}</td>
                                                <td>{tarjeta.nombre}</td>
                                                <td>{tarjeta.nombre_impreso}</td>
                                                <td><Chip type={conversionTipoTC(tarjeta.tipo)}>{tarjeta.tipo}</Chip></td>
                                                <td>{`$ ${Number(tarjeta.cupo).toLocaleString('en-US')}`}</td>

                                            </tr>
                                        );
                                    })}

                                </Table>
                            </div>
                        }

                        {lstOrdenTarjetas.length === 0 &&
                            <p style={{ fontSize: '18px' }}> <strong> No existe tarjetas aprobadas de la agencia seleccionada </strong> </p> 
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