const Textarea = (props) => {
    const textareaHandler = (e) => {
        props.onChange(e.target.value);
    }

    return <textarea
        className={props.value === '' ? 'no_valido' : ''}
        placeholder={props.placeholder} rows={props.rows} value={props.value} onChange={textareaHandler}
        required={props.esRequerido === null ? false : props.esRequerido}>{ props.children}

    </textarea>
}

export default Textarea;