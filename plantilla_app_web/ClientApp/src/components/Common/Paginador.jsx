import React, { useState, useEffect } from 'react';
import {
    Col,
    Row,
    Input,
    Pagination,
    PaginationItem,
    PaginationLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';

function Paginador(props) {
    const [listaPaginas, setlistaPaginas] = useState([1]);
    const [paginaActual, setpaginaActual] = useState(1);
    const [paginaMaxima, setpaginaMaxima] = useState(1);
    const [nro_regitros, setNroRegitros] = useState((props.hasta - props.desde) > 0 ? (props.hasta - props.desde) : 1);

    useEffect(() => {
        var lst = [];
        for (let i = 1; i <= Math.ceil(props.maximoRegistros / nro_regitros); i++) {
            lst.push(i);
        }
        setlistaPaginas(lst);
        setpaginaMaxima(lst[lst.length - 1]);
        setpaginaActual(1);
    }, [props.maximoRegistros, nro_regitros]);

    useEffect(() => {
        if (props.update === true) {
            setNroRegitros((props.hasta - props.desde) > 0 ? (props.hasta - props.desde) : 1);
            props.setUpdate(false);
        }
    }, [props]);

    return (
        <Row>
            <Col md={6}>
                <Pagination aria-label="Paginación de registros" size="sm">
                    <PaginationItem disabled={paginaActual === 1}>
                        <PaginationLink first onClick={() => {
                            setpaginaActual(1);
                            props.setDesde(0);
                            props.setHasta(nro_regitros);
                        }} />
                    </PaginationItem>
                    <PaginationItem disabled={paginaActual === 1}>
                        <PaginationLink previous onClick={() => {
                            var pag = paginaActual - 1;
                            var ini = (pag * nro_regitros) - nro_regitros + 1;
                            setpaginaActual(pag);
                            props.setDesde(ini);
                            props.setHasta(ini + nro_regitros - 1);
                        }} />
                    </PaginationItem>
                    <PaginationItem disabled={listaPaginas.length <= 1}>
                        <UncontrolledDropdown direction="end">
                            <DropdownToggle caret color="primary" className="page-link" >
                                {paginaActual}
                            </DropdownToggle>
                            {listaPaginas.length > 0 ?
                                <DropdownMenu style={{ overflowY: "auto", maxHeight: "500px" }}>
                                    {listaPaginas.map((pag) =>
                                        <DropdownItem key={pag} onClick={() => {
                                            setpaginaActual(pag);
                                            props.setDesde((pag * nro_regitros) - nro_regitros + 1);
                                            props.setHasta((pag * nro_regitros));
                                        }}>
                                            {pag}
                                        </DropdownItem>
                                    )}
                                </DropdownMenu>
                                : ""}
                        </UncontrolledDropdown>
                    </PaginationItem>
                    <PaginationItem disabled={paginaActual === paginaMaxima}>
                        <PaginationLink next onClick={() => {
                            setpaginaActual(paginaActual + 1);
                            props.setDesde(((paginaActual + 1) * nro_regitros) - nro_regitros + 1);
                            props.setHasta(props.hasta + nro_regitros);
                        }} />
                    </PaginationItem>
                    <PaginationItem disabled={paginaActual === paginaMaxima}>
                        <PaginationLink last onClick={() => {
                            setpaginaActual(paginaMaxima);
                            props.setDesde((paginaMaxima * nro_regitros) - nro_regitros + 1);
                            props.setHasta(props.maximoRegistros);
                        }} />
                    </PaginationItem>
                    {' '}&nbsp;Registros:{' '}&nbsp;<Input value={nro_regitros} type="number" min={1} step={1} max={props.maximoRegistros} bsSize="sm" style={{ width: 60 }} onChange={(e) => {
                        props.setDesde(0);
                        props.setHasta(Number(e.target.value));
                        setNroRegitros(Number(e.target.value));
                    }} />
                </Pagination>
            </Col>
            <Col md={6}>
                <span id="spanPagina" className="float-right">Mostrando {props.desde} - {props.hasta} de {props.maximoRegistros}</span>
            </Col>
        </Row >
    );
}

export default Paginador;