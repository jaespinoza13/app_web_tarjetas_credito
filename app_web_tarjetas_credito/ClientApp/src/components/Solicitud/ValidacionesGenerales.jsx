import Card from "../Common/Card";
import '../../scss/components/ValidacionesGenerales.css';

const ValidacionesGenerales = (props) => {
    console.log(props.lst_validaciones);
    return (
        <div >
            <label>Validaciones</label>
            {props.lst_validaciones.lst_validaciones_ok.length > 0 &&
                <Card className={["w-100"] }>
                    {props.lst_validaciones.lst_validaciones_ok.map((validacion) => {
                        return (
                            <div className="f-row validacion mb-3">
                                <img className="btn_mg mr-3" style={{ width: "15px", height: "15px" }} src="Imagenes/statusActive.png"></img>
                                <h3>{validacion.str_descripcion_alerta}</h3>
                            </div>                            
                        );

                    })}
                </Card>
            }
            {props.lst_validaciones.lst_validaciones_err.length > 0 &&
                <Card className={["W-100 mt-4"]}>
                    {props.lst_validaciones.lst_validaciones_err.map((validacion) => {
                        return (
                            <div className="f-row validacion">
                                <img className="btn_mg mr-3" style={{ width: "15px", height: "15px" }} src="/Imagenes/statusBlocked.png"></img>
                                <h3>{validacion.str_descripcion_alerta}</h3>
                            </div>
                        );

                    })}
                </Card>
            }
        </div>
    );
}

export default ValidacionesGenerales;