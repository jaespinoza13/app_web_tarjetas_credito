import "../../../scss/main.css";
import { useState, useEffect } from "react";

const Modal = (props) => {
    const [animation, setAnimation] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    let timeoutModal;
    useEffect(() => {
        if (props.modalIsVisible === true) {
            setModalVisible(true);
            timeoutModal = setTimeout(() => {
                console.log('llega show');
                setAnimation('modal-content-show');
            }, 200)
        }
        else if (props.modalIsVisible === false) {
            setAnimation('modal-content-hide');
            timeoutModal = setTimeout(() => {
                console.log('llega hide');
                setModalVisible(false);
            }, 200);
        }
        return () => clearTimeout(timeoutModal);

    }, [props.modalIsVisible]);
    return (
        <div className={`modal ${modalVisible ? 'modal-show' : ''}`}>
            <div className={`modal-content ${animation}`}>
                <div className="modal-header">
                    <h2>{props.titulo}</h2>
                </div>
                <div className="modal-body">
                    {props.children}
                </div>
                <div className="modal-footer">
                    <button className="btn_mg btn_mg__secondary"  onClick={props.onCloseClick} >Cerrar</button>
                    <button className="btn_mg btn_mg__primary" disabled={props.isBtnDisabled} onClick={props.onNextClick}>Siguiente</button>
                </div>
            </div>
        </div>
    );
}

export default Modal;