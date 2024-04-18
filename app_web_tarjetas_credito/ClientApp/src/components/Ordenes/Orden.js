import { useState } from 'react';
import Sidebar from '../Common/Navs/Sidebar';
import { useEffect } from 'react';

import Card from '../Common/Card';
import Item from '../Common/UI/Item';
import Button from '../Common/UI/Button';

import Table from '../Common/Table';
import Chip from '../Common/UI/Chip'
import RateReviewSharpIcon from '@mui/icons-material/RateReviewSharp';
import AssignmentTurnedInSharpIcon from '@mui/icons-material/AssignmentTurnedInSharp';
import { IconButton } from '@mui/material';

function Orden(props) {

    const [lstOrdenes, setLstOrdenes] = useState([]);



    const headersOrdenesActivas = [
        { nombre: "Nro. Orden", key: "nrOrden" }, { nombre: "Estado TC", key: "estado" }, { nombre: "Cantidad", key: "cantidad" },
        { nombre: "Producto TC", key: "tipo_tarjeta" }, { nombre: "Fecha solicitada", key: "fecha_solicita" }, { nombre: "Oficina solicita", key: "oficina_solicita" },
        { nombre: "Acciones", key: "acciones" }
    ]
        
    const [lstOrdenesActivas, setLstOrdenesActivas] = useState(
        [
            { nrOrden: 126, estado: "Anulada", cantidad: 10, tipo_tarjeta: "BLACK", fecha_solicita: "18/04/2024 3:50:31 PM", oficina_solicita: "MATRIZ" },
            { nrOrden: 127, estado: "Abierta", cantidad: 20, tipo_tarjeta: "ESTÁNDAR", fecha_solicita: "18/04/2024 4:05:02 PM", oficina_solicita: "MATRIZ" },
            { nrOrden: 128, estado: "Abierta", cantidad: 10, tipo_tarjeta: "GOLDEN", fecha_solicita: "18/04/2024 4:10:07 PM", oficina_solicita: "MATRIZ" },
            { nrOrden: 129, estado: "Abierta", cantidad: 5, tipo_tarjeta: "BLACK", fecha_solicita: "18/04/2024 4:20:40 PM", oficina_solicita: "AGENCIA EL VALLE" }
        ]
    );



    useEffect(() => {
        //PETICION API
        setLstOrdenes(lstOrdenesActivas);

    })


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
                <br />
                <h2 className="">Órdenes</h2>
                <br />

                <div className='row w-100'>

                    <div style={{ display: "flex", flexDirection: "column" }}>

                        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>

                            <div className="m-2" style={{ display: "flex", flexDirection: "column", width: "25%", marginRight: "10px"}}>
                                <Card >
                                    <img style={{ width: "15%" }} src="Imagenes/credit_card_FILL0_wght300_GRAD0_opsz24.svg"></img>
                                    <h4 className="mt-2">Crear Orden con información del Socio</h4>
                                    <h5 className="mt-2">Tipo NOMINADA</h5>
                                    <Button autoWidth tabIndex="3" className={["btn_mg btn_mg__primary mt-2"]} disabled={false}>Crear</Button>
                                </Card>
                            </div>

                            <div className="m-2" style={{ display: "flex", flexDirection: "column", width: "25%", marginRight: "10px" }}>

                                <Card>
                                    <img style={{ width: "15%" }} src="Imagenes/credit_card_FILL0_wght300_GRAD0_opsz24.svg"></img>
                                    <h4 className="mt-2">Crear Orden sin información del Socio</h4>
                                    <h5 className="mt-2">Tipo IN-NOMINADA</h5>
                                    <Button autoWidth tabIndex="3" className={["btn_mg btn_mg__primary mt-2"]} disabled={false}>Crear</Button>
                                </Card>
                            </div>

                            <div className="m-2" style={{ display: "flex", flexDirection: "column", width: "25%", marginRight: "10px" }}>

                                <Card>
                                    <img style={{ width: "15%" }} src="Imagenes/credit_card_FILL0_wght300_GRAD0_opsz24.svg"></img>
                                    <h4 className="mt-2">Generar archivo Ordenes aprobadas</h4>
                                    <h5 className="mt-2">Tipo Batch</h5>
                                    <Button autoWidth tabIndex="3" className={["btn_mg btn_mg__primary mt-2"]} disabled={false}>Crear</Button>
                                </Card>
                            </div>

                        </div>

                    </div>

                </div>






                <div id="listado_ordenes" className="mt-3">
                    <Table headers={headersOrdenesActivas}>
                        {/*BODY*/}
                        {lstOrdenes.map((orden, index) => {
                            return (
                                <tr key={index}>
                                    <td>{orden.nrOrden}</td>
                                    <td>{orden.estado}</td>
                                    <td>{orden.cantidad}</td>
                                    <td><Chip type={conversionTipoTC(orden.tipo_tarjeta)}>{orden.tipo_tarjeta }</Chip></td>
                                    <td>{orden.fecha_solicita}</td>
                                    <td>{orden.oficina_solicita}</td>
                                    <td>
                                        <IconButton onClick={() => { console.log("CLICK") }}>
                                            <RateReviewSharpIcon></RateReviewSharpIcon>
                                        </IconButton>
                                        <IconButton onClick={() => { console.log("CLICK") }}>
                                            <AssignmentTurnedInSharpIcon></AssignmentTurnedInSharpIcon>
                                        </IconButton>

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

export default Orden;