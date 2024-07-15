import Card from "../Common/Card";

const FinProceso = (props) => {
    return (
        <div className="f-row w-100 justify-content-center align-content-center">
            <div className="f-col w-60 mb-4">
                <div className="f-row justify-content-center align-content-center">
                    {props.gestion === "solicitud"
                        ? <img style={{ width: "28rem" }} src="Imagenes/Solicitud-exitosa.gif" loop={false} alt="Solicitud registrada"></img>
                        : <img style={{ width: "28rem" }} src="Imagenes/Prospecto-exitoso.gif" loop={false} alt="Prospecto exitosa"></img>

                    }
                </div>
                <div className="">
                    <p className="mb-4">Detalles: </p>
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
                        <hr className="dashed"></hr>
                    </Card>
                </div>
            </div>
        </div>

    )

}

export default FinProceso;