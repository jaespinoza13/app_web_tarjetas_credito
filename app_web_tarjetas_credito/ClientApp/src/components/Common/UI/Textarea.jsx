import { useRef, useState } from "react";
import { useEffect } from "react";

const Textarea = (props) => {
    const textareaRef = useRef(null);
    //Filas del text Area comentarioAdicional
    const [filasTextAreaComentarioSol, setFilasTextAreaComentarioSol] = useState(props.rows ? props.rows: 3); 
    const [filasTextMax, setFilasTextMax] = useState(props.rowsMax ? props.rowsMax : 7);
    const [anchoCampo, setAnchoCampo] = useState(75); 
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
        if (filasTextMax && props.rows) {
            setFilasTextAreaComentarioSol(props.rows);
        }
        else if (anchoCampo !== null && props.value.length > anchoCampo && props.controlAnchoTexArea === true) {
            let filasXancho = Math.floor(props.value.length / anchoCampo);
            if (numFilasXAnchoCampo !== filasXancho) {
                setNumFilasXAnchoCampo(filasXancho);
                setControlAnchoCampo(true);
            }
        }
        else if (filasActuales.length < 3 && props.controlAnchoTexArea === false) setFilasTextAreaComentarioSol(3);
    }, [props.value, anchoCampo, controlAnchoCampo])
    
    /*
    useEffect(() => {
        let filasActuales = props.value.split('\n');
        if (filasActuales.length >= 3 && (props.controlAnchoTexArea === false || IsNullOrEmpty(props.controlAnchoTexArea))) setFilasTextAreaComentarioSol(filasActuales.length + 1);
        if (anchoCampo !== null && props.controlAnchoTexArea === true && textareaRef.current.rows <= filasTextMax) {
            let filasXancho = Math.floor(props.value.length / anchoCampo);
            if (numFilasXAnchoCampo !== filasXancho) {
                setNumFilasXAnchoCampo(filasXancho);
                setControlAnchoCampo(true);
            }          

        }
        else if (filasActuales.length < 3 && (props.controlAnchoTexArea === false || IsNullOrEmpty(props.controlAnchoTexArea))) setFilasTextAreaComentarioSol(3);
    }, [props.value, anchoCampo, controlAnchoCampo])
    */
    
    useEffect(() => {
        if (controlAnchoCampo && props.rowsMax === null) {
            setFilasTextAreaComentarioSol(prevFilasActuales => prevFilasActuales + numFilasXAnchoCampo);
            setControlAnchoCampo(false);
        }
    }, [controlAnchoCampo, numFilasXAnchoCampo]);
    
    


    const textareaHandler = (e) => {
        const newValue = e.target.value;
        /*
        if (anchoCampo !== null && anchoCampo !== 0) {
            setAnchoCampo(e.target.offsetWidth);
            console.log("ANCHJO ", e.target.offsetWidth)
        } */

        if (props.maxlength !== undefined && newValue.length <= props.maxlength && props.max === undefined) {
            props.onChange(e.target.value);
        } else if (props.maxlength === undefined && props.max === undefined) {
            props.onChange(e.target.value);
        }


    }

    return <textarea
        ref={textareaRef} 
        className={props.value === '' ? 'no_valido' : ''} id={props.id} name={props.name}
        placeholder={props.placeholder} rows={filasTextAreaComentarioSol} value={props.value} onChange={textareaHandler}
        required={props.esRequerido === null ? false : props.esRequerido} readOnly={props.readOnly}
        style={{ overflow: "hidden" }}
    >{props.children}

    </textarea>
}

export default Textarea;