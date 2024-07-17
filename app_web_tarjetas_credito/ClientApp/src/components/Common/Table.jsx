const Table = (props) => {

    return (
        <table className={props.className} style={props.styleTable}>
            <THead
                headers={props.headers}
                classNameHeader={props.classNameTHeader }
                multipleOpcion={props.multipleOpcion}
                onChangeCheckBox={props.onChangeCheckBox}
                isSelectAll={props.isSelectAll}
                indexCheckbox={props.indexCheckbox}
                desactivarCheckEditar={props.desactivarCheckEditar}></THead>
            <tbody>
                {props.children}
            </tbody>
        </table>
    )
}

const THead = ({ headers, classNameTHeader, multipleOpcion, onChangeCheckBox, isSelectAll, desactivarCheckEditar, indexCheckbox }) => {
    return (
        <thead>
            <tr>
                {multipleOpcion &&
                    headers.map((header, index) => (
                        index === indexCheckbox ?
                            <th key={header.key}>{header.nombre} <br /> <input type='checkbox' checked={isSelectAll} disabled={desactivarCheckEditar} onChange={(e) => onChangeCheckBox(e)} style={{ position: "absolute", transform: "translate(-8px, -15px)"}} /> </th>
                            : <th key={header.key} className={classNameTHeader}>{header.nombre}</th>

                    ))
                }

                {(multipleOpcion === false || multipleOpcion === undefined || multipleOpcion === null) &&
                    headers.map((header, index) => (
                        <th key={header.key} className={classNameTHeader} > {header.nombre} </th>

                    ))
                }

            </tr>
        </thead>
    )
}

export default Table;