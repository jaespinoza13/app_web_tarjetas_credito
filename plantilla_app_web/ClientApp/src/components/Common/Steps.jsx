import React, { } from 'react';
import {
    Row,
    Col,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

function Steps(props) {
    return (
        <Row className="stepper-wrapper">
            {props.items.map((item, index) =>
                <Col key={"Step_" + index} className={"stepper-item " + ((props.stepActual === (index + 1)) ? "active" : "") + ((props.stepActual > (index + 1)) ? "completed" : "")}>
                    <div className="step-counter">{(props.stepActual > (index + 1)) ? <FontAwesomeIcon icon={solid("check")} color={"#FFF"} /> : index + 1}</div>
                    <div className="step-name">{item}</div>
                </Col>
            )}
        </Row>
    );
}

export default Steps;