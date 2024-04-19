

const Table = (props) => {
   

    return (
        <table>
            <THead headers={props.headers}></THead>
            <tbody>
                {props.children}
            </tbody>
        </table>
    )
}

const THead = ({ headers }) => {
    return ( 
        <thead>
            <tr>
                {headers.map((header) => (
                    <th key={header.key}>{header.nombre}</th>
                ))}
            </tr>
        </thead>
    )
}


export default Table;