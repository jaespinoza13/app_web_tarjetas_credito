import { useState, useEffect } from 'react';
import Sidebar from '../Common/Navs/Sidebar';
import Card from '../Common/Card';
import { useHistory } from 'react-router-dom';
import Table from '../Common/Table';
import Chip from '../Common/UI/Chip'
import { Input} from 'reactstrap';
import { RadioGroup, Radio, FormControlLabel, FormLabel } from '@mui/material';
import { connect } from 'react-redux';
import Button from "../Common/UI/Button";
//import { generarPDF } from "../../js/generarPDF";



function VerOrden(props) {

    const headersTarjetasAprobadas = [
        { nombre: 'Cuenta', key: 0 }, { nombre: 'Tipo Identificacion', key: 1 },
        { nombre: 'Identificación', key: 2 }, { nombre: 'Ente', key: 3 }, { nombre: 'Nombre', key: 4 },
        { nombre: 'Nombre impreso', key: 5 }, { nombre: 'Producto TC.', key: 6 }, { nombre: 'Cupo solicitado', key: 7 }
    ]


    //OBJETO SIMULADO PARA TRAER INFORMACION DE LA ORDEN 
    const objetoEditacion = [
        {
            orden: "164",
            prefijo_tarjeta: "53",
            cost_emision: "cobro_emision",
            descripcion: "TARJETAS SOLICITADAS PARA MES DE ABRIL",
            agencia_solicita: { nombre: "MATRIZ", id: "1" },
            tarjetas_solicitadas: [
                { cuenta: "410010064540", tipo_identificacion: "C", identificacion: "1150214375", ente: "189610", nombre: "DANNY VASQUEZ", nombre_impreso: "DANNY VASQUEZ", tipo: "BLACK", cupo: "8000", key: 23, Agencia: { nombre: "MATRIZ", id: "1" } },
                { cuenta: "410010061199", tipo_identificacion: "R", identificacion: "1105970712001", ente: "515146", nombre: "JUAN TORRES", nombre_impreso: "JUAN TORRES", tipo: "GOLDEN", cupo: "15000", key: 38, Agencia: { nombre: "MATRIZ", id: "1" } },
                { cuenta: "410010061514", tipo_identificacion: "R", identificacion: "1105970714001", ente: "515148", nombre: "ROBERTH TORRES", nombre_impreso: "ROBERTH TORRES", tipo: "ESTÁNDAR", cupo: "15000", key: 58, Agencia: { nombre: "MATRIZ", id: "1" } },
                { cuenta: "410010064000", tipo_identificacion: "P", identificacion: "PZ970715", ente: "515149", nombre: "ROBERTH TORRES", nombre_impreso: "ROBERTH TORRES", tipo: "GOLDEN", cupo: "15000", key: 68, Agencia: { nombre: "MATRIZ", id: "1" } }
            ]

        }
    ]


    const navigate = useHistory();
    const [lstSolicitudes, setLstSolicitudes] = useState([]);


    const [nrOrnden, setNrOrden] = useState("");
    const [prefijo, setPrefijo] = useState("");
    const [costoEmision, setCostoEmision] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [agenciaSolicita, setAgenciaSolicita] = useState("");



    useEffect(() => {

        /*if (props.location.pathname === '/orden/verOrden' && (props.location?.state?.numOrden === null || props.location?.state?.numOrden === undefined || props.location?.state?.numOrden)) {
            navigate.push('/orden');
        }
        else {*/

        /// TODO: traer data desde el back por peticion O VER SI DESDE LISTA ORDEN ENVIAR EL OBJETO YA A EDITAR
        setLstSolicitudes(objetoEditacion[0].tarjetas_solicitadas);
        setNrOrden(objetoEditacion[0].orden);
        setCostoEmision(objetoEditacion[0].cost_emision);
        setDescripcion(objetoEditacion[0].descripcion);
        setPrefijo(objetoEditacion[0].prefijo_tarjeta);
        setAgenciaSolicita(objetoEditacion[0].agencia_solicita.nombre);

        console.log(objetoEditacion[0].tarjetas_solicitadas);

        //}
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

    //columns, data, accountNumber, name, typeMovement
    const onDescargarReporte = (e) => {
        e.preventDefault();
        //window.alert("DESCARGAR ORDEN");
        //generarPDF(objetoEditacion[0].tarjetas_solicitadas);
    };

    return (
        <div className="f-row">
            <Sidebar enlace={props.location.pathname}></Sidebar>
            <div className="container_mg">


                <Card className={["m-max justify-content-space-between align-content-center"]}>
                    <br />
                    <div style={{ display: "flex", position: "relative", paddingBottom: "70px" }}>
                        
                        <h2>VISUALIZAR DETALLE DE LA ORDEN</h2>
                        <Button className={["btn_mg btn_mg__primary mr-2 close-modal"]} onClick={onDescargarReporte} disabled={false}>Descargar reporte</Button>
                    </div>
                    

                    <section className="elements_two_column">

                        <div className="form_mg_row">
                            <label htmlFor="numOrdenTarjetas" className="pbmg1 lbl-input label_horizontal">Número de orden</label>
                            <div className="form_mg__item ptmg1">
                                <Input id="numOrdenTarjetas" name="numOrdenTarjetas" type="text" value={nrOrnden} disabled={true}></Input>
                            </div>
                        </div>

                        <div className="form_mg_row">
                            <FormLabel sx={{ fontFamily: `"Karbon", sans-serif`, fontSize: "1.1rem;", color: "#3D3D3D" }} component="label">Costo de emisión</FormLabel>
                            <div className="form_mg__item">

                                <RadioGroup
                                    row
                                    aria-labelledby="label"
                                    name="row-radio-buttons-group"
                                    value={costoEmision}
                                >
                                    <FormControlLabel value="cobro_emision" control={<Radio />} label="Si" disabled={true} />
                                    <FormControlLabel value="no_cobro_emision" control={<Radio />} label="No" disabled={true} />
                                </RadioGroup>
                                {costoEmision === "" && <div className='text_error_validacion'>Escoja una opción.</div>}

                            </div>
                        </div>


                        <div className="form_mg_row">
                            <label htmlFor="tipoTC" className="pbmg1 lbl-input label_horizontal">Prefijo</label>
                            <div className="form_mg__item ptmg1">
                                <Input id="prefijo" name="prefijo" type="text" value={prefijo} disabled={true}></Input>
                            </div>
                        </div>



                        <div className="form_mg_row">
                            <label htmlFor="descripcion" className="pbmg1 lbl-input label_horizontal">Descripción</label>
                            <div className="form_mg__item ptmg1">
                                <Input id="descripcion" name="descripcion" type="text" value={descripcion} disabled={true}></Input>
                            </div>
                        </div>


                        <div className="form_mg_row">
                            <label htmlFor="agencia_solicita" className="pbmg1 lbl-input label_horizontal">Agencia que solicito</label>
                            <div className="form_mg__item ptmg1">
                                <Input id="agencia_solicita" name="agencia_solicita" type="text" value={agenciaSolicita} disabled={true}></Input>
                            </div>
                        </div>


                    </section>

                    <div id="listado_ordenes" className="mt-3">
                        <Table headers={headersTarjetasAprobadas}>
                            {lstSolicitudes.map((tarjeta) => {
                                return (
                                <tr key={tarjeta.ente}>
                                    <td>{tarjeta.cuenta}</td>
                                    <td>{tarjeta.tipo_identificacion}</td>
                                    <td>{tarjeta.identificacion}</td>
                                    <td>{tarjeta.ente}</td>
                                    <td>{tarjeta.nombre}</td>
                                    <td>{tarjeta.nombre_impreso}</td>
                                    <td><Chip type={conversionTipoTC(tarjeta.tipo)}>{tarjeta.tipo}</Chip></td>
                                    <td>{`$ ${Number(tarjeta.cupo).toLocaleString('en-US')}`}</td>
                                    </tr>
                                )
                            })}

                        </Table>
                    </div>


                </Card>

            </div>
        </div>
    )

}

export default VerOrden; 