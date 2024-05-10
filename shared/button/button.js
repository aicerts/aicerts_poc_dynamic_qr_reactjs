import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ label = '', onClick = () => {}, className = '' }) => {

    return (
        <button className={`global-button ${className}`} onClick={onClick}>
            {label}
        </button>
    );
}

Button.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    className: PropTypes.string,
};

export default Button;
