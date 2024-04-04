import { useState } from "react";

const Switch = (props) => {
    const [switchValue, setSwitchValue] = useState(false);
    const switchValueHandler = () => {
        setSwitchValue(!switchValue);   
        props.onChange(!switchValue);
    }
    return <label className="switch">
        <input type="checkbox" checked={props.value || switchValue} onChange={switchValueHandler}>
        </input>
        <span className="slider round"></span>
    </label>
}

export default Switch;