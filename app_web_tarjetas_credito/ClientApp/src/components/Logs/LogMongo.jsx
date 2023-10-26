import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Form,
    FormGroup,
    Input,
    InputGroup,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane,
    Collapse,
} from 'reactstrap';
import { IsNullOrWhiteSpace } from '../../js/utiles';
import ReactJson from 'react-json-view'
import JSONViewer from 'react-json-viewer';
import { fetchColecciones, fetchDocumentos } from '../../services/RestServices';

const mapStateToProps = (state) => {
    var bd = state.GetWebService.data;
    if (IsNullOrWhiteSpace(bd) || Array.isArray(state.GetWebService.data)) {
        bd = sessionStorage.getItem("WSSELECTED");
    }
    return {
        ws: bd,
        token: state.tokenActive.data,
    };
};

function LogsMongo(props) {
    const dispatch = useDispatch();

    const [isOpenSearch, setIsOpenSearch] = useState(false);
    const [listaColecciones, setListaColecciones] = useState([]);
    const [listaDocumentos, setListaDocumentos] = useState([]);
    const [listaHeaderData, setListaHeaderData] = useState([]);
    const [listaFiltros, setListaFiltros] = useState([]);
    const [ultimoRegistro, setUltimoRegistro] = useState("");
    const [auxCriterio, setAuxCriterio] = useState("");
    const [auxFiltro, setAuxFiltro] = useState("");
    const [rSelected, setRSelected] = useState(1);
    const [maximoRegistros, setMaximoRegistros] = useState(10);
    const [nro_regitros, setNroRegitros] = useState(10);

    const handlerSearch = (e, coleccion) => {
        e.preventDefault();
        var filtro = "";
        var lst = [...listaFiltros];
        if (!IsNullOrWhiteSpace(auxCriterio) && !IsNullOrWhiteSpace(auxFiltro)) {
            lst.push({ name: auxCriterio, value: auxFiltro });
            setListaFiltros(lst);
        }
        for (let i = 0; i < lst.length; i++) {
            if (!IsNullOrWhiteSpace(lst[i].value)) {
                if (lst[i].name === "_id") {
                    filtro += lst[i].name + ":ObjectId('" + lst[i].value + "'),";
                } else {
                    if (lst[i].name.startsWith("str_") || lst[i].name.startsWith("dt")) {
                        filtro += lst[i].name + ":'" + lst[i].value + "',";
                    } else {
                        if (lst[i].name.startsWith("int_")) {
                            filtro += lst[i].name + ":" + lst[i].value + ",";
                        } else if (lst[i].name.startsWith("bl")) {
                            filtro += lst[i].name + ":" + (lst[i].value ? "true" : "false") + ","
                        }
                    }
                }
            }
        }
        filtro = filtro.substr(0, filtro.length - 1);
        fetchDocumentos(props.ws, coleccion, nro_regitros, ultimoRegistro, false, filtro, props.token, (data) => {
            setMaximoRegistros(data.int_total_registros);
            setListaDocumentos(data.lst_docs);
            if (data.lst_docs.length > 0) {
                var arrHead = [];
                var arrBody = [];
                for (let i = 0; i < data.lst_docs.length; i++) {
                    for (var obj in Object.keys(data.lst_docs[i])) {
                        arrHead.push(Object.keys(data.lst_docs[i])[obj]);
                    }
                }
                var dataArr = new Set(arrHead);
                arrHead = [...dataArr];
                for (let i = 0; i < data.lst_docs.length; i++) {
                    var arrAux = [];
                    for (var j = 0; j < arrHead.length; j++) {
                        arrAux[j] = data.lst_docs[i][arrHead[j]] ?? "";
                    }
                    arrBody.push(arrAux);
                }
                setListaHeaderData(arrHead);
                //setListaDocBody(arrBody);
                setUltimoRegistro(data.lst_docs[data.lst_docs.length - 1]._id);
            }
        }, dispatch);
        setAuxCriterio("");
        setAuxFiltro("");
    };

    useEffect(() => {
        fetchColecciones(props.ws, props.token, (lst_coleccones, _) => {
            setListaColecciones(lst_coleccones);
        }, dispatch);
        document.getElementById('body_container_main').style.height = (window.innerHeight - document.getElementById("header_main").clientHeight) + "px";
        window.addEventListener("resize", function () {
            document.getElementById('body_container_main').style.height = (window.innerHeight - document.getElementById("header_main").clientHeight) + "px";
        });
    }, [props.ws, dispatch]);

    var lstFiltroAux = [...listaFiltros];

    return (
        <Container id={"body_container_main"}>
            <Card
                className="my-2"
            >
                <CardHeader>
                    <Row>
                        <Col md={6}>
                            <h4>{props.ws}</h4>
                        </Col>
                        <Col md={6} className="text-right">
                            <Button onClick={() => fetchColecciones(props.ws, props.token, (lst_coleccones, _) => {
                                setListaColecciones(lst_coleccones);
                            }, dispatch)}>Recargar</Button>
                        </Col>
                    </Row>
                </CardHeader>
                <CardBody style={{ overflowX: "auto" }}>
                    <Nav fill pills tabs>
                        {listaColecciones.map((item, index) =>
                            <NavItem key={"NAV" + index} style={{ cursor: "pointer" }}>
                                <NavLink id={"navtab" + item} className="tabsLista"
                                    onClick={function noRefCheck() {
                                        setListaDocumentos([]);
                                        fetchDocumentos(props.ws, item, nro_regitros, ultimoRegistro, false, "", props.token, (data) => {
                                            setMaximoRegistros(data.int_total_registros);
                                            setListaDocumentos(data.lst_docs);
                                            if (data.lst_docs.length > 0) {
                                                var arrHead = [];
                                                var arrBody = [];
                                                for (let i = 0; i < data.lst_docs.length; i++) {
                                                    for (var obj in Object.keys(data.lst_docs[i])) {
                                                        arrHead.push(Object.keys(data.lst_docs[i])[obj]);
                                                    }
                                                }
                                                var dataArr = new Set(arrHead);
                                                arrHead = [...dataArr];
                                                for (let i = 0; i < data.lst_docs.length; i++) {
                                                    var arrAux = [];
                                                    for (var j = 0; j < arrHead.length; j++) {
                                                        arrAux[j] = data.lst_docs[i][arrHead[j]] ?? "";
                                                    }
                                                    arrBody.push(arrAux);
                                                }
                                                setListaHeaderData(arrHead);
                                                //setListaDocBody(arrBody);
                                                setUltimoRegistro(data.lst_docs[data.lst_docs.length - 1]._id);
                                            }
                                        }, dispatch);
                                        setRSelected(1);
                                        var els = document.getElementsByClassName("tabsLista");
                                        for (let i = 0; i < els.length; i++) {
                                            els[i].classList.remove("active");
                                        }
                                        document.getElementById("navtab" + item).classList.add("active");
                                        document.getElementById("bodytab" + item).classList.add("active");
                                    }}
                                >
                                    {item}
                                </NavLink>
                            </NavItem>
                        )}
                    </Nav>
                    <TabContent activeTab="0">
                        {listaColecciones.map((item, index) =>
                            <TabPane className="tabsLista" id={"bodytab" + item} tabId={(index + 1) + ""} key={"TAB" + index}>
                                <Row>
                                    <Col sm={12} className="text-right">
                                        <br />
                                        <ButtonGroup style={{ float: "left" }}>
                                            <Button
                                                color="success"
                                                outline
                                                onClick={() => {
                                                    setRSelected(1);
                                                    document.getElementById("viewJSON" + item).style.display = "";
                                                    document.getElementById("viewTABLE" + item).style.display = "none";
                                                }}
                                                active={rSelected === 1}
                                            >
                                                JSON
                                            </Button>
                                            <Button
                                                color="primary"
                                                outline
                                                onClick={() => {
                                                    setRSelected(2);
                                                    document.getElementById("viewJSON" + item).style.display = "none";
                                                    document.getElementById("viewTABLE" + item).style.display = "";
                                                }}
                                                active={rSelected === 2}
                                            >
                                                Tabla
                                            </Button>
                                        </ButtonGroup>
                                        <Button onClick={() => setIsOpenSearch(!isOpenSearch)}>Buscar</Button>
                                        &nbsp;&nbsp;
                                        <Button onClick={() => fetchDocumentos(props.ws, item, nro_regitros, ultimoRegistro, false, "", props.token, (data) => {
                                            setMaximoRegistros(data.int_total_registros);
                                            setListaDocumentos(data.lst_docs);
                                            if (data.lst_docs.length > 0) {
                                                var arrHead = [];
                                                var arrBody = [];
                                                for (let i = 0; i < data.lst_docs.length; i++) {
                                                    for (var obj in Object.keys(data.lst_docs[i])) {
                                                        arrHead.push(Object.keys(data.lst_docs[i])[obj]);
                                                    }
                                                }
                                                var dataArr = new Set(arrHead);
                                                arrHead = [...dataArr];
                                                for (let i = 0; i < data.lst_docs.length; i++) {
                                                    var arrAux = [];
                                                    for (var j = 0; j < arrHead.length; j++) {
                                                        arrAux[j] = data.lst_docs[i][arrHead[j]] ?? "";
                                                    }
                                                    arrBody.push(arrAux);
                                                }
                                                setListaHeaderData(arrHead);
                                                //setListaDocBody(arrBody);
                                                setUltimoRegistro(data.lst_docs[data.lst_docs.length - 1]._id);
                                            }
                                        }, dispatch)}>Recargar</Button>
                                        <br />
                                        <br />
                                    </Col>
                                    <Col sm="12">
                                        <Collapse isOpen={isOpenSearch}>
                                            <Card>
                                                <CardBody>
                                                    <Form onSubmit={(e) => handlerSearch(e, item)}>
                                                        {lstFiltroAux.map((itemF) =>
                                                            <FormGroup key={"FG" + itemF.name}>
                                                                <InputGroup>
                                                                    <Input
                                                                        name={"selectFiltro" + itemF.name}
                                                                        type="select"
                                                                        value={itemF.name}
                                                                        onChange={(e) => {
                                                                            itemF.name = e.target.value;
                                                                            setListaFiltros(lstFiltroAux);
                                                                        }}
                                                                    >
                                                                        {listaHeaderData.map((itemH) =>
                                                                            <option value={itemH} key={"OPTS" + itemH}>
                                                                                {itemH}
                                                                            </option>
                                                                        )}
                                                                    </Input>
                                                                    <Input value={itemF.value} type="text" onChange={(e) => {
                                                                        itemF.value = e.target.value;
                                                                        setListaFiltros(lstFiltroAux);
                                                                    }} />
                                                                </InputGroup>
                                                            </FormGroup>
                                                        )}
                                                        <FormGroup>
                                                            <InputGroup>
                                                                <Input
                                                                    name="selectFiltro"
                                                                    type="select"
                                                                    value={auxCriterio}
                                                                    onChange={(e) => {
                                                                        setAuxCriterio(e.target.value);
                                                                    }}
                                                                >
                                                                    <option value="" key="SeloP">
                                                                        Seleccione...
                                                                    </option>
                                                                    {listaHeaderData.map((itemH) =>
                                                                        <option value={itemH} key={itemH}>
                                                                            {itemH}
                                                                        </option>
                                                                    )}
                                                                </Input>
                                                                <Input value={auxFiltro} type="text" onChange={(e) => {
                                                                    setAuxFiltro(e.target.value);
                                                                }} />
                                                                <Button onClick={() => {
                                                                    if (!IsNullOrWhiteSpace(auxCriterio) && !IsNullOrWhiteSpace(auxFiltro)) {
                                                                        var lst = [...listaFiltros];
                                                                        lst.push({ name: auxCriterio, value: auxFiltro });
                                                                        setListaFiltros(lst);
                                                                        setAuxCriterio("");
                                                                        setAuxFiltro("");
                                                                    }
                                                                }}>
                                                                    +1
                                                                </Button>
                                                            </InputGroup>
                                                        </FormGroup>
                                                        <Button type="submit" color="guardar-cambios">Buscar</Button>
                                                        &nbsp;&nbsp;
                                                        <Button type="button" color="cancel-alert" onClick={() => {
                                                            setListaFiltros([]); fetchDocumentos(props.ws, item, nro_regitros, ultimoRegistro, false, "", props.token, (data) => {
                                                                setMaximoRegistros(data.int_total_registros);
                                                                setListaDocumentos(data.lst_docs);
                                                                if (data.lst_docs.length > 0) {
                                                                    var arrHead = [];
                                                                    var arrBody = [];
                                                                    for (let i = 0; i < data.lst_docs.length; i++) {
                                                                        for (var obj in Object.keys(data.lst_docs[i])) {
                                                                            arrHead.push(Object.keys(data.lst_docs[i])[obj]);
                                                                        }
                                                                    }
                                                                    var dataArr = new Set(arrHead);
                                                                    arrHead = [...dataArr];
                                                                    for (let i = 0; i < data.lst_docs.length; i++) {
                                                                        var arrAux = [];
                                                                        for (var j = 0; j < arrHead.length; j++) {
                                                                            arrAux[j] = data.lst_docs[i][arrHead[j]] ?? "";
                                                                        }
                                                                        arrBody.push(arrAux);
                                                                    }
                                                                    setListaHeaderData(arrHead);
                                                                    //setListaDocBody(arrBody);
                                                                    setUltimoRegistro(data.lst_docs[data.lst_docs.length - 1]._id);
                                                                }
                                                            }, dispatch);
                                                        }}>Limpiar</Button>
                                                    </Form>
                                                </CardBody>
                                            </Card>
                                        </Collapse>
                                        <div id={"viewJSON" + item}>
                                            <ReactJson src={listaDocumentos} />
                                        </div>
                                        <div id={"viewTABLE" + item} style={{ display: "none", fontSize: "10px" }}>
                                            <JSONViewer json={listaDocumentos} />
                                        </div>
                                        <Row>
                                            <Col md={6}>
                                                <InputGroup style={{ width: 170 }} >
                                                    <Input value={nro_regitros} type="number" min={1} step={1} max={maximoRegistros} bsSize="sm" onChange={(e) => {
                                                        setNroRegitros(Number(e.target.value));
                                                    }} />
                                                    <Button onClick={() => fetchDocumentos(props.ws, item, nro_regitros, ultimoRegistro, true, "", props.token, (data) => {
                                                        setMaximoRegistros(data.int_total_registros);
                                                        var lst = [...listaDocumentos, ...data.lst_docs];
                                                        setListaDocumentos(lst);
                                                        if (data.lst_docs.length > 0) {
                                                            var arrHead = [];
                                                            var arrBody = [];
                                                            for (let i = 0; i < data.lst_docs.length; i++) {
                                                                for (var obj in Object.keys(data.lst_docs[i])) {
                                                                    arrHead.push(Object.keys(data.lst_docs[i])[obj]);
                                                                }
                                                            }
                                                            var dataArr = new Set(arrHead);
                                                            arrHead = [...dataArr];
                                                            for (let i = 0; i < data.lst_docs.length; i++) {
                                                                var arrAux = [];
                                                                for (var j = 0; j < arrHead.length; j++) {
                                                                    arrAux[j] = data.lst_docs[i][arrHead[j]] ?? "";
                                                                }
                                                                arrBody.push(arrAux);
                                                            }
                                                            setListaHeaderData(arrHead);
                                                            //setListaDocBody(arrBody);
                                                            setUltimoRegistro(data.lst_docs[data.lst_docs.length - 1]._id);
                                                        }
                                                    }, dispatch)}>
                                                        Cargar m&aacute;s!
                                                    </Button>
                                                </InputGroup>
                                            </Col>
                                            <Col md={6}>
                                                <span id="spanPagina" className="float-right">Mostrando 1 - {listaDocumentos.length} de {maximoRegistros}</span>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </TabPane>
                        )}
                    </TabContent>
                </CardBody>
            </Card>
        </Container>
    );
}

export default connect(mapStateToProps, {})(LogsMongo);