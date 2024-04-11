﻿const Button = (props) => {
    const classNameProps = props.className || '';
    return (<button className={`btn_mg ${classNameProps}`}
        disabled={props.disabled}
        tabIndex={props.tabIndex}
        onClick={props.onClick}
        id={props.id}>
        
        {props.children}
    </button>);
}

export default Button;