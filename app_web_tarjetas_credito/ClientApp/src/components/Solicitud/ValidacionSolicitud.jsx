const ValidacionSolicitud = (props) => {
    return (
        <div className="f-col mb-4">
            {props.gestion === "solicitud"
                ? <video style={{ objectFit: "cover" }} width="293px" height="27px" autoPlay>
                    <source src="Imagenes/transaccionExitosa1.mp4" type="video/mp4"></source>
                </video>
                : <video width="293px" height="27px" autoPlay >
                    <source src="Imagenes/transaccionExitosa1.mp4" type="video/mp4"></source>
                </video>
            }
            <div>
                <p className="mb-4">Datos del beneficiario: </p>
                <Card>
                    <h2>{props.nombres}</h2>
                    <hr className="dashed"></hr>
                    <div>
                        <p>Número de cédula</p>
                        <h3>{props.cedula}</h3>
                    </div>
                    <hr className="dashed"></hr>
                    <div>
                        <p>Número de teléfono</p>
                        <h3>{props.telefono}</h3>
                    </div>
                    <hr className="dashed"></hr>
                    <div>
                        <p>Email</p>
                        <h3>{props.email}</h3>
                    </div>
                    {props.gestion === "solicitud" &&
                        <div>
                            <p>Monto sugerido:</p>
                            <h3>$10000</h3>
                            <h3>{props.email}</h3>
                        </div>
                        <div>
                            <p>Concepto:</p>
                            <h3>Solicitud de tarjeta principal</h3>
                            <h3>{props.email}</h3>
                        </div>
                    }

                </Card>
            </div>
        </div>
    );
}

export default ValidacionSolicitud;