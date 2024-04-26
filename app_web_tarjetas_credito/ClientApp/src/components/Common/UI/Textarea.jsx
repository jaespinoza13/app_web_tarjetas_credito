const Textarea = (props) => {
    const textareaHandler = (e) => {
        props.onChange(e.target.value);
    }

    return <textarea
        className={props.value === '' ? 'no_valido' : ''} id={props.id} name={props.name}
        placeholder={props.placeholder} rows={props.rows} value={props.value} onChange={textareaHandler}
        required={props.esRequerido === null ? false : props.esRequerido} readOnly={props.readOnly}>{props.children}

    </textarea>
}

export default Textarea;