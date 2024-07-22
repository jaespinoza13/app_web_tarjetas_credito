import { useState } from 'react';
import Sidebar from '../Common/Navs/Sidebar';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import Card from '../Common/Card';
import Button from '../Common/UI/Button';
import { IsNullOrWhiteSpace, base64ToBlob, descargarArchivo, generarFechaHoy, verificarPdf } from '../../js/utiles';
import "../../css/Components/Reprocesar.css";
import AccordionV2 from '../Common/UI/AccordionV2';
import Input from '../Common/UI/Input';
import Table from '../Common/Table';
import Chip from '../Common/UI/Chip';


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


function Reprocesar(props) {

    const navigate = useHistory();
    const dispatch = useDispatch();
    const [inputBusqueda, setInputBusqueda] = useState([]);


    const ordenes = [
        { oficina: "1", fecha_error: "01/01/2024", num_total_tarjetas: 30, num_tarjetas_error: 3  },
        { oficina: "2", fecha_error: "05/01/2024", num_total_tarjetas: 20, num_tarjetas_error: 1 },
        { oficina: "3", fecha_error: "06/01/2024", num_total_tarjetas: 15, num_tarjetas_error: 0 },
    ]

    const clientes = [
        { cedula: "1150214370", nombres: "DANNY VASQUEZ", tipo_tarjeta: "BLACK", tipo_producto : "Principal"},
        { cedula: "1101898147", nombres: "NICOLE ALBAN", tipo_tarjeta: "ESTÁNDAR", tipo_producto: "Principal" },
        { cedula: "0181568681", nombres: "SEBASTIAN RIOFRIO", tipo_tarjeta: "GOLD", tipo_producto: "Principal" }
    ]

    const headersTarjetas = [{ key: 0, nombre: "Identificación" }, { key: 1, nombre: "Nombre del titular" }, { key: 2, nombre: "Fecha proceso" }, { key: 3, nombre: "Tipo de tarjeta" }, { key: 4, nombre: "Tipo de producto" }, { key: 5, nombre: "Oficina" }, { key: 6, nombre: "Error presentado" }, { key: 7, nombre: "" }]

    const tarjetas = [
        { ente: "15188", cedula: "1101898147", nombres: "NICOLE ALBAN", tipo_producto: "ESTÁNDAR", fecha_proceso: "12/07/2024 22:30", oficina_solicita: "MATRIZ", tipo_tarjeta: "Principal", error_proceso: "ERROR EN PROCESAMIENTO DE LA INFORMACIÓN" },
        { ente: "49456", cedula: "1150214370", nombres: "DANNY VASQUEZ", tipo_producto: "GOLD", fecha_proceso: "12/07/2024 22:30", oficina_solicita: "ALAMOR", tipo_tarjeta: "Principal", error_proceso: "ERROR LIMITE DE CREDITO" },
        { ente: "84684", cedula: "0111978465", nombres: "LUIS CONDE", tipo_producto: "BLACK", fecha_proceso: "12/07/2024 22:30", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal", error_proceso: "ERROR LIMITE DE CREDITO" },
        { ente: "95464", cedula: "1106849276", nombres: "SAMANTA CARRION", tipo_producto: "ESTÁNDAR", fecha_proceso: "13/07/2024 15:35", oficina_solicita: "MATRIZ", tipo_tarjeta: "Principal", error_proceso: "ERROR EN CORREO PERSONAL" },
        { ente: "11546", cedula: "0681486841", nombres: "FULANITO CABRERA", tipo_producto: "GOLD", fecha_proceso: "13/07/2024 15:35", oficina_solicita: "AGENCIA NORTE", tipo_tarjeta: "Principal", error_proceso: "ERROR EN INFORMACION DEL TITULAR" },
        { ente: "186424", cedula: "1954984972", nombres: "MARTHA PINEDA", tipo_producto: "ESTÁNDAR", fecha_proceso: "14/07/2024 17:30", oficina_solicita: "AGENCIA NORTE", tipo_tarjeta: "Principal", error_proceso: "ERROR EN PROCESAMIENTO DE LA INFORMACIÓN" },
        { ente: "2298", cedula: "0981864365", nombres: "PIEDA TOLEDO", tipo_producto: "GOLD", fecha_proceso: "14/07/2024 17:30", oficina_solicita: "ALAMOR", tipo_tarjeta: "Principal", error_proceso: "ERROR EN TASA DE INTERES" },
        { ente: "6849", cedula: "1104732936", nombres: "LEO MONTALVAN", tipo_producto: "BLACK", fecha_proceso: "12/07/2024 22:30", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal", error_proceso: "ERROR LIMITE DE CREDITO" },
        { ente: "97678", cedula: "0515846844", nombres: "LUISA VALDEZ", tipo_producto: "ESTÁNDAR", fecha_proceso: "12/07/2024 16:30", oficina_solicita: "AGENCIA NORTE", tipo_tarjeta: "Principal", error_proceso: "ERROR LIMITE DE CREDITO" },
        { ente: "15864", cedula: "0849655446", nombres: "MARIA ORTEGA", tipo_producto: "GOLD", fecha_proceso: "12/07/2024 16:30", oficina_solicita: "ALAMOR", tipo_tarjeta: "Principal", error_proceso: "ERROR EN INFORMACION DEL TITULAR" },

    ]


    const [tarjetasCheckBox, setTarjetaCheckBox] = useState([]);

    const [isSelectAll, setIsSelectAll] = useState(false);



    const seleccionMultiple = () => {
        toggleSelectAll(!isSelectAll);
        setIsSelectAll(!isSelectAll)
    }

    const toggleSelectAll = (checkAll) => {
        if (checkAll) {
            const resultado = tarjetas.map((orden, indexOrden) => {
                return orden.ente
            }).flat();
            setTarjetaCheckBox(resultado);
        } else {
            setTarjetaCheckBox([]);
        }
    };

    const checkTarjeta = (ordenCheck) => {
        if (tarjetasCheckBox.includes(ordenCheck)) {
            setTarjetaCheckBox(tarjetasCheckBox.filter(ordenItem => ordenItem !== ordenCheck));
        } else {
            setTarjetaCheckBox([...tarjetasCheckBox, ordenCheck]);
        }
        //Deseleccionar todas las opciones
        if (isSelectAll && tarjetasCheckBox.length !== tarjetas.length) {
            setIsSelectAll(false);
        }
        
    }
    useEffect(() => {
        console.log(tarjetasCheckBox)
        setIsSelectAll(tarjetasCheckBox.length === tarjetas.length && tarjetasCheckBox.length !== 0);
    }, [tarjetasCheckBox]);


    return (
        <div className="f-row w-100" >
            {/*<Sidebar enlace={props.location.pathname}></Sidebar>*/}
            <div className="container_mg">
         
                <h2 className="mt-5 mb-3">Reprocesar</h2>

                <div className='row w-100'>

                    <div style={{ display: "flex", flexDirection: "column" }}>

                        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>

                            <div className="m-2" style={{ display: "flex", flexDirection: "column", width: "25%", marginRight: "10px"}}>
                                <Card >
                                    <img style={{ width: "25px" }} src="Imagenes/credit_card_FILL0_wght300_GRAD0_opsz24.svg" alt="Generar órdenes"></img>
                                    <h4 className="mt-2">Órdenes</h4>
                                    <h5 className="mt-2">Generar las órdenes</h5>
                                    <Button autoWidth tabIndex="3" className={["btn_mg btn_mg__primary mt-2"]} disabled={false}>Extraer órdenes</Button>
                                </Card>
                            </div>                           

                        </div>

                    </div>

                </div>


                <div className="f-row w-100" style={{ display: "flex", justifyContent: "right", paddingRight: "30px" }}>
                    <div className="input-wrapper">
                        <Input className="w-20 ml-1 inputBusqueda" id="buscarOrden" type="text" disabled={false} value={inputBusqueda } setValueHandler={(e) => setInputBusqueda(e)}  placeholder={"Buscar"}></Input>
                        <img className="input-icon icon" src="Imagenes/search.svg" alt="Buscar"></img>
                    </div>

                    <div className="input-fitro">
                        <img className="input-icon icon" src="Imagenes/filter.svg" alt="Filtrar"></img>
                    </div>                    
                </div>

                <div className="contentTableOrden mt-3 mb-3">
                    <Table headers={headersTarjetas}
                        indexCheckbox={7}
                        isSelectAll={isSelectAll}
                        onChangeCheckBox={seleccionMultiple}
                        multipleOpcion={true}

                    >
                        {/*BODY*/}
                        {tarjetas.map((tarjetaItem, index) => {
                            return (
                                <tr key={tarjetaItem.cedula}>
                                    <td>{tarjetaItem.cedula}</td>
                                    <td>{tarjetaItem.nombres}</td>
                                    <td>{tarjetaItem.fecha_proceso}</td>
                                    <td>{tarjetaItem.tipo_tarjeta}</td>
                                    <td><Chip type={tarjetaItem.tipo_producto}>{tarjetaItem.tipo_producto}</Chip></td>
                                    <td>{tarjetaItem.oficina_solicita}</td>
                                    <td>{tarjetaItem.error_proceso}</td>
                                    <td>
                                        <Input key={tarjetaItem.cedula} disabled={false} type="checkbox"
                                            checked={tarjetasCheckBox.includes(tarjetaItem.ente)}
                                            setValueHandler={() => checkTarjeta(tarjetaItem.ente)} ></Input>

                                    </td>
                                </tr>
                            );
                        })}
                    </Table>
                </div>


                {/*<div className="contentTableOrden mt-3">*/}
                {/*    <table className='table-accordion'>*/}
                {/*        <thead className='thead-accordion'>*/}
                {/*            <tr>*/}
                {/*                <th className='paddingSpacing'>*/}
                {/*                    <div className="w-95 f-row">*/}
                {/*                        <div className='content-headertable' >*/}
                {/*                            <div style={{ width: "40px" }} >*/}
                                                
                {/*                            </div>*/}

                {/*                            <div style={{ width: "20%" }} >*/}
                {/*                                <h4 className="item-header">TOTAL DE ERRORES</h4>*/}
                {/*                            </div>*/}
                {/*                            <div style={{ width: "20%" }} >*/}
                {/*                                <h4 className="item-header">REPROCESAR</h4>*/}
                {/*                            </div> */}


                                 

                {/*                        </div>*/}

                {/*                    </div>*/}
                                    
                {/*                </th>*/}
                {/*            </tr>*/}
                {/*        </thead>*/}

                {/*        <tbody className="scroll-body">*/}

                {/*            {ordenes.map(orden => {*/}

                {/*                let textoTitulo = (*/}
                {/*                    <div className="w-95 f-row">*/}
                {/*                        <div className='content-headertable' >*/}
                {/*                            <div style={{ width: "20%" }} > */}
                {/*                                <h4 className="item-header">{orden.oficina}</h4>*/}
                {/*                            </div>*/}
                {/*                            <div style={{ width: "20%" }} >*/}
                {/*                                <h4 className="item-header">{orden.num_tarjetas_error}</h4>*/}
                {/*                            </div>      */}
                {/*                            <div style={{ width: "20%" }} >*/}
                {/*                                <input type="checkbox" name={orden.orden} />*/}
                {/*                            </div> */}
                {/*                        </div>*/}

                {/*                    </div>*/}

                {/*                );*/}
    

                {/*                return (*/}
                {/*                    <tr key={orden.orden}>*/}
                {/*                        <td className='paddingSpacing'>*/}
                {/*                            <AccordionV2 title={textoTitulo}>*/}
                {/*                                <table className='table-accordion2' style={{ overflowY: "hidden" }}>*/}
                {/*                                    <thead className='thead-accordion2'>*/}
                {/*                                        <tr>*/}
                {/*                                            <th className='paddingSpacing colorHeaderTable2'>Identificación</th>*/}
                {/*                                            <th className='paddingSpacing colorHeaderTable2'>Nombre del titular</th>*/}
                {/*                                            <th className='paddingSpacing colorHeaderTable2'>Tipo de producto</th>*/}
                {/*                                            <th className='paddingSpacing colorHeaderTable2'>Tipo de tarjeta</th>*/}
                {/*                                            <th className='paddingSpacing colorHeaderTable2'> </th>*/}
                {/*                                        </tr>*/}
                {/*                                    </thead>*/}
                {/*                                    <tbody style={{ overflowY: "hidden" }}>*/}
                {/*                                        {clientes.map(cliente => {*/}
                {/*                                            return (*/}
                {/*                                                <tr key={cliente.cedula}>*/}
                {/*                                                    <td className='paddingSpacing'>{cliente.cedula}</td>*/}
                {/*                                                    <td className='paddingSpacing'>{cliente.nombres}</td>*/}
                {/*                                                    <td className='paddingSpacing'>{cliente.tipo_producto}</td>*/}
                {/*                                                    <td className='paddingSpacing'>{cliente.tipo_tarjeta}</td>*/}
                {/*                                                    <td className='paddingSpacing'>*/}
                {/*                                                        <input type="checkbox" name={cliente.cedula} />*/}
                {/*                                                    </td>*/}

                {/*                                                </tr>*/}
                {/*                                            )*/}
                {/*                                        })}*/}
                {/*                                    </tbody>*/}
                {/*                                </table>*/}

                {/*                            </AccordionV2>*/}
                {/*                        </td>*/}
                {/*                    </tr>*/}
                {/*                )*/}
                {/*            })}*/}
                {/*        </tbody>*/}
                {/*    </table>*/}
                {/*</div>*/}

                <div className='row w-100 mt-2 f-row justify-content-center'>
                    <Button className="btn_mg__primary" disabled={false}>Reprocesar</Button>
                </div>


            </div>
        </div>
    )

}

export default connect(mapStateToProps, {})(Reprocesar);