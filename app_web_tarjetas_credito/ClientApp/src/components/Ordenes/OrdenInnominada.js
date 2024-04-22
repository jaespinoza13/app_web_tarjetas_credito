import { useState } from 'react';
import Sidebar from '../Common/Navs/Sidebar';
import { useEffect } from 'react';

import Card from '../Common/Card';
import Item from '../Common/UI/Item';
import Button from '../Common/UI/Button';

import Table from '../Common/Table';
import Chip from '../Common/UI/Chip'
import Input from '../Common/UI/Input'

import RateReviewSharpIcon from '@mui/icons-material/RateReviewSharp';
import { IconButton, RadioGroup, Radio, FormControlLabel } from '@mui/material';
import { FormGroup } from 'reactstrap';
import { IsNullOrWhiteSpace } from '../../js/utiles';
import { connect, useDispatch } from 'react-redux';
import Checkbox from '@mui/material/Checkbox';

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


function OrdenInnominada(props) {

    const headersTarjetasAprobadas = [
        { nombre: 'Seleccionar', key: 0 },
        { nombre: 'Identificación', key: 1 }, { nombre: 'Ente', key: 2 }, { nombre: 'Nombre', key: 3 },
        { nombre: 'Nombre impreso', key: 4 }, { nombre: 'Producto TC.', key: 5 }, { nombre: 'Cupo solicitado', key: 6 }
    ]

    const bodyTarjetasAprobadas = [
        { identificacion: "1150214375", ente: "189610", nombre: "DANNY VASQUEZ", nombre_impreso: "DANNY VASQUEZ", tipo: "BLACK", cupo: "8000", key: 23 },
        { identificacion: "1105970717", ente: "515145", nombre: "ROBERTH TORRES", nombre_impreso: "ROBERTH TORRES", tipo: "GOLDEN", cupo: "15000", key: 28 },
        { identificacion: "1105970712", ente: "515146", nombre: "ROBERTH TORRES", nombre_impreso: "ROBERTH TORRES", tipo: "ESTÁNDAR", cupo: "15000", key: 38 },
        { identificacion: "1105970713", ente: "515147", nombre: "ROBERTH TORRES", nombre_impreso: "ROBERTH TORRES", tipo: "GOLDEN", cupo: "15000", key: 48 },
        { identificacion: "1105970714", ente: "515148", nombre: "ROBERTH TORRES", nombre_impreso: "ROBERTH TORRES", tipo: "ESTÁNDAR", cupo: "15000", key: 58 },
        { identificacion: "1105970715", ente: "515149", nombre: "ROBERTH TORRES", nombre_impreso: "ROBERTH TORRES", tipo: "GOLDEN", cupo: "15000", key: 68 }
    ]


    const [nrOrnde, setNrOrden] = useState();
    const [prefijo, setPrefijo] = useState(0);
    const [costoEmision, setCostoEmision] = useState("no_cobro_emision");
    const [enableCostoEmision, setEnableCostoEmision] = useState(false); //TODO: MODIFICAR EN CASO QUIERA PARAMETRIZACION
    const [descripcion, setDescripcion] = useState();


    const [tarjetasAprobadasCheckBox, setTarjetasAprobadasCheckBox] = useState([]);
    const [isSelectAll, setIsSelectAll] = useState(false);

    const seleccionMultiple = (e) => {
        toggleSelectAll();
        setIsSelectAll(!isSelectAll);
    }


    const toggleSelectAll = () => {
        setIsSelectAll(!isSelectAll);
        if (!isSelectAll) {
            setTarjetasAprobadasCheckBox(bodyTarjetasAprobadas.map(tarjeta => tarjeta.identificacion));
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
        if (isSelectAll && tarjetasAprobadasCheckBox.length !== bodyTarjetasAprobadas.length) {
            setIsSelectAll(false);
        }
    }

    const setNrOrdenHandler = (value) => {
        setNrOrden(value);
    }

    const setCostoEmisionHandler = (e) => {
        console.log(e.target.value)
        setCostoEmision(e.target.value);
    }

    const setPrefijoHandler = (value) => {
        setPrefijo(value);
    }

    const setDescripcionHandler = (value) => {
        setDescripcion(value);
    }

    useEffect(() => {
        setIsSelectAll(tarjetasAprobadasCheckBox.length === bodyTarjetasAprobadas.length);
        console.log(tarjetasAprobadasCheckBox)
    }, [tarjetasAprobadasCheckBox]);


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


    return (
        <div className="f-row">
            <Sidebar></Sidebar>
            <div className="container_mg">


                <Card className={["m-max justify-content-space-between align-content-center"]}>

                    <br />
                    <h2>Crear Orden</h2>
                    <br />


                    <form className="form_mg" onSubmit={(e) => { console.log("ENVIAR"); e.preventDefault() }} autoComplete="off">
                        <section className="elements_two_column">
                            <FormGroup>

                                <div className="form_mg_row">
                                    <label htmlFor="tipoTC" className="pbmg1 lbl-input label_horizontal">Número de orden</label>
                                    <div className="form_mg__item ptmg1">

                                        <Input type="text" placeholder="Número de orden" setValueHandler={setNrOrdenHandler}></Input>
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
                                        <Input type="number" setValueHandler={setPrefijoHandler} max={99} min={0}></Input>
                                    </div>
                                </div>

                            </FormGroup>


                            <FormGroup>

                                <div className="form_mg_row">
                                    <label htmlFor="tipoTC" className="pbmg1 lbl-input label_horizontal">Descripción de la orden</label>
                                    <div className="form_mg__item ptmg1">
                                        <Input type="text" placeholder="Ingrese alguna descripción de la orden" setValueHandler={setDescripcionHandler}></Input>
                                    </div>
                                </div>

                            </FormGroup>
                        </section>


                        </form>



                    <div id="listado_ordenes" className="mt-3">
                        <Table headers={headersTarjetasAprobadas} multipleOpcion={true} onChangeCheckBox={seleccionMultiple} isSelectAll={isSelectAll}>
                            {/*BODY*/}
                            {bodyTarjetasAprobadas.map((tarjeta, index) => {
                                return (
                                    <tr key={tarjeta.ente}>
                                        <td>
                                            <Checkbox key={tarjeta.identificacion} checked={tarjetasAprobadasCheckBox.includes(tarjeta.identificacion)} onChange={() => checkTarjeta(tarjeta.identificacion)} />
                                        </td>
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
                        <button className="btn_mg btn_mg__primary" style={{ width: "200px" }} disabled={false}>
                            Registrar</button>
                    </div>

                </Card>



            </div>


        </div>
    )

}

export default connect(mapStateToProps, {})(OrdenInnominada);