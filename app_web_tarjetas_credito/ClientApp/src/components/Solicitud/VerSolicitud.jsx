import { IsNullOrWhiteSpace } from "../../js/utiles";
import { connect, useDispatch } from 'react-redux';
import { useEffect, useState } from "react";
import { fetchGetComentarios } from "../../services/RestServices";
import { solicitud } from "../../redux/Solicitud/reducers";
import Sidebar from "../Common/Navs/Sidebar";
import Card from "../Common/Card";
import Table from "../Common/Table";

const mapStateToProps = (state) => {
    console.log(state);
    var bd = state.GetWebService.data;
    if (IsNullOrWhiteSpace(bd) || Array.isArray(state.GetWebService.data)) {
        bd = sessionStorage.getItem("WSSELECTED");
    }
    return {
        ws: bd,
        listaFuncionalidades: state.GetListaFuncionalidades.data,
        token: state.tokenActive.data,
        solicitud: state.solicitud.data
    };
};

const VerSolicitud = (props) => {
    const dispatch = useDispatch();
    const [comentariosAsesor, setComentariosAsesor] = useState([]);

    const headerTableComentarios = [
        { nombre: 'Tipo', key: 1 }, { nombre: 'Descripción', key: 2 }, { nombre: 'Comentario', key: 3 }
    ];
    
    useEffect(() => {
        fetchGetComentarios(props.solicitud.solicitud, props.token, (data) => {
            setComentariosAsesor(data.lst_comn_ase_cre);
        }, dispatch);
    }, []);

    return <div className="f-row">
        <Sidebar></Sidebar>
        <Card>
            <Table headers={headerTableComentarios}>
                {
                    comentariosAsesor.map((comentario) => {
                        return (
                            <tr key={comentario.int_id_parametroint_id_parametro}>
                                <td>comentario.str_tipo</td>
                                <td>comentario.str_descripcion</td>
                                <td>comentario.str_detalle</td>
                            </tr>
                        );
                    })
                }
            </Table>
        </Card>
    </div>
}

export default connect(mapStateToProps, {})(VerSolicitud);