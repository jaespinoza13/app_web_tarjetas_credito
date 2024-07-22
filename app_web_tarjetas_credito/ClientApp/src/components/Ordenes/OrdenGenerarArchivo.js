import { useState, useEffect } from 'react';
import Sidebar from '../Common/Navs/Sidebar';
import Card from '../Common/Card';
import { useHistory } from 'react-router-dom';
import Input from '../Common/UI/Input'
import { ObjSolicitudesAprob } from './ObjetosMock';
import Table from '../Common/Table';
import { conversionTipoTC, descargarArchivo } from '../../js/utiles';
import Chip from '../Common/UI/Chip';

export default function OrdenGenerarArchivo(props) {


    const navigate = useHistory();
    const [lstTarjetasAprobadas, setLstTarjetasAprobadas] = useState([]);
    const [nrOrnden, setNrOrden] = useState("");
    const [agencia, setAgencia] = useState("");
    const [fechaCreacion, setFechaCreacion] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [numTarjetasTotal, setNumTarjetasTotal] = useState(0);
    const [numTarjetasGolden, setNumTarjetasGolden] = useState(0);
    const [numTarjetasEstandar, setNumTarjetasEstandar] = useState(0);
    const [numTarjetasBlack, setNumTarjetasBlack] = useState(0);

    useEffect(() => {

        /*
        //Control para evitar saltarse al editar, sin tener el numero de Orden
        if (props.location.pathname === '/orden/generarArchivo' && props.location?.state?.numOrden === undefined) {
            navigate.push('/orden');
        }
        else {


            /// TODO: traer data desde el back (llamar con props.location?.state?.numOrden)
            setNrOrden(objConfirmacionRecepcionTarjetas[1].orden);
            setAgencia(objConfirmacionRecepcionTarjetas[1].oficina_solicita);
            setDescripcion(objConfirmacionRecepcionTarjetas[1].descripcion);
            setFechaCreacion(objConfirmacionRecepcionTarjetas[1].fecha_creacion);

            setNumTarjetasTotal(objConfirmacionRecepcionTarjetas[1].orden_tarjetaDet.length);
            setNumTarjetasGolden(objConfirmacionRecepcionTarjetas[1].orden_tarjetaDet.filter(tarjeta => tarjeta.tipo === "GOLDEN").length.toString());
            setNumTarjetasEstandar(objConfirmacionRecepcionTarjetas[1].orden_tarjetaDet.filter(tarjeta => tarjeta.tipo === "ESTÁNDAR").length.toString());
            setNumTarjetasBlack(objConfirmacionRecepcionTarjetas[1].orden_tarjetaDet.filter(tarjeta => tarjeta.tipo === "BLACK").length.toString());


        }
        */

    }, [])
    useEffect(() => {
        setLstTarjetasAprobadas(ObjSolicitudesAprob);
    }, [])

    const headersTarjetasAprobadas = [
        { nombre: 'Ente', key: 0 }, { nombre: 'Tipo identificación', key: 1 }, { nombre: 'Identificación', key: 2 },
        { nombre: 'Nombre', key: 3 }, { nombre: 'Producto TC', key: 4 }, { nombre: 'Cupo solicitado', key: 5 },
    ]


    function generarInputFile() {
        const contenidoCSV = lstTarjetasAprobadas.map(solic => `${solic.ente},${solic.tipo_identificacion},${solic.identificacion},${solic.nombre},${solic.tipo},${solic.cupo}`).join("\n");

        const blob = new Blob([contenidoCSV], { type: "text/plain" });

        descargarArchivo(blob, 'inputfile', 'txt', false)





    }

  

    return (
        <div className="f-row w-100" >
            {/*<Sidebar enlace={props.location.pathname}></Sidebar>*/}
            <div className="container_mg">


                <Card className={["m-max justify-content-space-between align-content-center"]}>
                
                    <h2 className="mt-1 mb-4" >Generar Archivo Inputfile (Credencial)</h2>
                    <h3 className="mt-2 mb-3" style={{ textDecoration: "underline" }}>Solicitudes Aprobadas</h3>
                   

                    <div style={{ display: "flex", alignItems: "left", justifyContent: "left" }}>
                        <button className="btn_mg btn_mg__primary" style={{ width: "200px", marginRight: "15px" }} disabled={false} type="button" onClick={generarInputFile}>
                            Generar InputFile</button>

                        {/*<button className="btn_mg btn_mg__primary" style={{ width: "200px" }} disabled={false} type="button">*/}
                        {/*    Descargar último archivo</button>*/}
                    </div>

              
                    <div id="listado_ordenes" className="mt-1">
                        <Table headers={headersTarjetasAprobadas} multipleOpcion={false} >
                            {/*BODY*/}
                            {lstTarjetasAprobadas.map((tarjeta, index) => {
                                return (
                                    <tr key={tarjeta.ente}>
                                        <td>{tarjeta.ente}</td>
                                        <td>{tarjeta.tipo_identificacion}</td>
                                        <td>{tarjeta.identificacion}</td>
                                        <td>{tarjeta.nombre}</td>
                                        <td><Chip type={conversionTipoTC(tarjeta.tipo)}>{tarjeta.tipo}</Chip></td>
                                        <td>{`$ ${Number(tarjeta.cupo).toLocaleString('en-US')}`}</td>

                                    </tr>
                                );
                            })}

                        </Table>
                    </div>
                    
                    {/*<section className="elements_two_column">*/}
                    {/*    <div className="form_mg_row">*/}
                    {/*        <label htmlFor="numOrdenTarjetas" className="pbmg1 lbl-input label_horizontal">Número de orden</label>*/}
                    {/*        <div className="form_mg__item ptmg1">*/}
                    {/*            <Input id="numOrdenTarjetas" name="numOrdenTarjetas" type="text" value={nrOrnden} disabled={true}></Input>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}

                    {/*    <div className="form_mg_row">*/}
                    {/*        <label htmlFor="fecha_creacion" className="pbmg1 lbl-input label_horizontal">Fecha de creación</label>*/}
                    {/*        <div className="form_mg__item ptmg1">*/}
                    {/*            <Input id="fecha_creacion" name="fecha_creacion" type="text" value={fechaCreacion} disabled={true}></Input>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}

                    {/*    <div className="form_mg_row">*/}
                    {/*        <label htmlFor="oficina_solicitante" className="pbmg1 lbl-input label_horizontal">Agencia</label>*/}
                    {/*        <div className="form_mg__item ptmg1">*/}

                    {/*            <Input id="oficina_solicitante" name="oficina_solicitante" type="text" value={agencia}  disabled={true}></Input>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}

                    {/*    <div className="form_mg_row">*/}
                    {/*        <label htmlFor="descripcion" className="pbmg1 lbl-input label_horizontal">Descripción</label>*/}
                    {/*        <div className="form_mg__item ptmg1">*/}

                    {/*            <Input id="descripcion" name="descripcion" type="text" value={descripcion} disabled={true}></Input>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}

                    {/*</section>*/}

                    {/*<h3 className="mt-2 mb-3" style={{ textDecoration: "underline" }}>Tarjetas:</h3>*/}
                    
                    {/*<section style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>*/}

                    {/*    <div className="form_mg_row">*/}
                    {/*        <label htmlFor="tarjetas_golden" className="pbmg1 lbl-input label_horizontal" style={{ color: "#FED400" }}> <strong>Tarjetas Golden</strong></label>*/}
                    {/*        <div className="form_mg__item ptmg1">*/}
                    {/*            <Input id="tarjetas_golden" name="tarjetas_golden" type="text" value={numTarjetasGolden} disabled={true}></Input>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}

                    {/*    <div className="form_mg_row">*/}
                    {/*        <label htmlFor="tarjetas_black" className="pbmg1 lbl-input label_horizontal" style={{ color: "#3D3D3D", fontWeight: "bold" }}> Tarjetas Black</label>*/}
                    {/*        <div className="form_mg__item ptmg1">*/}

                    {/*            <Input id="tarjetas_black" name="tarjetas_black" type="text" value={numTarjetasBlack} disabled={true}></Input>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}

                    {/*    <div className="form_mg_row">*/}
                    {/*        <label htmlFor="tarjetas_estandar" className="pbmg1 lbl-input label_horizontal" style={{ color: "#B6B7B8" }}>Tarjetas Estándar</label>*/}
                    {/*        <div className="form_mg__item ptmg1">*/}

                    {/*            <Input id="tarjetas_estandar" name="tarjetas_estandar" type="text" value={numTarjetasEstandar} disabled={true}></Input>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}

                    {/*    <div className="form_mg_row">*/}
                    {/*        <label htmlFor="total_tarjetas" className="pbmg1 lbl-input label_horizontal">Total de tarjetas</label>*/}
                    {/*        <div className="form_mg__item ptmg1">*/}

                    {/*            <Input id="total_tarjetas" name="total_tarjetas" type="text" value={numTarjetasTotal} disabled={true}></Input>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}

                    {/*</section>*/}
                    {/*<br/>*/}

                    {/*<div className="center_text_items">*/}
                    {/*    <button className="btn_mg btn_mg__primary" style={{ width: "200px", marginRight: "15px" }} disabled={false} type="button">*/}
                    {/*        Generar InputFile</button>*/}

                    {/*    <button className="btn_mg btn_mg__primary" style={{ width: "200px" }} disabled={false} type="button">*/}
                    {/*        Descargar último archivo</button>*/}
                    {/*</div>*/}

                </Card>



            </div>


        </div>
    )

}