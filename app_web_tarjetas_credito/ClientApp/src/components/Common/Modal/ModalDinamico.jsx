import { useState, useEffect } from "react";


const ModalDinamico = (props) => {
    const defaultType = "md";
    const [animation, setAnimation] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    let timeoutModal;
    useEffect(() => {
        if (props.modalIsVisible === true) {
            setModalVisible(true);
            timeoutModal = setTimeout(() => {
                setAnimation('modal-content-show');
            }, 200)
        }
        else if (props.modalIsVisible === false) {
            setAnimation('modal-content-hide');
            timeoutModal = setTimeout(() => {
                setModalVisible(false);
            }, 200);
        }
        return () => clearTimeout(timeoutModal);

    }, [props.modalIsVisible]);
    return (
        <div className={`modal ${modalVisible ? 'modal-show' : ''}`}>
            <div className={`modal-content modal-content-${props.type || defaultType} ${animation} sin-height`}>
                <div className="modal-header">
                    <h2 className="center_text_items">{props.titulo}</h2>
                </div>
                <div className="modal-body">
                    {props.children}
                </div>
                <div className="modal-footer">
                    <button className="btn_mg btn_mg__tertiary close-modal width_btn_close" onClick={props.onCloseClick} ><img src="Imagenes/close.svg" alt="Cerrar"></img> </button>
                </div>
            </div>
        </div>
    );
}

export default ModalDinamico;