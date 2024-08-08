import { useCallback } from "react";
import { useEffect, useState } from "react";

const SortableTable = (props) => {

    const [sortConfig, setSortConfig] = useState(props.sortConfig);

    const [sortedData, setSortedData] = useState([]);
    // Ordena los datos cuando cambia sortConfig
    const sortData = useCallback(() => {
        const sorted = [...props.informacion].sort((a, b) => {

            let valorA = parseFloat(a[sortConfig.key]);
            let valorB = parseFloat(b[sortConfig.key]);
            if (!isNaN(valorA) && !isNaN(valorB)) {
                if (valorA < valorB) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (valorA > valorB) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
            } else {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
            }            
            return 0;
        });

        setSortedData(sorted);
        props.dataFiltrada(sorted, true)
    }, [sortConfig]);

    useEffect(() => {
        sortData();
    }, [sortConfig, sortData]);


    const requestSort = key => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };  


    const THead = ({ headers, classNameTHeader, multipleOpcion, onChangeCheckBox, isSelectAll, desactivarCheckEditar, indexCheckbox }) => {
        return (
            <thead>
                <tr>
                    {multipleOpcion &&
                        headers.map((header, index) => (
                            index === indexCheckbox ?
                                <th key={header.key}>{header.nombre} <br /> <input type='checkbox' checked={isSelectAll} disabled={desactivarCheckEditar} onChange={(e) => onChangeCheckBox(e)} style={{ position: "absolute", transform: "translate(-8px, -15px)" }} onClick={() => requestSort(header.keyName)} /> </th>
                                : <th key={header.key} className={classNameTHeader} onClick={() => requestSort(header.keyName)}>{header.nombre}</th>

                        ))
                    }

                    {(multipleOpcion === false || multipleOpcion === undefined || multipleOpcion === null) &&
                        headers.map((header, index) => (
                            <th key={header.key} className={classNameTHeader} onClick={() => requestSort(header.keyName)} > {header.nombre} </th>

                        ))
                    }

                </tr>
            </thead>
        )
    }

    return (
        <table className={props.className} style={props.styleTable}>
            <THead
                headers={props.headers}
                classNameHeader={props.classNameTHeader}
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

export default SortableTable;
