import React, { useState } from 'react';
import '../../../scss/main.css';

//const mapStateToProps = (state) => {
//    return {
//        token: state.tokenActive.data,
//        listaFuncionalidades: state.GetListaFuncionalidades.data,
//    };
//};
function Sidebar(props) {
    const [collapsed, setCollapsed] = useState(false);
    const [funcionalidades, setFuncionalidades] = useState([]);


    function toggleSideBar() {
        console.log('clicked');
        setCollapsed(!collapsed);
    }

    return (
    <div class="content">
            <div class={`sidebar ${collapsed ? 'sidebar_min' : ''}`} id='sidebar'>
            <div class="sidebar_info">
                    <div class="sidebar_minimize">
                        <button class="btn_mg btn_mg__secondary" id="toggle-sidebar" onClick={toggleSideBar}>&#60;</button>
                </div>
                <div class="sidebar_profile">
                    <img src="../dist/images/avatar1.png" alt=""></img>
                    <h3>Cosme Fulanito</h3>
                    <hr></hr>
                    <h4>Asistente de Operaciones 2</h4>
                </div>
            </div>
            <div class="sidebar_menu">
                <div class="sidebar_menu__items">
                    {/*{listaFuncionalidades.forEach(element => {*/}
                    {/*    console.log(element);*/}
                    {/*})}*/}
                    <div class="sidebar_menu__item">
                        <a class="active item__master">Reportes</a>
                        <div class="item_slaves">
                            <a class="item__slave">Reportes</a>
                        </div>
                    </div>
                    <div class="sidebar_menu__item">
                        <a class="item__master">Reportes</a>
                        <div class="item_slaves">
                            <a class="item__slave">
                                Reportes
                            </a>
                            <a class="item__slave">Reportes</a>
                        </div>
                    </div>
                    <div class="sidebar_menu__item">
                        <a class="item__master">Reportes</a>
                        <div class="item_slaves">
                            <a class="item__slave">Reportes</a>
                            <a class="item__slave">Reportes</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}

export default /*connect(mapStateToProps, {})*/(Sidebar); ;