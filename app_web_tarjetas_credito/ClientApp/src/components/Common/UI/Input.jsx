import { useState } from "react";

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
    return (
        <input
            className={`${inputClass} ${props.className || ''}`}
            required={props.esRequerido === null ? false : props.esRequerido}
            type={props.type}
            tabIndex={props.tabIndex}
            placeholder={props.placeholder}
            name={props.name}
            readOnly={props.readOnly}
            rounded={props.rounded}
            value={inputValue}
            onChange={changeHandler}
            maxlength={props.maxlength}
            min={props.min}
            max={props.max}

            ></input>
    );
}

export default Input;