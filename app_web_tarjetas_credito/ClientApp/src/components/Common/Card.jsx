const Card = (props) => {
    const classNamesArr = ["card", ...(props.className || [])];
    const classNames = classNamesArr.join(' ');

    return (
        <div className={props.incluyeImagen === true ? "card_image" : classNames }>
            {props.children}
        </div >
    );
}

export default Card;