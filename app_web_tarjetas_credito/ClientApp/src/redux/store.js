import { applyMiddleware, createStore, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import thunk from 'redux-thunk'

import { GetListaUrls } from "./Urls/reducers"
import { GetParametros } from "./Parametros/reducers"
import { GetListaFuncionalidades } from "./Funcionalidades/reducers"
import { GetListaMejoras } from "./Parametros/InfoSistema/Mejoras/reducers"
import { GetWebService } from "./Logs/WebServerSelected/reducers"
import { GetFile } from "./Logs/FileSelected/reducers"
import { ListaBasesMongoDb } from "./Logs/ListaBases/reducers"
import { loadding } from "./Loadding/reducers"
import { alertText } from "./Alert/reducers"
import { tokenActive } from "./Token/reducers"
import { solicitud } from "./Solicitud/reducers"

const Reducers = combineReducers({
    GetParametros,
    GetListaMejoras,
    GetListaFuncionalidades,
    GetWebService,
    GetFile,
    GetListaUrls,
    loadding,
    alertText,
    tokenActive,
    ListaBasesMongoDb,
    solicitud
});

export const store = createStore(
    Reducers,
    composeWithDevTools(
        applyMiddleware(thunk)
    )
)
