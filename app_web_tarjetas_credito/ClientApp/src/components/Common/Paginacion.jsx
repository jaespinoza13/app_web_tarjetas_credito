import '../../css/Components/Paginacion.css';

const Paginacion = ({ numPaginas, paginaActual, setPaginaActual }) => {
    const paginas = [...Array(numPaginas + 1).keys()].slice(1)
    const avanzarPagina = () => {
        if (paginaActual !== numPaginas) setPaginaActual(paginaActual + 1)
    }
    const regresarPagina = () => {
        if (paginaActual !== 1) setPaginaActual(paginaActual - 1)
    }


    return (
        <nav className='estilo_paginacion'>
            <ul className='pagination justify-content-center efecto-lista'>
                <li className="page-item">
                    {/*<a className="page-link indicador"*/}
                    {/*    onClick={regresarPagina}*/}
                    {/*    href='#'>*/}
                    {/*    &lt;*/}
                    {/*</a>*/}

                    <button className="page-link indicador" onClick={regresarPagina}>
                        &lt;
                    </button>
                </li>
                {paginas.map(numPagina => (
                    <li key={numPagina}
                        className={`page-item ${paginaActual == numPagina ? 'active' : ''} `} >

                        <button className="page-link" onClick={() => setPaginaActual(numPagina)}>
                            {numPagina}
                        </button>


                        {/*<a onClick={() => setPaginaActual(numPagina)}*/}
                        {/*    className='page-link'*/}
                        {/*    href='/'>*/}
                        {/*    {numPagina}*/}
                        {/*</a>*/}
                    </li>
                ))}
                <li className="page-item">
                    {/*<a className="page-link indicador"*/}
                    {/*    onClick={avanzarPagina}*/}
                    {/*    href='#'>*/}
                    {/*    &gt;*/}
                    {/*</a>*/}
                    <button className="page-link indicador" onClick={avanzarPagina}>
                        &gt;
                    </button>
                </li>
            </ul>
        </nav>
    )
};

export default Paginacion;
