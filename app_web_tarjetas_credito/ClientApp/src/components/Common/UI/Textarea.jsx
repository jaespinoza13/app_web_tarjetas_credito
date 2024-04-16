const Textarea = (props) => {
    const textareaHandler = (e) => {
        props.onChange(e.target.value);
    }

    return <textarea
        className={props.value === '' ? 'no_valido': ''}
        placeholder={props.placeholder} rows={props.rows} value={props.value} onChange={textareaHandler} required>

    </textarea>
}

export default Textarea;