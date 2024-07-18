// TARJETAS QUE LLEGAN FISICAMENTE (TARJEAS CREADAS)
export const ordenTarjetasCreadasMock = [
    {
        id_tarjeta: 23,
        numero_tarjeta: "4891 XXXX XXXX 5646",
        codigo_referencia: "EST_5646",
        cuenta: "410010064540",
        identificacion: "1150214375",
        ente: "189610",
        nombre: "DANNY VASQUEZ",
        tipo: "BLACK",
        estado: "CREADA",
        fecha_creacion: "5/1/2024 7:38:11 PM",
        cupo: "15000",
        solicitud_pertenece: "sol_1570", //Deberia incluirse

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
        numero_tarjeta: "4891 XXXX XXXX 3636",
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
        numero_tarjeta: "4891 XXXX XXXX 0101",
        codigo_referencia: "GOL_0101",
        cuenta: "410010061199",
        identificacion: "115111371",
        ente: "515146",
        nombre: "LUIS VALDEZ",
        tipo: "BLACK",
        estado: "CREADA",
        fecha_creacion: "5/1/2024 7:38:11 PM",
        cupo: "20000",

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
        numero_tarjeta: "4891 XXXX XXXX 0214",
        codigo_referencia: "EST_0214",
        cuenta: "410010094684",
        identificacion: "PL970713",
        ente: "515147",
        nombre: "MARIO CRUZ",
        tipo: "ESTÁNDAR",
        estado: "CREADA",
        fecha_creacion: "5/1/2024 7:38:11 PM",
        cupo: "3000",

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
        numero_tarjeta: "4891 XXXX XXXX 1818",
        codigo_referencia: "BLK_1818",
        cuenta: "410010061514",
        identificacion: "1105970714001",
        ente: "515148",
        nombre: "NICOLE ALBAN",
        tipo: "GOLD",
        estado: "CREADA",
        fecha_creacion: "5/1/2024 7:38:11 PM",
        cupo: "10000",

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


//ORDENES DE COMPRA 
export const lstOrdenesMock =
    [
        {
            orden: 126,
            descripcion: "TARJETAS SOLICITADAS",
            usuario_crea: "Ericka Rios",
            estado: "Anulada",
            fecha_creacion: "18/01/2024 2:10:56 PM",
            fecha_solicita: "",
            fecha_proceso: "",            
            fecha_cierre_orden: "",
            tipo_producto: "BLACK",
            cant_tarjetas: 30,
            cant_disponible: 0,
            descripcion_recepcion: "",
            input_file_identifica: ""            
        },
        {

            orden: 127,
            descripcion: "TARJETAS SOLICITADAS 2",
            usuario_crea: "Ericka Rios",
            estado: "Cerrada",
            fecha_creacion: "18/02/2024 4:00:07 PM",
            fecha_solicita: "19/02/2024 8:35:07 PM",
            fecha_proceso: "01/03/2024 5:05:35 AM",
            fecha_cierre_orden: "03/03/2024 5:04:15 PM",
            tipo_producto: "GOLD",
            cant_tarjetas: 20,
            cant_disponible: 0,
            descripcion_recepcion: "",
            input_file_identifica: ""    

        },
        {
            orden: 128,
            descripcion: "TARJETAS SOLICITADAS BLACK",
            usuario_crea: "Ericka Rios",
            estado: "Pendiente Distribución",
            fecha_creacion: "25/03/2024 4:00:07 PM",
            fecha_solicita: "25/03/2024 5:10:07 PM",
            fecha_proceso: "03/04/2024 09:30:00 AM",
            fecha_cierre_orden: "",
            tipo_producto: "BLACK",
            cant_tarjetas: 25,
            cant_disponible: 4,
            descripcion_recepcion: "NINGUNA OBSERVACIÓN",
            input_file_identifica: "BLACK128"    
        },
        {
            orden: 124,
            descripcion: "TARJETAS SOLICITADAS GOLD",
            usuario_crea: "Ericka Rios",
            estado: "Pendiente Distribución",
            fecha_creacion: "15/03/2024 4:00:07 PM",
            fecha_solicita: "14/03/2024 5:10:07 PM",
            fecha_proceso: "17/03/2024 09:30:00 AM",
            fecha_cierre_orden: "",
            tipo_producto: "GOLD",
            cant_tarjetas: 22,
            cant_disponible: 21,
            descripcion_recepcion: "NINGUNA OBSERVACIÓN",
            input_file_identifica: "GOLD124"
        },
        {
            orden: 130,
            descripcion: "TARJETAS SOLICITADAS ESTÁNDAR",
            usuario_crea: "Ericka Rios",
            estado: "Solicitada",
            fecha_creacion: "25/03/2024 4:00:07 PM",
            fecha_solicita: "25/03/2024 5:10:07 PM",
            fecha_proceso: "",
            fecha_cierre_orden: "",
            tipo_producto: "BLACK",
            cant_tarjetas: 18,
            cant_disponible: 0,
            descripcion_recepcion: "",
            input_file_identifica: "ESTÁNDAR130"
        },
        {
            orden: 131,
            descripcion: "TARJETAS SOLICITADAS GOLD",
            usuario_crea: "Ericka Rios",
            estado: "Solicitada",
            fecha_creacion: "20/05/2024 4:45:07 PM",
            fecha_solicita: "21/05/2024 8:20:40 AM",
            fecha_proceso: "",
            fecha_cierre_orden: "",
            tipo_producto: "GOLD",
            cant_tarjetas: 35,
            cant_disponible: 0,
            descripcion_recepcion: "",
            input_file_identifica: "GOLD131"
        },
        {
            orden: 135,
            descripcion: "TARJETAS SOLICITADAS ESTÁNDAR 3",
            usuario_crea: "Ericka Rios",
            estado: "Creada",
            fecha_creacion: "20/05/2024 4:45:07 PM",
            fecha_solicita: "",
            fecha_proceso: "",
            fecha_cierre_orden: "",
            tipo_producto: "ESTÁNDAR",
            cant_tarjetas: 40,
            cant_disponible: 0,
            descripcion_recepcion: "",
            input_file_identifica: "ESTÁNDAR135"
        },
    ];


//SOLICITUDES TARJETAS
export const ObjSolicitudesAprob = [
    {
        sol_identifica: "sol_1570",
        cuenta: "410010064540",
        tipo_identificacion: "C",
        identificacion: "1150214375",
        ente: "189610",
        nombre: "DANNY VASQUEZ",
        nombre_impreso: "DANNY VASQUEZ",
        tipo: "BLACK",
        cupo: "8000",
        key: 23,
        oficina_recepta: "AGENCIA EL VALLE"
    },
    {
        sol_identifica: "sol_1666",
        cuenta: "410010026841",
        tipo_identificacion: "C",
        identificacion: "PZ970715",
        ente: "515145",
        nombre: "SALVADOR VALDEZ",
        nombre_impreso: "SALVADOR VALDEZ",
        tipo: "GOLD",
        cupo: "15000",
        key: 28,
        oficina_recepta: "AGENCIA EL VALLE"
    },
    {
        sol_identifica: "sol_17777",
        cuenta: "410010061199",
        tipo_identificacion: "R",
        identificacion: "1105970712001",
        ente: "515146",
        nombre: "JUAN TORRES",
        nombre_impreso: "JUAN TORRES",
        tipo: "GOLD",
        cupo: "15000",
        key: 38,
        oficina_recepta: "MATRIZ"
    },
    {
        sol_identifica: "sol_18888",
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
        sol_identifica: "sol_19999",
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
        sol_identifica: "sol_19999",
        cuenta: "410010098716",
        tipo_identificacion: "P",
        identificacion: "11468715684",
        ente: "100168",
        nombre: "NICOLE SANMARTIN",
        nombre_impreso: "NICOLE SANMARTIN",
        tipo: "ESTÁNDAR", cupo: "11000",
        key: 68,
        oficina_recepta: "MATRIZ"
    }
]


//ORDENES ENTRADA CREADAS CON TARJETAS
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
        fecha_proceso: "",
        fecha_solicita: "",
        fecha_distribucion: "",
        fecha_cierre_orden: "",
        cant_tarjetas: 2,

        //CAMBIAR PARA QUE SOLO SE RECEPTE ORDEN POR PRODUCTO, (NO ESPECIFICAR TARJETA SINO CANTIDAD)
        orden_tarjetaDet: [
            ordenTarjetasCreadasMock[0],
            ordenTarjetasCreadasMock[1]
        ]

    },
    {
        orden: "1",
        prefijo_tarjeta: "53",
        cost_emision: "cobro_emision",
        descripcion: "TARJETAS SOLICITADAS PARA MES DE MAYO",
        oficina_envia: "MATRIZ",
        oficina_solicita: "",
        usuario_crea: "Ericka Rios",
        estado: "Creada",
        fecha_creacion: "30/04/2023 4:15:07 PM",
        fecha_proceso: "",
        fecha_solicita: "",
        fecha_distribucion: "",
        fecha_cierre_orden: "",
        cant_tarjetas: 3,
        orden_tarjetaDet: [
            ordenTarjetasCreadasMock[2],
            ordenTarjetasCreadasMock[3],
            ordenTarjetasCreadasMock[4]
        ]
    }
]



/*********************************** ORDENES DE SALIDA ***************************************/

export const ObjSolicitudesAprobSalida = [
    {
        sol_identifica: "sol_1570",
        tipo_identificacion: "C",
        identificacion: "1150214375",
        ente: "189610",
        nombre: "DANNY VASQUEZ",
        nombre_impreso: "DANNY VASQUEZ",
        tipo: "BLACK",
        cupo: "8000",
        oficina_recepta: "AGENCIA EL VALLE"
    },
    {
        sol_identifica: "sol_1666",
        tipo_identificacion: "C",
        identificacion: "1105970717",
        ente: "515145",
        nombre: "ROBERTH TORRES",
        nombre_impreso: "ROBERTH TORRES",
        tipo: "GOLD",
        cupo: "15000",
        oficina_recepta: "AGENCIA EL VALLE"
    },
    {
        sol_identifica: "sol_17777",
        tipo_identificacion: "C",
        identificacion: "115111371",
        ente: "515146",
        nombre: "LUIS VALDEZ",
        nombre_impreso: "LUIS VALDEZ",
        tipo: "GOLD",
        cupo: "11500",
        oficina_recepta: "MATRIZ"
    },
    {

        sol_identifica: "sol_18888",
        tipo_identificacion: "P",
        identificacion: "PL970713",
        ente: "515199",
        nombre: "LUIS TORRES",
        nombre_impreso: "LUIS TORRES",
        tipo: "ESTÁNDAR",
        cupo: "5000",
        oficina_recepta: "CATAMAYO"
    },
    {
        sol_identifica: "sol_19999",
        tipo_identificacion: "R",
        identificacion: "1105970714001",
        ente: "515148",
        nombre: "MIGUEL ROMAN",
        nombre_impreso: "MIGUEL ROMAN",
        tipo: "ESTÁNDAR",
        cupo: "5000",
        oficina_recepta: "CATAMAYO"
    },
    {
        sol_identifica: "sol_19999",
        tipo_identificacion: "R",
        identificacion: "11468715684",
        ente: "100168",
        nombre: "NICOLE SANMARTIN",
        nombre_impreso: "NICOLE SANMARTIN",
        tipo: "BLACK",
        cupo: "4000",
        oficina_recepta: "MATRIZ"
    }
]


export const tarjetasCreadasSalidaMock = [
    {
        id_tarjeta: 23,
        numero_tarjeta: "2500 XXXX XXXX 5646",
        codigo_referencia: "BLK_5646",
        cuenta: "410010064540",
        identificacion: "1150214375",
        ente: "189610",
        nombre: "DANNY VASQUEZ",
        tipo: "BLACK",
        estado: "CREADA",
        fecha_creacion: "5/1/2024 7:38:11 PM",
        cupo_maximo: "15000",
        solicitud_pertenece: ObjSolicitudesAprobSalida[0]

    },
    {
        id_tarjeta: 20,
        numero_tarjeta: "2500 XXXX XXXX 3636",
        codigo_referencia: "BLK_3636",
        cuenta: "410010026841",
        identificacion: "1105970717",
        ente: "515145",
        nombre: "ROBERTH TORRES",
        tipo: "GOLD",
        estado: "CREADA",
        fecha_creacion: "5/1/2024 7:38:11 PM",
        cupo_maximo: "15000",
        solicitud_pertenece: ObjSolicitudesAprobSalida[1]

       
    },
    {
        id_tarjeta: 38,
        numero_tarjeta: "2500 XXXX XXXX 0101",
        codigo_referencia: "GOL_0101",
        cuenta: "410010061199",
        identificacion: "115111371",
        ente: "515146",
        nombre: "LUIS VALDEZ",
        tipo: "GOLD",
        estado: "CREADA",
        fecha_creacion: "5/1/2024 7:38:11 PM",
        cupo_maximo: "14000",
        solicitud_pertenece: ObjSolicitudesAprobSalida[2]      

    },
    {
        id_tarjeta: 48,
        numero_tarjeta: "2500 XXXX XXXX 0214",
        codigo_referencia: "EST_0214",
        cuenta: "410010094684",
        identificacion: "PL970713",
        ente: "515199",
        nombre: "LUIS TORRES",
        tipo: "ESTÁNDAR",
        estado: "CREADA",
        fecha_creacion: "5/1/2024 7:38:11 PM",
        cupo_maximo: "15000",
        solicitud_pertenece: ObjSolicitudesAprobSalida[3]      

    },
    {

        id_tarjeta: 58,
        numero_tarjeta: "2500 XXXX XXXX 1818",
        codigo_referencia: "BLK_1818",
        cuenta: "410010061514",
        identificacion: "11468715684",
        ente: "100168",
        nombre: "NICOLE ALBAN",
        tipo: "BLACK",
        estado: "CREADA",
        fecha_creacion: "5/1/2024 7:38:11 PM",
        cupo_maximo: "25000",
        solicitud_pertenece: ObjSolicitudesAprobSalida[5]      

       
    }
]






// STOCK
export const tarjetasInventario = [
    {
        tarjeta_stock: 102,
        producto: "GOLD",
        cantidad_disponible: 7,
        fecha_registro: "",
        estado_tarjeta_producto: "Activa",
        cost_emision: "No",
        estado_stock: "Actual",
        orden_involucra: 175,
        anterior_posicion: 101
    },
    {
        tarjeta_identifica_stock: 103,
        producto: "BLACK",
        cantidad_disponible: 15,
        fecha_registro: "",
        estado_tarjeta_producto: "Activa",
        cost_emision: "No",
        estado_stock: "Actual",
        orden_involucra: 181,
        anterior_posicion: 98
    },
    {
        tarjeta_identifica_stock: 104,
        producto: "ESTÁNDAR",
        cantidad_disponible: 22,
        fecha_registro: "",
        estado_tarjeta_producto: "Activa",
        cost_emision: "No",
        estado_stock: "Actual",
        orden_involucra: 183,
        anterior_posicion: 99
    }



]

//Para editar una Orden de salida
export const objSubOrdenes = [
    {
        sub_id: "sub0101",
        orden_pertenece: 180,
        //tarjeta_pertenece: 28,
        tarjeta_pertenece: [
            tarjetasCreadasSalidaMock[1]
        ],
        tarjeta_inventario: tarjetasInventario[0],
        //tipo_producto: "GOLD",
        cost_emision: "No",
        usuario_entrega: "",
        fecha_entrega_usuario: "",
        descrip_cliente_recepta: "Tarjeta por entregar",
    },
    {

        sub_id: "sub0102",
        orden_pertenece: 180,
        //tarjeta_pertenece: 23,
        tarjeta_pertenece: [
            tarjetasCreadasSalidaMock[0]
        ],
        tarjeta_stock: tarjetasInventario[1], 
        //tipo_producto: "BLACK",
        cost_emision: "No",
        usuario_entrega: "",
        fecha_entrega_usuario: "",
        descrip_cliente_recepta: "Tarjeta por entregar",
    },

    {
        sub_id: "sub0103",
        orden_pertenece: 220,
        //tarjeta_pertenece: 38,
        tarjeta_pertenece: [
            tarjetasCreadasSalidaMock[2]
        ],
        tarjeta_inventario: tarjetasInventario[0],
        //tipo_producto: "GOLD",
        cost_emision: "No",
        usuario_entrega: "",
        fecha_entrega_usuario: "",
        descrip_cliente_recepta: "Tarjeta por entregar",
    },
    {

        sub_id: "sub0104",
        orden_pertenece: 220,
        //tarjeta_pertenece: 68,
        tarjeta_pertenece: [
            tarjetasCreadasSalidaMock[5]
        ],
        tarjeta_stock: tarjetasInventario[2], 
        //tipo_producto: "BLACK",
        cost_emision: "No",
        usuario_entrega: "",
        fecha_entrega_usuario: "",
        descrip_cliente_recepta: "Tarjeta por entregar",
    },



]


export const objOrdenesPedido = [

    {
        orden: 180,
        tipo_orden: "PEDIDO",
        tipo_producto: "VARIOS",
        estado: "ENVIADA A AGENCIA",
        usuario_crea: "Ericka Rios",
        usuario_recibe: "Ximena Ojeda",
        fecha_creacion: "05/01/2023 4:40:07 PM",
        fecha_solicita: "",
        fecha_envia_oficina: "10/01/2023 4:40:07 PM",
        fecha_proceso: "09/01/2023 2:55:45PM",
        cantidad: 2,
        oficina_solicita: "",
        oficina_destino: "AGENCIA EL VALLE",
        descripcion_recepta: "",

        ///BASE SUBORDEN (Para editar una Orden de salida)
        subOrdenes: [
            objSubOrdenes[0],
            objSubOrdenes[1]
        ]
    },
    {
        orden: 220,
        tipo_orden: "PEDIDO",
        tipo_producto: "VARIOS",
        estado: "ENVIADA A AGENCIA",
        usuario_crea: "Ericka Rios",
        usuario_recibe: "Veronica Ocampo",
        fecha_creacion: "05/06/2023 9:30:00 AM",
        fecha_solicita: "",
        fecha_envia_oficina: "05/08/2023 9:30:00 AM",
        fecha_proceso: "",
        cantidad: 2,
        oficina_solicita: "",
        oficina_destino: "MATRIZ",
        descripcion_recepta: "",

        ///BASE SUBORDEN
        subOrdenes: [
            objSubOrdenes[2],
            objSubOrdenes[3]
        ]
    }

]