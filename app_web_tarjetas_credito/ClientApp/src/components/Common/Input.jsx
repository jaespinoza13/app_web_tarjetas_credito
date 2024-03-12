import React from 'react';
import PropTypes from 'prop-types';
import { IsNullOrWhiteSpace } from '../../js/utiles';

/**
 * elemento input customizado al diseño de Coopmego
 * @param {{ width: number, height: number, color: string|null }} param0
 */
function InputMego(props) {
    var { id, label, onClickBtn, textBtn, isHorizontal = false, disabled, isError, errorText, helperText, correctText } = props;

    if (isHorizontal) {
        return (
            <div className="form_mg_row">
                <label htmlFor={id} className="pbmg1 lbl-input label_horizontal">{label}</label>
                <div className="form_mg__item">
                    <input type="text" name="username" id={id} {...props} autoComplete="off"  />
                    <a href="#!" rel="noreferrer" className="link_mg pbmg1 link-input" tabIndex="-1" onClick={(e) => onClickBtn(e)}>{textBtn}</a>
                </div>
            </div>
        );
    } else {
        return (
            <div className="form_mg__item">
                <label htmlFor={id} className="pbmg1 lbl-input">{label}</label>
                <input type="text" name="username" id={id} {...props} />
                <a href="#!" rel="noreferrer" className="link_mg pbmg1 link-input" tabIndex="-1" onClick={(e) => onClickBtn(e)}>{textBtn}</a>
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