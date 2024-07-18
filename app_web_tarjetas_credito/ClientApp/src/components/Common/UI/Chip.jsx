const Chip = (props) => {
    let chipType = '';
    switch (props.type) {
        /*case 'black':
            chipType = 'black'
            break;
        case 'gold':
            chipType = 'gold'
            break;
        case 'standar':
            chipType = 'standar'
            break;*/
        case 'BLACK':
            chipType = 'black'
            break;
        case 'GOLD':
            chipType = 'gold'
            break;
        case 'ESTÁNDAR':
            chipType = 'standar'
            break;
        default:
            break;
    }
    return <h3 className={`chip ${chipType}`}>{props.children}</h3>
}

export default Chip;