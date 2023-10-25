import React, { useState, useCallback, useEffect } from 'react';
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
        <header id={idHeader}>
            <Col className="widthPrincipal">
                <Row className="blueBackgroundRect align-items-center">
                    <Col xs={6}>
                        <img
                            alt="logo"
                            src="/Imagenes/logo.png"
                            style={{ width: 250 }}
                        />
                    </Col>
                    <Col xs={6}>
                        <h1 className="text-right">{toCapitalize(props.nombreSistema)}</h1>
                    </Col>
                </Row>
            </Col>
            <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom bg_smoke" light>
                <NavbarBrand tag={Link} to="/"></NavbarBrand>
                <NavbarToggler onClick={() => setCollapsed(!collapsed)} className="mr-2" />
                <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={collapsed} navbar>
                    <ul className="navbar-nav flex-grow">
                        <NavItem>
                            <NavLink tag={Link} className="text-dark" to="/" active={linkSelected === "/"}>Home</NavLink>
                        </NavItem>
                        {props.listaMenus.map((item) =>
                            <NavItem key={item.id}>
                                {item.funcionesHijas && item.funcionesHijas.length > 0 ?
                                    <Dropdown nav isOpen={dropdownOpen} toggle={toggle} id={item.url}>
                                        <DropdownToggle nav caret>{item.nombre}</DropdownToggle>
                                        <DropdownMenu>
                                            {item.funcionesHijas.map((fun) =>
                                                <DropdownItem key={"FHija_" + fun.fun_id}>
                                                    <NavLink tag={Link} to={fun.fun_url} active={linkSelected === item.url} className="text-dark">{toCapitalize(fun.fun_nombre)}</NavLink>
                                                </DropdownItem>
                                            )}
                                        </DropdownMenu>
                                    </Dropdown>
                                    :
                                    <NavLink tag={Link} to={item.url} active={linkSelected === item.url} className="text-dark" id={item.url}>{toCapitalize(item.nombre)}</NavLink>
                                }
                            </NavItem>
                        )}
                        <NavItem>
                            <NavLink tag={Link} className="text-dark" target="_blank" to="/ManualLogs.pdf">Manual</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} className="text-dark" to="#" onClick={() => setOpenCambiarPass(!openCambiarPass)}>Cambiar Password</NavLink>
                            {openCambiarPass ?
                                <CambiarPassword openModal={openCambiarPass} setOpenModal={setOpenCambiarPass} callIn={"NAV"} />
                                : ""}
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} className="text-dark" to="#" onClick={() => setOpenCambiarPreguntas(!openCambiarPreguntas)}>Cambiar Preguntas</NavLink>
                            {openCambiarPreguntas ?
                                <CambiarPreguntas openModal={openCambiarPreguntas} setOpenModal={setOpenCambiarPreguntas} callIn={"NAV"} />
                                : ""}
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} className="text-dark" to="/logout">Salir</NavLink>
                        </NavItem>
                        <NavItem>
                            &nbsp;
                        </NavItem>
                    </ul>
                </Collapse>
            </Navbar>
            <Col className="widthPrincipal">
                <Row className="bg-light">
                    <Col className="d-none d-md-block d-lg-block">
                        &nbsp;
                    </Col>
                    <Col className="text-center">
                        <Clock tstampActual={props.tstampActual} dataTinactividad={props.dataTinactividad} />
                    </Col>
                    <Col className="text-right">
                        <b>{perfilUsuario}:</b> {nombreUsuario}
                    </Col>
                </Row>
            </Col>
        </header>
    );
}

export default connect(mapStateToProps, {})(NavMenu);