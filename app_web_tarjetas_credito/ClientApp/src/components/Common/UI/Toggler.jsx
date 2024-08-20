import { Fragment, useEffect, useState } from "react";
import Button from "./Button";

const Toggler = (props) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [lstToggles, setLstToggles] = useState(props.toggles);
    const togglerHandler = (index) => {
        setActiveIndex(index)
        props.selectedToggle(index);
    }


    useEffect(() => {
        if (lstToggles.length > 0) {
            setActiveIndex(lstToggles[0].key);
            togglerHandler(lstToggles[0].key); //Se agrega para primera iteracion, retorne valor por defecto
        }
    }, [lstToggles]);

    useEffect(() => {
        if (props.toggleReset) {
            //console.log("CAMBIO TOGGLE, ", props.toggles[props.toggleReset])
            setActiveIndex(props.toggleReset);
        }
    }, [props.toggleReset])

    return (
        <div className={`toggler ${props.className}`} value={activeIndex}>

            {lstToggles.length > 0 && lstToggles.map((element, ind) => (
                <Fragment key={ind}>
                <Button
                    key={element.key}
                    className={`btn_mg__toggler mr-2 ${element.key === activeIndex ? 'active' : ''}`}
                    onClick={() => { togglerHandler(element.key) }}>
                    <Fragment key={element.textPrincipal} >
                        <div>
                            <img src={element.image} alt="" />
                        </div>
                        <div className="text-toggler ml-2 text-align-left">
                            <h4>{element.textPrincipal}</h4>
                            <p>{element.textSecundario}</p>
                        </div>
                    </Fragment>                    
                    </Button>
                </Fragment>
            ))}
        </div>
    );

}

export default Toggler;