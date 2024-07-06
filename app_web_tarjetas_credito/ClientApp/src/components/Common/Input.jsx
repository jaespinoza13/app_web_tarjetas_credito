import React from 'react';
import PropTypes from 'prop-types';
import { IsNullOrWhiteSpace } from '../../js/utiles';

/**
 * elemento input customizado al diseño de Coopmego
 * @param {{ width: number, height: number, color: string|null }} param0
 */
function InputMego(props) {
    var { id, label, onClick, textbutton, change, type, isHorizontal = false, disabled, isError, errorText, helperText, correctText } = props;

    if (isHorizontal) {
        return (
            <div className="form_mg_row">
                <label htmlFor={id} className="pbmg1 lbl-input label_horizontal">{label}</label>
                <div className="form_mg__item">
                    <input type={type ? type: "text" } name="username" id={id} autoComplete="off" onChange={e => { change(e) }} />
                    <a href="#!" rel="noreferrer" className="link_mg pbmg1 link-input" tabIndex="-1" onClick={(e) => onClick(e)}>{textbutton}</a>
                </div>
            </div>
        );
    } else {
        return (
            <div className="form_mg__item">
                <label htmlFor={id} className="pbmg1 lbl-input">{label}</label>
                <input type={type ? type : "text"} name="username" id={id} onChange={e => { change(e) }} />
                <a href="#!" rel="noreferrer" className="link_mg pbmg1 link-input" tabIndex="-1" onClick={(e) => onClick(e)}>{textbutton}</a>
            </div>
        );
    }
}

InputMego.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string
}

export default InputMego;