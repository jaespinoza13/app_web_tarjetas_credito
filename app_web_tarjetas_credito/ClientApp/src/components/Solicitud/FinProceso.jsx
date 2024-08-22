import { numberFormatMoney } from "../../js/utiles";
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
                    <h2 className="mb-4">Detalles: </h2>
                    <Card>
                        <h2 className="strong">{props.nombres}</h2>
                        <hr className="dashed"></hr>
                        <div>
                            <h3>Número de cédula</h3>
                            <h3 className="strong">{props.cedula}</h3>
                        </div>
                        <hr className="dashed"></hr>
                        <div>
                            <h3>Número de teléfono</h3>
                            <h3 className="strong">{props.telefono}</h3>
                        </div>
                        <hr className="dashed"></hr>
                        <div>
                            <h3>Email</h3>
                            <h3 className="strong">{props.email}</h3>
                        </div>
                        <hr className="dashed"></hr>
                        <div>
                            <h3>Cupo solicitado</h3>
                            <h3 className="strong">{numberFormatMoney(props.cupoSolicitado)}</h3>
                        </div>
                        <hr className="dashed"></hr>
                        <div>
                            <h3>Cupo sugerido CoopMego</h3>
                            <h3 className="strong">{numberFormatMoney(props.cupoSugeridoCoopmego)}</h3>
                        </div>
                        <hr className="dashed"></hr>
                    </Card>
                </div>
            </div>
        </div>

    )

}

export default FinProceso;