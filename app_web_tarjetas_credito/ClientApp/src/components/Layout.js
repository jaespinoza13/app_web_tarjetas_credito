import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Col } from 'reactstrap';
import { IsNullOrWhiteSpace, validateToken } from '../js/utiles';
import { setAlertText, setErrorRedirigir } from '../redux/Alert/actions';
import { fetchGetListaFuncionalidades } from '../redux/Funcionalidades/actions';
import { fetchGetListaParametros } from '../redux/Parametros/actions';
import ModalAlert from './Common/Alert';
import LoadingAlert from './Common/Loading';
import NavMenu from './Common/Navs/NavMenu';

const mapStateToProps = (state) => {
    return {
        token: state.tokenActive.data,
        loadGeneral: state.loadding.loading,
        alertText: state.alertText.text,
        alertIsError: !state.alertText.code,
        errorRedirigir: state.alertText.redirect,
        customActionAlert: state.alertText.action,
        listaFuncionalidades: state.GetListaFuncionalidades.data,
        statusLoadParams: state.GetParametros.loading
    };
};


function Layout(props) {
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();

    const [tstampActual, setTstampActual] = useState(new Date().getTime());
    const [token, setToken] = useState(props.token);

    useEffect(() => {
        setToken(props.token);
    }, [props.token]);

    useEffect(() => {
        if (location.pathname !== "/" && !IsNullOrWhiteSpace(token) && !validateToken(token)) {
            alert("Sesi\u00F3n caducada");
            window.location.href = "/";
        }
    }, [token, location.pathname]);

    useEffect(() => {
        dispatch(fetchGetListaParametros());
    }, [dispatch]);

    useEffect(() => {
        if (!props.statusLoadParams && props.listaFuncionalidades.length === 0 && !IsNullOrWhiteSpace(props.token)) {
            dispatch(fetchGetListaFuncionalidades(location.pathname.includes("reporte"), props.token));
        }
    }, [dispatch, location.pathname, props.listaFuncionalidades.length, props.statusLoadParams]);

    return (
        <div onMouseMove={(e) => { setTstampActual(new Date().getTime()); }}>
            <LoadingAlert openLoad={props.loadGeneral} />
            {(!IsNullOrWhiteSpace(props.alertText)) ?
                <ModalAlert
                    titleAlert={props.alertIsError ? 'Atenci\u00F3n' : "Correcto"}
                    icon={props.alertIsError ? 'danger' : "success"}
                    bodyAlert={props.alertText}
                    openModal={true}
                    size={"sm"}
                    unmountOnClose={true}
                    handlerBtnAceptar={() => {
                        props.setAlertText({ code: "0", text: "" });
                        if (!IsNullOrWhiteSpace(props.errorRedirigir)) {
                            if (props.errorRedirigir === "/reload") {
                                props.setErrorRedirigir('');
                                window.location.href = "/";
                            } else {
                                if (props.customActionAlert) {
                                    props.customActionAlert();
                                }
                                history.push(props.errorRedirigir);
                                props.setErrorRedirigir('');
                            }
                        } else {
                            if (props.customActionAlert) {
                                props.customActionAlert();
                            }
                        }
                    }}
                    btnAceptar={"Aceptar"} />
                : ''}
            <NavMenu id={"header_main"} tstampActual={tstampActual} listaMenus={props.listaMenus} listaUrls={props.listaUrls} />
            <Col className="widthPrincipal">
                {props.children}
            </Col>
        </div>
    );
}

export default connect(mapStateToProps, { setAlertText, setErrorRedirigir })(Layout);