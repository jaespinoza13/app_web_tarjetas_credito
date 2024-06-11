namespace Domain.Common {
    public class AppSettings {
        #region LoadParameters
        public List<int> lst_ids_sistemas { get; set; } = new();
        public List<string> lst_nemonicos_parametros { get; set; } = new();
        public List<string> lst_codigos_error { get; set; } = new();
        public List<string> lst_nombres_parametros_local { get; set; } = new();
        public List<Urls> lst_urls { get; set; } = new();
        #endregion

        #region Endpoints
        public string gw_logs { get; set; }
        #endregion

        #region EndpointServices
        #region ws_sistemas
        public string service_autentificar { get; set; }
        public string service_cerrar_session { get; set; }
        public string service_verificar_horario { get; set; }
        public string service_get_perfiles { get; set; }
        public string service_get_info_sistema { get; set; }
        public string service_get_preguntas { get; set; }
        public string service_set_preguntas { get; set; }
        public string service_set_cambiar_password { get; set; }
        public string service_set_resetear_password { get; set; }
        public string service_set_pass_primera_vez { get; set; }
        public string service_get_pregunta_usuario { get; set; }
        public string service_get_validar_respuesta { get; set; }
        public string service_get_menu_principal { get; set; }
        public string service_get_funciones_hijas { get; set; }
        public string service_get_funcionalidades { get; set; }
        public string service_get_parametros { get; set; }
        #endregion
        #region gw_logs
        #region GET
        public string service_get_logs_texto { get; set; }
        public string service_get_body_logs_texto { get; set; }
        public string service_download_logs_texto { get; set; }
        public string service_get_lista_bases { get; set; }
        public string service_get_lista_colecciones { get; set; }
        public string service_get_lista_documentos { get; set; }
        public string service_get_seguimiento { get; set; }
        public string service_get_conexiones { get; set; }
        #endregion
        #region ADD
        public string service_add_conexion { get; set; }
        #endregion
        #region SET
        public string service_set_conexion { get; set; }
        #endregion
        #endregion
        #endregion

        #region BasicAuth
        #region gw_logs
        public string auth_user_gw_logs { get; set; }
        public string auth_pass_gw_logs { get; set; }
        public string auth_basic { get; set; }
        #endregion
        #endregion

        #region HttpConfig
        public int time_out { get; set; }
        #endregion

        #region EnvConfig
        public int id_sistema { get; set; }
        public string nombre_sistema { get; set; }
        public string nmo_canal { get; set; }
        public string app_name { get; set; }
        public string version_sistema { get; set; }
        public string actualizacion { get; set; }
        public int minutos_inactividad { get; set; }
        public string dominio { get; set; }
        #endregion
        #region TarjetasCredito
        public string ws_personas { get; set; } = String.Empty;
        public string service_get_validaciones { get; set; } = String.Empty;
        public string auth_user_ws_personas { get; set; } = String.Empty;
        public string auth_pass_ws_personas { get; set; } = String.Empty;
        public string ws_aval { get; set; } = String.Empty;
        public string service_get_score { get; set; } = String.Empty;
        public string auth_ws_aval { get; set; } = String.Empty;
        public string ws_tarjeta_credito { get; set; } = String.Empty;
        public string auth_ws_tarjeta_credito { get; set; } = String.Empty;
        public string service_get_info_socio { get; set; } = String.Empty;
        public string service_get_info_economica { get; set; } = String.Empty;
        public string service_add_autorizacion { get; set; } = String.Empty;
        public string service_get_contrato { get; set; } = String.Empty;
        public string service_get_solicitudes { get; set; } = String.Empty;
        public string service_add_solicitud { get; set; } = String.Empty;
        public string service_get_info_finan { get; set; } = String.Empty;
        public string service_add_prospecto { get; set; } = String.Empty;
        public string service_get_informe_tc { get; set; } = String.Empty;
        public string service_add_informe_tc { get; set; } = String.Empty;
        public string service_add_comentario_solicitud { get; set; } = String.Empty;
        public string service_get_flujo_solicitud { get; set; } = String.Empty;
        public string service_get_resolucion { get; set; } = String.Empty;
        public string service_add_resolucion { get; set; } = String.Empty;
        public string service_upd_resolucion { get; set; } = String.Empty;
        public string service_get_reporte_orden { get; set; } = String.Empty;
        public string service_get_ordenes { get; set; } = String.Empty;
        public string service_get_tarjetas_credito { get; set; } = String.Empty;
        public string service_get_medio_aprobacion { get; set; } = String.Empty;
        public string service_add_proc_espec { get; set; } = String.Empty;
        public string service_upd_solicitud { get; set; } = String.Empty;
        public string service_get_parametros_sistema { get; set; } = String.Empty;
        public string service_get_separadores { get; set; } = String.Empty;

        #endregion
    }
}
