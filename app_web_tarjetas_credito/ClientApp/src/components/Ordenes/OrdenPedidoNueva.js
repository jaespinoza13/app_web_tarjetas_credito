import { useState, useEffect } from 'react';
import Sidebar from '../Common/Navs/Sidebar';
import Card from '../Common/Card';
import { useHistory } from 'react-router-dom';
import Input from '../Common/UI/Input'
import { IsNullOrWhiteSpace, conversionTipoTC } from '../../js/utiles';
import { connect, useDispatch } from 'react-redux';
import { tarjetasCreadasSalidaMock } from './ObjetosMock'
import TransferList from '../Common/TransferList';




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


function OrdenPedidoNueva(props) {


    const dispatch = useDispatch();

    const headersTarjetasAprobadas = [
        { nombre: 'Solicitud', key: 0 }, { nombre: 'Identificación', key: 1 }, { nombre: 'Nombre solicitante', key: 2 }, { nombre: 'Tarjeta', key: 3 },
        { nombre: 'Producto TC', key: 4 }, { nombre: 'Oficina recepta', key: 5 }, { nombre: 'Oficina solicitante', key: 6 }, { nombre: 'Fecha solicita cliente', key: 7 },
        { nombre: 'Estado Tarjeta', key: 8 },
    ]


    //Headers y Body TextArea
    const headersTable_multiple = [
        { nombre: "Tarjetas pendientes de envío", key: 0 }
    ]

    const headersTable_multipleAgg = [
        { nombre: "Tarjetas listas para envío/entrega", key: 0 }
    ]


    const navigate = useHistory();
    const [nrOrdenPedido, setNrOrdenPedido] = useState();
    const [agenciaDestino, setAgenciaDestino] = useState("-1");
    const [resultListTransfer, setResultListTransfer] = useState([]);
        const [lstTarjetasCreadasPendienteEntrega, setLstTarjetasCreadasPendienteEntrega] = useState([]);


    const [lstTarjetasAprobCreadas, stLstTarjetasAprobCreadas] = useState([]);


    useEffect(() => {
       /* if (props.location.pathname !== '/crear_suborden') {
            return navigate.push('/orden');
        }*/
        // LLamar a tarjetas creadas para que sean asignadas a una cantidad del stock
        //stLstTarjetasAprobCreadas(ordenTarjetasCreadasMock);

        const listadoPendiente = tarjetasCreadasSalidaMock;
       // console.log(listadoPendiente)


        //setLstTarjetasCreadasPendienteEntrega(MapeoTransferList(tarjetasCreadasSalidaMock));
    }, [])



    const agenciaDestinoHandler = (e) => {
        setAgenciaDestino(e.target.value);
        //TODO: PETICION BACK PARA BUSCAR TARJETAS PENDIENTES POR AGENCIA A RECEPTAR
        const listTarjetasParaEnvioAgencia = tarjetasCreadasSalidaMock.filter(tarjeta => tarjeta.solicitud_pertenece.oficina_recepta.toLowerCase() === e.target.value.toLowerCase());
        setLstTarjetasCreadasPendienteEntrega(MapeoTransferList(listTarjetasParaEnvioAgencia));
    }




    const setResultListTransferHandler = (array) => {
        //console.log("resultado", array);
        setResultListTransfer(array)
        console.log(array)
    }




    const onSubmitOrdenPedido = (e) => {
        e.preventDefault();
      
    };


    function MapeoTransferList(tarjetasPendientes) {
        const result = tarjetasPendientes.map(tarjeta => {

/*<br>HOLA MUNDO  <h1> ${tarjeta.nombre} </h1>*/

            var itemCard =
                `
                     
            <div>
                
                <div class="row"> <div style=" padding-left: 20px;""><p style="font-size: 15px"><strong>Tarjeta:&ensp;&ensp;&ensp;</p></strong> </div>  ${tarjeta.numero_tarjeta}   </div>
                <div class="row"> <div style=" padding-left: 20px"><p style="font-size: 15px"><strong>Nombre:&ensp;&ensp;</p></strong>  </div>  ${tarjeta.nombre}   </div>
                <div class="row"> <div style=" padding-left: 20px"><p style="font-size: 15px"><strong>Tipo:&ensp;&ensp;&ensp;&ensp;&ensp;</p></strong>  </div>  ${tarjeta.tipo}   </div>
                <div class="row"> <div style=" padding-left: 20px"><p style="font-size: 15px"><strong>Tipo:&ensp;&ensp;&ensp;&ensp;&ensp;</p></strong>  </div>  ${tarjeta.solicitud_pertenece.oficina_recepta}   </div>
                
            </div>`;

            return (
                {
                    id: tarjeta.id_tarjeta,
                    //nombre: itemCard
                    nombre: <div dangerouslySetInnerHTML={{ __html: itemCard }} />,
                    informacion: tarjeta

                }
            )
        })
        return result;
    }

    return (
        <div className="f-row">
            <Sidebar enlace={"orden"}></Sidebar>
            <div className="container_mg">


                <Card className={["m-max justify-content-space-between align-content-center"]}>

                    <div className="row" >
                        <h2 className="mt-1 mb-5">CREAR ORDEN DE ENVÍO DE TARJETAS (AGENCIAS/MATRIZ)</h2><h3 style={{ paddingTop: "3px", marginTop: "5px"}}> (AGENCIAS/MATRIZ)</h3>
                    </div>
                    

                    <form className="form_mg" onSubmit={onSubmitOrdenPedido} autoComplete="off">
                        <section className="elements_two_column">
                            <div>

                                <div className="form_mg_row">
                                    <label htmlFor="numOrdenTarjetas" className="pbmg1 lbl-input label_horizontal">Número de orden</label>
                                    <div className="form_mg__item ptmg1">

                                        <Input id="numOrdenTarjetas" name="numOrdenTarjetas" esRequerido={true} type="text" value={nrOrdenPedido} placeholder="Número de orden" setValueHandler={(e) => setNrOrdenPedido(e)}></Input>
                                    </div>
                                </div>

                            </div>

                            <div>

                                <div className="form_mg_row">
                                    <label htmlFor="tipoOrden" className="pbmg1 lbl-input label_horizontal">Tipo de Orden</label>
                                    <div className="form_mg__item ptmg1">

                                        <Input id="tipoOrden" name="tipoOrden" type="text" value={"ENVIO"} disabled={true}></Input>
                                    </div>
                                </div>

                            </div>


                            <div>
                                <div className="form_mg_row">
                                    <label htmlFor="agencia_destino" className="pbmg1 lbl-input label_horizontal">Agencia destino</label>
                                    <div className="form_mg__item ptmg1">

                                    
                                        <div className="form_mg__item ptmg1">
                                            <select id="agencia_destino" name="agencia_destino" defaultValue={"-1"} onChange={agenciaDestinoHandler} value={agenciaDestino} disabled={false}>
                                                <option value="-1" disabled={true}>----- SELECCIONE AGENCIA A ENVIAR-----</option>
                                                <option value="MATRIZ">MATRIZ</option>
                                                <option value="SARAGURO">SARAGURO</option>
                                                <option value="CATAMAYO">CATAMAYO</option>
                                                <option value="CARIAMANGA">CARIAMANGA</option>
                                                <option value="ALAMOR">ALAMOR</option>
                                                <option value="ZAMORA">ZAMORA</option>
                                                <option value="CUENCA">CUENCA</option>
                                                <option value="AGENCIA NORTE">AGENCIA NORTE</option>
                                                <option value="MACARA">MACARA</option>
                                                <option value="AGENCIA SUR">AGENCIA SUR</option>
                                                <option value="AGENCIA YANTZAZA">AGENCIA YANTZAZA</option>
                                                <option value="BALSAS">BALSAS</option>
                                                <option value="CATACOCHA">CATACOCHA</option>
                                                <option value="SANTA ROSA">SANTA ROSA</option>
                                                <option value="AGENCIA GUALAQUIZA">AGENCIA GUALAQUIZA</option>
                                                <option value="AGENCIA CUARTO CENTENARIO">AGENCIA CUARTO CENTENARIO</option>
                                                <option value="AGENCIA ZUMBA">AGENCIA ZUMBA</option>
                                                <option value="AGENCIA EL VALLE">AGENCIA EL VALLE</option>
                                                <option value="AGENCIA MACHALA">AGENCIA MACHALA</option>
                                                <option value="AGENCIA EL EJIDO">AGENCIA EL EJIDO</option>
                                                <option value="AGENCIA LATACUNGA">AGENCIA LATACUNGA</option>
                                                <option value="AGENCIA SANTO DOMINGO">AGENCIA SANTO DOMINGO</option>
                                            </select>
                                        </div>


                                    </div>
                                </div>
                         
                            </div>

                           
                        </section>

                        <div>

                            <TransferList
                                headersTableN1={headersTable_multiple}
                                headersTableN2={headersTable_multipleAgg}
                                datos={lstTarjetasCreadasPendienteEntrega}
                                isActiveBtnCambiarTodos={true}
                                setResultadoArray={setResultListTransferHandler}
                            ></TransferList>

                        </div>


                        <div className="center_text_items ptmg1">
                            <button className="btn_mg btn_mg__primary" style={{ width: "200px" }} disabled={false} type="submit">
                                Enviar</button>
                        </div>
                    </form>



                </Card>



            </div>


        </div>
    )

}


export default connect(mapStateToProps, {})(OrdenPedidoNueva);