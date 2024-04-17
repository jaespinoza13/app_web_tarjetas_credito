const Accordion = (props) => {
    const handleToggleAccordion = () => {
        props.toggleAccordion();
    }

    return (
        <div className={`accordion ${props.className || ''}`}>
            <div className="accordion-header">
                <h3>{props.title}</h3>
                {props.loading
                    ? <button className={`btn_mg btn_mg__tertiray btn_mg__auto loading`}><img className={`${props.loading ? 'loading' : ''}`} src="Imagenes/progress_activity.svg" alt="" /></button>
                    : <button className="btn_mg btn_mg__tertiray btn_mg__auto" onClick={handleToggleAccordion}><img className={props.rotate ? 'rotated' : ''} src="Imagenes/stat_minus.svg" alt="" /></button>
                }
            </div>
            <div className={`accordion-content ${props.rotate ? 'open' : ''}`}>
                {props.children}
            </div>
        </div>
    );
}

export default Accordion;