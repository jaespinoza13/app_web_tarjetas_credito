import Chip from '../Common/UI/Chip';


const Table = (props) => {
    const { headers, data, tipo  } = props;

    let contenido;
    if (tipo === "Solicitudes") {
        contenido = (
            <table>
                <THead headers={headers}></THead>

                <tbody>
                    {data.map((solicitud) => {
                        return (
                        <tr key={solicitud.int_id}>
                            <td>{solicitud.str_identificacion}</td>
                            <td>{solicitud.int_ente}</td>
                            <td>{solicitud.str_nombres}</td>
                            <td><Chip type="black">Black</Chip></td>
                            <td>{`$ ${solicitud.dec_cupo_solicitado.toLocaleString}`}</td>
                            <td>{"AA"}</td>
                            <td>{solicitud.str_estado}</td>
                            <td>{"Matriz"}</td>
                            <td>{solicitud.str_usuario_crea}</td>
                            <td>{solicitud.str_usuario_crea}</td>
                            <td>{solicitud.dtt_fecha_solicitud}</td>
                            <td> <h2>ACCIONES</h2> </td>
                        </tr>);
                    })}
                </tbody>
            </table>
        );
    }
    else if (tipo === "Prospectos") {
        contenido = (
        <table>
            <THead headers={headers}></THead>
            <tbody>
                {data.map((prospecto) => {
                    return (
                    <tr key={prospecto.pro_id}>
                        <td>{prospecto.pro_id}</td>
                        <td>{prospecto.pro_num_documento}</td>
                        <td>{`${prospecto.pro_nombres} ${prospecto.pro_apellidos}`}</td>
                        <td>{prospecto.pro_celular}</td>
                        <td>{prospecto.pro_email}</td>
                        <td>{`$ ${prospecto.pro_cupo_solicitado}`}</td>
                        <td>{prospecto.pro_usuario_crea}</td>
                    </tr>);
                })}
            </tbody>
            </table>
        )
    } else {
        contenido = (
            <h2>OTRA IMPLEMENTACIÓN</h2>
        )
    }

    return contenido;
}

const THead = ({ headers }) => {
    return ( 
        <thead>
            <tr>
                {headers.map((header, index) => (
                    <th key={index}>{header}</th>
                ))}
            </tr>
        </thead>
    )
}


export default Table;