import React, { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
import { connect } from 'react-redux';
import {
    Button,
    Container, Input,
} from 'reactstrap';
import { useExecuteScript } from "../../hooks/useHooks"
import ModalAlert from '../Common/Alert';
import LoadingAlert from '../Common/Loading';

const mapStateToProps = (state) => {
    return {
    };
};

function DibujarSeguimiento(props) {
    const [loadding, setLoadding] = useState(false);
    const [nodeSel, setNodeSel] = useState("");
    const [script, setScript] = useState("");
    const [listaNodos, setListaNodos] = useState([]);

    const random_hex_color_code = () => {
        let simbolos, color;
        simbolos = "0123456789ABCDEF";
        color = "#";

        for (var i = 0; i < 6; i++) {
            color = color + simbolos[Math.floor(Math.random() * 16)];
        }
        return color
    };

    useEffect(() => {
        setLoadding(true);
        var nod = "";
        var ed = ""
        var id = 2;
        var nodos = [];
        for (let i = 0; i < props.lists.length; i++) {
            var color = random_hex_color_code();
            ed += "{ from: 1, color: {color: \"" + color + "\"}, label: \"" + props.lists[i][0].str_web_service + "\", to: " + id + " },";
            for (let j = 0; j < props.lists[i].length; j++) {
                nod += "{ id: " + id + ", color: {background: \"" + color + "\"}, font: {color: \"white\"}, label: \"" + props.lists[i][j].str_coleccion + "\" },";
                nodos.push({ id: id, ws: props.lists[i][j].str_web_service, cl: props.lists[i][j].str_coleccion, data: props.lists[i][j] });
                id++;
                if (j < props.lists[i].length - 1) {
                    ed += "{ from: " + (id - 1) + ", color: {color: \"" + color + "\"}, label: \"" + props.lists[i][j].str_web_service + "\", to: " + id + " },";
                }
            }
        }
        setListaNodos(nodos);
        setScript("try{" +
            "document.getElementById('btnLoad').click();" +
            "var tim = setTimeout(() => {" +
            "var nodes = new vis.DataSet([" +
            "{ id: 1, label: \"" + props.transaccion + "\" }," +
            nod +
            "]);" +
            "var edges = new vis.DataSet([" +
            ed +
            "]);" +
            "var container = document.getElementById(\"mynetwork\");" +
            "var data = {" +
            "   nodes: nodes," +
            "   edges: edges," +
            "};" +
            "var options = {}; " +
            "var network = new vis.Network(container, data, options);" +
            "network.on(\"selectNode\", function (params) {" +
            "    document.getElementById('nodoSelected').value = params.nodes[0];" +
            "    document.getElementById('nodoSelected').click();" +
            "});" +
            "document.getElementById('btnLoad').click();" +
            "clearTimeout(tim);" +
            "}, 500);" +
            "}catch(err){" +
            "    console.log(err);" +
            "}");
        setLoadding(false);
    }, [props.lists, props.transaccion]);

    useExecuteScript({
        execute: script
    });

    return (
        <Container>
            <div id="mynetwork" style={{ height: "400px", width: "100%" }}></div>
            <Input type="hidden" id="nodoSelected" onClick={(e) => {
                setNodeSel(document.getElementById('nodoSelected').value);
            }} />
            <Button type="button" id="btnLoad" style={{ display: "none" }} onClick={() => setLoadding(!loadding)}></Button>
            {loadding ?
                <LoadingAlert openLoad={loadding} setOpenLoad={setLoadding} />
                : ""}
            <ModalAlert
                titleAlert={"Datos de " + (nodeSel !== "" ? listaNodos.find((it) => it.id === Number(nodeSel)).ws + " - " + listaNodos.find((it) => it.id === Number(nodeSel)).cl : "")}
                icon={'info'}
                openModal={nodeSel !== ""}
                size={"lg"}
                unmountOnClose={true}
                handlerBtnCancelar={() => { setNodeSel(""); }}
                handlerBtnAceptar={() => { setNodeSel(""); }}
                btnAceptar={"Aceptar"} >
                <ReactJson src={nodeSel !== "" ? listaNodos.find((it) => it.id === Number(nodeSel)).data : {}} />
            </ModalAlert>
        </Container>
    );
}

export default connect(mapStateToProps, {})(DibujarSeguimiento);