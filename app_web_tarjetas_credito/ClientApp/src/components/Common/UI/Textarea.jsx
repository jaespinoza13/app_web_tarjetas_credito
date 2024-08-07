import { useState } from "react";
import { useEffect } from "react";

const Textarea = (props) => {
    //Filas del text Area comentarioAdicional
    const [filasTextAreaComentarioSol, setFilasTextAreaComentarioSol] = useState(3); //TODO: Mejorar para pasar por parametro
    const [anchoCampo, setAnchoCampo] = useState(75); //TODO: Mejorar para establecer el ancho de caracteres segun tamaño de los input 
    const [numFilasXAnchoCampo, setNumFilasXAnchoCampo] = useState(0);
    const [controlAnchoCampo, setControlAnchoCampo] = useState(false);

    //Control para el numero de filas del text area
    /*useEffect(() => {
        let filasActuales = props.value.split('\n');
        if (filasActuales.length >= 3) setFilasTextAreaComentarioSol(filasActuales.length + 1);
        else if (filasActuales.length < 3) setFilasTextAreaComentarioSol(3);
    }, [props.value])*/


    useEffect(() => {
        let filasActuales = props.value.split('\n');
        if (filasActuales.length >= 3 && props.controlAnchoTexArea === false) setFilasTextAreaComentarioSol(filasActuales.length + 1);
        if (anchoCampo !== null && props.value.length > anchoCampo && props.controlAnchoTexArea === true) {
            let filasXancho = Math.floor(props.value.length / anchoCampo);
            if (numFilasXAnchoCampo !== filasXancho ){
                setNumFilasXAnchoCampo(filasXancho);
                setControlAnchoCampo(true);
            }          
        }
        else if (filasActuales.length < 3 && props.controlAnchoTexArea === false) setFilasTextAreaComentarioSol(3);
    }, [props.value, anchoCampo, controlAnchoCampo])


    useEffect(() => {
        if (controlAnchoCampo) {
            setFilasTextAreaComentarioSol(prevFilasActuales => prevFilasActuales + numFilasXAnchoCampo);
            setControlAnchoCampo(false);
        }
    }, [controlAnchoCampo, numFilasXAnchoCampo]);




    const textareaHandler = (e) => {
        /*
        if (anchoCampo !== null && anchoCampo !== 0) {
            setAnchoCampo(e.target.offsetWidth);
            console.log("ANCHJO ", e.target.offsetWidth)
        } */     

        props.onChange(e.target.value);
    }

    return <textarea
        className={props.value === '' ? 'no_valido' : ''} id={props.id} name={props.name}
        placeholder={props.placeholder} rows={filasTextAreaComentarioSol} value={props.value} onChange={textareaHandler}
        required={props.esRequerido === null ? false : props.esRequerido} readOnly={props.readOnly}>{props.children}

    </textarea>
}

export default Textarea;