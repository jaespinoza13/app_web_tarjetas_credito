function Card(props) {
    const classNamesArr = ["card", ...(props.className || [])];
    const classNames = classNamesArr.join(' ');
    return(
        <div className={classNames}>
            { props.children }
        </div >
    );
}

export default Card;