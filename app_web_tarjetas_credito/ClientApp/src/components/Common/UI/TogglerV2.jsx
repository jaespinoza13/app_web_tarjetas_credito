import { Fragment, useEffect, useState } from "react";
import '../../../css/Components/TogglerV2.css';
import Button from "./Button";


const TogglerV2 = (props) => {
    const [tamArray, setTamArray] = useState(0);
    const [activeIndex, setActiveIndex] = useState(null);
    const togglerHandler = (index) => {
        setActiveIndex(index)
        props.selectedToggle(index);
    }

    useEffect(() => {
        setActiveIndex(props.toggles[0].key);
        setTamArray(props.toggles.length - 1)
        props.selectedToggle(props.toggles[0].key);// Retorna la accion del primer boton
    }, []);

    return (
        <div className={`togglerv2 ${props.className}`} value={activeIndex}>

            {props.toggles.map((element, index) => (
                <Button
                    key={element.key}
                    className={`btn_mg__togglerv2 ${element.key === activeIndex ? 'active' : ''} ${index === 0 ? 'inicialBotton' : ''} ${index === tamArray ? 'endBotton' : ''} ${(index !== tamArray && index !== 0) ? 'middBotton' : ''}`}
                    onClick={() => { togglerHandler(element.key) }}>
                    {
                        <Fragment key={element.key}>
                            <div style={{ marginTop: "5px", marginRight: "15px" }}>
                                <img width="25px" src={element.image} alt="" />
                            </div>
                            <div className="text-togglerv2">
                                <p className="textoToggle">{element.textPrincipal}</p>
                                <p>{element.textSecundario}</p>
                            </div>
                        </Fragment>
                    }
                </Button>
            ))}
        </div>
    );

}

export default TogglerV2;