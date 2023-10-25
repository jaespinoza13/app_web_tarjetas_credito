import React, { useState, useEffect } from 'react';
import Lottie from "lottie-react";
import PropTypes from 'prop-types';
import { IsNullOrWhiteSpace } from '../../js/utiles';
import gifLoad from "../../css/Imagenes/gif_load.json";
import { Dialog, DialogContent } from '@mui/material';

function LoadingAlert(props) {
    const [open, setOpen] = useState(props.openLoad);

    useEffect(() => {
        setOpen(props.openLoad);
    }, [props.openLoad]);

    return (
        <div>
            <Dialog
                id={"modal_load"}
                open={open}
                keepMounted
                maxWidth={"xs"}
                contentClassName={"modal-loading"}
                PaperProps={{ style: { backgroundColor: "transparent", boxShadow: "none" } }}
            >
                <DialogContent>
                    <Lottie animationData={gifLoad} loop={true} />
                    <p style={{
                        color: "#fff",
                        textAlign: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                        borderRadius: "5px"
                    }}>
                        {IsNullOrWhiteSpace(props.title) ? "Cargando..." : props.title}
                        <br />
                        <span style={{ color: "#ffc107" }}>
                            {IsNullOrWhiteSpace(props.txt) ? "Por favor espere" : props.txt}
                        </span>
                    </p>
                </DialogContent>
            </Dialog>
        </div>
    );
}

LoadingAlert.propTypes = {
    openLoad: PropTypes.bool.isRequired,
    title: PropTypes.string,
    txt: PropTypes.string,
}

export default LoadingAlert;