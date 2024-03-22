const Button = (props) => {
    const classNameProps = props.className || '';
    return (<button className={`btn_mg ${classNameProps}`}
        disabled={props.disabled}
        tabIndex={props.tabIndex}
        onClick={props.onClick}>
        {props.children}
    </button>);
}

export default Button;