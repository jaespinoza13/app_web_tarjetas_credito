import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import {
    Button,
    Col,
    Container,
    Form,
    FormFeedback,
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

    const footer = <Button color="guardar-cambios" type="button" disabled={validImputs.length <= props.dataNroPregntas + props.dataNroPregntas} onClick={() => handlerSubmitCambiarPass1raVez(preguntas, respuestas, passNueva, props.token, (code) => {
        if (code === "0000") props.setOpenModal();
    }, dispatch)}>Guardar</Button>;
    const header = <><FontAwesomeIcon icon={solid("key")} color={"blue"} />&nbsp;Cambiar Password Primera Vez</>;

    return (
        <Container>
            <ModalAlert
                openModal={props.openModal}
                size={"xl"}
                unmountOnClose={true}
                btnCancelar={(props.callIn === "NAV") ? "Cancelar" : null}
                handlerBtnCancelar={(props.callIn === "NAV") ? () => { props.setOpenModal(); } : null}
                header={header}
                canClose={props.callIn === "NAV"}
                btn_footer={footer}
            >
                <Container>
                    <Form>
                        <FormGroup row className="mb-3">
                            <Label for="passwordAnterior" md={2}>Clave Anterior:</Label>
                            <Col md={10}>
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
                                    })} />
                                <FormFeedback>
                                    {invalidImputs.find(x => x.id === "passwordAnterior") ? invalidImputs.find(x => x.id === "passwordAnterior").text : ''}
                                </FormFeedback>
                            </Col>
                        </FormGroup>
                        <hr />
                        <FormGroup row className="mb-3">
                            <Label for="passwordNueva" sm={2}>Clave Nueva:</Label>
                            <Col sm={10}>
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
                                    })} />
                                <FormFeedback>
                                    {invalidImputs.find(x => x.id === "passwordNueva") ? invalidImputs.find(x => x.id === "passwordNueva").text : ''}
                                </FormFeedback>
                            </Col>
                        </FormGroup>
                        <FormGroup row className="mb-3">
                            <Label for="confirmPasswordNueva" sm={2}>Confirmar Clave:</Label>
                            <Col sm={10}>
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
                                    })} />
                                <FormFeedback>
                                    {invalidImputs.find(x => x.id === "confirmPasswordNueva") ? invalidImputs.find(x => x.id === "confirmPasswordNueva").text : ''}
                                </FormFeedback>
                            </Col>
                        </FormGroup>
                        <Table>
                            <thead>
                                <tr className="row">
                                    <th className="col-md-6">
                                        Pregunta
                                    </th>
                                    <th className="col-md-6">
                                        Respuesta
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {arr.map((item) =>
                                    <tr key={"Preg_" + item} className="row">
                                        <td className="col-md-6">
                                            <FormGroup>
                                                <Input
                                                    type="select"
                                                    id={"selectpregunta_" + item}
                                                    name={"selectpregunta_" + item}
                                                    disabled={IsNullOrWhiteSpace(confirmPassNueva) || (validImputs && !validImputs.includes('confirmPasswordNueva'))}
                                                    value={preguntas[item]}
                                                    onChange={(e) => { addPregunta(item, e.target.value); }}>
                                                    <option key={"preguntanull"} value={''}>
                                                        Seleccione...
                                                    </option>
                                                    {listaPreguntas.map((item) =>
                                                        <option key={"pregunta_" + item.codigo} value={item.codigo}>
                                                            {item.nombre}
                                                        </option>
                                                    )}
                                                </Input>
                                            </FormGroup>
                                        </td>
                                        <td className="col-md-6">
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
                                                    })} />
                                                <FormFeedback>
                                                    {invalidImputs.find(x => x.id === "respuesta_" + item) ? invalidImputs.find(x => x.id === "respuesta_" + item).text : ''}
                                                </FormFeedback>
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