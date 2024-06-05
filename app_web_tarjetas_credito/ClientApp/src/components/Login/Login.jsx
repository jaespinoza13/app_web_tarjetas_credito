import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { saveUser, saveSession, getUser, removeSession } from 'react-session-persist';
import { generate, encriptar, get, set, desencriptar } from '../../js/crypt';
import ModalAlert from '../Common/Alert';
import CambiarPassword from '../CambiarPassword';
import RecuperarPassword from '../RecuperarPassword';
import { IsNullOrWhiteSpace, setPasswordWithOff, toCapitalize } from '../../js/utiles';
import { handleSubmitLogin, handleSubmitPerfil } from '../../services/RestServices';
import CambiarPass1raVez from '../CambiarPass1raVez';
import SizedBox from '../Common/SizedBox';
import { Box, LinearProgress, Typography, CircularProgress, Collapse } from '@mui/material';
import { FormGroup } from 'reactstrap';
import InputMego from '../Common/Input';

const mapStateToProps = (state) => {
    return {
        token: state.tokenActive.data,
        loadingParametros: state.GetParametros.loading,
        dataErrorParametros: state.GetParametros.error,
        dataVersion: get(state.GetParametros.data["version"]),
        nombreSistema: get(state.GetParametros.data["sistema"]),
    };
};

function Login(props) {
    const dispatch = useDispatch();
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [passOff, setPassOff] = useState("");
    const [textLogin, setTextLogin] = useState("");
    const [lst_perfiles, setLst_perfiles] = useState([]);
    const [msg, setMsg] = useState([]);
    const [isLogin, setIsLogin] = useState(0);
    const [progress, setProgress] = useState(0);
    const [loginCorrecto, setLoginCorrecto] = useState(false);
    const [disableBtn, setdisableBtn] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [openUsuario, setOpenUsuario] = useState(false);
    const [openPass, setOpenPass] = useState(false);
    const [openPass1ra, setOpenPass1ra] = useState(false);
    const [codigo, setCodigo] = useState(false);


    const handlerSubmit = async (e) => {
        e.preventDefault();
        if (!disableBtn) {
            setdisableBtn(true);
            setProgress(30);
            await handleSubmitLogin(login, password, props.token, async (data) => {
                setProgress(60);
                var str = "";
                if (data.mensajes.length > 1) {
                    data.mensajes.forEach((el) => {
                        str += el + "<hr>";
                    });
                } else {
                    str = data.mensajes[0];
                }
                setMsg([str]);
                setProgress(70);
                const remitente = localStorage.getItem('remitente');
                const ts = Number(localStorage.getItem('aceptar'));
                let key = generate(navigator.userAgent, ts, get(remitente), data.datosUsuario.login);
                if (data.codigo === "000") {
                    console.log(data);
                    data.datosUsuario.str_sesion = data.datosUsuario.id_usuario + "" + data.datosUsuario.id_perfil + "" + ts + "" + data.datosUsuario.id_persona;
                    localStorage.setItem('sender', set(data.datosUsuario.login));
                    localStorage.setItem('office', set(data.datosUsuario.id_oficina));
                    localStorage.setItem('role', set(data.datosUsuario.nombre_perfil));
                    localStorage.setItem('sender_name', set(data.datosUsuario.nombre));
                    data.datosUsuario.canRedirect = true;
                    saveUser({ data: await encriptar(key, JSON.stringify(data.datosUsuario)) });
                    saveSession(true);
                    setIsLogin(1);
                    setProgress(90);
                    setLoginCorrecto(true);
                    setCodigo(data.codigo);
                } else if (data.codigo === "002") {
                    localStorage.setItem('sender', set(data.datosUsuario.login));
                    data.datosUsuario.canRedirect = false;
                    saveUser({ data: await encriptar(key, JSON.stringify(data.datosUsuario)) });
                    setIsLogin(2);
                    setProgress(80);
                    setLst_perfiles(data.lst_perfiles);
                } else if (data.codigo === "003") {
                    data.datosUsuario.str_sesion = data.datosUsuario.id_usuario + "" + data.datosUsuario.id_perfil + "" + ts + "" + data.datosUsuario.id_persona;
                    data.datosUsuario.canRedirect = false;
                    localStorage.setItem('sender', set(data.datosUsuario.login));
                    saveUser({ data: await encriptar(key, JSON.stringify(data.datosUsuario)) });
                    setIsLogin(3);
                    setProgress(90);
                    setOpenPass(true);
                } else if (data.codigo === "004") {
                    data.datosUsuario.str_sesion = data.datosUsuario.id_usuario + "" + data.datosUsuario.id_perfil + "" + ts + "" + data.datosUsuario.id_persona;
                    data.datosUsuario.canRedirect = false;
                    localStorage.setItem('sender', set(data.datosUsuario.login));
                    saveUser({ data: await encriptar(key, JSON.stringify(data.datosUsuario)) });
                    setIsLogin(4);
                    setProgress(90);
                    setOpenPass1ra(true);
                } else {
                    setIsLogin(0);
                    setProgress(95);
                    setMsg(data.mensajes[0]);
                }
                setdisableBtn(false);
                setProgress(100);

            }, dispatch);
            if (progress < 100) {
                setdisableBtn(false);
                setProgress(100);
            }
        }
    };

    return (
        <div className="bg_fixed login">
            {isLogin === 1 ?
                <ModalAlert
                    titleAlert={'Login Correcto'}
                    icon={loginCorrecto ? 'success' : 'danger'}
                    bodyAlert={msg[0]}
                    openModal={isLogin === 1}
                    handlerBtnAceptar={() => { loginCorrecto ? window.location.reload() : setIsLogin(0); }}
                    handlerBtnCancelar={() => { loginCorrecto ? window.location.reload() : setIsLogin(0); }}
                    btnAceptar={"Aceptar"}
                    size={"md"} />
                : isLogin === 2 ?
                    <div>
                        {!IsNullOrWhiteSpace(textLogin) ?
                            <ModalAlert
                                titleAlert={'Login Correcto 2'}
                                icon={loginCorrecto ? 'success' : 'danger'}
                                bodyAlert={textLogin}
                                openModal={!IsNullOrWhiteSpace(textLogin)}
                                btnAceptar={"Aceptar"}
                                handlerBtnAceptar={async () => {
                                    const remitente = localStorage.getItem('remitente');
                                    const ts = Number(localStorage.getItem('aceptar'));
                                    const sender = localStorage.getItem('sender');
                                    let key = generate(navigator.userAgent, ts, get(remitente), get(sender));
                                    var datosUsuario = await desencriptar(key, getUser().data);
                                    if (loginCorrecto) {
                                        datosUsuario.canRedirect = true;
                                        saveUser({ data: await encriptar(key, JSON.stringify(datosUsuario)) });
                                        window.location.reload();
                                    } else {
                                        setIsLogin(0);
                                        setTextLogin("");
                                    }
                                }}
                                handlerBtnCancelar={async () => {
                                    const remitente = localStorage.getItem('remitente');
                                    const ts = Number(localStorage.getItem('aceptar'));
                                    const sender = localStorage.getItem('sender');
                                    let key = generate(navigator.userAgent, ts, get(remitente), get(sender));
                                    var datosUsuario = await desencriptar(key, getUser().data);
                                    if (loginCorrecto) {
                                        datosUsuario.canRedirect = true;
                                        saveUser({ data: await encriptar(key, JSON.stringify(datosUsuario)) });
                                        window.location.reload();
                                    } else {
                                        setIsLogin(0);
                                        setTextLogin("");
                                    }
                                }}
                                size={"md"} />
                            : ""}
                        <ModalAlert
                            titleAlert={'Seleccionar Perfil'}
                            icon={'success'}
                            openModal={isLogin === 2}
                            btnAceptar={"Aceptar"}
                            handlerBtnAceptar={() => {
                                handleSubmitPerfil(props.token, () => {
                                    var str = "";
                                    msg.forEach((el) => {
                                        str += el + "|";
                                    });
                                    saveSession(true);
                                    setTextLogin(str);
                                    setLoginCorrecto(true);
                                }, () => {
                                    setIsLogin(0); removeSession(); saveSession(false);
                                }, dispatch);
                            }}
                            handlerBtnCancelar={() => { setIsLogin(0); removeSession(); saveSession(false); }}
                            size={"md"}>
                            <div className="form_mg__item">
                                <label htmlFor="selectPerfil" className="pbmg1 lbl-input">Selecciona el perfil con el que deseas ingresar</label>
                                <select id="selectPerfil" name="selectPerfil" onChange={async (e) => {
                                    const remitente = localStorage.getItem('remitente');
                                    const ts = Number(localStorage.getItem('aceptar'));
                                    const sender = localStorage.getItem('sender');
                                    let key = generate(navigator.userAgent, ts, get(remitente), get(sender));
                                    var datosUsuario = await desencriptar(key, getUser().data);
                                    datosUsuario.id_perfil = Number(e.target.value);
                                    datosUsuario.nombre_perfil = e.target.selectedOptions[0].innerText;
                                    datosUsuario.str_sesion = datosUsuario.id_usuario + "" + datosUsuario.id_perfil + "" + ts + "" + datosUsuario.id_persona;
                                    saveUser({ data: await encriptar(key, JSON.stringify(datosUsuario)) });
                                }}>
                                    <option key={0} value={0}>
                                        Seleccione...
                                    </option>
                                    {lst_perfiles.map((perfil) =>
                                        <option key={perfil.per_id} value={perfil.per_id}>
                                            {perfil.per_nombre}
                                        </option>
                                    )}
                                </select>
                            </div>
                        </ModalAlert>
                    </div>
                    : isLogin === 3 ?
                        <CambiarPassword openModal={openPass} setOpenModal={() => { setOpenPass(!openPass); window.location.reload(); removeSession(); }} callIn={"LOGIN"} />
                        : isLogin === 4 ?
                            <CambiarPass1raVez openModal={openPass1ra} setOpenModal={() => { setOpenPass1ra(!openPass1ra); window.location.reload(); removeSession(); }} callIn={"LOGIN"} />
                            : ""
            }

            <div className="login_info">
                <img src="/Imagenes/abejaSaluda.png" alt="abeja saludando" width="232px" />
                {/*<h2>Sistema de Pagos y Transferencias</h2>*/}
                {/*<h3>Sistema para soporte técnico, impresión de documentos en Plataforma de Servicios, reportes para departamento de Operaciones, switch lógico para servicio Windows de monitoreo de cobranzas, administraci</h3>*/}
                <h2>Sistemas Internos</h2>
                <h3>{toCapitalize(props.nombreSistema)}</h3>
                <SizedBox height={50} />
                <img src="/Imagenes/logo.png" alt="logo coopmego" width="133px" />
            </div>
            <div className="login_form bg-page shadowIn">
                <div className="card card_md card-login">
                    <Collapse in={!isOpen}>
                        <div className="card_header">
                            <h2>Inicio de sesión</h2>
                        </div>
                        <form className="form_mg" onSubmit={handlerSubmit} autoComplete="off">
                            <FormGroup>
                                <InputMego
                                    type="text"
                                    name="username"
                                    id="username"
                                    label="Usuario"
                                    textbutton="Olvidé mi usuario"
                                    onClickBtn={(e) => { e.preventDefault(); setOpenUsuario(true); }}
                                    value={login}
                                    onChange={(e) => setLogin(e.target.value)}
                                />
                                <ModalAlert
                                    titleAlert={'Olvidé mi usuario'}
                                    icon={'info'}
                                    bodyAlert={"Para recuperar su usuario debe comunicarse con el departamento de seguridad de la información (seginformacion@mego.net)"}
                                    openModal={openUsuario}
                                    handlerBtnAceptar={() => setOpenUsuario(false)}
                                    handlerBtnCancelar={() => setOpenUsuario(false)}
                                    btnAceptar={"Aceptar"}
                                    size={"xs"} />
                            </FormGroup>
                            <FormGroup>
                                <InputMego
                                    type="password"
                                    name="password"
                                    id="password"
                                    label="Contraseña"
                                    textbutton="Olvidé mi contraseña"
                                    onClickBtn={(e) => { e.preventDefault(); setIsOpen(!isOpen); }}
                                    value={passOff}
                                    onChange={(e) => setPasswordWithOff(password, e.target.value, (pass, passOff) => {
                                        setPassword(pass);
                                        setPassOff(passOff);
                                    })}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>{codigo !== "000" ? msg : '' }</label>
                            </FormGroup>
                            <button className="btn_mg btn_mg__primary" style={{ width: "200px" }} disabled={disableBtn}>{disableBtn ? <CircularProgress /> : ""}Continuar</button>
                            <span className="version-app"><br />{props.dataVersion}</span>
                        </form>
                        {progress > 0 && progress < 100 ?
                            <LinearProgressWithLabel value={progress} />
                            : ""}

                    </Collapse>
                    {isOpen ?
                        <Collapse in={isOpen}>
                            <RecuperarPassword openModal={isOpen} setOpenModal={setIsOpen} />
                        </Collapse>
                        : ""}
                </div>
            </div>
        </div>
    );
}

function LinearProgressWithLabel(props) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

export default connect(mapStateToProps, {})(Login);