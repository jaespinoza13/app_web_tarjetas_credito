import { useEffect, useState } from "react";

const Input = (props) => {
    const [inputValue, setInputValue] = useState('');
    const changeHandler = (e) => {
        const newValue = e.target.value;



        //En caso exista las dos propiedades evalua la de "max""
        if (props.maxlength !== undefined && props.max !== undefined && Number(newValue) <= Number(props.max)) {
            setInputValue(newValue);
            props.setValueHandler(newValue);
        }
        //Control para tamaño de caracteres
        else if (props.maxlength !== undefined && newValue.length <= props.maxlength && props.max === undefined) {
            setInputValue(newValue);
            props.setValueHandler(newValue);
        }
        //Control para valor maximo
        else if (props.max !== undefined && Number(newValue) <= Number(props.max) && props.maxlength === undefined) {
            console.log("ENTRA")
            setInputValue(newValue);
            props.setValueHandler(newValue);
        }
        else if (props.maxlength === undefined && props.max === undefined) {
            setInputValue(newValue);
            props.setValueHandler(newValue);
        }

    }
    let inputClass = 'default';
    if (props.rounded) {
        inputClass = 'squared';
    }

    useEffect(() => {
        if (props.value) {
            setInputValue(props.value);
        }
    }, [props.value])

    const styleMayuscText = {
        textTransform: 'uppercase'
    }
    const inputStyle = props.controlMayusText ? styleMayuscText : {};

    return (
        <input
            className={`${inputClass} ${props.className || ''} ${(props.value === '' && props.esRequerido === true) ? 'no_valido' : ''}`}
            required={props.esRequerido === null ? false : props.esRequerido}
            type={props.type}
            tabIndex={props.tabIndex}
            placeholder={props.placeholder}
            name={props.name}
            readOnly={props.readOnly}
            rounded={props.rounded}
            value={inputValue}
            onChange={changeHandler}
            checked={props.checked}
            maxLength={props.maxlength}
            min={props.min}
            max={props.max}
            disabled={props.disabled}
            onKeyDown={props.keyDown}
            id={props.id}
            style={inputStyle}

        /*  key={props.key} */

        ></input>
    );
}

export default Input;