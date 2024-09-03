import React, { useState, useEffect } from 'react';
import { getUser } from 'react-session-persist';
import {
    NavItem,
    NavLink,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import '../../../scss/main.css';
import { obtenerConexionesLocales, extraerFuncionalPadre } from '../../../js/utiles';
import { desencriptar, generate, get } from '../../../js/crypt';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import CachedRoundedIcon from '@mui/icons-material/CachedRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';

function Sidebar(props) {
    const [collapsed, setCollapsed] = useState(false);
    const [perfilUsuario, setPerfilUsuario] = useState("");
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [url, setUrl] = useState("");


    //Info sesión
    const [datosUsuario, setDatosUsuario] = useState([]);


    const [funcionalidadActiva, setFuncionalidadActiva] = useState("");
    function toggleSideBar() {
        setCollapsed(!collapsed);
    }

    useEffect(() => {
        setFuncionalidadActiva(extraerFuncionalPadre(props.enlace));
    }, [props.enlace])

    useEffect(() => {        
        obtenerConexionesLocales(sessionStorage.getItem("COEXIONSELECTED")).then((data) => {
            setUrl(data);
        });
        if (perfilUsuario === '') {
            const sender = get(localStorage.getItem('sender'));
            const remitente = get(localStorage.getItem('remitente'));
            const ts = Number(localStorage.getItem('aceptar'));
            if (getUser() && remitente && sender) {
                let key = generate(navigator.userAgent, ts, remitente, sender);
                desencriptar(key, getUser().data).then((datosUsuario) => {                    
                    setPerfilUsuario((datosUsuario) ? datosUsuario.nombre_perfil : '');
                    setNombreUsuario((datosUsuario) ? datosUsuario.nombre : '');
                });
            }
        }
    }, [perfilUsuario]);

    useEffect(() => {
        const strOficial = get(localStorage.getItem("sender_name"));
        const strRol = get(localStorage.getItem("role"));

        const userOficial = get(localStorage.getItem('sender'));
        const userOficina = get(localStorage.getItem('office'));

        setDatosUsuario([{ strCargo: strRol, strOficial: strOficial, strUserOficial: userOficial, strUserOficina: userOficina }]);
    }, [])
    
    useEffect(() => {
        console.log(datosUsuario)
    }, [datosUsuario])
    
    return (
        /*<div className="content">*/
        <div className={`sidebar ${collapsed && 'sidebar_min'}`} id="sidebar">

            <div className="sidebar_info" style={{
                height: collapsed ? "11rem" : "17.5rem",
                transition: "0.3s ease",
                border: "none"
            }}>
                <div className="sidebar_minimize">
                    <div className="width_btn_close" id="toggle-sidebar" onClick={toggleSideBar}>
                        <img src="Imagenes/menu.png" alt="icono_oculta_menu" width="40rem" ></img>
                    </div>
                </div>

                <div className="sidebar_profile">
                    <img src="Imagenes/avatar1.png" alt="" />
                    {collapsed && <hr style={{ backgroundColor: "#FED400" }} />}
                    <h3 className="tituloUsuario">{nombreUsuario}</h3>
                    {!collapsed && <hr style={{ backgroundColor: "#FED400" }} />}
                    <h4 className="perfilUsuario">{perfilUsuario}</h4>
                </div>
            </div>

            <div className="sidebar_menu">
                <div className="sidebar_menu__items">

                    {/*Se deja ASESOR DE CR�DITO porque no se reconoce caracter de la tilde*/}
                    {perfilUsuario !== "" && (perfilUsuario === "ASESOR DE NEGOCIO" || /*perfilUsuario === "ASISTENTE DE AGENCIA" || */
                        perfilUsuario === "ASESOR DE CRÉDITO" || perfilUsuario === "ASESOR DE CR�DITO" || perfilUsuario === "ANALISTA CREDITO" || perfilUsuario === "JEFE DE UAC" || perfilUsuario === "OPERATIVO DE NEGOCIOS" || perfilUsuario === "UNIDAD DE RIESGOS"
                        || perfilUsuario === "DIRECTOR DE NEGOCIOS") &&
                        <div className="sidebar_menu__item">
                            <NavItem>
                                <NavLink tag={Link} className={`text-dark ${(funcionalidadActiva === 'solicitud' || funcionalidadActiva === 'prospeccion') ? 'active' : ''}`} to="/solicitud">
                                    <div className="f-row" style={{ width: collapsed ? "25px" : "" }}>
                                        <HomeRoundedIcon
                                            sx={{
                                                fontSize: 26,
                                                marginLeft: collapsed ? 1.7 : 0.7,
                                                marginRight: collapsed ? 1.7 : 0.7,
                                                transition: "0.3s ease",
                                            }}
                                        ></HomeRoundedIcon>
                                        {/*<img src="Imagenes/menu.png" alt="Solicitudes" className="ml-1 mr-3"></img>*/}
                                        <div className={`tituloItemMenu`}
                                            style={{
                                                transform: "translateY(0.1rem)",
                                                transition: "opacity 0.3s ease",
                                                display: collapsed ? "none" : "block",

                                            }}>Solicitud</div>
                                    </div>
                                </NavLink>
                            </NavItem>
                        </div>
                    }




                    {perfilUsuario !== "" && perfilUsuario === "ASISTENTE DE OPERACIONES" &&

                        <div className="sidebar_menu__item">
                            <NavItem>
                                <NavLink tag={Link} className={`text-dark ${(funcionalidadActiva === 'reprocesar') ? 'active' : ''}`} to="/reprocesar">
                                    <div className="f-row" style={{ width: collapsed ? "25px" : "" }}>
                                        <CachedRoundedIcon
                                            sx={{
                                                fontSize: 26,
                                                marginLeft: collapsed ? 1.7 : 0.7,
                                                marginRight: collapsed ? 1.7 : 0.7,
                                                transition: "0.3s ease",
                                            }}
                                        ></CachedRoundedIcon>
                                        {/*<img src="Imagenes/menu.png" alt="Solicitudes" className="ml-1 mr-3"></img>*/}
                                        <div className={`tituloItemMenu`}
                                            style={{
                                                transform: "translateY(0.1rem)",
                                                transition: "opacity 0.3s ease",
                                                display: collapsed ? "none" : "block",

                                            }}>Reprocesar</div>
                                    </div>
                                </NavLink>
                            </NavItem>
                        </div>
                    }




                    {perfilUsuario !== "" && (perfilUsuario === "ASISTENTE DE OPERACIONES" || perfilUsuario === "ASISTENTE DE AGENCIA" || perfilUsuario === "ASISTENTE DE PLATAFORMA DE SERVICIOS"
                        || perfilUsuario ==="SUPERVISOR DE PLATAFORMA DE SERVICIOS") &&
                        <div className="sidebar_menu__item">
                            <NavItem>
                                <NavLink tag={Link} className={`text-dark ${(funcionalidadActiva === 'seguimiento') ? 'active' : ''}`} to="/seguimiento">
                                    <div className="f-row" style={{ width: collapsed ? "25px" : "" }}>
                                        <AssignmentRoundedIcon
                                            sx={{
                                                fontSize: 26,
                                                marginLeft: collapsed ? 1.7 : 0.7,
                                                marginRight: collapsed ? 1.7 : 0.7,
                                                transition: "0.3s ease",
                                            }}
                                        ></AssignmentRoundedIcon>
                                        {/*<img src="Imagenes/menu.png" alt="Solicitudes" className="ml-1 mr-3"></img>*/}
                                        <div className={`tituloItemMenu`}
                                            style={{
                                                transform: "translateY(0.1rem)",
                                                transition: "opacity 0.3s ease",
                                                display: collapsed ? "none" : "block",

                                            }}>Seguimiento</div>
                                    </div>
                                </NavLink>
                            </NavItem>
                        </div>
                    }

                    {perfilUsuario !== "" && perfilUsuario === "ASISTENTE DE OPERACIONES" &&

                        <div className="sidebar_menu__item">
                            <NavItem>
                                <NavLink tag={Link} className={`text-dark ${(funcionalidadActiva === 'rechazadas') ? 'active' : ''}`} to="/rechazadas">
                                    <div className="f-row" style={{ width: collapsed ? "25px" : "" }}>
                                        <CachedRoundedIcon
                                            sx={{
                                                fontSize: 26,
                                                marginLeft: collapsed ? 1.7 : 0.7,
                                                marginRight: collapsed ? 1.7 : 0.7,
                                                transition: "0.3s ease",
                                            }}
                                        ></CachedRoundedIcon>
                                        {/*<img src="Imagenes/menu.png" alt="Solicitudes" className="ml-1 mr-3"></img>*/}
                                        <div className={`tituloItemMenu`}
                                            style={{
                                                transform: "translateY(0.1rem)",
                                                transition: "opacity 0.3s ease",
                                                display: collapsed ? "none" : "block",

                                            }}>Rechazadas</div>
                                    </div>
                                </NavLink>
                            </NavItem>
                        </div>
                    }



                    {/*<div className="sidebar_menu__item">*/}
                    {/*    <NavItem>*/}
                    {/*        <NavLink tag={Link} className={`text-dark ${(funcionalidadActiva === 'recepcion') ? 'active' : ''}`} to="/recepcion">Recibir &oacute;rdenes personalizadas</NavLink>*/}
                    {/*    </NavItem>*/}
                    {/*</div>*/}

                    {/*<div className="sidebar_menu__item">*/}
                    {/*    <NavItem>*/}
                    {/*        <NavLink tag={Link} className={`text-dark ${(funcionalidadActiva === 'distribucion') ? 'active' : ''}`} to="/distribucion">Distribuir &oacute;rdenes</NavLink>*/}
                    {/*    </NavItem>*/}
                    {/*</div>*/}

                    {/*<div className="sidebar_menu__item">*/}
                    {/*    <NavItem>*/}
                    {/*        <NavLink tag={Link} className={`text-dark ${(funcionalidadActiva === 'recibirOrden') ? 'active' : ''}`} to="/recibirOrden">Recibir &oacute;rdenes</NavLink>*/}
                    {/*    </NavItem>*/}
                    {/*</div>*/}



                    {/*{datosUsuario.length > 0 &&*/}
                    {/*    (datosUsuario[0]?.strCargo === "ASISTENTE DE PLATAFORMA DE SERVICIOS" ||*/}
                    {/*        datosUsuario[0]?.strCargo === "ASISTENTE DE AGENCIA") &&*/}
                    {/*    <div className="sidebar_menu__item">*/}
                    {/*        <NavItem>*/}
                    {/*            <NavLink tag={Link} className={`text-dark ${(funcionalidadActiva === 'entregaTC') ? 'active' : ''}`} to="/entregaTC">*/}
                    {/*                {datosUsuario[0]?.strCargo === "ASISTENTE DE PLATAFORMA DE SERVICIOS" ? "Entregar tarjeta" : "Activar TC" }*/}

                    {/*            </NavLink>*/}
                    {/*        </NavItem>*/}
                    {/*    </div>*/}
                    {/*}*/}




                    {/*<div className="sidebar_menu__item">*/}
                    {/*    <NavItem>*/}
                    {/*        <NavLink tag={Link} className={`text-dark ${(funcionalidadActiva === 'activacion') ? 'active' : ''}`} to="/activacion">Activar</NavLink>*/}
                    {/*    </NavItem>*/}
                    {/*</div>*/}

                    {/*<div className="sidebar_menu__item">*/}
                    {/*    <NavItem>*/}
                    {/*        <NavLink tag={Link} className={`text-dark ${(funcionalidadActiva === 'orden') ? 'active' : ''}`} to="/orden">Ordenes</NavLink>*/}
                    {/*    </NavItem>*/}
                    {/*</div>*/}
                    {/*<div className="sidebar_menu__item">*/}
                    {/*    <NavItem>*/}
                    {/*        <NavLink tag={Link} className={`text-dark ${(funcionalidadActiva === 'recibir_orden_proveedor') ? 'active' : ''}`} to="/recibir_orden_proveedor">Recibir env&#237;o del Proveedor</NavLink>*/}
                    {/*    </NavItem>*/}
                    {/*</div>*/}
                    {/*<div className="sidebar_menu__item">*/}
                    {/*    <NavItem>*/}
                    {/*        <NavLink tag={Link} className={`text-dark ${(funcionalidadActiva === 'confirmar_recepcion') ? 'active' : ''}`} to="/confirmar_recepcion">Confirmar Recepci&#243;n Tarjetas</NavLink>*/}
                    {/*    </NavItem>*/}
                    {/*</div>*/}
                    {/*<div className="sidebar_menu__item">*/}
                    {/*    <a className="item__master">Reportes</a>*/}
                    {/*    <div className="item_slaves">*/}
                    {/*        <a className="item__slave">*/}
                    {/*            Reportes*/}
                    {/*        </a>*/}
                    {/*        <a className="item__slave">Reportes</a>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    {/*<div className="sidebar_menu__item">*/}
                    {/*    <a className="item__master">Reportes</a>*/}
                    {/*    <div className="item_slaves">*/}
                    {/*        <a className="item__slave">Reportes</a>*/}
                    {/*        <a className="item__slave">Reportes</a>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
                </div>
        </div>


        //<div className={`sidebar ${collapsed ? 'sidebar_min' : ''}`} id='sidebar'>
        //    <div className="sidebar_info">
        //        <div className="sidebar_minimize">
        //            <button className="btn_mg btn_mg__tertiary" id="toggle-sidebar" onClick={toggleSideBar}>
        //                <img src="Imagenes/menu.png"></img>
        //            </button>
        //        </div>
        //        <div className="sidebar_profile">
        //            <img src="/Imagenes/avatar1.png" alt=""></img>
        //            <h3>{nombreUsuario}</h3>
        //            <hr></hr>
        //            <h4>{perfilUsuario }</h4>
        //        </div>
        //    </div>
        //    <div className="sidebar_menu">
        //        <div className="sidebar_menu__items">
        //            <div className="sidebar_menu__item">
        //                <NavItem>
        //                    <NavLink tag={Link} className="text-dark" to="/solicitud">Solicitud</NavLink>
        //                </NavItem>
        //            </div>
        //            <div className="sidebar_menu__item">
        //                <a className="item__master">Reportes</a>
        //                <div className="item_slaves">
        //                    <a className="item__slave">Reportes</a>
        //                    <a className="item__slave">Reportes</a>
        //                </div>
        //            </div>
        //        </div>
        //    </div>
        //</div>
        //</div>
    );
}

export default /*connect(mapStateToProps, {})*/(Sidebar);;