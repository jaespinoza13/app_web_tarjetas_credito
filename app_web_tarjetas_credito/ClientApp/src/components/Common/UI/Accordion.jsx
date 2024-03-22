//import { useState } from "react";

//const Accordion = ({ loading, rotate, contentReady, toggleAccordion, className, children }) => {
//    const [localLoading, setLocalLoading] = useState(loading);
//    const [localRotate, setLocalRotate] = useState(rotate);
//    const handleToggleAccordion = () => {
//        if (!contentReady) {
//            toggleAccordion();
//        }
//    }
//    console.log('contentReady');
//    return (
//        <div className={`accordion ${className && ''}`}>
//            <div className="accordion-header">
//                <h3>Score</h3>
//                {localLoading
//                    ? <button className={`btn_mg btn_mg__tertiray loading`}><img className={`${localLoading ? 'loading' : ''}`} src="Imagenes/progress_activity.svg" alt="" /></button>
//                    : <button className="btn_mg btn_mg__tertiray" onClick={handleToggleAccordion}><img className={localRotate ? 'rotated' : ''} src="Imagenes/stat_minus.svg" alt="" ></img></button>
//                }
//            </div>
//            <div className={`accordion-content ${localRotate ? 'open' : ''}`}>
//                {children}
//            </div>
//        </div>
//    );
//}

//export default Accordion;

import { useState } from "react";

const Accordion = (props) => {
    const handleToggleAccordion = () => {
        props.toggleAccordion();
    }

    return (
        <div className={`accordion ${props.className || ''}`}>
            <div className="accordion-header">
                <h3>Score</h3>
                {props.loading
                    ? <button className={`btn_mg btn_mg__tertiray loading`}><img className={`${props.loading ? 'loading' : ''}`} src="Imagenes/progress_activity.svg" alt="" /></button>
                    : <button className="btn_mg btn_mg__tertiray" onClick={handleToggleAccordion}><img className={props.rotate ? 'rotated' : ''} src="Imagenes/stat_minus.svg" alt="" /></button>
                }
            </div>
            <div className={`accordion-content ${props.rotate ? 'open' : ''}`}>
                {props.children}
            </div>
        </div>
    );
}

export default Accordion;