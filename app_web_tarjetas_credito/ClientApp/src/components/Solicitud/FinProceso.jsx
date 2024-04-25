import Card from "../Common/Card";

const FinProceso = (props) => {
    return <div className="f-col mb-4">
        {props.gestion === "solicitud"
            ? <img style={{ width: "25rem" }} src="Imagenes/Solicitud-exitosa.gif" loop={false}></img>
            : <img style={{ width: "25rem" }} src="Imagenes/Prospecto-exitoso.gif" loop={false}></img>
            
        }
        <div>
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
            </Card>
        </div>
        </div>
}

export default FinProceso;