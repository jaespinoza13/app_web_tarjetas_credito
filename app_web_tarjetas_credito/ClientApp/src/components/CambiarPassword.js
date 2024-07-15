import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import {
    Button,
    Container,
    Form,
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

    const header = <>
        <div className="f-row">
            <FontAwesomeIcon icon={solid("key")} color={"blue"} />
            <h3 style={{ transform: "translateY(-9px)", marginLeft: "5px" }} >&nbsp;Cambiar Password</h3>
        </div>
    </>;


    const footer = <Button className="btn_mg btn_mg__primary" color="guardar-cambios" type="button" disabled={validImputs.length < 3} onClick={() => handlerSubmitCambiarClave(passNueva, props.token, props.callIn !== "NAV", (code) => {
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

                                <Label for="passwordAnterior" md={2} className="ml-3" style={{ paddingTop: "3px" }}>Clave Anterior:</Label>

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
                                    }}
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

                        <FormGroup row className="mb-3">
                            <div className="f-row w-100 mt-2 mb-1">
                                <Label for="passwordNueva" md={2} className="ml-3" style={{ paddingTop: "3px" }}>Clave Nueva:</Label>

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
                                    }}
                                    className="w-55"
                                    style={{ marginLeft: "48px" }}
                                />
                            </div>


                            <div className="f-row mb-1" style={{ paddingLeft: "155px" }}>
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
                                    }}
                                    className="w-55"
                                    style={{ marginLeft: "22px" }}
                                />
                            </div>
                            <div className="f-row mb-1" style={{ paddingLeft: "155px" }}>
                                <h5 style={{ width: "90%", whiteSpace: "break-spaces" }}>
                                    {invalidImputs.find(x => x.id === "confirmPasswordNueva") ? invalidImputs.find(x => x.id === "confirmPasswordNueva").text : ''}
                                </h5>
                            </div>

                        </FormGroup>
                    </Form>
                </Container>
            </ModalAlert>
        </Container>
    );
}

export default connect(mapStateToProps, {})(CambiarPassword);