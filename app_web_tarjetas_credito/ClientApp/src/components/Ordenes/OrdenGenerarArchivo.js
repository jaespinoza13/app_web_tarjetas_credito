import { useState, useEffect } from 'react';
import Sidebar from '../Common/Navs/Sidebar';
import Card from '../Common/Card';
import { useHistory } from 'react-router-dom';
import Input from '../Common/UI/Input'

export default function OrdenGenerarArchivo(props) {


    const navigate = useHistory();
    const [nrOrnden, setNrOrden] = useState("");
    const [agencia, setAgencia] = useState("");
    const [fechaCreacion, setFechaCreacion] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [numTarjetasTotal, setNumTarjetasTotal] = useState(0);
    const [numTarjetasGolden, setNumTarjetasGolden] = useState(0);
    const [numTarjetasEstandar, setNumTarjetasEstandar] = useState(0);
    const [numTarjetasBlack, setNumTarjetasBlack] = useState(0);

    const objetoGenerarArchivo = [
        {
            orden: "164",
            fecha_creacion: "30/04/2023 4:15:07 PM",
            agencia: "CATAMAYO",
            descripcion: "TARJETAS SOLICITADAS PARA MES DE ABRIL",
            tarjetas_solicitadas: [
                { cuenta: "410010026841", tipo_identificacion: "C", identificacion: "1105970717", ente: "515145", nombre: "ROBERTH TORRES", nombre_impreso: "ROBERTH TORRES", tipo: "GOLDEN", cupo: "15000", key: 28, Agencia: { nombre: "CATAMAYO", id: "3" } },
                { cuenta: "410010094684", tipo_identificacion: "P", identificacion: "PL970713", ente: "515147", nombre: "LUIS TORRES", nombre_impreso: "LUIS TORRES", tipo: "ESTÁNDAR", cupo: "15000", key: 48, Agencia: { nombre: "CATAMAYO", id: "3" } },
                { cuenta: "410010094684", tipo_identificacion: "P", identificacion: "PL970713", ente: "515100", nombre: "JORGE MARTINEZ", nombre_impreso: "JORGE MARTINEZ", tipo: "GOLDEN", cupo: "15000", key: 20, Agencia: { nombre: "CATAMAYO", id: "3" } }
            ]

        }
    ]


    useEffect(() => {


        //Control para evitar saltarse al editar, sin tener el numero de Orden
        if (props.location.pathname === '/orden/generarArchivo' && props.location?.state?.numOrden === undefined) {
            navigate.push('/orden');
        }
        else {

            /// TODO: traer data desde el back (llamar con props.location?.state?.numOrden)
            setNrOrden(objetoGenerarArchivo[0].orden);
            setAgencia(objetoGenerarArchivo[0].agencia);
            setDescripcion(objetoGenerarArchivo[0].descripcion);
            setFechaCreacion(objetoGenerarArchivo[0].fecha_creacion);

            setNumTarjetasTotal(objetoGenerarArchivo[0].tarjetas_solicitadas.length);
            setNumTarjetasGolden(objetoGenerarArchivo[0].tarjetas_solicitadas.filter(tarjeta => tarjeta.tipo === "GOLDEN").length.toString());
            setNumTarjetasEstandar(objetoGenerarArchivo[0].tarjetas_solicitadas.filter(tarjeta => tarjeta.tipo === "ESTÁNDAR").length.toString());
            setNumTarjetasBlack(objetoGenerarArchivo[0].tarjetas_solicitadas.filter(tarjeta => tarjeta.tipo === "BLACK").length.toString());


        }

    }, [])



    return (
        <div className="f-row">
            <Sidebar enlace={props.location.pathname}></Sidebar>
            <div className="container_mg">


                <Card className={["m-max justify-content-space-between align-content-center"]}>
                    <br />
                    <h2>Generar Archivo</h2>
                    <br />

                    <h3 style={{ textDecoration: "underline" }}>Orden:</h3>
                    <br />

                    <section className="elements_two_column">
                        <div className="form_mg_row">
                            <label htmlFor="numOrdenTarjetas" className="pbmg1 lbl-input label_horizontal">Número de orden</label>
                            <div className="form_mg__item ptmg1">
                                <Input id="numOrdenTarjetas" name="numOrdenTarjetas" type="text" value={nrOrnden} disabled={true}></Input>
                            </div>
                        </div>

                        <div className="form_mg_row">
                            <label htmlFor="fecha_creacion" className="pbmg1 lbl-input label_horizontal">Fecha de creación</label>
                            <div className="form_mg__item ptmg1">
                                <Input id="fecha_creacion" name="fecha_creacion" type="text" value={fechaCreacion} disabled={true}></Input>
                            </div>
                        </div>

                        <div className="form_mg_row">
                            <label htmlFor="agencia_solicitante" className="pbmg1 lbl-input label_horizontal">Agencia</label>
                            <div className="form_mg__item ptmg1">

                                <Input id="agencia_solicitante" name="agencia_solicitante" type="text" value={agencia}  disabled={true}></Input>
                            </div>
                        </div>

                        <div className="form_mg_row">
                            <label htmlFor="descripcion" className="pbmg1 lbl-input label_horizontal">Descripción</label>
                            <div className="form_mg__item ptmg1">

                                <Input id="descripcion" name="descripcion" type="text" value={descripcion} disabled={true}></Input>
                            </div>
                        </div>

                    </section>
                    <br />
                    <h3 style={{ textDecoration: "underline"} }>Tarjetas:</h3>
                    <br />
                   
                    <section style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>

                        <div className="form_mg_row">
                            <label htmlFor="tarjetas_golden" className="pbmg1 lbl-input label_horizontal" style={{ color: "#FED400" }}> <strong>Tarjetas Golden</strong></label>
                            <div className="form_mg__item ptmg1">
                                <Input id="tarjetas_golden" name="tarjetas_golden" type="text" value={numTarjetasGolden} disabled={true}></Input>
                            </div>
                        </div>

                        <div className="form_mg_row">
                            <label htmlFor="tarjetas_black" className="pbmg1 lbl-input label_horizontal" style={{ color: "#3D3D3D", fontWeight: "bold" }}> Tarjetas Black</label>
                            <div className="form_mg__item ptmg1">

                                <Input id="tarjetas_black" name="tarjetas_black" type="text" value={numTarjetasBlack} disabled={true}></Input>
                            </div>
                        </div>

                        <div className="form_mg_row">
                            <label htmlFor="tarjetas_estandar" className="pbmg1 lbl-input label_horizontal" style={{ color: "#B6B7B8" }}>Tarjetas Estándar</label>
                            <div className="form_mg__item ptmg1">

                                <Input id="tarjetas_estandar" name="tarjetas_estandar" type="text" value={numTarjetasEstandar} disabled={true}></Input>
                            </div>
                        </div>

                        <div className="form_mg_row">
                            <label htmlFor="total_tarjetas" className="pbmg1 lbl-input label_horizontal">Total de tarjetas</label>
                            <div className="form_mg__item ptmg1">

                                <Input id="total_tarjetas" name="total_tarjetas" type="text" value={numTarjetasTotal} disabled={true}></Input>
                            </div>
                        </div>

                    </section>
                    <br/>

                    <div className="center_text_items">
                        <button className="btn_mg btn_mg__primary" style={{ width: "200px", marginRight: "15px" }} disabled={false} type="button">
                            Generar InputFile</button>

                        <button className="btn_mg btn_mg__primary" style={{ width: "200px" }} disabled={false} type="button">
                            Descargar último archivo</button>
                    </div>

                </Card>



            </div>


        </div>
    )

}