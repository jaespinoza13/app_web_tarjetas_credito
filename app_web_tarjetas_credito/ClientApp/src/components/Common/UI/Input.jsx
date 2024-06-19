import { useEffect, useState } from "react";

const Input = (props) => {
    const [inputValue, setInputValue] = useState('');
    const changeHandler = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        props.setValueHandler(newValue);
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
            /*onKeyDown={props.onKeyDown}*/
        /*  key={props.key} */

        ></input>
    );
}

export default Input;