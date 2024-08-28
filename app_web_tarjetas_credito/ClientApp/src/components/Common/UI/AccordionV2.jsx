import '../../../css/Components/AccordionV2.css';

import { useState } from "react"


const AccordionV2 = (props) => {
    const handleToggleAccordion = () => {
        setEstadoLoadingInfoSocio(true)
        let val = setTimeout(() => {
            setEstadoLoadingInfoSocio(false)
            setEstadoBtnDespl(!estadoBtnDespl);
            clearTimeout(val)
        }, 200)
    }



    const [estadoBtnDespl, setEstadoBtnDespl] = useState(true);
    const [estadoLoadingInfoSocio, setEstadoLoadingInfoSocio] = useState(false);


    return (
        <div className={`accordionV2 ${props.className || ''}`}>
            <div className={`accordionV2-header ${props.classNameTitulo || ''}`}>
                <h3 className="strong">
                    {props.title}
                </h3>

                <div className="accordionV2-icon">
                    {estadoLoadingInfoSocio
                        ? <button className={`btn_mg btn_mg__tertiray btn_mg__auto loading`} onClick={handleToggleAccordion}><img className={`${estadoLoadingInfoSocio ? 'loading' : ''}`} src="Imagenes/progress_activity.svg" alt="" /></button>
                        : <button className="btn_mg btn_mg__tertiray btn_mg__auto" onClick={handleToggleAccordion}><img className={estadoBtnDespl ? 'rotated' : ''} src="Imagenes/stat_minus.svg" alt="" /></button>
                    }
                </div>
            </div>
            <div className={`accordion-contentV2 ${estadoBtnDespl ? 'open' : ''}`}>
                {props.children}
            </div>
        </div>
    );
}

export default AccordionV2;