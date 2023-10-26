import React from 'react';
import PropTypes from 'prop-types';
import { IsNullOrWhiteSpace } from '../../js/utiles';

/**
 * Crear un Box con un tamaño para dar espacios
 * @param {{ width: number, height: number, color: string|null }} param0
 */
function SizedBox(props) {
    var {width, height, color} = props;

    if (isNaN(width)) {
        width = 0;
    }
    if (isNaN(height)) {
        height = 0;
    }

    if (!IsNullOrWhiteSpace(color)) {
        return (
            <div style={{ width: width + "px", height: height + "px", backgroundColor: color }} {...props}>&nbsp;</div>
        );
    } else {
        return (
            <div style={{ width: width + "px", height: height + "px" }} {...props}>&nbsp;</div>
        );
    }
}

SizedBox.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string
}

export default SizedBox;