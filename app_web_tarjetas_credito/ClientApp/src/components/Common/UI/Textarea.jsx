const Textarea = (props) => {
    const textareaHandler = (e) => {
        props.onChange(e.target.value);
    }

    return <textarea placeholder={props.placeholder} rows={props.rows} value={props.value} onChange={textareaHandler}>

    </textarea>
}

export default Textarea;