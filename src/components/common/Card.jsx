/**
 * Card Component
 * Reusable card container with variants
 */

import './Card.css';

export default function Card({
    children,
    variant = 'default',
    padding = 'medium',
    className = '',
    onClick,
    hoverable = false,
    ...props
}) {
    const classes = [
        'card',
        `card--${variant}`,
        `card--padding-${padding}`,
        hoverable && 'card--hoverable',
        onClick && 'card--clickable',
        className
    ].filter(Boolean).join(' ');

    return (
        <div
            className={classes}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            {...props}
        >
            {children}
        </div>
    );
}

/**
 * Card Header Sub-component
 */
Card.Header = function CardHeader({ children, className = '' }) {
    return (
        <div className={`card__header ${className}`}>
            {children}
        </div>
    );
};

/**
 * Card Body Sub-component
 */
Card.Body = function CardBody({ children, className = '' }) {
    return (
        <div className={`card__body ${className}`}>
            {children}
        </div>
    );
};

/**
 * Card Footer Sub-component
 */
Card.Footer = function CardFooter({ children, className = '' }) {
    return (
        <div className={`card__footer ${className}`}>
            {children}
        </div>
    );
};
