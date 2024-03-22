const Chip = (props) => {
    let chipType = '';
    switch (props.type) {
        case 'black':
            chipType = 'black'
            break;
        case 'gold':
            chipType = 'gold'
            break;
        case 'standar':
            chipType = 'standar'
            break;
        default:
            break;
    }
    return <h3 className={`chip ${chipType}`}>{props.children}</h3>
}

export default Chip;