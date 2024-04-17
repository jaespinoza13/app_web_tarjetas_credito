const Button = (props) => {
    const classNameProps = props.className || '';
    return (<button className={`btn_mg ${classNameProps} ${props.autoWidth ? 'btn_mg__auto' : ''}`}
        disabled={props.disabled}
        tabIndex={props.tabIndex}
        onClick={props.onClick}
        id={props.id}>
        {props.children}
    </button>);
}

export default Button;