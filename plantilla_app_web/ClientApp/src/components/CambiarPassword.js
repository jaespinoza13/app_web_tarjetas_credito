import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
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
} from 'reactstrap';
import { get } from '../js/crypt';
import hex_md5 from '../js/md5';
import { IsNullOrWhiteSpace, setPasswordWithOff, validarFormatoPassword, validarIgualdadPassword, validarPassAnterior } from '../js/utiles';
import { handlerSubmitCambiarClave } from '../services/RestServices';
import { getUsuario, setUsuario } from '../services/Services';
import ModalAlert from './Common/Alert';

const mapStateToProps = (state) => {
    return {
        token: state.tokenActive.data,
        dataNroCaracteres: Number(get(state.GetParametros.data["nroCara"])),
    };
};

function CambiarPassword(props) {
    const dispatch = useDispatch();
    const [passAnterior, setPassAnterior] = useState("");
    const [passAnteriorOff, setPassAnteriorOff] = useState("");
    const [passNueva, setPassNueva] = useState("");
    const [passNuevaOff, setPassNuevaOff] = useState("");
    const [confirmPassNueva, setConfirmPassNueva] = useState("");
    const [confirmPassNuevaOff, setConfirmPassNuevaOff] = useState("");
    const [validImputs] = useState([]);
    const [invalidImputs] = useState([]);

    const validateInput = (id, validador) => {
        if (!validador.bln) {
            if (validImputs.includes(id)) {
                validImputs.splice(validImputs.indexOf(id), 1);
            }
            if (!invalidImputs.find(x => x.id === id)) {
                invalidImputs.push({ id: id, text: validador.text });
            }
        } else {
            if (invalidImputs.find(x => x.id === id)) {
                invalidImputs.splice(invalidImputs.findIndex(x => x.id === id), 1);
            }
            if (!validImputs.includes(id)) {
                validImputs.push(id);
            }
        }
    };

    const header = <><FontAwesomeIcon icon={solid("key")} color={"blue"} />&nbsp;Cambiar Password</>;
    const footer = <Button color="guardar-cambios" type="button" disabled={validImputs.length < 3} onClick={() => handlerSubmitCambiarClave(passNueva, props.token, props.callIn !== "NAV", (code) => {
        if (code === "0000") {
            getUsuario().then(usr => {
                if (usr) {
                    usr.password = hex_md5(passNueva);
                    setUsuario(usr);
                }
            });
            props.setOpenModal();
        }
    }, dispatch)}>Guardar</Button>;

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
                            <Label for="passwordAnterior" sm={2}>Clave Anterior:</Label>
                            <Col sm={10}>
                                <Input
                                    id="passwordAnterior"
                                    name="passwordAnterior"
                                    type="password"
                                    invalid={invalidImputs && invalidImputs.find(x => x.id === "passwordAnterior") !== undefined}
                                    valid={validImputs && validImputs.includes('passwordAnterior')}
                                    value={passAnteriorOff}
                                    onChange={(e) => {
                                        setPasswordWithOff(passAnterior, e.target.value, async (pass, passOff) => {
                                            validateInput("passwordAnterior", await validarPassAnterior(hex_md5(pass)));
                                            setPassAnterior(pass);
                                            setPassAnteriorOff(passOff);
                                        });
                                    }} />
                                <FormFeedback>
                                    {invalidImputs.find(x => x.id === "passwordAnterior") ? invalidImputs.find(x => x.id === "passwordAnterior").text : ''}
                                </FormFeedback>
                            </Col>
                        </FormGroup>
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
                                    onChange={(e) => {
                                        setPasswordWithOff(passNueva, e.target.value, (pass, passOff) => {
                                            validateInput("passwordNueva", validarFormatoPassword(pass, Number(props.dataNroCaracteres)));
                                            setPassNueva(pass);
                                            setPassNuevaOff(passOff);
                                        });
                                    }} />
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
                                    disabled={IsNullOrWhiteSpace(passAnterior) || (validImputs && !validImputs.includes('passwordAnterior'))}
                                    invalid={invalidImputs && invalidImputs.find(x => x.id === "confirmPasswordNueva") !== undefined}
                                    valid={validImputs && validImputs.includes('confirmPasswordNueva')}
                                    value={confirmPassNuevaOff}
                                    onChange={(e) => {
                                        setPasswordWithOff(confirmPassNueva, e.target.value, (pass, passOff) => {
                                            validateInput("confirmPasswordNueva", validarIgualdadPassword(passNueva, pass));
                                            setConfirmPassNueva(pass);
                                            setConfirmPassNuevaOff(passOff);
                                        });
                                    }} />
                                <FormFeedback>
                                    {invalidImputs.find(x => x.id === "confirmPasswordNueva") ? invalidImputs.find(x => x.id === "confirmPasswordNueva").text : ''}
                                </FormFeedback>
                            </Col>
                        </FormGroup>
                    </Form>
                </Container>
            </ModalAlert>
        </Container>
    );
}

export default connect(mapStateToProps, {})(CambiarPassword);