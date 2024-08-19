import { useState, useEffect } from "react";

const Modal = (props) => {
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
            <div className={`modal-content modal-content-${props.type || defaultType} ${animation} mb-2`}>
                <div className="modal-header">
                    <h2>{props.titulo}</h2>
                </div>
                <div className="modal-body">
                    {props.children}
                </div>
                <div className="modal-footer">                    
                    <button className="btn_mg btn_mg__tertiary btn_mg__auto close-modal"  onClick={props.onCloseClick} ><img src="Imagenes/close.svg"></img> </button>
                    <button className="btn_mg btn_mg__primary" disabled={props.isBtnDisabled} onClick={props.onNextClick}>{props.mainText || "Siguiente"}</button>
                </div>
            </div>
        </div>
    );
}

export default Modal;


