
import Checkbox from '@mui/material/Checkbox';
const Table = (props) => {
   
    return (
        <table>
            <THead headers={props.headers} multipleOpcion={props.multipleOpcion} onChangeCheckBox={props.onChangeCheckBox} isSelectAll={props.isSelectAll}
                desactivarCheckEditar={props.desactivarCheckEditar }></THead>
            <tbody>
                {props.children}
            </tbody>
        </table>
    )
}

const THead = ({ headers, multipleOpcion, onChangeCheckBox, isSelectAll, desactivarCheckEditar }) => {
    return ( 
        <thead>
            <tr>
                {multipleOpcion && 
                    headers.map((header, index) => (
                        index === 0 ?
                            <th key={header.key}>{header.nombre} <br /> <Checkbox checked={isSelectAll} disabled={desactivarCheckEditar} onChange={(e) => onChangeCheckBox(e)} /> </th> 
                            : <th key={header.key}>{header.nombre}</th>
                        
                    ))
                }

                {(multipleOpcion === false || multipleOpcion === undefined || multipleOpcion === null) &&
                    headers.map((header, index) => (
                       <th key = { header.key } > { header.nombre }</th>

                    ))
                }
                
            </tr>
        </thead>
    )
}


export default Table;