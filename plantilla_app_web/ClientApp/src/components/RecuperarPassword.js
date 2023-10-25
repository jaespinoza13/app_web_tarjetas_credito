import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { get, set } from '../js/crypt';
import { IsNullOrWhiteSpace, offText, setPasswordWithOff, validarContieneEspecial, validarFormatoPassword, validarIgualdadPassword } from '../js/utiles';
import { fetchPreguntaUsuario, handlerSubmitResetearClave, handlerSubmitValidarRespuesta } from '../services/RestServices';
import CambiarPassword from './CambiarPassword';
import ModalAlert from './Common/Alert';
import { setAlertText } from "../redux/Alert/actions";
import { Alert, Box, Collapse, Container, FormGroup, Grid, } from '@mui/material';
import InputMego from './Common/Input';

const mapStateToProps = (state) => {
    localStorage.setItem('sender', set("Param"));
    localStorage.removeItem('sender');
    return {
        token: state.tokenActive.data,
        dataNroCaracteres: Number(get(state.GetParametros.data["nroCara"])),
    };
};

/**
 * Dialogo de recuperar contraseña
 * @param {{openModal: boolean, setOpenModal: Function}} props
 */
function RecuperarPassword(props) {
    const dispatch = useDispatch();

    const [idUsuario, setIdUsuario] = useState(0);
    const [usuario, setUsuario] = useState("");
    const [respuesta, setRespuesta] = useState("");
    const [respuestaOff, setRespuestaOff] = useState("");
    const [pregunta, setPregunta] = useState("");
    const [passNueva, setPassNueva] = useState("");
    const [passNuevaOff, setPassNuevaOff] = useState("");
    const [confirmPassNueva, setConfirmPassNueva] = useState("");
    const [confirmPassNuevaOff, setConfirmPassNuevaOff] = useState("");
    const [codeResponse, setCodeResponse] = useState("");
    const [cambiarPass, setCambiarPass] = useState(false);
    const [validImputs] = useState([]);
    const [invalidImputs] = useState([]);

    const validateInput = (id, validador) => {
        if (!validador.bln) {
            if (invalidImputs.find(x => x.id === id)) {
                invalidImputs.splice(invalidImputs.findIndex(x => x.id === id), 1);
            }
            if (!validImputs.includes(id)) {
                validImputs.push(id);
            }
        } else {
            if (validImputs.includes(id)) {
                validImputs.splice(validImputs.indexOf(id), 1);
            }
            if (!invalidImputs.find(x => x.id === id)) {
                invalidImputs.push({ id: id, text: validador.text });
            }
        }
    };

    var isValidarButton = false;

    if (!IsNullOrWhiteSpace(pregunta) && idUsuario > 0 && codeResponse === "0000") {
        isValidarButton = false;
    } else {
        isValidarButton = true;
    }

    return (
        <Box>
            {cambiarPass ?
                <CambiarPassword openModal={cambiarPass} setOpenModal={setCambiarPass} callIn={"RESET_PASS"} />
                : ""}
            <div className="card_header">
                <h2>Recuperar Password</h2>
            </div>
            <form>
                <FormGroup row className="mb-3">
                    <InputMego
                        id="usuario"
                        name="usuario"
                        type="text"
                        label="Usuario:"
                        isHorizontal={true}
                        isError={invalidImputs && invalidImputs.find(x => x.id === "usuario") !== undefined}
                        helperText={invalidImputs.find(x => x.id === "usuario") ? invalidImputs.find(x => x.id === "usuario").text : ''}
                        value={usuario}
                        onChange={(e) => {
                            validateInput("usuario", validarContieneEspecial(e.target.value));
                            setUsuario(e.target.value);
                        }} />
                </FormGroup>
                <Alert severity="info" open={true} >
                    <button color="primary" type="button" disabled={IsNullOrWhiteSpace(usuario) || (invalidImputs && invalidImputs.find(x => x.id === "usuario") !== undefined)} onClick={() => {
                        fetchPreguntaUsuario(usuario, props.token, (pregunta, idUsr) => {
                            setPregunta(pregunta);
                            setIdUsuario(idUsr);
                        }, (code, message) => {
                            if (code === "0002") {
                                props.setOpenModal();
                                setCambiarPass(true);
                            }
                            props.setAlertText({ code: code, text: message });
                        }, dispatch);
                    }}>Verificar</button>
                    <Collapse in={!IsNullOrWhiteSpace(pregunta)}>
                        <h6 className="alert-heading">
                            Ingrese la respuesta a la pregunta secreta:
                        </h6>
                        <FormGroup row className="mb-3">
                            <InputMego
                                id="respuesta"
                                name="respuesta"
                                type="password"
                                label={pregunta + ":"}
                                disabled={IsNullOrWhiteSpace(usuario) || (validImputs && !validImputs.includes('usuario'))}
                                isError={invalidImputs && invalidImputs.find(x => x.id === "respuesta") !== undefined}
                                helperText={invalidImputs.find(x => x.id === "respuesta") ? invalidImputs.find(x => x.id === "respuesta").text : ''}
                                value={respuestaOff}
                                onChange={(e) => {
                                    var txt = e.target.value;
                                    var flag = IsNullOrWhiteSpace(txt) || txt.length < 2;
                                    validateInput("respuesta", { bln: flag, text: "Campo vac\u00EDo" });
                                    offText(e.target.value, (text, textOff) => {
                                        setRespuesta(text);
                                        setRespuestaOff(textOff);
                                    });
                                }} />
                        </FormGroup>
                    </Collapse>
                </Alert>
                <Collapse in={!IsNullOrWhiteSpace(pregunta) && idUsuario > 0 && codeResponse === "0000"}>
                    <Alert severity="warning">
                        <h6 className="alert-heading">
                            Resetear Clave
                        </h6>
                        <FormGroup row className="mb-3">
                            <Grid sm={10}>
                                <InputMego
                                    id="passwordNueva"
                                    name="passwordNueva"
                                    type="password"
                                    label="Clave Nueva:"
                                    isError={invalidImputs && invalidImputs.find(x => x.id === "passwordNueva") !== undefined}
                                    helperText={invalidImputs.find(x => x.id === "passwordNueva") ? invalidImputs.find(x => x.id === "passwordNueva").text : ''}
                                    value={passNuevaOff}
                                    onChange={(e) => {
                                        setPasswordWithOff(passNueva, e.target.value, (pass, passOff) => {
                                            var aux = validarFormatoPassword(pass, Number(props.dataNroCaracteres));
                                            aux.bln = !aux.bln;
                                            validateInput("passwordNueva", aux);
                                            setPassNueva(pass);
                                            setPassNuevaOff(passOff);
                                        });
                                    }} />
                            </Grid>
                        </FormGroup>
                        <FormGroup row className="mb-3">
                            <Grid sm={10}>
                                <InputMego
                                    id="confirmPasswordNueva"
                                    name="confirmPasswordNueva"
                                    type="password"
                                    label="Confirmar Clave:"
                                    isError={invalidImputs && invalidImputs.find(x => x.id === "confirmPasswordNueva") !== undefined}
                                    helperText={invalidImputs.find(x => x.id === "confirmPasswordNueva") ? invalidImputs.find(x => x.id === "confirmPasswordNueva").text : ''}
                                    value={confirmPassNuevaOff}
                                    onChange={(e) => {
                                        setPasswordWithOff(confirmPassNueva, e.target.value, (pass, passOff) => {
                                            var aux = validarIgualdadPassword(passNueva, pass);
                                            aux.bln = !aux.bln;
                                            validateInput("confirmPasswordNueva", aux);
                                            setConfirmPassNueva(pass);
                                            setConfirmPassNuevaOff(passOff);
                                        });
                                    }} />
                            </Grid>
                        </FormGroup>
                    </Alert>
                </Collapse>
                <button color="guardar-cambios" type="button" disabled={validImputs.length < 2} onClick={() => {
                    if (!isValidarButton) {
                        handlerSubmitResetearClave(idUsuario, usuario, passNueva, props.token, (code, message) => {
                            props.setOpenModal();
                            props.setAlertText({ code: code, text: message });
                        }, dispatch);
                        setPassNueva("");
                        setPassNuevaOff("");
                        setConfirmPassNuevaOff("");
                    } else {
                        handlerSubmitValidarRespuesta(idUsuario, usuario, pregunta, respuesta, props.token, (code, message) => {
                            setCodeResponse(code);
                            if (code !== "0000") {
                                props.setAlertText({ code: code, text: message });
                            }
                        }, dispatch);
                    }
                }}>{!isValidarButton ? "Guardar" : "Validar"}</button>
                <button onClick={() => props.setOpenModal(false)}>Cancelar</button>
            </form>
        </Box>
    );
}

ModalAlert.propTypes = {
    openModal: PropTypes.bool.isRequired,
    handlerBtnAceptar: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, { setAlertText })(RecuperarPassword);