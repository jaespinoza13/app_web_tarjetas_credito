namespace Domain.Common {
    public class Header {
        public Header() {}

        public Header(Header header) {
            this.str_id_transaccion = header.str_id_transaccion;
            this.str_identificador = header.str_identificador;
            this.str_id_sistema = header.str_id_sistema;
            this.str_app = header.str_app;
            this.str_id_servicio = header.str_id_servicio;
            this.str_version_servicio = header.str_version_servicio;
            this.str_mac_dispositivo = header.str_mac_dispositivo;
            this.str_ip_dispositivo = header.str_ip_dispositivo;
            this.str_remitente = header.str_remitente;
            this.str_receptor = header.str_receptor;
            this.str_tipo_peticion = header.str_tipo_peticion;
            this.str_id_msj = header.str_id_msj;
            this.dt_fecha_operacion = header.dt_fecha_operacion;
            this.bl_posible_duplicado = header.bl_posible_duplicado;
            this.str_prioridad = header.str_prioridad;
            this.str_login = header.str_login;
            this.str_firma_digital = header.str_firma_digital;
            this.str_sesion = header.str_sesion;
            this.str_nemonico_canal = header.str_nemonico_canal;
            this.str_id_usuario = header.str_id_usuario;
            this.str_latitud = header.str_latitud;
            this.str_longitud = header.str_longitud;
            this.str_num_sim = header.str_num_sim;
            this.str_clave_secreta = header.str_clave_secreta;
            this.str_pais = header.str_pais;
            this.str_id_oficina = header.str_id_oficina;
            this.str_id_perfil = header.str_id_perfil;
        }

        public string str_id_transaccion { get; set; } = Guid.NewGuid().ToString();
        public string str_identificador { get; set; } = Guid.NewGuid().ToString();
        public string str_id_sistema { get; set; } = String.Empty;
        public string str_app { get; set; } = String.Empty;
        public string str_id_servicio { get; set; } = String.Empty;
        public string str_version_servicio { get; set; } = "1.0";
        public string str_mac_dispositivo { get; set; }
        public string str_ip_dispositivo { get; set; } = String.Empty;
        public string str_remitente { get; set; } = "TARJETAS DE CRÉDITO";
        public string str_receptor { get; set; } = "apiGatewayTarjetasCredito";
        public string str_tipo_peticion { get; set; } = "REQ";
        public string str_id_msj { get; set; } = DateTime.Now.ToFileTime().ToString();
        public DateTime dt_fecha_operacion { get; set; } = DateTime.Now;
        public bool bl_posible_duplicado { get; set; } = false;
        public string str_prioridad { get; set; } = "BAJA";
        public string str_login { get; set; }
        public string str_firma_digital { get; set; } = Guid.NewGuid().ToString();
        public string str_sesion { get; set; }
        public string str_nemonico_canal { get; set; } = String.Empty;
        public string str_id_usuario { get; set; }
        public string str_latitud { get; set; } = "-1";
        public string str_longitud { get; set; } = "-1";
        public string str_num_sim { get; set; } = "-1";
        public string str_clave_secreta { get; set; } = Guid.NewGuid().ToString();
        public string str_pais { get; set; } = "EC";
        public string str_id_oficina { get; set; }
        public string str_id_perfil { get; set; }

        public void llenarDatosConfig(AppSettings _settings) {
            this.str_id_sistema = _settings.id_sistema.ToString();
            this.str_nemonico_canal = _settings.nmo_canal;
            this.str_app = _settings.app_name;
        }

        public override string? ToString() {
            return "{Header : {" +
                "\nstr_id_transaccion: " + str_id_transaccion +
            "\nstr_identificador: " + str_identificador +
            "\nstr_id_sistema: " + str_id_sistema +
            "\nstr_app: " + str_app +
            "\nstr_id_servicio: " + str_id_servicio +
            "\nstr_version_servicio: " + str_version_servicio +
            "\nstr_mac_dispositivo: " + str_mac_dispositivo +
            "\nstr_ip_dispositivo: " + str_ip_dispositivo +
            "\nstr_remitente: " + str_remitente +
            "\nstr_receptor: " + str_receptor +
            "\nstr_tipo_peticion: " + str_tipo_peticion +
            "\nstr_id_msj: " + str_id_msj +
            "\ndt_fecha_operacion: " + dt_fecha_operacion +
            "\nbl_posible_duplicado: " + bl_posible_duplicado +
            "\nstr_prioridad: " + str_prioridad +
            "\nstr_login: " + str_login +
            "\nstr_firma_digital: " + str_firma_digital +
            "\nstr_sesion: " + str_sesion +
            "\nstr_nemonico_canal: " + str_nemonico_canal +
            "\nstr_id_usuario: " + str_id_usuario +
            "\nstr_latitud: " + str_latitud +
            "\nstr_longitud: " + str_longitud +
            "\nstr_num_sim: " + str_num_sim +
            "\nstr_clave_secreta: " + str_clave_secreta +
            "\nstr_pais: " + str_pais +
            "\nstr_id_oficina: " + str_id_oficina +
            "\nstr_id_perfil: " + str_id_perfil +
            "}\n" +
                "}";
        }
    }
}
