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
import Button from '../Common/UI/Button';
import { filtrarOrdenes } from '../../js/filtros';
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


function RecepcionTarjetaAgencias(props) {

    const headersTarjetasAprobadas = [
        { nombre: 'Orden', key: 0 }, { nombre: 'Identificacion', key: 1 },
        { nombre: 'Nombre', key: 2 }, { nombre: 'Tarjeta', key: 3 }, { nombre: 'Producto TC.', key: 4 }, { nombre: 'Oficina envia', key: 5 },
        { nombre: 'Oficina recepta', key: 6 }, { nombre: 'Fecha cliente solicita', key: 7 },{ nombre: 'Recibido', key: 8 },
    ]

    const navigate = useHistory();
    const [lstOrdenPorConfirmar, setLstOrdenPorConfirmar] = useState([]);
    const [lstOrdenesRespaldo, setLstOrdenesRespaldo] = useState([]);

    const [totalTarjetasReceptar, setTotalTarjetasReceptar] = useState(0);
    const [filtroOpcion, setFiltroOpcion] = useState("-1");
    const [filtroInputValor, setFiltroInputValor] = useState("");
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
                return orden.orden_tarjetaDet
            }).flat();


            setTarjetasReceptadasCheckBox(resultado);
        } else {
            setTarjetasReceptadasCheckBox([]);
        }
    };

    const checkTarjeta = (ordenTarjetaCheck) => {

        if (tarjetasReceptadasCheckBox.includes(ordenTarjetaCheck)) {
            setTarjetasReceptadasCheckBox(tarjetasReceptadasCheckBox.filter(tarjeta_identificacion => tarjeta_identificacion !== ordenTarjetaCheck));
        } else {
            setTarjetasReceptadasCheckBox([...tarjetasReceptadasCheckBox, ordenTarjetaCheck]);
        }
        //Deseleccionar todas las opciones
        if (isSelectAll && tarjetasReceptadasCheckBox.length !== totalTarjetasReceptar) {
            setIsSelectAll(false);
        }
    }

    useEffect(() => {
        setIsSelectAll(tarjetasReceptadasCheckBox.length === totalTarjetasReceptar && tarjetasReceptadasCheckBox.length !== 0);
    }, [tarjetasReceptadasCheckBox]);


    const filtrarOrdenesHandler = () => {

        const resultSearch = filtrarOrdenes(filtroOpcion, filtroInputValor, lstOrdenesRespaldo) 
        setLstOrdenPorConfirmar(resultSearch);

    }

    useEffect(() => {
        if (props.location.pathname !== '/confirmar_recepcion') {
            navigate.push('/orden');
        }

        setLstOrdenPorConfirmar([objConfirmacionRecepcionTarjetas[1]]);
        const conteoTarjetas = [objConfirmacionRecepcionTarjetas[1]].reduce((acumulador, orden) => acumulador + orden.orden_tarjetaDet.length, 0);
        setTotalTarjetasReceptar(conteoTarjetas);

        //Respaldo de toda la consulta(Se usara para filtro opcion "TODOS"")
        setLstOrdenesRespaldo([objConfirmacionRecepcionTarjetas[1]])
        
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


    const onSubmitConfirmacionRecepcion = (e) => {
        e.preventDefault();
        if (tarjetasReceptadasCheckBox.length === 0) {
            window.alert("SELECCIONE ALMENOS UN TARJETA PARA REGISTRAR LA RECEPCION");
        } else {
            window.alert("SE GUARDO CORRECTAMENTE LA RECEPCION DE TARJETAS");
            console.log(tarjetasReceptadasCheckBox)
            //navigate.push('/orden');

        }
    };

    return (
        <div className="f-row w-100" >
            {/*<Sidebar enlace={props.location.pathname}></Sidebar>*/}
            <div className="container_mg">


                <Card className={["m-max justify-content-space-between align-content-center"]}>
                   
                    <h2 className="mt-1 mb-5">CONFIRMAR RECEPCIÓN DE TARJETAS</h2>
            
                    <div>
                        <p style={{ fontSize: " 1.1rem" }}>Filtrar: </p>
                        <div style={{ display: "flex", paddingTop: "5px" }}>
                            <select defaultValue="-1" onChange={(e) => setFiltroOpcion(e.target.value)} value={filtroOpcion}>
                                <option disabled="true" value="-1" >Seleccione alguna opción</option>
                                <option value="filtroTodos" >Todo</option>
                                <option value="filtroOrden" >Orden</option>
                                <option value="filtroIdentificacion" >Identificación</option>
                                <option value="filtroNombre" >Nombre</option>
                                <option value="filtroTarjeta" >Tarjeta</option>
                            </select>

                            <Input className="w-20 ml-1" id="filtradoTarjetas" type="text" value={filtroInputValor} setValueHandler={(valor) => setFiltroInputValor(valor)} disabled={false}></Input>
                            <Button className="btn_mg__primary ml-1" autoWidth="w-25" onClick={filtrarOrdenesHandler}>Buscar</Button>
                        </div>

                    </div>

                    <form className="form_mg" onSubmit={onSubmitConfirmacionRecepcion} autoComplete="off">
                        {lstOrdenPorConfirmar.length > 0 &&
                            <div id="listado_ordenes2" className="mt-3">
                                <Table headers={headersTarjetasAprobadas} multipleOpcion={true} onChangeCheckBox={seleccionMultiple} isSelectAll={isSelectAll} desactivarCheckEditar={false}
                                    indexCheckbox={8}>
                                    {lstOrdenPorConfirmar.map((item, index) => (
                                        <>
                                            {item.orden_tarjetaDet.map((tarjeta_receptar, tarjetaIndex) => (

                                                <tr key={`${index}${tarjetaIndex}`}>
                                                    <td>{item.orden}</td>
                                                    <td>{tarjeta_receptar.identificacion}</td>
                                                    <td>{tarjeta_receptar.nombre}</td>
                                                    <td>{tarjeta_receptar.numero_tarjeta}</td>
                                                    <td><Chip type={conversionTipoTC(tarjeta_receptar.tipo)}>{tarjeta_receptar.tipo}</Chip></td>
                                                    <td>{item.oficina_envia}</td>
                                                    <td>{item.oficina_solicita}</td>
                                                    <td>{tarjeta_receptar.fecha_cliente_solicita}</td>
                                                    <td>
                                                        <Input key={tarjeta_receptar.identificacion} disabled={false} type="checkbox" checked={tarjetasReceptadasCheckBox.includes(tarjeta_receptar)} setValueHandler={() => checkTarjeta(tarjeta_receptar)}></Input>

                                                    </td>
                                                </tr>
                                            ))}
                                        </>

                                    ))}

                                </Table>
                            </div>

                        }

                        {lstOrdenPorConfirmar.length === 0 &&
                            <p style={{ fontSize: '18px', paddingTop: "5px" }}> <strong> No existe tarjetas por confirmar recepción. </strong> </p>
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
                                        onChange={(e) => setObservacion(e)}
                                    ></Textarea>

                                    
                                </div>
                            </div>

                        </div>


                        <div className="center_text_items">
                            <button className="btn_mg btn_mg__primary" style={{ width: "200px" }} disabled={false} type="submit">
                                Confirmar recepción</button>
                        </div>
                    </form>


                    <br />
                    <br />

                    <div>
                        <h3 className={"strong"}>Número total de tarjetas pendientes a confirmar: {totalTarjetasReceptar}</h3>
                        <h3 className={"strong"}>Número de tarjetas seleccionadas: {tarjetasReceptadasCheckBox.length}</h3>
                    </div>

                </Card>



            </div>


        </div>
    )

}


export default connect(mapStateToProps, {})(RecepcionTarjetaAgencias);