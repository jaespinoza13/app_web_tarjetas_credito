import { Fragment, useEffect, useState } from "react";
import Button from "../Buttons/Button";

const Toggler = (props) => {
    const [activeIndex, setActiveIndex] = useState(null);
    console.log(props.toggles);
    const togglerHandler = (index) => {
        setActiveIndex(index)
        props.selectedToggle(index);
    }

    useEffect(() => {
        setActiveIndex(props.toggles[0].key);
    }, []);

    return (
        <div className={`toggler ${props.className}`} value={activeIndex}>

            {props.toggles.map((element) => (
                <Button
                    key={element.key}
                    className={`btn_mg__toggler mr-2 ${element.key === activeIndex ? 'active' : ''}`}
                    onClick={() => { togglerHandler(element.key) }}>
                    {
                        <Fragment>
                            <div>
                                <img src={element.image} alt="" />
                            </div>
                            <div className="text-toggler ml-2 text-align-left">
                                <h4>{element.textPrincipal}</h4>
                                <p>{element.key}</p>
                            </div>
                        </Fragment>
                    }
                </Button>
            ))}
        </div>
    );

}

export default Toggler;