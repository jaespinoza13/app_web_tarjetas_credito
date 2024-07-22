
import { useState, useEffect } from 'react';
import Sidebar from '../Common/Navs/Sidebar';
import Card from '../Common/Card';
import { useHistory } from 'react-router-dom';
import Table from '../Common/Table';
import Chip from '../Common/UI/Chip'
import Input from '../Common/UI/Input'
import { IsNullOrWhiteSpace, conversionTipoTC } from '../../js/utiles';
import { connect } from 'react-redux';
import Button from '../Common/UI/Button';
import { filtrarOrdenes } from '../../js/filtros';
import { objConfirmacionRecepcionTarjetas } from './ObjetosMock'

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


function OrdenRecibirProveedor(props) {

    const headersTarjetasAprobadas = [
        { nombre: 'Orden', key: 0 }, { nombre: 'Identificación', key: 1 }, { nombre: 'Nombre solicitante', key: 2 }, { nombre: 'Tarjeta', key: 3 },
        { nombre: 'Producto TC', key: 4 }, { nombre: 'Oficina recepta', key: 5 }, { nombre: 'Oficina solicitante', key: 6 }, { nombre: 'Fecha solicita cliente', key: 7 },
        { nombre: 'Estado Tarjeta', key: 8 },
    ]

    const navigate = useHistory();
    const [lstTarjetasRecibirProveedor, setLstTarjetasRecibirProveedor] = useState([]);
    const [lstTarjetasRespaldo, setLstTarjetasRespaldo] = useState([]);

    const [totalTarjetasReceptar, setTotalTarjetasReceptar] = useState(0);
    const [filtroOpcion, setFiltroOpcion] = useState("-1");
    const [filtroInputValor, setFiltroInputValor] = useState("");
    const [tarjetasReceptadasCheckBox, setTarjetasReceptadasCheckBox] = useState([]);
    const [isSelectAll, setIsSelectAll] = useState(false);

    const seleccionMultiple = (e) => {
        toggleSelectAll();
        setIsSelectAll(!isSelectAll);
    }


    const toggleSelectAll = () => {
        setIsSelectAll(!isSelectAll);
        if (!isSelectAll) {

            const resultado = lstTarjetasRecibirProveedor.map((orden, indexOrden) => {
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

        const resultSearch = filtrarOrdenes(filtroOpcion, filtroInputValor, lstTarjetasRespaldo)
        setLstTarjetasRecibirProveedor(resultSearch);

    }

    useEffect(() => {
        if (props.location.pathname !== '/recibir_orden_proveedor') {
            navigate.push('/orden');
        }

        //OBJETO MOCK TRAER CONSULTA A LA BASE
        setLstTarjetasRecibirProveedor(objConfirmacionRecepcionTarjetas);


        const conteoTarjetas = objConfirmacionRecepcionTarjetas.reduce((acumulador, orden) => acumulador + orden.orden_tarjetaDet.length, 0);
        setTotalTarjetasReceptar(conteoTarjetas);

        //Respaldo de toda la consulta(Se usara para filtro opcion "TODOS"")
        setLstTarjetasRespaldo(objConfirmacionRecepcionTarjetas)

    }, [])



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

                    <h2 className="mt-1 mb-5">RECIBIR ORDEN DE TARJETAS</h2>

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
                    {/*   */}
                    <form className="form_mg" onSubmit={onSubmitConfirmacionRecepcion} autoComplete="off">
                        {lstTarjetasRecibirProveedor.length > 0 &&
                            <div id="listado_ordenes" className="mt-3">
                                <Table headers={headersTarjetasAprobadas} multipleOpcion={true} onChangeCheckBox={seleccionMultiple} isSelectAll={isSelectAll} indexCheckbox={8}
                                    desactivarCheckEditar={false}>

                                    {lstTarjetasRecibirProveedor.map((item, index) => (
                                        <>
                                            {item.orden_tarjetaDet.map((tarjeta_receptar, tarjetaIndex) => (

                                                <tr key={tarjeta_receptar.id_tarjeta}>
                                                    <td>{item.orden}</td>
                                                    <td>{tarjeta_receptar.identificacion}</td>
                                                    <td>{tarjeta_receptar.nombre}</td>
                                                    <td>{tarjeta_receptar.numero_tarjeta}</td>
                                                    <td><Chip type={conversionTipoTC(tarjeta_receptar.tipo)}>{tarjeta_receptar.tipo}</Chip></td>
                                                    <td>{item.oficina_envia}</td>
                                                    <td>{item.oficina_solicita}</td>
                                                    <td>{item.fecha_creacion}</td>
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

                        {lstTarjetasRecibirProveedor.length === 0 &&
                            <p style={{ fontSize: '18px', paddingTop: "5px" }}> <strong> No existe tarjetas pendientes de receptar por envío del proveedor. </strong> </p>
                        }



                        <div className="center_text_items">
                            <button className="btn_mg btn_mg__primary" style={{ width: "200px" }} disabled={false} type="submit">
                                Confirmar recepción</button>
                        </div>
                    </form>


                    {/*<div>*/}
                    {/*    <h3 className={"strong"}>Número total de tarjetas pendientes a confirmar: {totalTarjetasReceptar}</h3>*/}
                    {/*    <h3 className={"strong"}>Número de tarjetas seleccionadas: {tarjetasReceptadasCheckBox.length}</h3>*/}
                    {/*</div>*/}

                </Card>



            </div>


        </div>
    )

}


export default connect(mapStateToProps, {})(OrdenRecibirProveedor);