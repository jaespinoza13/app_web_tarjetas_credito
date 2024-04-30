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

function Sidebar(props) {
    const [collapsed, setCollapsed] = useState(false);
    const [funcionalidades, setFuncionalidades] = useState([]);
    const [perfilUsuario, setPerfilUsuario] = useState("");
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [url, setUrl] = useState("");

    const [funcionalidadActiva, setFuncionalidadActiva] = useState("");
    function toggleSideBar() {
        setCollapsed(!collapsed);
    }

    useEffect(() => {
        setFuncionalidadActiva(extraerFuncionalPadre(props.enlace));
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

    return (
        /*<div className="content">*/
        <div className={`sidebar ${collapsed && 'sidebar_min'}`} id="sidebar">
            <div className="sidebar_info">
                <div className="sidebar_minimize">
                    <button className="btn_mg btn_mg__tertiary width_btn_close" id="toggle-sidebar" onClick={toggleSideBar}>
                        <img src="Imagenes/menu.png" alt="icono_oculta_menu"></img>
                    </button>
                </div>
                <div className="sidebar_profile">
                    <img src="Imagenes/avatar1.png" alt=""/>
                    <h3>{nombreUsuario}</h3>
                    <hr></hr>
                    <h4>{perfilUsuario }</h4>
                </div>
            </div>
            <div className="sidebar_menu">
                <div className="sidebar_menu__items">
                    <div className="sidebar_menu__item">
                        <NavItem>
                            <NavLink tag={Link} className={`text-dark ${(funcionalidadActiva === 'solicitud') ? 'active' : ''}`} to="/solicitud">Solicitud</NavLink>
                         </NavItem>
                    </div>
                    <div className="sidebar_menu__item">
                        <NavItem>
                            <NavLink tag={Link} className={`text-dark ${(funcionalidadActiva === 'orden') ? 'active' : ''}`} to="/orden">Ordenes</NavLink>
                        </NavItem>
                    </div>
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