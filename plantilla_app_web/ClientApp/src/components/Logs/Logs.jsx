import React, { useCallback, useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardText,
    CardTitle,
    Col,
    Container,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Form,
    FormGroup,
    Input,
    Label,
    Nav,
    NavItem,
    Row,
    Tooltip,
    NavLink,
    UncontrolledDropdown,
    OffcanvasHeader,
    OffcanvasBody,
    Offcanvas,
} from 'reactstrap';
import { selectWebService } from '../../redux/Logs/WebServerSelected/actions';
import { getUsuario } from '../../services/Services';
import { dateFormat, IsNullOrWhiteSpace, obtenerConecxionesStorage, persistirConexionesStorage, reduceString } from '../../js/utiles';
import ModalAlert from '../Common/Alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { fetchGetListaParametros } from '../../redux/Parametros/actions';
import { Link } from 'react-router-dom';
import { fetchBds, fetchColecciones, fetchConexiones, fetchDocumentos, handlerConexion } from '../../services/RestServices';
import { setAlertText } from '../../redux/Alert/actions';
import { set } from '../../js/crypt';
import { setListaBases } from '../../redux/Logs/ListaBases/actions';

function CardItem(props) {
    const dispatch = useDispatch();

    const { item, id, color, isError } = props;
    const [tooltipOpen, setTooltipOpen] = useState(false);

    const toggle = () => setTooltipOpen(!tooltipOpen);
    return (
        <Col style={{ padding: "5px" }}>
            <Card
                id={"Card" + id}
                className="my-2"
                color={color}
                outline
                style={{
                    width: '15rem',
                    margin: "0 auto"
                }}
            >
                <CardHeader style={{ minHeight: "85px", display: "flex", placeItems: "center" }}>
                    <h4 className={"text-" + color} style={{ width: "100%" }}>{item.str_nombre}</h4>
                </CardHeader>
                <CardBody>
                    <CardTitle tag="h5">
                        {item.str_ip}
                    </CardTitle>
                    <CardText>
                        {item.str_host}
                        {isError ?
                            <span style={{ color: "red", fontSize: "10px" }}><br />Posible error de est&aacute;ndar ISO - 20022</span>
                            : ""}
                    </CardText>
                </CardBody>
                <CardFooter>
                    <Row width="100%">
                        <Col>
                            <Button color={'primary'} disabled={color === "primary" || !props.enableTXT} onClick={() => {
                                sessionStorage.setItem("WSSELECTED", item.str_nombre);
                                dispatch(selectWebService(item.str_nombre));
                                props.history.push("/logsTexto");
                            }}>
                                Texto
                            </Button>
                        </Col>
                        <Col>
                            <Button color={'success'} disabled={!props.enableMongo} onClick={() => {
                                sessionStorage.setItem("WSSELECTED", item.str_nombre);
                                dispatch(selectWebService(item.str_nombre));
                                props.history.push("/logsMongo")
                            }}>
                                Mongo
                            </Button>
                        </Col>
                    </Row>
                </CardFooter>
            </Card>
            {(color !== "success") ?
                <Tooltip
                    placement="bottom"
                    fade={false}
                    isOpen={tooltipOpen}
                    target={"Card" + id}
                    toggle={toggle}
                >
                    {(color === "primary") ? item.str_nombre + " a\u00fan no usa wsLogs." :
                        (color === "danger") ? "El sistema " + item.str_nombre + " registr\u00f3 un error el " + dateFormat("Dddd dd de Mmmm del yyyy, HH:MIN:SS", item.dtt_fecha_registro) : null}
                </Tooltip>
                : ""
            }
        </Col>
    );
}

CardItem.propTypes = {
    item: PropTypes.object,
    id: PropTypes.string,
};

const mapStateToProps = (state) => {
    return {
        token: state.tokenActive.data,
        lst_urls: state.GetListaUrls.data,
        listaFuncionalidades: state.GetListaFuncionalidades.data,
        lstBases: state.ListaBasesMongoDb.data
    };
};

function HomeLogs(props) {
    const dispatch = useDispatch();

    const [openModal, setOpenModal] = useState(false);
    const [listaBds, setListaBds] = useState([]);
    const [listaBdsAux, setListaBdsAux] = useState([]);
    const [listaConexiones, setListaConexiones] = useState([]);
    const [listaConexionesLocales, setListaConexionesLocales] = useState([]);
    const [recordar, setRecordar] = useState(false);
    const [idEdit, setIdEdit] = useState("");
    const [loginUser, setLoginUser] = useState("");
    const [userBd, setUserBd] = useState("");
    const [idUser, setIdUser] = useState(0);
    const [passBd, setPassBd] = useState("");
    const [passOFF, setPassOFF] = useState("");
    const [serverBd, setServerBd] = useState("");
    const [filtrarError, setFiltrarError] = useState(false);
    const [filtrarNoError, setFiltrarNoError] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [enableTXT, setEnableTXT] = useState(false);
    const [enableMongo, setEnableMongo] = useState(false);
    const [filtrarSistema, setFiltrarSistema] = useState("");

    useEffect(() => {
        getUsuario().then((user) => {
            if (user) {
                setLoginUser(user.login);
                setUserBd(user.login);
                setIdUser(user.id_usuario);
                if (listaConexionesLocales.length === 0) {
                    obtenerConecxionesStorage(user.login, user.id_usuario).then((con) => {
                        setListaConexionesLocales(con);
                    });
                }
            }
        });
        let heightBtn = document.getElementById('btn_menu_lateral_hidd').clientHeight;
        if (document.getElementById('btn_menu_lateral_hidd').style.display !== 'none') {
            document.getElementById('col_nav_lateral').classList.remove("border");
            document.getElementById('col_nav_lateral').classList.add("border");
        } else {
            document.getElementById('col_nav_lateral').classList.remove("border");
        }
        document.getElementById('container_main').style.height = (window.innerHeight - document.getElementById("header_main").clientHeight - heightBtn) + "px";
        window.addEventListener("resize", function () {
            heightBtn = document.getElementById('btn_menu_lateral_hidd').clientHeight;
            document.getElementById('container_main').style.height = (window.innerHeight - document.getElementById("header_main").clientHeight - heightBtn) + "px";
        });
    }, [listaConexionesLocales.length]);

    const fetchConexion = useCallback((usr = null, srv = null) => {
        if (listaConexiones.length === 0) {
            fetchConexiones(props.token, (lst_conexiones) => {
                setListaConexiones(lst_conexiones);
                obtenerConecxionesStorage(loginUser, idUser).then((con) => {
                    setListaConexionesLocales(con);
                    if (!IsNullOrWhiteSpace(sessionStorage.getItem("conSelected"))) {
                        let cont = 0;
                        for (let i = 0; i < con.length; i++) {
                            let item = con[i];
                            if (item.id === sessionStorage.getItem("conSelected")) {
                                cont++;
                                fetchBds(props.lstBases.length === 0, { str_usuario: item.usr, str_clave: item.clv, str_servidor: item.srv }, props.token, (lst_bds) => {
                                    if (props.lstBases.length !== 0) {
                                        lst_bds = props.lstBases;
                                    }
                                    setListaBds(lst_bds);
                                    setListaBdsAux(lst_bds);
                                    setOpenMenu(false);
                                }, dispatch);
                                break;
                            }
                        }
                        if (cont === 0) {
                            for (let i = 0; i < lst_conexiones.length; i++) {
                                let item = lst_conexiones[i];
                                if (item.str_id_con === sessionStorage.getItem("conSelected")) {
                                    fetchBds(props.lstBases.length === 0, item, props.token, (lst_bds) => {
                                        if (props.lstBases.length !== 0) {
                                            lst_bds = props.lstBases;
                                        }
                                        setListaBds(lst_bds);
                                        setListaBdsAux(lst_bds);
                                        setOpenMenu(false);
                                    }, dispatch);
                                    break;
                                }
                            }
                        }
                    }
                });
            }, dispatch, usr, srv);
        }
    }, [idUser, loginUser, listaConexiones.length, props.lstBases, dispatch]);

    const handlerConexionL = (bd = null, usr = null, pass = null) => {
        if (recordar || (!IsNullOrWhiteSpace(bd) && !IsNullOrWhiteSpace(usr) && !IsNullOrWhiteSpace(pass))) {
            var srv = !IsNullOrWhiteSpace(bd) ? bd : serverBd;
            var us = !IsNullOrWhiteSpace(usr) ? usr : userBd;
            if (!listaConexiones.find((el) => el.str_nombre === us + "@" + srv) || !IsNullOrWhiteSpace(idEdit)) {
                var edit = null;
                if (!IsNullOrWhiteSpace(idEdit)) {
                    edit = listaConexiones.find((el) => el.str_id_con === idEdit);
                }

                handlerConexion(props.token, dispatch, srv, us, !IsNullOrWhiteSpace(pass) ? pass : passBd, !IsNullOrWhiteSpace(idEdit), edit ? edit.str_nombre : null);

            } else {
                if (dispatch) dispatch(setAlertText({ code: "1", text: "Ya existe una conexi\u00f3n" }));
            }
        } else {
            obtenerConecxionesStorage(loginUser, idUser).then((con) => {
                if (!con.find((el) => el.usr_id === idUser && el.usr === us && el.srv === srv)) {
                    if (!IsNullOrWhiteSpace(idEdit)) {
                        con = con.filter((el) => el.id !== idEdit);
                        con.push({ id: idEdit, usr: userBd, usr_id: idUser, clv: passBd, srv: serverBd });
                        setIdEdit("");
                    } else {
                        if (!con.find((el) => el.usr_id === idUser && el.usr === userBd && el.srv === serverBd)) {
                            con.push({ id: "LOCAL_" + con.length, usr: userBd, usr_id: idUser, clv: passBd, srv: serverBd });
                        }
                    }
                    persistirConexionesStorage(loginUser, idUser, con);
                    sessionStorage.setItem("conSelected", "LOCAL_" + con.length);
                    setListaConexionesLocales(con);
                    fetchBds(true, { str_usuario: userBd, str_clave: passBd, str_servidor: serverBd }, props.token, (lst_bds) => {
                        setListaBds(lst_bds);
                        setListaBdsAux(lst_bds);
                        setOpenMenu(false);
                    }, dispatch);
                } else {
                    if (dispatch) dispatch(setAlertText({ code: "1", text: "Ya existe una conexi\u00f3n" }));
                }
            });
        }
        setOpenModal(false);
    }

    const offText = (txt_old, txt_new) => {
        var textAux = txt_new;
        if (txt_new.substring(txt_new.length - 1) === "*") {
            textAux = txt_old.substring(0, txt_new.length);
        } else {
            if (IsNullOrWhiteSpace(txt_new)) {
                textAux = "";
            } else {
                if (txt_new.length > 0) {
                    textAux = txt_old + txt_new.substring(txt_new.length - 1);
                } else {
                    textAux = txt_new;
                }
            }
        }
        return textAux;
    }

    const setPassword = (pass) => {
        if (pass === "") {
            setPassBd("");
            setPassOFF("");
        } else {
            var passAux = offText(passBd, pass);
            setPassBd(passAux);
            var off = "";
            for (let i = 0; i < pass.length; i++) {
                off += "*";
            }
            setPassOFF(off);
        }
    }

    useEffect(() => {
        if (props.lst_urls.length === 0) {
            dispatch(fetchGetListaParametros());
        }
        fetchConexion();

        let enM = false;
        let enT = false;
        if (props.listaFuncionalidades.length > 0) {
            for (let i = 0; i < props.listaFuncionalidades.length; i++) {
                if (props.listaFuncionalidades[i].nombre === set("VER_LOGS_DE_MONGO")) {
                    enM = true;
                }
                if (props.listaFuncionalidades[i].nombre === set("VER_LOGS_DE_TEXTO")) {
                    enT = true;
                }
            }
        }
        setEnableMongo(enM);
        setEnableTXT(enT);
    }, [dispatch, props.lst_urls, fetchConexion, props.listaFuncionalidades]);

    useEffect(() => {
        let ver = localStorage.getItem("verify");
        let dateLast = new Date(ver);
        let minPasados = Math.abs(dateLast.getMinutes - new Date().getMinutes());
        if (IsNullOrWhiteSpace(ver)) minPasados = 20;
        if (listaBds.length > 0 && minPasados >= 10) {
            getCols([...listaBds], props.token, 0);

            function getCols(lst, tok, i) {
                if (i < lst.length) {
                    fetchColecciones(lst[i].str_nombre, tok, (lstCol, token2) => {
                        getDocs(lst, lstCol, token2, i, 0);
                    }, dispatch, true);
                }
            }
            function getDocs(lst, lstCol, tok, i, j) {
                if (j < lstCol.length) {
                    if (lstCol[j] && lstCol[j].toLowerCase().includes("resp")) {
                        fetchDocumentos(lst[i].str_nombre, lstCol[j], 1, 0, false, "", tok, (dataRes) => {
                            if (dataRes.lst_docs.length > 0 && dataRes.lst_docs[0].str_res_estado_transaccion === "ERR") {
                                lst[i].bln_isResError = true;
                            } else {
                                lst[i].bln_isResError = false;
                            }
                            getDocs(lst, lstCol, dataRes.solToken, i, j + 1);
                        }, dispatch, true);
                    } else {
                        getDocs(lst, lstCol, tok, i, j + 1);
                    }
                } else if (j === lstCol.length) {
                    getCols(lst, tok, i + 1);
                    if (i === lst.length - 1) {
                        localStorage.setItem("verify", new Date().getTime());
                        dispatch(setListaBases(lst));
                        setListaBds(lst);
                        setListaBdsAux(lst);
                    }
                }
            }
        }
    }, [listaBds, dispatch]);

    const footer = <Button color="guardar-cambios" type="button" disabled={IsNullOrWhiteSpace(userBd) || IsNullOrWhiteSpace(passBd) || IsNullOrWhiteSpace(serverBd)} onClick={() => handlerConexionL()} >Guardar y Conectar</Button>;

    const header = <><FontAwesomeIcon icon={solid("globe")} color={"orange"} />&nbsp;Nueva Conexi&oacute;n</>;

    const navLateral = <>
        <Button onClick={async () => {
            setRecordar(false);
            getUsuario().then((user) => {
                if (user) {
                    setUserBd(user.login);
                    setIdUser(user.id_usuario);
                }
            });
            setPassword("");
            setServerBd("");
            setOpenModal(!openModal);
        }}>Conectar</Button>
        <ModalAlert
            openModal={openModal}
            size={"md"}
            unmountOnClose={true}
            btnCancelar={"Cancelar"}
            handlerBtnCancelar={() => setOpenModal(!openModal)}
            header={header}
            btn_footer={footer}
        >
            <Form>
                <FormGroup>
                    <Label for="userConnect">
                        Usuario
                    </Label>
                    <Input
                        id="userConnect"
                        name="userConnect"
                        placeholder="Usuario de MongoDB"
                        type="text"
                        value={userBd}
                        onChange={(e) => setUserBd(e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="claveConnect">
                        Clave
                    </Label>
                    <Input
                        id="claveConnect"
                        name="claveConnect"
                        placeholder="Clave de MongoDB"
                        value={passOFF}
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="serverConnect">
                        Servidor
                    </Label>
                    <Input
                        id="serverConnect"
                        name="serverConnect"
                        placeholder="Servidor de MongoDB"
                        value={serverBd}
                        type="select"
                        onChange={(e) => setServerBd(e.target.value)}
                    >
                        <option key={"URLS"} value={""}>
                            Seleccione...
                        </option>
                        {props.lst_urls.map((url) =>
                            <option key={"URLS" + url} value={url}>
                                {url}
                            </option>
                        )}
                    </Input>
                </FormGroup>
                {IsNullOrWhiteSpace(idEdit) ?
                    <FormGroup check>
                        <Input type="checkbox" id="blnSave" name="blnSave" checked={recordar} onChange={() => setRecordar(!recordar)} />
                        <Label check for="blnSave">
                            Recordar Conexi&oacute;n
                        </Label>
                    </FormGroup>
                    : ""}
            </Form>
        </ModalAlert>
        <Nav vertical id="nav_lateral_sm">
            <hr />
            {listaConexionesLocales.map((item, index) =>
                <NavItem key={"ConLocal" + index} className="row">
                    <NavLink tag={Link} to="#" className="text-dark col-10" onClick={() => {
                        sessionStorage.setItem("conSelected", item.id);
                        fetchBds(true, { str_usuario: item.usr, str_clave: item.clv, str_servidor: item.srv }, props.token, (lst_bds) => {
                            setListaBds(lst_bds);
                            setListaBdsAux(lst_bds);
                            setOpenMenu(false);
                        }, dispatch);
                    }}><FontAwesomeIcon icon={solid("address-card")} color={"orange"} />&nbsp;{reduceString(item.usr + "@" + item.srv, 20)}</NavLink>
                    <UncontrolledDropdown size={"sm"} direction="end" className="col-2" >
                        <DropdownToggle caret color="primary" >
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem onClick={() => {
                                setPassword("");
                                setIdEdit(item.id);
                                setRecordar(false);
                                setUserBd(item.usr);
                                setServerBd(item.srv);
                                setOpenModal(true);
                            }}>
                                Editar
                            </DropdownItem>
                            <DropdownItem onClick={() => {
                                obtenerConecxionesStorage(loginUser, idUser).then((con) => {
                                    con = con.filter((el) => el.id !== item.id);
                                    setListaConexionesLocales(con);
                                    persistirConexionesStorage(loginUser, idUser, con);
                                    if (!IsNullOrWhiteSpace(sessionStorage.getItem("conSelected")) && sessionStorage.getItem("conSelected") === item.id) {
                                        sessionStorage.removeItem("conSelected");
                                    }
                                });
                            }}>
                                Eliminar
                            </DropdownItem>
                            <DropdownItem onClick={() => {
                                sessionStorage.setItem("conSelected", item.id);
                                fetchBds(true, { str_usuario: item.usr, str_clave: item.clv, str_servidor: item.srv }, props.token, (lst_bds) => {
                                    setListaBds(lst_bds);
                                    setListaBdsAux(lst_bds);
                                    setOpenMenu(false);
                                }, dispatch);
                            }}>
                                Conectar
                            </DropdownItem>
                            <DropdownItem onClick={() => {
                                setRecordar(true);
                                setUserBd(item.usr);
                                setPassBd(item.clv);
                                setServerBd(item.srv);
                                var t = setTimeout(() => {
                                    handlerConexionL(item.srv, item.usr, item.clv);
                                    clearTimeout(t);
                                }, 700);
                            }}>
                                Recordar
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </NavItem>
            )}
            <hr />
            {listaConexiones.map((item, index) =>
                <NavItem key={"Con" + index} className="row">
                    <NavLink tag={Link} to="#" className="text-dark col-10" onClick={() => {
                        sessionStorage.setItem("conSelected", item.str_id_con);
                        fetchBds(true, item, props.token, (lst_bds) => {
                            setListaBds(lst_bds);
                            setListaBdsAux(lst_bds);
                            setOpenMenu(false);
                        }, dispatch);
                    }}><FontAwesomeIcon icon={regular("address-card")} color={"green"} />&nbsp;{reduceString(item.str_nombre, 20)}</NavLink>
                    <UncontrolledDropdown size={"sm"} direction="end" className="col-2" >
                        <DropdownToggle caret color="primary" >
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem onClick={() => {
                                setPassword("");
                                setIdEdit(item.str_id_con);
                                setRecordar(true);
                                setUserBd(item.str_usuario);
                                setServerBd(item.str_nombre.split("@")[1]);
                                setOpenModal(true);
                            }}>
                                Editar
                            </DropdownItem>
                            <DropdownItem onClick={() => {
                                sessionStorage.setItem("conSelected", item.str_id_con);
                                fetchBds(true, item, props.token, (lst_bds) => {
                                    setListaBds(lst_bds);
                                    setListaBdsAux(lst_bds);
                                    setOpenMenu(false);
                                }, dispatch);
                            }}>
                                Conectar
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </NavItem>
            )}
        </Nav>
    </>;

    return (
        <Row>
            <Button
                color="light"
                onClick={() => {
                    setOpenMenu(!openMenu);
                }}
                className="d-block d-sm-block d-md-none"
                id="btn_menu_lateral_hidd"
            >
                <FontAwesomeIcon icon={solid("bars")} />
            </Button>
            <Offcanvas autoFocus backdrop fade={false} container="body" direction="start" isOpen={openMenu} toggle={() => { setOpenMenu(!openMenu); }}>
                <OffcanvasHeader toggle={() => { setOpenMenu(!openMenu); }}>
                    Conexiones
                </OffcanvasHeader>
                <OffcanvasBody>
                    {navLateral}
                </OffcanvasBody>
            </Offcanvas>
            <Col md="2" id="col_nav_lateral" className="border bg_smoke d-none d-sm-none d-md-block">
                &nbsp;&nbsp;{navLateral}
            </Col>
            <Col md="10" id={"container_main"}>
                <Container id={"body_container_main"} className="text-center">
                    <Form className="mt-4">
                        <Row>
                            <Col md={6}>
                                <FormGroup row>
                                    <Label for="txtFiltrarSisema" sm={2}>Sistema</Label>
                                    <Col sm={10}>
                                        <Input id="txtFiltrarSisema" name="txtFiltrarSisema" value={filtrarSistema} onChange={(e) => {
                                            setFiltrarSistema(e.target.value);
                                            if (!IsNullOrWhiteSpace(e.target.value)) {
                                                setListaBds(listaBds.filter(x => x.str_nombre.trim().toLowerCase().includes(e.target.value.trim().toLowerCase())));
                                            } else {
                                                if (filtrarNoError) {
                                                    setListaBds(listaBdsAux.filter(x => x.bln_isError === false && !IsNullOrWhiteSpace(x.str_ip)));
                                                } else if (filtrarError) {
                                                    setListaBds(listaBdsAux.filter(x => x.bln_isError === true));
                                                } else {
                                                    setListaBds(listaBdsAux);
                                                }
                                            }
                                        }} />
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col md={3}>
                                <FormGroup check>
                                    <Input type="checkbox" id="blnIsError" name="blnIsError" checked={filtrarError} onChange={() => {
                                        setFiltrarNoError(false);
                                        setFiltrarError(!filtrarError);
                                        if (!filtrarError === true) {
                                            setListaBds(listaBdsAux.filter(x => x.bln_isError === true));
                                        } else {
                                            setListaBds(listaBdsAux);
                                        }
                                    }} />
                                    <Label check for="blnIsError">
                                        Solo sistemas con error
                                    </Label>
                                </FormGroup>
                            </Col>
                            <Col md={3}>
                                <FormGroup check>
                                    <Input type="checkbox" id="blnIsNotError" name="blnIsNotError" checked={filtrarNoError} onChange={() => {
                                        setFiltrarError(false);
                                        setFiltrarNoError(!filtrarNoError);
                                        if (!filtrarNoError === true) {
                                            setListaBds(listaBdsAux.filter(x => x.bln_isError === false && !IsNullOrWhiteSpace(x.str_ip)));
                                        } else {
                                            setListaBds(listaBdsAux);
                                        }
                                    }} />
                                    <Label check for="blnIsNotError">
                                        Solo sistemas sin error
                                    </Label>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                    <hr />
                    <Row>
                        {listaBds.map((item) =>
                            <CardItem
                                key={"colCard" + item.str_nombre}
                                item={item}
                                id={item.str_nombre}
                                enableMongo={enableMongo}
                                enableTXT={enableTXT}
                                isError={item.bln_isError}
                                color={item.bln_isResError ? "danger" : IsNullOrWhiteSpace(item.str_ip) ? "primary" : "success"}
                                history={props.history} />
                        )}
                    </Row>
                </Container>
            </Col>
        </Row>
    );
}

export default connect(mapStateToProps, {})(HomeLogs);