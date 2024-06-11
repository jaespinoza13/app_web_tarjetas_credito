import React, { useState, useCallback, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { getUser } from 'react-session-persist';
import {
    Collapse,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    NavItem,
    NavLink,
    Row,
    Col,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import { Link, useHistory, useLocation } from 'react-router-dom';
import '../../../css/NavMenu.css';
import { dateFormat, IsNullOrWhiteSpace, obtenerConexionesLocales, toCapitalize } from '../../../js/utiles';
import CambiarPassword from '../../CambiarPassword';
import CambiarPreguntas from '../../CambiarPreguntas';
import { desencriptar, generate, get } from '../../../js/crypt';

function Clock(props) {
    const [value, setValue] = useState(new Date());
    const history = useHistory();

    const controlSession = useCallback(() => {
        var date = new Date();
        setValue(date);
        if (Math.abs(props.tstampActual - date.getTime()) >= (1000 * 60 * (props.dataTinactividad ?? 5))) {
            history.push("/logout");
        }
    }, [props.tstampActual, props.dataTinactividad, history]);

    useEffect(() => {
        const interval = setInterval(() => controlSession(), 1000);

        return () => {
            clearInterval(interval);
        };
    }, [controlSession]);

    return (
        <span>{dateFormat("Dddd dd de Mmmm del yyyy, HH:MIN:SS", value)}</span>
    );
}

const mapStateToProps = (state) => {
    return {
        token: state.tokenActive.data,
        dataTinactividad: Number(get(state.GetParametros.data["tInacti"])),
        nombreSistema: get(state.GetParametros.data["sistema"]),
    };
};

function NavMenu(props) {
    const location = useLocation();

    const [linkSelected, setLinkSelected] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [openCambiarPass, setOpenCambiarPass] = useState(false);
    const [openCambiarPreguntas, setOpenCambiarPreguntas] = useState(false);
    const [perfilUsuario, setPerfilUsuario] = useState("");
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [url, setUrl] = useState("");
    const [idHeader, setIdHeader] = useState((!IsNullOrWhiteSpace(props.id)) ? props.id : "header_main");
    const [isCollapsedDropdown, setCollapsedDropDown] = useState(false);

    const toggleDropdownOn = () => {
        if (!isCollapsedDropdown) {
            setCollapsedDropDown(true);
        }
    }

    const toggleDropdownOff = () => {
        if (isCollapsedDropdown) {
            setCollapsedDropDown(false);
        }
    }

    const toggle = () => setDropdownOpen(!dropdownOpen);

    useEffect(() => {
        setLinkSelected(location.pathname);
    }, [location.pathname]);

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
        if (document.getElementById('/seguimientotran') && props.listaMenus.length > 0) {
            if (!IsNullOrWhiteSpace(url)) {
                document.getElementById('/seguimientotran').style.display = '';
            } else {
                document.getElementById('/seguimientotran').style.display = 'none';
            }
        }
    }, [url, props.listaMenus.length]);

    useEffect(() => {
        setIdHeader(props.id);
    }, [props.id]);

    return (
        <Fragment>
            {
                nombreUsuario && 
                    <nav id={idHeader}>
                        <div className="info-sistema">
                            <img src="/Imagenes/coopmego-logo-white.svg" alt="imagen_coopmego" />
                            <h2>|</h2>
                            <h2>{toCapitalize(props.nombreSistema)}</h2>
                        </div>
                        <div className="actions">
                            <div className="profile" onMouseEnter={toggleDropdownOn} onMouseLeave={toggleDropdownOff}>
                                <button className="btn_mg btn_mg__secondary btn_mg__auto" id="profile">{nombreUsuario}</button>
                                <div className={`dropdown_mg ${isCollapsedDropdown ? 'active' : ''}`} id="dropdown_mg">
                                    <a href="#">Cambiar contraseña</a>
                                    <a href="#">Preguntas de seguridad</a>
                                </div>
                            </div>
                            <button className="btn_mg btn_mg__secondary btn_mg__auto" id="logout">
                                <NavItem>
                                    <NavLink tag={Link} className="text-dark" to="/logout"> Salir </NavLink>
                                </NavItem>
                            </button>
                        </div>
                    </nav> 
            }
        </Fragment>
        
    );
}

export default connect(mapStateToProps, {})(NavMenu);