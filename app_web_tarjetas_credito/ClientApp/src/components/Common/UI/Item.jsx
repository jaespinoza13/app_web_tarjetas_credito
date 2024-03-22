const Item = (props) => {
    
    const columnClasses = `col-xs-${props.xs || ''} col-sm-${props.sm || ''} col-md-${props.md || ''} col-lg-${props.lg || ''} col-xl-${props.xl || ''}`;
    return (
        <div className={`${columnClasses} ${props.className }`}>
            {props.children}
        </div>
    );
}

export default Item;