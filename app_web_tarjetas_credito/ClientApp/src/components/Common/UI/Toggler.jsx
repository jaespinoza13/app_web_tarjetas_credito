import { useState } from "react";
import Button from "./Button";

const Toggler = (props) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const togglerHandler = (index) => {
        setActiveIndex(index)
        props.selectedToggle(index);
    }

    return (
        <div className={`toggler ${props.className}`} value={activeIndex}> 
            {props.toggles.map((element, index) => (
                <Button
                    key={index} // Ensure each button has a unique key
                    className={`btn_mg__toggler mr-2 ${index === activeIndex ? 'active' : ''}`}
                    onClick={() => { togglerHandler(index) }}>
                    {element}
                </Button>
            ))}
        </div>
    );

}

export default Toggler;