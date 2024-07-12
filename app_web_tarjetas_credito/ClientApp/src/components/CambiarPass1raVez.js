import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import {
    Button,
    Container,
    Form,
    FormGroup,
    Input,
    Label,
    Table,
} from 'reactstrap';
import { get } from '../js/crypt';
import hex_md5 from '../js/md5';
import { IsNullOrWhiteSpace, offText, setPasswordWithOff, validarFormatoPassword, validarIgualdadPassword, validarPassAnterior } from '../js/utiles';
import { setAlertText } from '../redux/Alert/actions';
import { fetchListaPreguntas, handlerSubmitCambiarPass1raVez } from '../services/RestServices';
import ModalAlert from './Common/Alert';

const mapStateToProps = (state) => {
    return {
        token: state.tokenActive.data,
        dataNroPregntas: Number(get(state.GetParametros.data["nroPreg"])),
        dataNroCaracteres: Number(get(state.GetParametros.data["nroCara"])),
    };
};

function CambiarPass1raVez(props) {
    const dispatch = useDispatch();

    const [passNueva, setPassNueva] = useState("");
    const [passAnterior, setPassAnterior] = useState("");
    const [confirmPassNueva, setConfirmPassNueva] = useState("");
    const [passNuevaOff, setPassNuevaOff] = useState("");
    const [passAnteriorOff, setPassAnteriorOff] = useState("");
    const [confirmPassNuevaOff, setConfirmPassNuevaOff] = useState("");
    const [preguntas] = useState([]);
    const [respuestas] = useState([]);
    const [respuestasOff] = useState([]);
    const [listaPreguntas, setListaPreguntas] = useState([]);
    const [validImputs, setValidImputs] = useState([]);
    const [invalidImputs, setInvalidImputs] = useState([]);
    const [arr] = useState([]);

    useEffect(() => {
        if (!IsNullOrWhiteSpace(props.token) && listaPreguntas.length === 0) {
            for (let i = 0; i < props.dataNroPregntas; i++) {
                arr.push(i);
                respuestas.push('');
                respuestasOff.push('');
            }
            fetchListaPreguntas(true, props.token, (preguntas) => {
                setListaPreguntas(preguntas);
            }, dispatch);
        }
    }, [arr, props.dataNroPregntas, listaPreguntas.length, respuestas, respuestasOff, dispatch]);

    const validateInput = (id, validador) => {
        if (!validador.bln) {
            if (invalidImputs.find(x => x.id === id)) {
                invalidImputs.splice(invalidImputs.findIndex(x => x.id === id), 1);
            }
            if (!validImputs.includes(id)) {
                validImputs.push(id);
                setValidImputs(validImputs);
            }
        } else {
            if (validImputs.includes(id)) {
                validImputs.splice(validImputs.indexOf(id), 1);
            }
            if (!invalidImputs.find(x => x.id === id)) {
                invalidImputs.push({ id: id, text: "El campo es incorrecto: " + validador.text });
            }
        }
        setValidImputs([...validImputs]);
        setInvalidImputs([...invalidImputs]);
    };

    const addPregunta = (pos, txt) => {
        if (!IsNullOrWhiteSpace(txt)) {
            let flag = false;
            if (preguntas.find(x => x === txt)) {
                flag = true;
                preguntas[pos] = '';
                if (dispatch) dispatch(setAlertText({ code: "1", text: "La pregunta ya fue seleccionada" }));
                document.getElementById("selectpregunta_" + pos).value = '';
            } else {
                preguntas[pos] = txt;
            }
            validateInput("selectpregunta_" + pos, { bln: flag, text: "Campo vac\u00EDo" });
        } else {
            if (dispatch) dispatch(setAlertText({ code: "1", text: "Opci\u00F3n Inv\u00E1lida" }));
        }
    };

    const header = <>
        <div className="f-row">
            <FontAwesomeIcon icon={solid("key")} color={"blue"} />
            <h3 style={{ transform: "translateY(-9px)", marginLeft: "5px" }} >&nbsp;Cambiar Password Primera Vez</h3>
        </div>
    </>;

    const footer = <Button className="btn_mg btn_mg__primary" color="guardar-cambios" type="button" disabled={validImputs.length <= props.dataNroPregntas + props.dataNroPregntas} onClick={() => handlerSubmitCambiarPass1raVez(preguntas, respuestas, passNueva, props.token, (code) => {
        if (code === "0000") props.setOpenModal();
    }, dispatch)}>Guardar</Button>;
    

    return (
        <Container fluid="xs">
            <ModalAlert
                openModal={props.openModal}
                size={"xs"}
                unmountOnClose={true}
                btnCancelar={(props.callIn === "NAV") ? "Cancelar" : null}
                handlerBtnCancelar={(props.callIn === "NAV") ? () => { props.setOpenModal(); } : null}
                header={header}
                canClose={props.callIn === "NAV"}
                btn_footer={footer}
                handlerBtnAceptar={() => { }}
            >
                <Container fluid="xs">
                    <Form>
                        <FormGroup row className="mb-3">
                            <div className="f-row w-100 mb-1">
                                <Label for="passwordAnterior" md={2} className="ml-3" style={{ paddingTop: "3px" }} >Clave Anterior:</Label>
                                <Input
                                    id="passwordAnterior"
                                    name="passwordAnterior"
                                    type="password"
                                    invalid={invalidImputs && invalidImputs.find(x => x.id === "passwordAnterior") !== undefined}
                                    valid={validImputs && validImputs.includes('passwordAnterior')}
                                    value={passAnteriorOff}
                                    onChange={(e) => setPasswordWithOff(passAnterior, e.target.value, async (pass, passOff) => {
                                        setPassAnterior(pass);
                                        var val = await validarPassAnterior(hex_md5(pass));
                                        val.bln = !val.bln;
                                        validateInput("passwordAnterior", val);
                                        setPassAnteriorOff(passOff);
                                    })}
                                    className="w-55"
                                    style={{ marginLeft: "35px" }}
                                />

                            </div>
                            <div className="f-row mb-1" style={{ paddingLeft: "155px" }}>
                                <h5 style={{ width: "90%", whiteSpace: "break-spaces" }}>
                                    {invalidImputs.find(x => x.id === "passwordAnterior") ? invalidImputs.find(x => x.id === "passwordAnterior").text : ''}
                                </h5>
                            </div>

                        </FormGroup>
                        <hr className="w-100" />
                        <FormGroup row className="mb-3">
                            <div className="f-row w-100 mb-1">
                                <Label for="passwordNueva" md={2} className="ml-3" style={{ paddingTop: "3px" }}>Clave Nueva:</Label>
                                <Input
                                    id="passwordNueva"
                                    name="passwordNueva"
                                    type="password"
                                    disabled={IsNullOrWhiteSpace(passAnterior) || (validImputs && !validImputs.includes('passwordAnterior'))}
                                    invalid={invalidImputs && invalidImputs.find(x => x.id === "passwordNueva") !== undefined}
                                    valid={validImputs && validImputs.includes('passwordNueva')}
                                    value={passNuevaOff}
                                    onChange={(e) => setPasswordWithOff(passNueva, e.target.value, (pass, passOff) => {
                                        let val = validarFormatoPassword(pass, Number(props.dataNroCaracteres));
                                        val.bln = !val.bln;
                                        validateInput("passwordNueva", val);
                                        setPassNueva(pass);
                                        setPassNuevaOff(passOff);
                                    })}
                                    className="w-55"
                                    style={{ marginLeft: "48px" }}
                                />
                            </div>
                            <div className="f-row mb-1" style={{ paddingLeft: "15px" }}>
                                <h5 style={{ width: "90%", whiteSpace: "break-spaces" }}>
                                    {invalidImputs.find(x => x.id === "passwordNueva") ? invalidImputs.find(x => x.id === "passwordNueva").text : ''}
                                </h5>
                            </div>


                        </FormGroup>
                        <FormGroup row className="mb-3">
                            <div className="f-row w-100 mt-2 mb-1">
                                <Label for="confirmPasswordNueva" md={2} className="ml-3" style={{ paddingTop: "3px" }}>Confirmar Clave:</Label>
                                <Input
                                    id="confirmPasswordNueva"
                                    name="confirmPasswordNueva"
                                    type="password"
                                    disabled={IsNullOrWhiteSpace(passNueva) || (validImputs && !validImputs.includes('passwordNueva'))}
                                    invalid={invalidImputs && invalidImputs.find(x => x.id === "confirmPasswordNueva") !== undefined}
                                    valid={validImputs && validImputs.includes('confirmPasswordNueva')}
                                    value={confirmPassNuevaOff}
                                    onChange={(e) => setPasswordWithOff(confirmPassNueva, e.target.value, (pass, passOff) => {
                                        let val = validarIgualdadPassword(passNueva, pass);
                                        val.bln = !val.bln;
                                        validateInput("confirmPasswordNueva", val);
                                        setConfirmPassNueva(pass);
                                        setConfirmPassNuevaOff(passOff);
                                    })}
                                    className="w-55"
                                    style={{ marginLeft: "22px" }}
                                />
                            </div>
                            <div className="f-row mb-1" style={{ paddingLeft: "15px" }}>
                                <h5 style={{ width: "90%", whiteSpace: "break-spaces" }}>
                                    {invalidImputs.find(x => x.id === "confirmPasswordNueva") ? invalidImputs.find(x => x.id === "confirmPasswordNueva").text : ''}
                                </h5>
                            </div>


                        </FormGroup>
                        <Table>
                            <thead>
                                <tr className="row">
                                    <th style={{ width: "50%" }}>
                                        Pregunta
                                    </th>
                                    <th style={{ width: "50%" }}>
                                        Respuesta
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {arr.map((item) =>
                                    <tr key={"Preg_" + item} className="row">
                                        <td style={{ width: "50%" }}>
                                            <FormGroup>
                                                <Input
                                                    type="select"
                                                    id={"selectpregunta_" + item}
                                                    name={"selectpregunta_" + item}
                                                    disabled={IsNullOrWhiteSpace(confirmPassNueva) || (validImputs && !validImputs.includes('confirmPasswordNueva'))}
                                                    value={preguntas[item]}
                                                    onChange={(e) => { addPregunta(item, e.target.value); }}
                                                    style={{ fontSize: "11.5px" }}
                                                >
                                                    <option key={"preguntanull"} value={''}>
                                                        Seleccione...
                                                    </option>
                                                    {listaPreguntas.map((item) =>
                                                        <option key={"pregunta_" + item.codigo} value={item.codigo}>{item.nombre}                                                        </option>
                                                    )}                                                    
                                                </Input>
                                            </FormGroup>
                                        </td>
                                        <td style={{ width: "50%" }}>
                                            <FormGroup>
                                                <Input
                                                    id={"respuesta_" + item}
                                                    name={"respuesta_" + item}
                                                    type="password"
                                                    disabled={IsNullOrWhiteSpace(confirmPassNueva) || (validImputs && !validImputs.includes('confirmPasswordNueva'))}
                                                    invalid={invalidImputs && invalidImputs.find(x => x.id === "respuesta_" + item) !== undefined}
                                                    valid={validImputs && validImputs.includes("respuesta_" + item)}
                                                    value={respuestasOff[item]}
                                                    onChange={(e) => offText(e.target.value, (text, textOff) => {
                                                        var flag = IsNullOrWhiteSpace(text) || text.length < 2;
                                                        validateInput("respuesta_" + item, { bln: flag, text: "Campo vac\u00EDo" });
                                                        respuestas[item] = text;
                                                        respuestasOff[item] = textOff;
                                                    })}
                                                    style={{ fontSize: "11.5px" }}
                                                />
                                                <div className="f-row w-100" style={{ paddingLeft: "15px" }}>
                                                    <h5 className="fw-80">
                                                        {invalidImputs.find(x => x.id === "respuesta_" + item) ? invalidImputs.find(x => x.id === "respuesta_" + item).text : ''}
                                                    </h5>
                                                </div>
                                            </FormGroup>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Form>
                </Container>
            </ModalAlert>
        </Container>
    );
}

export default connect(mapStateToProps, {})(CambiarPass1raVez);