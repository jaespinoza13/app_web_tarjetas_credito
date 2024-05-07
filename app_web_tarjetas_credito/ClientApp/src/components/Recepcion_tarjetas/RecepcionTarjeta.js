import { useState, useEffect } from 'react';
import Sidebar from '../Common/Navs/Sidebar';
import Card from '../Common/Card';
import { useHistory } from 'react-router-dom';
import Table from '../Common/Table';
import Chip from '../Common/UI/Chip'
import Input from '../Common/UI/Input'
import { IsNullOrWhiteSpace } from '../../js/utiles';
import { connect } from 'react-redux';
import Textarea from '../Common/UI/Textarea';

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


function RecepcionTarjeta(props) {

    const headersTarjetasAprobadas = [
        { nombre: 'Orden', key: 0 }, { nombre: 'Identificacion', key: 1 },
        { nombre: 'Nombre', key: 2 }, { nombre: 'Tarjeta', key: 3 }, { nombre: 'Producto TC.', key: 4 }, { nombre: 'Oficina envia', key: 5 },
        { nombre: 'Oficina recepta', key: 6 }, { nombre: 'Recibido', key: 7 },
    ]


    //OBJETO SIMULADO PARA EDITAR DATOS
    const tarjetasPendientesConfirmar = [
        {
            orden: "164",
            prefijo_tarjeta: "53",
            cost_emision: "no_cobro_emision",
            descripcion: "TARJETAS SOLICITADAS PARA MES DE ABRIL",
            oficina_envia: "MATRIZ",
            oficina_recepta: "EL VALLE",
            tarjetas_receptadas: [
                { numero_tarjeta: "2500 XXXX XXXX 5646", cuenta: "410010064540", tipo_identificacion: "C", identificacion: "1150214375", ente: "189610", nombre: "DANNY VASQUEZ", nombre_impreso: "DANNY VASQUEZ", tipo: "BLACK", cupo: "8000", key: 23, Agencia: { nombre: "EL VALLE", id: "18" } },
                { numero_tarjeta: "2500 XXXX XXXX 3636", cuenta: "410010026841", tipo_identificacion: "C", identificacion: "1105970717", ente: "515145", nombre: "ROBERTH TORRES", nombre_impreso: "ROBERTH TORRES", tipo: "GOLDEN", cupo: "15000", key: 28, Agencia: { nombre: "EL VALLE", id: "18" } },
                { numero_tarjeta: "2500 XXXX XXXX 0101", cuenta: "410010061199", tipo_identificacion: "R", identificacion: "1105970712001", ente: "515146", nombre: "JUAN TORRES", nombre_impreso: "JUAN TORRES", tipo: "GOLDEN", cupo: "15000", key: 38, Agencia: { nombre: "EL VALLE", id: "18" } },
                            ]

        },
        {
            orden: "165",
            prefijo_tarjeta: "54",
            cost_emision: "cobro_emision",
            descripcion: "TARJETAS SOLICITADAS PARA MES DE MAYO",
            oficina_envia: "MATRIZ",
            oficina_recepta: "EL VALLE",
            tarjetas_receptadas: [
                { numero_tarjeta: "2500 XXXX XXXX 0214", cuenta: "410010094684", tipo_identificacion: "P", identificacion: "PL970713", ente: "515147", nombre: "LUIS TORRES", nombre_impreso: "LUIS TORRES", tipo: "ESTÁNDAR", cupo: "15000", key: 48, Agencia: { nombre: "EL VALLE", id: "18" } },
                { numero_tarjeta: "2500 XXXX XXXX 1818", cuenta: "410010061514", tipo_identificacion: "R", identificacion: "1105970714001", ente: "515148", nombre: "ROBERTH TORRES", nombre_impreso: "ROBERTH TORRES", tipo: "ESTÁNDAR", cupo: "15000", key: 58, Agencia: { nombre: "EL VALLE", id: "18" } }
            ]

        }
    ]


    const navigate = useHistory();
    const [lstOrdenPorConfirmar, setLstOrdenPorConfirmar] = useState([]);


    const [totalTarjetasReceptar, setTotalTarjetasReceptar] = useState(0);
    const [observacion, setObservacion] = useState("");
    const [tarjetasReceptadasCheckBox, setTarjetasReceptadasCheckBox] = useState([]);
    const [isSelectAll, setIsSelectAll] = useState(false);

    const seleccionMultiple = (e) => {
        toggleSelectAll();
        setIsSelectAll(!isSelectAll);
    }


    const toggleSelectAll = () => {
        setIsSelectAll(!isSelectAll);
        if (!isSelectAll) {
            const resultado = lstOrdenPorConfirmar.map((orden, indexOrden) => {
                return orden.tarjetas_receptadas.map((tarjeta, indexTarjeta) => {
                    return tarjeta.identificacion;
                });
            }).flat();
            setTarjetasReceptadasCheckBox(resultado);
        } else {
            setTarjetasReceptadasCheckBox([]);
        }
    };


    const checkTarjeta = (identificacion) => {
        if (tarjetasReceptadasCheckBox.includes(identificacion)) {
            setTarjetasReceptadasCheckBox(tarjetasReceptadasCheckBox.filter(tarjeta_identificacion => tarjeta_identificacion !== identificacion));
        } else {
            setTarjetasReceptadasCheckBox([...tarjetasReceptadasCheckBox, identificacion]);
        }

       

        //Deseleccionar todas las opciones
        if (isSelectAll && tarjetasReceptadasCheckBox.length !== totalTarjetasReceptar) {
            setIsSelectAll(false);
        }
    }

    useEffect(() => {
        console.log(tarjetasReceptadasCheckBox.length, totalTarjetasReceptar)

        setIsSelectAll(tarjetasReceptadasCheckBox.length === totalTarjetasReceptar && tarjetasReceptadasCheckBox.length !== 0);
    }, [tarjetasReceptadasCheckBox]);




  

    const setObservacionHandler = (e) => {
        setObservacion(e);
    }


    useEffect(() => {
        if (props.location.pathname !== '/confirmar_recepcion') {
            navigate.push('/orden');
        }

        setLstOrdenPorConfirmar(tarjetasPendientesConfirmar);
        const conteoTarjetas = tarjetasPendientesConfirmar.reduce((acumulador, orden) => acumulador + orden.tarjetas_receptadas.length, 0);
        setTotalTarjetasReceptar(conteoTarjetas);

        
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


    const onSubmitConfirmacionRecepcion = (e) => {
        e.preventDefault();
        if (tarjetasReceptadasCheckBox.length === 0) {
            window.alert("SELECCIONE ALMENOS UN TARJETA PARA REGISTRAR LA RECEPCION");
        } else {
            console.log("IMPLEMENTAR GUARDADO,", e);
            window.alert("SE GUARDO CORRECTAMENTE LA RECEPCION DE TARJETAS");
            //navigate.push('/orden');
        }
    };

    return (
        <div className="f-row">
            <Sidebar enlace={props.location.pathname}></Sidebar>
            <div className="container_mg">


                <Card className={["m-max justify-content-space-between align-content-center"]}>
                    <br />
                    <h2>CONFIRMAR RECEPCION DE TARJETAS</h2>
                    <br />

                    <section className="elements_two_column">
                        <h3>Número total de tarjetas pendientes a confirmar: {totalTarjetasReceptar}</h3>
                    </section>

                    <br />

                    <div className="form_mg__item ptmg1">
                        <Input id="filtradoTarjetas" type="text" value={""} disabled={true}></Input>
                    </div>


                    <form className="form_mg" onSubmit={onSubmitConfirmacionRecepcion} autoComplete="off">
                        {lstOrdenPorConfirmar.length > 0 &&
                            <div id="listado_ordenes" className="mt-3">
                                <Table headers={headersTarjetasAprobadas} multipleOpcion={true} onChangeCheckBox={seleccionMultiple} isSelectAll={isSelectAll} desactivarCheckEditar={false}
                                    indexCheckbox={7}>
                                    {lstOrdenPorConfirmar.map((item, index) => (
                                        <>
                                            {item.tarjetas_receptadas.map((tarjeta_receptar, tarjetaIndex) => (

                                                <tr key={tarjetaIndex}>
                                                    <td>{item.orden}</td>
                                                    <td>{tarjeta_receptar.identificacion}</td>
                                                    <td>{tarjeta_receptar.nombre}</td>
                                                    <td>{tarjeta_receptar.numero_tarjeta}</td>
                                                    <td><Chip type={conversionTipoTC(tarjeta_receptar.tipo)}>{tarjeta_receptar.tipo}</Chip></td>
                                                    <td>{item.oficina_envia}</td>
                                                    <td>{item.oficina_recepta}</td>
                                                    <td>
                                                        <Input key={tarjeta_receptar.identificacion} disabled={false} type="checkbox" checked={tarjetasReceptadasCheckBox.includes(tarjeta_receptar.identificacion)} setValueHandler={() => checkTarjeta(tarjeta_receptar.identificacion)}></Input>

                                                    </td>
                                                </tr>
                                            ))}
                                        </>

                                    ))}

                                </Table>
                            </div>

                        }

                        {lstOrdenPorConfirmar.length === 0 &&
                            <p style={{ fontSize: '18px' }}> <strong> No existe tarjetas por confirmar recepción. </strong> </p>
                        }


                        <div style={{ paddingTop: "15px" }}>

                            <div className="form_mg_row">
                                <label htmlFor="observacion" className="pbmg1 lbl-input label_horizontal">Observación</label>
                                <div className="form_mg__item ptmg1">
                                    <Textarea
                                        rows={5}
                                        cols={30}
                                        placeholder="Ingrese alguna observación"
                                        type="textarea"
                                        esRequerido={false}
                                        onChange={setObservacionHandler}
                                    ></Textarea>

                                    
                                </div>
                            </div>

                        </div>


                        <div className="center_text_items">
                            <button className="btn_mg btn_mg__primary" style={{ width: "200px" }} disabled={false} type="submit">
                                Confirmar recepción</button>
                        </div>
                    </form>

                </Card>



            </div>


        </div>
    )

}


export default connect(mapStateToProps, {})(RecepcionTarjeta);