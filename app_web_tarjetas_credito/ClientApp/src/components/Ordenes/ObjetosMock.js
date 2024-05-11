// TARJETAS QUE LLEGAN FISICAMENTE
export const ordenTarjetasCreadasMock = [
    {
        id_tarjeta: 23,
        numero_tarjeta: "2500 XXXX XXXX 5646",
        codigo_referencia: "EST_5646",
        cuenta: "410010064540",
        identificacion: "1150214375",
        ente: "189610",
        nombre: "DANNY VASQUEZ",
        tipo: "ESTÁNDAR",
        estado: "CREADA",
        fecha_creacion: "5/1/2024 7:38:11 PM",
        cupo: "15000",

        // TIENES QUE ESTAR EN OTRA BASE
        orden_pertenece: "164",
        tarjeta_pertenece: 23,
        estado_recepta: "BUENO",
        oficina_recepta: "AGENCIA EL VALLE",
        usuario_recepto_tarjeta: "Si",
        fecha_cliente_solicita: "1/1/2024 8:44:11 AM",
        fecha_entrega_usuario: "",
        oficina_recepta_cliente: "",
        usuario_entrega_tarj: "",
    },
    {
        id_tarjeta: 20,
        numero_tarjeta: "2500 XXXX XXXX 3636",
        codigo_referencia: "BLK_3636",
        cuenta: "410010026841",
        identificacion: "1105970717",
        ente: "515145",
        nombre: "ROBERTH TORRES",
        tipo: "BLACK",
        estado: "CREADA",
        fecha_creacion: "5/1/2024 7:38:11 PM",
        cupo: "15000",

        // TIENES QUE ESTAR EN OTRA BASE
        orden_pertenece: "164",
        tarjeta_pertenece: 20,
        estado_recepta: "MALO",
        oficina_recepta: "CATAMAYO",
        usuario_recepto_tarjeta: "Si",
        fecha_cliente_solicita: "2/1/2024 9:44:11 AM",
        fecha_entrega_usuario: "",
        oficina_recepta_cliente: "",
        usuario_entrega_tarj: "",
    },
    {
        id_tarjeta: 38,
        numero_tarjeta: "2500 XXXX XXXX 0101",
        codigo_referencia: "GOL_0101",
        cuenta: "410010061199",
        identificacion: "115111371",
        ente: "515146",
        nombre: "LUIS VALDEZ",
        tipo: "GOLDEN",
        estado: "CREADA",
        fecha_creacion: "5/1/2024 7:38:11 PM",
        cupo: "15000",

        // TIENES QUE ESTAR EN OTRA BASE
        orden_pertenece: "164",
        tarjeta_pertenece: 38,
        estado_recepta: "BUENO",
        oficina_recepta: "AGENCIA EL VALLE",
        usuario_recepto_tarjeta: "Si",
        fecha_cliente_solicita: "2/1/2024 10:44:11 AM",
        fecha_entrega_usuario: "",
        oficina_recepta_cliente: "",
        usuario_entrega_tarj: "",

    },
    {
        id_tarjeta: 48,
        numero_tarjeta: "2500 XXXX XXXX 0214",
        codigo_referencia: "EST_0214",
        cuenta: "410010094684",
        identificacion: "PL970713",
        ente: "515147",
        nombre: "MARIO CRUZ",
        tipo: "ESTÁNDAR",
        estado: "CREADA",
        fecha_creacion: "5/1/2024 7:38:11 PM",
        cupo: "15000",

        // TIENES QUE ESTAR EN OTRA BASE
        orden_pertenece: "164",
        tarjeta_pertenece: 48,
        estado_recepta: "BUENO",
        oficina_recepta: "CATAMAYO",
        usuario_recepto_tarjeta: "Si",
        fecha_cliente_solicita: "2/2/2024 9:04:33 AM",
        fecha_entrega_usuario: "",
        oficina_recepta_cliente: "",
        usuario_entrega_tarj: "",

    },
    {

        id_tarjeta: 58,
        numero_tarjeta: "2500 XXXX XXXX 1818",
        codigo_referencia: "BLK_1818",
        cuenta: "410010061514",
        identificacion: "1105970714001",
        ente: "515148",
        nombre: "NICOLE ALBAN",
        tipo: "BLACK",
        estado: "CREADA",
        fecha_creacion: "5/1/2024 7:38:11 PM",
        cupo: "15000",

        // TIENES QUE ESTAR EN OTRA BASE
        orden_pertenece: "164",
        tarjeta_pertenece: 58,
        estado_recepta: "BUENO",
        oficina_recepta: "AGENCIA EL VALLE",
        usuario_recepto_tarjeta: "Si",
        fecha_cliente_solicita: "3/2/2024 10:44:11 AM",
        fecha_entrega_usuario: "",
        oficina_recepta_cliente: "",
        usuario_entrega_tarj: "",
    }
]



export const lstOrdenesMock =
    [
        {
            orden: 126,
            prefijo_tarjeta: "53",
            cost_emision: "no_cobro_emision",
            descripcion: "TARJETAS SOLICITADAS",
            oficina_envia: "MATRIZ",
            oficina_solicita: "MATRIZ",
            usuario_crea: "Ericka Rios",
            estado: "Anulada",
            fecha_creacion: "18/01/2024 2:10:56 PM",
            fecha_solicita: "",
            fecha_recepcion: "",
            fecha_distribucion: "",
            fecha_cierre_orden: "",
            cant_tarjetas: 10,
            
        },
        {
            orden: 127,
            prefijo_tarjeta: "53",
            cost_emision: "no_cobro_emision",
            descripcion: "TARJETAS SOLICITADAS",
            oficina_envia: "MATRIZ",
            oficina_solicita: "CATAMAYO",
            usuario_crea: "Ericka Rios",
            estado: "Entregada/Cerrada",
            fecha_creacion: "18/02/2024 4:00:07 PM",
            fecha_solicita: "19/02/2024 8:35:07 PM",
            fecha_recepcion: "01/03/2024 5:05:35 AM",
            fecha_distribucion: "02/03/2024 8:40:00 AM",
            fecha_cierre_orden: "03/03/2024 5:04:15 PM",
            cant_tarjetas: 30
        },
        {
            orden: 128,
            prefijo_tarjeta: "53",
            cost_emision: "no_cobro_emision",
            descripcion: "TARJETAS SOLICITADAS",
            oficina_envia: "MATRIZ",
            oficina_solicita: "SANTO DOMINGO",
            usuario_crea: "Ericka Rios",
            estado: "Enviada",
            fecha_creacion: "25/03/2024 4:00:07 PM",
            fecha_solicita: "25/03/2024 5:10:07 PM",
            fecha_recepcion: "03/04/2024 09:30:00 AM",
            fecha_distribucion: "03/04/2024 11:45:00 AM",
            fecha_cierre_orden: "",
            cant_tarjetas: 60
        },
        {
            orden: 130,
            prefijo_tarjeta: "53",
            cost_emision: "no_cobro_emision",
            descripcion: "TARJETAS SOLICITADAS",
            oficina_envia: "MATRIZ",
            oficina_solicita: "SARAGURO",
            usuario_crea: "Ericka Rios",
            estado: "Receptada",
            fecha_creacion: "18/04/2024 4:15:07 PM",
            fecha_solicita: "18/04/2024 4:20:40 PM",
            fecha_recepcion: "25/04/2024 8:50:00 PM",
            fecha_distribucion: "",
            fecha_cierre_orden: "",
            cant_tarjetas: 80
        },
        {
            orden: 131,
            prefijo_tarjeta: "53",
            cost_emision: "no_cobro_emision",
            descripcion: "TARJETAS SOLICITADAS",
            oficina_envia: "MATRIZ",
            oficina_solicita: "MATRIZ",
            usuario_crea: "Ericka Rios",
            estado: "Solicitada",
            fecha_creacion: "20/05/2024 4:45:07 PM",
            fecha_solicita: "21/05/2024 8:20:40 AM",
            fecha_recepcion: "",
            fecha_distribucion: "",
            fecha_cierre_orden: "",
            cant_tarjetas: 30,
        },
        {
            orden: 135,
            prefijo_tarjeta: "53",
            cost_emision: "no_cobro_emision",
            descripcion: "TARJETAS SOLICITADAS",
            oficina_envia: "MATRIZ",
            oficina_solicita: "SARAGURO",
            usuario_crea: "Ericka Rios",
            estado: "Creada",
            fecha_creacion: "30/04/2023 4:15:07 PM",
            fecha_solicita: "",
            fecha_recepcion: "",
            fecha_distribucion: "",
            fecha_cierre_orden: "",
            cant_tarjetas: 20
        },
        {
            orden: 134,
            prefijo_tarjeta: "53",
            cost_emision: "no_cobro_emision",
            descripcion: "TARJETAS SOLICITADAS",
            oficina_envia: "MATRIZ",
            oficina_solicita: "CATAMAYO",
            usuario_crea: "Ericka Rios",
            estado: "Creada",
            fecha_creacion: "30/04/2023 2:40:07 PM",
            fecha_solicita: "",
            fecha_recepcion: "",
            fecha_distribucion: "",
            fecha_cierre_orden: "",
            cant_tarjetas: 10,
        },
    ];


//SOLICITUDES TARJETAS
export const ObjTarjSolicAprobMock = [
    {
        cuenta: "410010064540",
        tipo_identificacion: "C",
        identificacion: "1150214375",
        ente: "189610",
        nombre: "DANNY VASQUEZ",
        nombre_impreso: "DANNY VASQUEZ",
        tipo: "BLACK",
        cupo: "8000",
        key: 23,
        oficina_recepta: "MATRIZ"
    },
    {
        cuenta: "410010026841",
        tipo_identificacion: "C",
        identificacion: "PZ970715",
        ente: "515145",
        nombre: "SALVADOR VALDEZ",
        nombre_impreso: "SALVADOR VALDEZ",
        tipo: "GOLDEN",
        cupo: "15000",
        key: 28,
        oficina_recepta: "CATAMAYO"
    },
    {
        cuenta: "410010061199",
        tipo_identificacion: "R",
        identificacion: "1105970712001",
        ente: "515146",
        nombre: "JUAN TORRES",
        nombre_impreso: "JUAN TORRES",
        tipo: "GOLDEN",
        cupo: "15000",
        key: 38,
        oficina_recepta: "MATRIZ"
    },
    {
        cuenta: "410010094684",
        tipo_identificacion: "P",
        identificacion: "PL970713",
        ente: "515147",
        nombre: "LUIS TORRES",
        nombre_impreso: "LUIS TORRES",
        tipo: "ESTÁNDAR",
        cupo: "15000",
        key: 48,
        oficina_recepta: "CATAMAYO"
    },
    {
        cuenta: "410010061514",
        tipo_identificacion: "R",
        identificacion: "1105970714001",
        ente: "515148",
        nombre: "MIGUEL ROMAN",
        nombre_impreso: "MIGUEL ROMAN",
        tipo: "ESTÁNDAR",
        cupo: "15000",
        key: 58,
        oficina_recepta: "SARAGURO"
    },
    {
        cuenta: "410010064000",
        tipo_identificacion: "P",
        identificacion: "1105970717",
        ente: "515149",
        nombre: "ROBERTH TORRES",
        nombre_impreso: "ROBERTH TORRES",
        tipo: "GOLDEN", cupo: "15000",
        key: 68,
        oficina_recepta: "MATRIZ"
    }
]


//ORDENES CREADAS CON TARJETAS
export const objConfirmacionRecepcionTarjetas = [
    {
        orden: "164",
        prefijo_tarjeta: "53",
        cost_emision: "no_cobro_emision",
        descripcion: "TARJETAS SOLICITADAS PARA MES DE ABRIL",
        oficina_envia: "MATRIZ",
        oficina_solicita: "CATAMAYO",
        usuario_crea: "Ericka Rios",
        estado: "Creada",
        fecha_creacion: "30/04/2023 4:15:07 PM",
        fecha_recepcion: "",
        fecha_solicita: "",
        fecha_distribucion: "",
        fecha_cierre_orden: "",
        cant_tarjetas: 2,
        orden_tarjetaDet: [
            ordenTarjetasCreadasMock[1],
            ordenTarjetasCreadasMock[3]
        ]

    },
    {
        orden: "165",
        prefijo_tarjeta: "53",
        cost_emision: "cobro_emision",
        descripcion: "TARJETAS SOLICITADAS PARA MES DE MAYO",
        oficina_envia: "MATRIZ",
        oficina_solicita: "AGENCIA EL VALLE",
        usuario_crea: "Ericka Rios",
        estado: "Creada",
        fecha_creacion: "30/04/2023 4:15:07 PM",
        fecha_recepcion: "",
        fecha_solicita: "",
        fecha_distribucion: "",
        fecha_cierre_orden: "",
        cant_tarjetas: 2,
        orden_tarjetaDet: [
            ordenTarjetasCreadasMock[0],
            ordenTarjetasCreadasMock[2],
            ordenTarjetasCreadasMock[4]
        ]
    }
]
