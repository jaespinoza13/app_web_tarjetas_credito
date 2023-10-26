import React from 'react';
import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { saveSession, removeSession } from 'react-session-persist';
import { getLogout, getUsuario, ServicioGetExecute } from '../../services/Services';
import LoadingAlert from '../Common/Loading';

const mapStateToProps = (state) => {
    return {
        token: state.tokenActive.data
    };
};

function Logout(props) {
    const dispatch = useDispatch();

    useEffect(() => {
        const salir = async () => {
            var datosUsuario = await getUsuario();
            ServicioGetExecute(getLogout, props.token, { params: { id_usuario: datosUsuario.id_usuario, dispatch: dispatch } }).then((data) => {
                if (data) {
                    if (data.error) {
                        console.error(data.error);
                    }
                } else {
                    console.log(data);
                }
                var localesAux = localStorage.getItem("COEXIONES_LOCALES");
                localStorage.clear();
                sessionStorage.clear();
                localStorage.setItem("COEXIONES_LOCALES", localesAux);
                saveSession(false);
                removeSession();
                window.location = "/";
            });
        };
        salir();
    }, [dispatch]);

    return (
        <h2>
            <LoadingAlert openLoad={true} />
            Cerrando Sesi&oacute;n...
        </h2>
    );
}


export default connect(mapStateToProps, {})(Logout);