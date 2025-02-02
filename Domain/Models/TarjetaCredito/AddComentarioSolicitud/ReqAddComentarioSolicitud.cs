﻿using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.TarjetaCredito.AddComentarioSolicitud
{
    public class ReqAddComentarioSolicitud : Header
    {
        public bool bl_regresa_estado {  get; set; }
        public int int_estado { get; set; }
        public string str_comentario {  get; set; } = string.Empty;
        public int int_id_solicitud { get; set; }
        public bool bl_microcredito { get; set; } //PARA SABER SI ES MICROCREDITO O NO, SOLO EN SOLICITUD CON ESTADO CREADA
        public decimal dcc_cupo_solicitado { get; set; }

    }
}
