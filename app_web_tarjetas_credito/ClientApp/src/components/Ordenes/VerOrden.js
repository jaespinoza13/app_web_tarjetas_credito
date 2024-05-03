import { useState, useEffect } from 'react';
import { fetchGetReporteOrden } from "../../services/RestServices";
import Sidebar from '../Common/Navs/Sidebar';
import Card from '../Common/Card';
import { useHistory } from 'react-router-dom';
import Table from '../Common/Table';
import Chip from '../Common/UI/Chip'
import  Input  from '../Common/UI/Input';
import { connect, useDispatch } from 'react-redux';
import { IsNullOrWhiteSpace, base64ToBlob, verificarPdf, descargarArchivo, generarFechaHoy } from '../../js/utiles';
import Button from "../Common/UI/Button";


const mapStateToProps = (state) => {
    var bd = state.GetWebService.data;
    if (IsNullOrWhiteSpace(bd) || Array.isArray(state.GetWebService.data)) {
        bd = sessionStorage.getItem("WSSELECTED");
    }
    return {
        ws: bd,
        listaFuncionalidades: state.GetListaFuncionalidades.data,
        token: state.tokenActive.data,
    };
};

function VerOrden(props) {

    const headersTarjetasAprobadas = [
        { nombre: 'Cuenta', key: 0 }, { nombre: 'Tipo Identificacion', key: 1 },
        { nombre: 'Identificación', key: 2 }, { nombre: 'Ente', key: 3 }, { nombre: 'Nombre', key: 4 },
        { nombre: 'Nombre impreso', key: 5 }, { nombre: 'Producto TC.', key: 6 }, { nombre: 'Cupo solicitado', key: 7 }
    ]


    //OBJETO SIMULADO PARA TRAER INFORMACION DE LA ORDEN 
    const objetoEditacion = [
        {
            orden: "164",
            prefijo_tarjeta: "53",
            cost_emision: "cobro_emision",
            descripcion: "TARJETAS SOLICITADAS PARA MES DE ABRIL",
            agencia_solicita: { nombre: "MATRIZ", id: "1" },
            tarjetas_solicitadas: [
                { cuenta: "410010064540", tipo_identificacion: "C", identificacion: "1150214375", ente: "189610", nombre: "DANNY VASQUEZ", nombre_impreso: "DANNY VASQUEZ", tipo: "BLACK", cupo: "8000", key: 23, Agencia: { nombre: "MATRIZ", id: "1" } },
                { cuenta: "410010061199", tipo_identificacion: "R", identificacion: "1105970712001", ente: "515146", nombre: "JUAN TORRES", nombre_impreso: "JUAN TORRES", tipo: "GOLDEN", cupo: "15000", key: 38, Agencia: { nombre: "MATRIZ", id: "1" } },
                { cuenta: "410010061514", tipo_identificacion: "R", identificacion: "1105970714001", ente: "515148", nombre: "ROBERTH TORRES", nombre_impreso: "ROBERTH TORRES", tipo: "ESTÁNDAR", cupo: "15000", key: 58, Agencia: { nombre: "MATRIZ", id: "1" } },
                { cuenta: "410010064000", tipo_identificacion: "P", identificacion: "PZ970715", ente: "515149", nombre: "ROBERTH TORRES", nombre_impreso: "ROBERTH TORRES", tipo: "GOLDEN", cupo: "15000", key: 68, Agencia: { nombre: "MATRIZ", id: "1" } }
            ]

        }
    ]


    const navigate = useHistory();
    const dispatch = useDispatch();
    const [lstSolicitudes, setLstSolicitudes] = useState([]);


    const [nrOrnden, setNrOrden] = useState("");
    const [prefijo, setPrefijo] = useState("");
    const [costoEmision, setCostoEmision] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [agenciaSolicita, setAgenciaSolicita] = useState("");

    const [reporteBytes, setReporteBytes] = useState([]);

    useEffect(() => {

        console.log(props.location?.state?.numOrden);
        if (props.location.pathname === '/orden/verOrden' && (props.location?.state?.numOrden === null || props.location?.state?.numOrden === undefined)) {
            navigate.push('/orden');
        }
        else {

            /// TODO: traer data desde el back por peticion O VER SI DESDE LISTA ORDEN ENVIAR EL OBJETO YA A EDITAR
            setLstSolicitudes(objetoEditacion[0].tarjetas_solicitadas);
            setNrOrden(objetoEditacion[0].orden);
            setCostoEmision(objetoEditacion[0].cost_emision);
            setDescripcion(objetoEditacion[0].descripcion);
            setPrefijo(objetoEditacion[0].prefijo_tarjeta);
            setAgenciaSolicita(objetoEditacion[0].agencia_solicita.nombre);

        }

    }, [])


    const conversionTipoTC = (tipo) => {
        let chipType = '';
        switch (tipo) {
            case 'BLACK':
                chipType = 'black'
                break;
            case 'GOLDEN':
                chipType = 'gold'
                break;
            case 'ESTÁNDAR':
                chipType = 'standar'
                break;
            default:
                break;
        }
        return chipType;
    }

    //columns, data, accountNumber, name, typeMovement
    const onDescargarReporte = () => {
        console.log(nrOrnden, props.token)
        fetchGetReporteOrden(nrOrnden, props.token, (data) => {
            setReporteBytes(data.byt_reporte);
        }, dispatch);
    };

    useEffect(() => {
        if (reporteBytes.length > 0) {
            if (verificarPdf(reporteBytes)) {
                const blob = base64ToBlob(reporteBytes, 'application/pdf');
                let fechaHoy = generarFechaHoy();
                const nombreArchivo = `Orden${nrOrnden}_${(fechaHoy)}`;
                descargarArchivo(blob, nombreArchivo);

            } else {
                window.alert("ERROR AL GENERAR EL REPORTE, COMUNIQUESE CON EL ADMINISTRADOR");
            }
        }
    }, [reporteBytes])


    return (
        <div className="f-row">
            <Sidebar enlace={props.location.pathname}></Sidebar>
            <div className="container_mg">


                <Card className={["m-max justify-content-space-between align-content-center"]}>
                    <br />
                    <div style={{ display: "flex", position: "relative", paddingBottom: "70px" }}>
                        
                        <h2>VISUALIZAR DETALLE DE LA ORDEN</h2>
                        <Button className={["btn_mg btn_mg__primary mr-2 close-modal"]} onClick={() => onDescargarReporte()} disabled={false}>Descargar reporte</Button>
                    </div>
                    

                    <section className="elements_two_column">

                        <div className="form_mg_row">
                            <label htmlFor="numOrdenTarjetas" className="pbmg1 lbl-input label_horizontal">Número de orden</label>
                            <div className="form_mg__item ptmg1">
                                <Input id="numOrdenTarjetas" name="numOrdenTarjetas" type="text" value={nrOrnden} disabled={true}></Input>
                            </div>
                        </div>

                        <div className="form_mg_row">
                            <label id="label">Costo de emisión</label>
                            
                            <div className="form_mg__item">

                                <div style={{ display: 'flex' }}>
                                    <div className=''>
                                        <input type="radio" id="cobro_emision" name="cobro_tarjeta" value="cobro_emision" checked={costoEmision === "cobro_emision"} disabled={true} />
                                        <label htmlFor="cobro_emision">Si</label>
                                    </div>
                                    <div className=''>
                                        <input type="radio" id="no_cobro_emision" name="cobro_tarjeta" value="no_cobro_emision" checked={costoEmision === "no_cobro_emision"} disabled={true} />
                                        <label htmlFor="no_cobro_emision">No</label>
                                    </div>
                                </div>
                                {costoEmision === "" && <div className='text_error_validacion'>Escoja una opción.</div>}

                            </div>

                        </div>


                        <div className="form_mg_row">
                            <label htmlFor="tipoTC" className="pbmg1 lbl-input label_horizontal">Prefijo</label>
                            <div className="form_mg__item ptmg1">
                                <Input id="prefijo" name="prefijo" type="text" value={prefijo} disabled={true}></Input>
                            </div>
                        </div>



                        <div className="form_mg_row">
                            <label htmlFor="descripcion" className="pbmg1 lbl-input label_horizontal">Descripción</label>
                            <div className="form_mg__item ptmg1">
                                <Input id="descripcion" name="descripcion" type="text" value={descripcion} disabled={true}></Input>
                            </div>
                        </div>


                        <div className="form_mg_row">
                            <label htmlFor="agencia_solicita" className="pbmg1 lbl-input label_horizontal">Agencia que solicito</label>
                            <div className="form_mg__item ptmg1">
                                <Input id="agencia_solicita" name="agencia_solicita" type="text" value={agenciaSolicita} disabled={true}></Input>
                            </div>
                        </div>


                    </section>

                    <div id="listado_ordenes" className="mt-3">
                        <Table headers={headersTarjetasAprobadas}>
                            {lstSolicitudes.map((tarjeta) => {
                                return (
                                <tr key={tarjeta.ente}>
                                    <td>{tarjeta.cuenta}</td>
                                    <td>{tarjeta.tipo_identificacion}</td>
                                    <td>{tarjeta.identificacion}</td>
                                    <td>{tarjeta.ente}</td>
                                    <td>{tarjeta.nombre}</td>
                                    <td>{tarjeta.nombre_impreso}</td>
                                    <td><Chip type={conversionTipoTC(tarjeta.tipo)}>{tarjeta.tipo}</Chip></td>
                                    <td>{`$ ${Number(tarjeta.cupo).toLocaleString('en-US')}`}</td>
                                    </tr>
                                )
                            })}

                        </Table>
                    </div>


                </Card>

            </div>
        </div>
    )

}

export default connect(mapStateToProps, {})(VerOrden); 