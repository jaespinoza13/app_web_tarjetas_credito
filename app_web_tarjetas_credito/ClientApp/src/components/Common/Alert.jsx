import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { IsNullOrWhiteSpace } from '../../js/utiles';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, Slide } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * Alert dialog general
 * @param {{
    openModal: boolean,
    canClose: boolean,
    titleAlert: string,
    header: Element,
    bodyAlert: string,
    children: Element,
    btn_footer: Element,
    btnAceptar: string,
    handlerBtnAceptar: Function,
    btnCancelar: string,
    handlerBtnCancelar: Function,
    icon: string,
    size: ["xs", "sm", "md", "lg", "xl"],
}} props
 */
function ModalAlert(props) {
    const [open, setOpen] = useState(props.openModal);
    const [canClose, setCanClose] = useState((props.canClose !== null && props.canClose !== undefined) ? props.canClose : true);
    const [size, setSize] = useState("sm");
    const refBtnAceptar = useRef(null);
    var icon = null;
    var color = "";
    switch (props.icon) {
        case "danger":
            color = "#e64a19";
            icon = solid("circle-xmark");
            break;
        case "warning":
            color = "#ff6f00";
            icon = solid("circle-exclamation");
            break;
        case "info":
            color = "#0277bd";
            icon = solid("circle-info");
            break;
        case "success":
            color = "#2e7d32";
            icon = solid("circle-check");
            break;
        default:
            color = "#546e7a";
            icon = solid("circle");
            break;
    }
    const toggleAcept = () => {
        if (props.btnAceptar && props.handlerBtnAceptar) {
            props.handlerBtnAceptar();
        }
        setOpen(!open);
    };
    const toggleCancel = () => {
        if (props.handlerBtnCancelar) {
            props.handlerBtnCancelar();
        }
        setOpen(!open);
    };

    useEffect(() => {
        let ti = setTimeout(() => {
            if (refBtnAceptar && refBtnAceptar.current) {
                refBtnAceptar.current.focus();
            }
            clearTimeout(ti);
        }, 60);
    }, [refBtnAceptar]);

    useEffect(() => {
        setOpen(props.openModal);
    }, [props.openModal]);

    useEffect(() => {
        if (props.size) {
            setSize(props.size);
        }
    }, [props.size]);

    useEffect(() => {
        if (props.canClose !== null && props.canClose !== undefined) {
            setCanClose(props.canClose);
        }
    }, [props.canClose]);

    return (
        <div>
            <Dialog
                scroll={"paper"}
                open={open}
                TransitionComponent={Transition}
                keepMounted
                maxWidth={size}
            >
                <DialogTitle className="title-alert-mego">
                    <Grid container spacing={2}>
                        <Grid item xs={11}>
                            {props.header ?
                                <>{props.header}</>
                                :
                                <>
                                    <FontAwesomeIcon icon={icon} color={color} />&nbsp;{props.titleAlert}
                                </>
                            }
                        </Grid>
                        <Grid item xs={1}>
                            {canClose ? <button className="btn_mg btn_mg__tertiary btn_mg__auto"><FontAwesomeIcon icon={solid("close")} onClick={toggleCancel} /></button> : ""}
                        </Grid>
                    </Grid>
                </DialogTitle>
                <DialogContent className="text-alert-mego">
                    {(!IsNullOrWhiteSpace(props.bodyAlert)) ?
                        <p dangerouslySetInnerHTML={{ __html: props.bodyAlert.replaceAll("|", "<br />") }} />
                        :
                        props.children
                    }
                </DialogContent>
                <DialogActions>
                    {props.btn_footer}
                    {(props.btnAceptar) ?
                        <button className="btn_mg btn_mg__primary" innerRef={refBtnAceptar} onClick={toggleAcept}>
                            {props.btnAceptar}
                        </button>
                        :
                        <span></span>}
                    {(props.btnCancelar && canClose) ?
                        <button className="btn_mg btn_mg__secondary" onClick={toggleCancel}>
                            {props.btnCancelar}
                        </button>
                        :
                        ''}
                </DialogActions>
            </Dialog>
        </div>
    );
}

ModalAlert.propTypes = {
    openModal: PropTypes.bool.isRequired,
    canClose: PropTypes.bool,
    titleAlert: PropTypes.string,
    header: PropTypes.element,
    bodyAlert: PropTypes.string,
    children: PropTypes.element,
    btn_footer: PropTypes.element,
    btnAceptar: PropTypes.string,
    handlerBtnAceptar: PropTypes.func,
    btnCancelar: PropTypes.string,
    handlerBtnCancelar: PropTypes.func,
    icon: PropTypes.string,
    size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
}

export default ModalAlert;