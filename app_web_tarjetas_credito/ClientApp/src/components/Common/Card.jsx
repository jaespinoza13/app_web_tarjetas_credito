const Card = (props) => {

    return (
        <div className={props.incluyeImagen === true ? "card_image" : "card card-row"}>
            {props.children}
        </div>
    );
}

export default Card;