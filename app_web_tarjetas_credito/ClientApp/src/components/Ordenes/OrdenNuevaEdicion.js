import { useState, useEffect } from 'react';
import Sidebar from '../Common/Navs/Sidebar';
import Card from '../Common/Card';
import { useHistory } from 'react-router-dom';
import Table from '../Common/Table';
import Chip from '../Common/UI/Chip'
import { Input, FormGroup } from 'reactstrap';
import { RadioGroup, Radio, FormControlLabel, Checkbox } from '@mui/material';
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
        { cuenta: "410010064540", tipo_identificacion: "C", identificacion: "1150214375", ente: "189610", nombre: "DANNY VASQUEZ", nombre_impreso: "DANNY VASQUEZ",tipo: "BLACK", cupo: "8000", key: 23 },
        { cuenta: "410010026841", tipo_identificacion: "C", identificacion: "1105970717", ente: "515145", nombre: "ROBERTH TORRES", nombre_impreso: "ROBERTH TORRES", tipo: "GOLDEN", cupo: "15000", key: 28 },
        { cuenta: "410010061199", tipo_identificacion: "R", identificacion: "1105970712001", ente: "515146", nombre: "JUAN TORRES", nombre_impreso: "JUAN TORRES", tipo: "ESTÁNDAR", cupo: "15000", key: 38 },
        { cuenta: "410010094684", tipo_identificacion: "P", identificacion: "PL970713", ente: "515147", nombre: "LUIS TORRES", nombre_impreso: "LUIS TORRES", tipo: "GOLDEN", cupo: "15000", key: 48 },
        { cuenta: "410010061514", tipo_identificacion: "R", identificacion: "1105970714001", ente: "515148", nombre: "ROBERTH TORRES", nombre_impreso: "ROBERTH TORRES", tipo: "ESTÁNDAR", cupo: "15000", key: 58 },
        { cuenta: "410010064000", tipo_identificacion: "P", identificacion: "PZ970715", ente: "515149", nombre: "ROBERTH TORRES", nombre_impreso: "ROBERTH TORRES", tipo: "GOLDEN", cupo: "15000", key: 68 }
    ]

    //OBJETO SIMULADO PARA EDITAR DATOS
    const objetoEditacion = [
        {
            orden: "164",
            prefijo_tarjeta: "53",
            cost_emision: "cobro_emision",
            descripcion: "TARJETAS SOLICITADAS PARA MES DE ABRIL",
            tarjetas_solicitadas: [
                bodyTarjetasAprobadas[0],
                bodyTarjetasAprobadas[2]
            ]

        }
    ]

    
    const navigate = useHistory();
    const [lstOrdenTarjetas, setLstOrdenTarjetas] = useState([]);
    const [accion, setAccion] = useState();
    const [accionBtn, setAccionBtn] = useState();

    const [nrOrnden, setNrOrden] = useState();
    const [prefijo, setPrefijo] = useState(0);
    const [costoEmision, setCostoEmision] = useState("no_cobro_emision");
    const [descripcion, setDescripcion] = useState();
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
        setNrOrden(e.target.value);
    }

    const setCostoEmisionHandler = (e) => {
        setCostoEmision(e.target.value);
    }

    const setPrefijoHandler = (e) => {
        setPrefijo(e.target.value);
    }

    const setDescripcionHandler = (e) => {
        setDescripcion(e.target.value);
    }

    useEffect(() => {
        setIsSelectAll(tarjetasAprobadasCheckBox.length === lstOrdenTarjetas.length && tarjetasAprobadasCheckBox.length !== 0);
    }, [tarjetasAprobadasCheckBox]);



    useEffect(() => {

        if (props.location.pathname === '/orden/nueva' && (props.location?.state?.numOrdenEditar === null || props.location?.state?.numOrdenEditar === undefined || props.location?.state?.numOrdenEditar === -1)) {
            setAccion("Crear Orden")
            setAccionBtn("Registrar nueva orden")

            // TODO: llamado a back para todas las tarjetas 
            // llamar al fetch correspondiente
            setLstOrdenTarjetas(bodyTarjetasAprobadas);
            
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

            }
        }
    }, [])

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
        }
    };

    return (
        <div className="f-row">
            <Sidebar></Sidebar>
            <div className="container_mg">


                <Card className={["m-max justify-content-space-between align-content-center"]}>
                    <br />
                    <h2>{accion}</h2>
                    <br />

                    <form className="form_mg" onSubmit={onSubmitOrden} autoComplete="off">
                        <section className="elements_two_column">
                            <FormGroup>

                                <div className="form_mg_row">
                                    <label htmlFor="tipoTC" className="pbmg1 lbl-input label_horizontal">Número de orden</label>
                                    <div className="form_mg__item ptmg1">

                                        <Input type="text" value={nrOrnden} placeholder="Número de orden" onChange={setNrOrdenHandler}></Input>
                                    </div>
                                </div>

                            </FormGroup>

                            <FormGroup>

                                <div className="form_mg_row">
                                    <label htmlFor="tipoTC" className="pbmg1 lbl-input label_horizontal">Costo de emisión</label>
                                    <div className="form_mg__item">

                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            value={costoEmision}
                                            onChange={setCostoEmisionHandler}
                                        >
                                            <FormControlLabel value="cobro_emision" control={<Radio />} label="Si" disabled={enableCostoEmision} />
                                            <FormControlLabel value="no_cobro_emision" control={<Radio />} label="No" disabled={enableCostoEmision} />

                                        </RadioGroup>


                                    </div>
                                </div>

                            </FormGroup>

                            <FormGroup>

                                <div className="form_mg_row">
                                    <label htmlFor="tipoTC" className="pbmg1 lbl-input label_horizontal">Prefijo</label>
                                    <div className="form_mg__item ptmg1">
                                        <Input type="number" value={prefijo} onChange={setPrefijoHandler} min={0}></Input>
                                    </div>
                                </div>

                            </FormGroup>


                            <FormGroup>

                                <div className="form_mg_row">
                                    <label htmlFor="tipoTC" className="pbmg1 lbl-input label_horizontal">Descripción de la orden</label>
                                    <div className="form_mg__item ptmg1">
                                        <Input type="text" value={descripcion} placeholder="Ingrese alguna descripción de la orden" onChange={setDescripcionHandler}></Input>
                                    </div>
                                </div>

                            </FormGroup>
                        </section>

                        <div id="listado_ordenes" className="mt-3">
                            <Table headers={headersTarjetasAprobadas} multipleOpcion={true} onChangeCheckBox={seleccionMultiple} isSelectAll={isSelectAll}>
                                {/*BODY*/}
                                {lstOrdenTarjetas.map((tarjeta, index) => {
                                    return (
                                        <tr key={tarjeta.ente}>
                                            <td>
                                                <Checkbox key={tarjeta.identificacion} checked={tarjetasAprobadasCheckBox.includes(tarjeta.identificacion)} onChange={() => checkTarjeta(tarjeta.identificacion)} />
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


                        <div className="center_text_items">
                            <button className="btn_mg btn_mg__primary" style={{ width: "200px" }} disabled={false} type="submit">
                                Registrar</button>
                        </div>
                    </form>

                </Card>



            </div>


        </div>
    )

}

export default connect(mapStateToProps, {})(OrdenNuevaEdicion); 