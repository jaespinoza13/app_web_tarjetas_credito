import Table from '../Table';
import ModalDinamico from '../Modal/Modal_dinamico';
import Textarea from './Textarea'
import '../../../scss/main.css';


const TableWithTextArea = (props) => {


    return (
        <>
            <ModalDinamico
                modalIsVisible={props.modalIsVisible}
                titulo={props.titulo}
                onCloseClick={props.onCloseClick}
                isBtnDisabled={props.isBtnDisabled}
                type={props.type}
                onCancelarModal={props.onCancelarModal }
            >
                {props.modalIsVisible && <div>

                    <div className="table-container">
                        <form onSubmit={props.onSubmitComentarios  } >
                        
                            <Table headers={props.headers} className="responsive-table">

                                {props.body.map((data, index) => (
                                    <tr key={data.key}>
                                        <td>{data.tipo}</td>
                                        <td>{data.descripcion}</td>
                                        <td>
                                            <Textarea
                                                rows={5}
                                                cols={30}
                                                placeholder="Ingrese un detalle"
                                                value={data.detalle}
                                                type="textarea"
                                                esRequerido={ true }
                                                onChange={(e) => props.onChangeTable(e, data.key)}
                                            ></Textarea>
                                        </td>

                                    </tr>
                                ))}

                            </Table>
           
                            <div className="row center_text_items">
                                <button className="btn_mg btn_mg__primary mt-2" disabled={props.isBtnDisabled} type="submit">Guardar</button>
                                <button className="btn_mg btn_mg__secondary mt-2 " onClick={(e) => { e.preventDefault(); props.onCancelarModal(); }}>"Cancelar"</button>
                            </div>
                        </form>
                        
                    </div>
                </div>}
            </ModalDinamico>
        </>
    );

}

export default TableWithTextArea;