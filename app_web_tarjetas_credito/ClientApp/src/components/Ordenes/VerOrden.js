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
import { objConfirmacionRecepcionTarjetas } from "./ObjetosMock";


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
        { nombre: 'Número de tarjeta', key: 0 }, { nombre: 'Identificación', key: 1 }, { nombre: 'Cuenta', key: 2 },
        { nombre: 'Nombre impreso', key: 3 }, { nombre: 'Producto TC.', key: 4 }, { nombre: 'Cupo', key: 5 }
    ]

    const navigate = useHistory();
    const dispatch = useDispatch();
    const [lstOrdenTarjetas, setlstOrdenTarjetas] = useState([]);

    
    const [nrOrnden, setNrOrden] = useState("");
    const [prefijo, setPrefijo] = useState("");
    const [costoEmision, setCostoEmision] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [agenciaSolicita, setAgenciaSolicita] = useState("");

    const [reporteBytes, setReporteBytes] = useState([]);

    useEffect(() => {

        if (props.location.pathname === '/orden/verOrden' && (props.location?.state?.numOrden === null || props.location?.state?.numOrden === undefined)) {
            navigate.push('/orden');
        }
        else {

            /// TODO: traer data desde el back por peticion O VER SI DESDE LISTA ORDEN ENVIAR EL OBJETO YA A EDITAR
            setlstOrdenTarjetas(objConfirmacionRecepcionTarjetas[1].orden_tarjetaDet);
            setNrOrden(objConfirmacionRecepcionTarjetas[1].orden);
            //setCostoEmision(objConfirmacionRecepcionTarjetas[1].cost_emision);
            setDescripcion(objConfirmacionRecepcionTarjetas[1].descripcion);
            //setPrefijo(objConfirmacionRecepcionTarjetas[1].prefijo_tarjeta);
            //setAgenciaSolicita(objConfirmacionRecepcionTarjetas[1].oficina_solicita);

        }

    }, [])


    const conversionTipoTC = (tipo) => {
        let chipType = '';
        switch (tipo) {
            case 'BLACK':
                chipType = 'black'
                break;
            case 'GOLD':
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
                descargarArchivo(blob, nombreArchivo, 'pdf', false);

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
                        <div className="btns-in-margin-rigth">
                            <Button className={["btn_mg btn_mg__primary mr-2"]} onClick={() => onDescargarReporte()} disabled={false}>Descargar reporte</Button>
                        </div>
                        
                    </div>
                    

                    <section className="elements_two_column">

                        <div className="form_mg_row">
                            <label htmlFor="numOrdenTarjetas" className="pbmg1 lbl-input label_horizontal">Número de orden</label>
                            <div className="form_mg__item ptmg1">
                                <Input id="numOrdenTarjetas" name="numOrdenTarjetas" type="text" value={nrOrnden} disabled={true}></Input>
                            </div>
                        </div>

                        {/*<div className="form_mg_row">*/}
                        {/*    <label id="label">Costo de emisión</label>*/}
                            
                        {/*    <div className="form_mg__item">*/}

                        {/*        <div style={{ display: 'flex' }}>*/}
                        {/*            <div className=''>*/}
                        {/*                <input type="radio" id="cobro_emision" name="cobro_tarjeta" value="cobro_emision" checked={costoEmision === "cobro_emision"} disabled={true} />*/}
                        {/*                <label htmlFor="cobro_emision">Si</label>*/}
                        {/*            </div>*/}
                        {/*            <div className=''>*/}
                        {/*                <input type="radio" id="no_cobro_emision" name="cobro_tarjeta" value="no_cobro_emision" checked={costoEmision === "no_cobro_emision"} disabled={true} />*/}
                        {/*                <label htmlFor="no_cobro_emision">No</label>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*        {costoEmision === "" && <div className='text_error_validacion'>Escoja una opción.</div>}*/}

                        {/*    </div>*/}

                        {/*</div>*/}


                        <div className="form_mg_row">
                            <label htmlFor="tipoOrden" className="pbmg1 lbl-input label_horizontal">Tipo de Orden</label>
                            <div className="form_mg__item ptmg1">
                                <Input id="tipoOrden" name="tipoOrden" type="text" value={'PEDIDO'} disabled={true}></Input>
                            </div>
                        </div>



                        <div className="form_mg_row">
                            <label htmlFor="descripcion" className="pbmg1 lbl-input label_horizontal">Descripción</label>
                            <div className="form_mg__item ptmg1">
                                <Input id="descripcion" name="descripcion" type="text" value={descripcion} disabled={true}></Input>
                            </div>
                        </div>


                        <div className="form_mg_row">
                            <label htmlFor="obser_adicional" className="pbmg1 lbl-input label_horizontal">Observación adicional</label>
                            <div className="form_mg__item ptmg1">
                                <Input id="obser_adicional" name="obser_adicional" type="text" value={''} disabled={true}></Input>
                            </div>
                        </div>



                        {/*<div className="form_mg_row">*/}
                        {/*    <label htmlFor="oficina_solicita" className="pbmg1 lbl-input label_horizontal">Agencia que solicito</label>*/}
                        {/*    <div className="form_mg__item ptmg1">*/}
                        {/*        <Input id="oficina_solicita" name="oficina_solicita" type="text" value={agenciaSolicita} disabled={true}></Input>*/}
                        {/*    </div>*/}
                        {/*</div>*/}


                    </section>

                    <div id="listado_ordenes" className="mt-3">
                        <Table headers={headersTarjetasAprobadas}>
                            {lstOrdenTarjetas.map((tarjeta) => {
                                return (
                                <tr key={tarjeta.ente}>
                                        <td>{tarjeta.numero_tarjeta}</td>
                                        <td>{tarjeta.identificacion}</td>
                                        <td>{tarjeta.cuenta}</td>
                                        <td>{tarjeta.nombre}</td>
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