import './Button.css';

export default function Button({
    children,
    variant = 'primary',
    size = 'medium',
    type = 'button',
    disabled = false,
    loading = false,
    fullWidth = false,
    icon = null,
    onClick,
    className = '',
    ...props
}) {
    const classes = [
        'btn',
        `btn--${variant}`,
        `btn--${size}`,
        fullWidth && 'btn--full-width',
        loading && 'btn--loading',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading && <span className="btn__spinner" />}
            {icon && !loading && <span className="btn__icon">{icon}</span>}
            <span className="btn__text">{children}</span>
        </button>
    );
}
