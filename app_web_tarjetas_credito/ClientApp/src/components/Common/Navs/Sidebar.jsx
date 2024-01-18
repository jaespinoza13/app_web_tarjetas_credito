import React, { useState } from 'react';
import {
    NavItem,
    NavLink,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import '../../../scss/main.css';

function Sidebar(props) {
    const [collapsed, setCollapsed] = useState(false);
    const [funcionalidades, setFuncionalidades] = useState([]);

    console.log(props);
    function toggleSideBar() {
        setCollapsed(!collapsed);
    }

    return (
        <div className="content">
            <div className={`sidebar ${collapsed ? 'sidebar_min' : ''}`} id='sidebar'>
                <div className="sidebar_info">
                    <div className="sidebar_minimize">
                        <button className="btn_mg btn_mg__secondary" id="toggle-sidebar" onClick={toggleSideBar}>&#60;</button>
                    </div>
                    <div className="sidebar_profile">
                        <img src="../dist/images/avatar1.png" alt=""></img>
                        <h3>Cosme Fulanito</h3>
                        <hr></hr>
                        <h4>Asistente de Operaciones 2</h4>
                    </div>
                </div>
                <div className="sidebar_menu">
                    <div className="sidebar_menu__items">
                        {/*{listaFuncionalidades.forEach(element => {*/}
                        {/*    console.log(element);*/}
                        {/*})}*/}

                        <div className="sidebar_menu__item">
                            <a className="active item__master">Reportes</a>
                            <div className="item_slaves">
                                <a className="item__slave">Reportes</a>
                            </div>
                        </div>
                        <div className="sidebar_menu__item">
                            <NavItem>
                                <NavLink tag={Link} className="text-dark" to="/solicitud">Solicitud</NavLink>
                            </NavItem>
                        </div>
                        <div className="sidebar_menu__item">
                            <a className="item__master">Reportes</a>
                            <div className="item_slaves">
                                <a className="item__slave">
                                    Reportes
                                </a>
                                <a className="item__slave">Reportes</a>
                            </div>
                        </div>
                        <div className="sidebar_menu__item">
                            <a className="item__master">Reportes</a>
                            <div className="item_slaves">
                                <a className="item__slave">Reportes</a>
                                <a className="item__slave">Reportes</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default /*connect(mapStateToProps, {})*/(Sidebar);;