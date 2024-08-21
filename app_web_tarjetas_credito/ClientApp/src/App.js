import React, { Component, useEffect, useState } from 'react';
import { getAuthenticated, getUser, removeSession } from 'react-session-persist';
import { Route, Switch, Redirect } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Login from './components/Login/Login';
import Logout from './components/Login/Logout';
import HomeLogs from './components/Logs/Logs';
import LogsTexto from './components/Logs/LogTexto';
import VerLogsTexto from './components/Logs/VerLogTexto';
import LogsMongo from './components/Logs/LogMongo';
import SeguimientoTransaccion from './components/Logs/SeguimientoTran';
import { IsNullOrWhiteSpace, validateToken } from './js/utiles';
import './scss/main.css'
import { desencriptar, generate, get, set } from './js/crypt';
import { fetchMenuPrincipal, fetchGetParametrosSistema, fetchGetFuncionalidadesTC, fetchGetPermisosPerfil } from './services/RestServices';
import { connect, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import Solicitud from './components/Solicitud/Solicitud';
import NuevaSolicitud from './components/Solicitud/NuevaSolicitud';
import Reprocesar from './components/Ordenes/Reprocesar';
import Orden from './components/Ordenes/Orden';
import VerSolicitud from './components/Solicitud/VerSolicitud';
import OrdenNuevaEdicion from './components/Ordenes/OrdenNuevaEdicion';
import OrdenGenerarArchivo from './components/Ordenes/OrdenGenerarArchivo';
import VerOrden from './components/Ordenes/VerOrden';
import RecepcionTarjetaAgencias from './components/Ordenes/RecepcionTarjetaAgencias';
import OrdenRecibirProveedor from './components/Ordenes/OrdenRecibirProveedor';
import OrdenPedidoNueva from './components/Ordenes/OrdenPedidoNueva';
import NuevaProspeccion from './components/Prospeccion/NuevaProspeccion';
import { setParametrosTCStateAction } from './redux/ParametrosTC/actions';
import { setFuncionalidadesSistemaAction } from './redux/FuncionalidadesSistema/actions';
import Seguimiento from './components/Ordenes/Seguimiento';
import RecibirOrdenesPersonalizadas from './components/Ordenes/RecibirOrdenesPersonalizadas';
import Distribucion from './components/Ordenes/Distribucion';
import RecibirOrdenesOficinas from './components/Ordenes/RecibirOrdenesOficinas';
import EntregaSocio from './components/EntregaTarjetaCredito/EntregaSocio';
import Activacion from './components/EntregaTarjetaCredito/Activacion';
import VerDetalle from './components/Prospeccion/VerDetalle';


const mapStateToProps = (state) => {
    return {
        token: state.tokenActive.data,
        listaFuncionalidades: state.GetListaFuncionalidades.data,
        parametrosTC: state.GetParametrosTC.data
    };
};

function Menus({ listaMenus, id_perfil, token, setListas, setListaFunc, listaFuncionalidades, parametrosSis }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    const [tokeni, setToken] = useState(token);
    const [idPerfil, setIdPerfil] = useState(id_perfil);
    const [listaMenusi, setListaMenus] = useState([]);
    const [listaUrls, setListaUrls] = useState([]);
    const [existeParametrosSistema, setExisteParametrosSistema] = useState(false);
    const [sended, setSended] = useState(false);
    const [sendedParams, setSendedParams] = useState(false);

    useEffect(() => {
        if (!IsNullOrWhiteSpace(token)) {
            setToken(token);
        }
    }, [token]);

    useEffect(() => {
        if (id_perfil > 0) {
            setIdPerfil(id_perfil);
        }
    }, [id_perfil]);

    useEffect(() => {
        if (listaMenus.length === 0) {
            if (listaMenusi.length > 0) {
                setListas(listaMenusi, listaUrls);
            }
        }
    }, [listaMenusi, listaUrls, setListas, listaMenus.length]);

    useEffect(() => {
        let ti = setTimeout(() => {
            if (idPerfil > 0 && !IsNullOrWhiteSpace(tokeni) && validateToken(tokeni) && listaMenus.length === 0 && listaMenusi.length === 0 && !sended) {
                setSended(true);
                //TODO: VALIDAR SI FUNCIONA
                /*fetchMenuPrincipal(idPerfil, tokeni, (listaMenusg, listaUrlsg) => {
                    setListaUrls(listaUrlsg);
                    setListaMenus(listaMenusg);
                }, dispatch);*/
            }
            clearTimeout(ti);
        }, 400);
    }, [idPerfil, tokeni, sended, listaMenus.length, listaMenusi.length, dispatch]);

    //OBTENCION DE PARAMETROS DEL SISTEMA
    useEffect(() => {
        if (idPerfil > 0 && !IsNullOrWhiteSpace(tokeni) && validateToken(tokeni) && existeParametrosSistema === false && !sendedParams) {
            setSendedParams(true);
            //Obtener parametros y se almacena por medio de redux
            fetchGetParametrosSistema("", tokeni, (data) => {
                setExisteParametrosSistema(true);
                dispatch(setParametrosTCStateAction({ lst_parametros: data.lst_parametros }));
            }, dispatch)
            fetchGetPermisosPerfil(tokeni, (data) => {
                dispatch(setFuncionalidadesSistemaAction({ permisos: data.lst_funcionalidades }));
                console.log("lst_funcionalidades ", data.lst_funcionalidades)
            }, dispatch)
        }
    }, [idPerfil, tokeni, existeParametrosSistema.length, dispatch, sendedParams, existeParametrosSistema]);
       

    useEffect(() => {
        var tOut = setTimeout(() => {
            if (listaUrls.length > 0 && !listaUrls.includes(location.pathname) && location.pathname !== "/") {
                if (listaFuncionalidades.length > 0) {
                    let match = false;
                    let lstDecode = [];
                    for (let i = 0; i < listaFuncionalidades.length; i++) {
                        lstDecode.push(get(listaFuncionalidades[i].url));
                        if (listaFuncionalidades[i].url === set(location.pathname)) {
                            match = true;
                            break;
                        }
                    }
                    //console.log(lstDecode)
                    setListaFunc(lstDecode);
                    if (!match) {
                        history.push("/");
                    }
                } else { //NO PUEDE ACCEDER SI NO TIENES FUNCIONALIDADES
                    removeSession();
                    history.push("/logout");
                    localStorage.removeItem('sender');
                    localStorage.removeItem('remitente');
                    localStorage.removeItem('aceptar');
                }
            }
            clearTimeout(tOut);
        }, 500);
    }, [listaUrls, listaFuncionalidades, setListaFunc, history, location.pathname]);

    return (<></>);
}

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false,
            idUsuario: -1,
            listaMenus: [],
            listaFunc: [],
            listUrls: [],
            listaParams :[] 
        };
    }

    componentDidMount() {
        if (!this.state.isAuthenticated) {
            const sender = get(localStorage.getItem('sender'));
            const remitente = get(localStorage.getItem('remitente'));
            const ts = Number(localStorage.getItem('aceptar'));
            if (getUser() && sender && remitente) {
                let key = generate(navigator.userAgent, ts, remitente, sender);
                desencriptar(key, getUser().data).then((datosUsuario) => {
                    this.setState({ isAuthenticated: getAuthenticated() === true && datosUsuario && datosUsuario.canRedirect === true });
                    if (!this.state.isAuthenticated) {
                        localStorage.removeItem('sender');
                        localStorage.removeItem('remitente');
                        localStorage.removeItem('aceptar');
                        removeSession();
                    }
                    if (getAuthenticated() && datosUsuario && datosUsuario.id_perfil > 0) {
                        this.setState({ idUsuario: datosUsuario.id_perfil });
                    }
                }).catch((e) => console.error("App", e));
            }
        }
    }

    render() {
        return (
            <Layout listaMenus={this.state.listaMenus} listaUrls={this.state.listUrls}>
                
                <Menus
                    listaMenus={this.state.listaMenus}
                    id_perfil={this.state.idUsuario}
                    token={this.props.token}
                    listaFuncionalidades={this.props.listaFuncionalidades}
                    setListaFunc={(lstFunc) => this.setState({ listaFunc: lstFunc })}
                    setListas={(lstMenus, lstUrls) => this.setState({ listaMenus: lstMenus, listUrls: lstUrls })}
                    listaParametros={this.state.listaParams}
                    setListaParametros={(listaParam) => this.setState({ listaParams: listaParam })}
                    parametrosSis={this.props.parametrosTC}
                    
                />
                <Switch>
                    <Route exact path='/' component={!this.state.isAuthenticated ? Login : Home} />
                    {/*<Route path='/auth' component={Login} />*/}
                    <Route path='/auth' component={this.state.isAuthenticated ? Home : Login} />
                    <Route path='/logout' component={!this.state.isAuthenticated ? Login : Logout} />
                    <Route path='/solicitud'>
                        {this.state.isAuthenticated ? (
                            <>
                                <Route exact path='/solicitud' component={Solicitud} />
                                <Route path='/solicitud/nueva' component={NuevaSolicitud} />
                                <Route path='/solicitud/ver' component={VerSolicitud} />
                            </>
                        ) : (
                            <Route render={() => <Redirect to="/auth" />} />
                        )}
                    </Route>

                    <Route path='/prospeccion'>
                        {this.state.isAuthenticated ? (
                            <>                                
                                <Route path='/prospeccion/nueva' component={NuevaProspeccion} /> 
                                <Route path='/prospeccion/ver' component={VerDetalle}/>
                            </>
                        ) : (
                            <Route render={() => <Redirect to="/auth" />} />
                        )}
                    </Route>

                    <Route path='/reprocesar'>
                        {this.state.isAuthenticated ? (
                            <>
                                <Route exact path='/reprocesar' component={Reprocesar} />
                            </>  
                        ) : (
                            <Route render={() => <Redirect to="/auth" />} />
                        )}
                    </Route>

                    <Route path='/seguimiento'>
                        {this.state.isAuthenticated ? (
                            <>
                                <Route exact path='/seguimiento' component={Seguimiento} />
                            </>
                        ) : (
                            <Route render={() => <Redirect to="/auth" />} />
                        )}
                    </Route>

                    {/*<Route path='/recepcion'>*/}
                    {/*    {this.state.isAuthenticated ? (*/}
                    {/*        <>*/}
                    {/*            <Route exact path='/recepcion' component={RecibirOrdenesPersonalizadas} />*/}
                    {/*        </>*/}
                    {/*    ) : (*/}
                    {/*        <Route render={() => <Redirect to="/auth" />} />*/}
                    {/*    )}*/}
                    {/*</Route>*/}

                    {/*<Route path='/distribucion'>*/}
                    {/*    {this.state.isAuthenticated ? (*/}
                    {/*        <>*/}
                    {/*            <Route exact path='/distribucion' component={Distribucion} />*/}
                    {/*        </>*/}
                    {/*    ) : (*/}
                    {/*        <Route render={() => <Redirect to="/auth" />} />*/}
                    {/*    )}*/}
                    {/*</Route>*/}

                    <Route path='/recibirOrden'>
                        {this.state.isAuthenticated ? (
                            <>
                                <Route exact path='/recibirOrden' component={RecibirOrdenesOficinas} />
                            </>
                        ) : (
                            <Route render={() => <Redirect to="/auth" />} />
                        )}
                    </Route>

                    {/*<Route path='/entregaTC'>*/}
                    {/*    {this.state.isAuthenticated ? (*/}
                    {/*        <>*/}
                    {/*            <Route exact path='/entregaTC' component={EntregaSocio} />*/}
                    {/*        </>*/}
                    {/*    ) : (*/}
                    {/*        <Route render={() => <Redirect to="/auth" />} />*/}
                    {/*    )}*/}
                    {/*</Route>*/}


                    {/*<Route path='/activacion'>*/}
                    {/*    {this.state.isAuthenticated ? (*/}
                    {/*        <>*/}
                    {/*            <Route exact path='/activacion' component={Activacion} />*/}
                    {/*        </>*/}
                    {/*    ) : (*/}
                    {/*        <Route render={() => <Redirect to="/auth" />} />*/}
                    {/*    )}*/}
                    {/*</Route>*/}



                    {/*<Route path='/orden'>*/}
                    {/*    {this.state.isAuthenticated ? (*/}
                    {/*        <>*/}
                    {/*            <Route exact path='/orden' component={Orden} />*/}
                    {/*            <Route path='/orden/nueva' component={OrdenNuevaEdicion} />*/}
                    {/*            <Route path='/orden/editar' component={OrdenNuevaEdicion} />*/}
                    {/*            <Route path='/orden/generarArchivo' component={OrdenGenerarArchivo} />*/}
                    {/*            <Route path='/orden/verOrden' component={VerOrden} />*/}
                    {/*        </>*/}
                    {/*    ) : (*/}
                    {/*        <Route render={() => <Redirect to="/auth" />} />*/}
                    {/*    )}*/}
                    {/*</Route>*/}

                    {/*<Route path='/ordenPedido'>*/}
                    {/*    {this.state.isAuthenticated ? (*/}
                    {/*        <>*/}
                    {/*           <Route path='/ordenPedido/nueva' component={OrdenPedidoNueva} />*/}
                    {/*        </>*/}
                    {/*    ) : (*/}
                    {/*        <Route render={() => <Redirect to="/auth" />} />*/}
                    {/*    )}*/}
                    {/*</Route>*/}

                    {/*<Route path='/recibir_orden_proveedor' component={!this.state.isAuthenticated ? Login : OrdenRecibirProveedor} />*/}
                    {/*<Route path='/confirmar_recepcion' component={!this.state.isAuthenticated ? Login : RecepcionTarjetaAgencias} />*/}



                    {this.state.listaMenus.find(x => x.url === "/logs") ?
                        <Route exact path='/logs' component={!this.state.isAuthenticated ? Login : HomeLogs} />
                        : ""}
                    {this.state.listaFunc.find(x => x === "/logsTexto") ?
                        <Route exact path='/logsTexto' component={!this.state.isAuthenticated ? Login : LogsTexto} />
                        : ""}
                    {this.state.listaFunc.find(x => x === "/contenidoLog") ?
                        <Route exact path='/contenidoLog' component={!this.state.isAuthenticated ? Login : VerLogsTexto} />
                        : ""}
                    {this.state.listaFunc.find(x => x === "/logsMongo") ?
                        <Route exact path='/logsMongo' component={!this.state.isAuthenticated ? Login : LogsMongo} />
                        : ""}
                    {this.state.listaMenus.find(x => x.url === "/seguimientotran") ?
                        <Route exact path='/seguimientotran' component={!this.state.isAuthenticated ? Login : SeguimientoTransaccion} />
                        : ""}
                </Switch>
            </Layout>
        );
    }
}

export default connect(mapStateToProps, {})(App);