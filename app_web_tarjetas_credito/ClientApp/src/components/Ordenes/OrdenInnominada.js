import { useState } from 'react';
import Sidebar from '../Common/Navs/Sidebar';
import { useEffect } from 'react';

import Card from '../Common/Card';
import Item from '../Common/UI/Item';
import Button from '../Common/UI/Button';

import Table from '../Common/Table';
import Chip from '../Common/UI/Chip'
import RateReviewSharpIcon from '@mui/icons-material/RateReviewSharp';
import { IconButton } from '@mui/material';

function OrdenInnominada(props) {

    const [ordenInnominada, setOrdenInnominada] = useState([]);



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


    /*
    useEffect(() => {
        //PETICION API
        setLstOrdenes(lstOrdenesActivas);

    })*/


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
                <h2 className="">Crear Orden Innominada</h2>
                <br />

                
                

            </div>


        </div>
    )

}

export default OrdenInnominada;