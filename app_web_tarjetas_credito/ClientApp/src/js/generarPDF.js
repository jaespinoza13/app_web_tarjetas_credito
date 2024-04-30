import { useEffect, useState } from 'react';
import 'jspdf-autotable';
import jsPDF from 'jspdf';
//import { helpFunctions } from './helpFunctions';
//import { helpDateFunctions } from './helpDateFunctions';
import { IconButton } from '@mui/material';
import { renderToString } from "react-dom/server";
//export const generarPDF = () => {
//const { currencyFormatter } = helpFunctions()
//const { convertDate } = helpDateFunctions()

//import HeaderPrint from '../images/HeaderPrint.png'




export const generarPDF = (datos) => {

    var doc = new jsPDF('p', 'pt', 'a4')
    let fechaHoy = new Date();
    let day = fechaHoy.getDate()
    let month = fechaHoy.getMonth() + 1
    let year = fechaHoy.getFullYear()
    
    fechaHoy = month < 10 ? `0${month}/${day}/${year}` : `${month}/${day}/${year}`;

    const fecha = `Fecha: ${fechaHoy}`
    const orden = "No. Orden: 153";
    const totalTarjetas = "Total de tarjetas de agencia: 30 de 30";
    const agencia = "Agencia: MATRIZ";


    

    // generate the above data table
    let datos = [
        { str_tipo: "1", dt_fecha: "01/10/2021", dt_hora: "4:30:00 PM", int_referencia: "1", str_motivo: "PRUEBA", description: "DESCIPT", str_canal: "ATMS", dec_monto: 20, dec_disponible: 2153, dec_contable: 153 },
        { str_tipo: "2", dt_fecha: "01/10/2021", dt_hora: "4:30:00 PM", int_referencia: "1", str_motivo: "PRUEBA", description: "DESCIPT", str_canal: "ATMS", dec_monto: 20, dec_disponible: 2153, dec_contable: 156 },

    ]
    let dataCustom = '';
    dataCustom = datos && datos.map(element => {



        /*return {
            logo: element.str_tipo,
            date: element.dt_fecha,
            hour: element.dt_hora,
            reference: element.int_referencia,
            concept: `${element.str_motivo}` + `${element.str_motivo === ' ' ? '' : ' '}` + `${element.str_concepto}`,
            description: element.str_motivo,
            channel: element.str_canal,
            loansCredits: Number(element.dec_monto),
            //loansCredits: currencyFormatter.format(Number(element.dec_monto)),
            balance: element.dec_disponible,
            countableBalance: element.dec_contable,
        }*/
    })
    const movemetsColumns = [
        {
            title: 'Tipo',
            field: 'logo',
            name: '',
            width: 70,
            sortable: false

        }, {
            title: 'Fecha',
            field: 'date',
            name: 'Fecha',
            width: 110,
            type: 'date'

        }, {
            title: 'Hora',
            field: 'hour',
            name: 'Hora',
            width: 85

        }, {
            title: 'Referencia',
            field: 'reference', IconButton,
            name: 'Referencia'
            // width: 100,

        }, {
            title: 'Concepto',
            field: 'concept',
            name: 'Concepto ',
            flex: 1

        }, {
            title: 'Canal',
            field: 'channel',
            name: 'Canal ',
            width: 122

        }, {
            title: 'Valor',
            field: 'loansCredits',
            name: 'Débitos (-) Créditos '

        }, {
            title: 'Saldo disponible',
            field: 'balance',
            name: 'Saldo disponible '

        },
        {
            title: 'Saldo contable',
            field: 'countableBalance',
            name: 'Saldo contable '

        },
        {
            field: 'donwload',
            name: '',
            title: '',
            width: 5,
            disableColumnMenu: true

        },
    ];

   

 
    //var image1 = "/images/HeaderPrint.png"; /// URL de la imagen
    //doc.addImage(image1, 'PNG', 150, 20)



    doc.addFont('karbon', 'medium')
    doc.setLineWidth(2);
    doc.text(250, 40, "COOPMEGO");
    doc.setFontSize(13);
    doc.setLineWidth(6);
    doc.text(40, 80, fecha);
    doc.text(40, 95, orden);
    doc.text(40, 110, agencia);
    doc.text(40, 125, totalTarjetas);

    doc.autoTable({
        margin: { top: 180 },
        theme: "striped",
        columns: movemetsColumns.map(col => ({ ...col, dataKey: col.field })),
        body: dataCustom

        /* 
        body: body,
         startY: 70,
         head: [['SL.No', 'Product Name', 'Price', 'Model']],
         headStyles: {
             lineWidth: 1, fillColor: [30, 212, 145], textColor: [255, 255, 255],
         },
         theme: 'grid',
         columnStyles: {
             0: {
                 halign: 'right',
                 cellWidth: 50,
                 fillColor: [232, 252, 245],
             },
             1: {
                 halign: 'left',
                 cellWidth: 380,
                 fillColor: [232, 252, 245],
             },
             2: {
                 halign: 'right',
                 cellWidth: 50,
                 fillColor: [232, 252, 245],
             },
             3: {
                 halign: 'right',
                 cellWidth: 50,
                 fillColor: [232, 252, 245],
             }
         },
         */
    })
    const name_file = `${agencia}_${orden}_${(fechaHoy)}.pdf`
    console.log(name_file);
    doc.save(name_file);


}
