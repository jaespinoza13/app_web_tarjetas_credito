import '../../../css/Components/PopoverComponent.css';
import { Fragment, useState } from 'react';
import Popover from '@mui/material/Popover';
import PropTypes from 'prop-types';

const PopoverComponent = (props) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const { textoPrincipal, icon: Icon, children } = props;
    const [anchorOriginPopover, setAnchorOriginPopover] = useState({
        vertical: props.anchorOrigin.vertical,
        horizontal: props.anchorOrigin.horizontal,
    })
    const [transformOriginPopover, setTransformOriginPopover] = useState({
        vertical: props.transformOrigin.vertical,
        horizontal: props.transformOrigin.horizontal,
    })

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };


    return (
        <Fragment>
            <div style={props.style}>
                <div className='popover-container'
                    aria-owns={open ? 'mouse-over-popover' : undefined}
                    aria-haspopup="true"
                    onMouseEnter={handlePopoverOpen}
                    onMouseLeave={handlePopoverClose}
                >
                    {Icon && <Icon style={{ marginRight: "8px", fontSize: "21px" }} />}
                    {textoPrincipal}
                </div>
                <Popover
                    id="mouse-over-popover"
                    sx={{ pointerEvents: 'none' }}
                    open={open}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: anchorOriginPopover.vertical,
                        horizontal: anchorOriginPopover.horizontal,
                    }}
                    transformOrigin={{
                        vertical: transformOriginPopover.vertical,
                        horizontal: transformOriginPopover.horizontal,
                    }}
                    onClose={handlePopoverClose}
                    disableRestoreFocus
                >
                    {children}
                    </Popover>
            </div>
        </Fragment>
    );
};

// Definir tipos de propiedades
PopoverComponent.propTypes = {
    textoPrincipal: PropTypes.string.isRequired,
    icon: PropTypes.elementType,
    children: PropTypes.node,
    anchorOrigin: PropTypes.shape({
        vertical: PropTypes.oneOf(['top', 'bottom', 'center']).isRequired,
        horizontal: PropTypes.oneOf(['left', 'right', 'center']).isRequired
    }).isRequired,
    transformOrigin: PropTypes.shape({
        vertical: PropTypes.oneOf(['top', 'bottom', 'center']).isRequired,
        horizontal: PropTypes.oneOf(['left', 'right', 'center']).isRequired
    }).isRequired
};

// Valores predeterminados para las propiedades
PopoverComponent.defaultProps = {
    icon: null,
    children: null,
    anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center'
    },
    transformOrigin: {
        vertical: 'top',
        horizontal: 'center'
    }
};
export default PopoverComponent;