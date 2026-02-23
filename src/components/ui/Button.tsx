import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = '',
    ...props
}: ButtonProps) {
    const baseStyle: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        fontWeight: 500,
        transition: 'all var(--transition-fast)',
        width: fullWidth ? '100%' : 'auto',
    };

    const variantStyles: Record<string, React.CSSProperties> = {
        primary: {
            background: 'var(--accent-primary)',
            color: '#ffffff',
            boxShadow: 'var(--shadow-md)',
        },
        secondary: {
            background: 'var(--bg-surface-hover)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
        },
        outline: {
            background: 'transparent',
            color: 'var(--accent-primary)',
            border: '1px solid var(--accent-primary)',
        },
        ghost: {
            background: 'transparent',
            color: 'var(--text-secondary)',
        },
    };

    const sizeStyles: Record<string, React.CSSProperties> = {
        sm: { padding: '0.375rem 0.75rem', fontSize: '0.875rem' },
        md: { padding: '0.5rem 1rem', fontSize: '1rem' },
        lg: { padding: '0.75rem 1.5rem', fontSize: '1.125rem' },
    };

    const combinedStyle = {
        ...baseStyle,
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...(props.disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
    };

    return (
        <button
            style={combinedStyle}
            className={className}
            onMouseOver={(e) => {
                if (props.disabled) return;
                if (variant === 'primary') e.currentTarget.style.background = 'var(--accent-primary-hover)';
                if (variant === 'ghost') e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseOut={(e) => {
                if (props.disabled) return;
                if (variant === 'primary') e.currentTarget.style.background = variantStyles.primary.background as string;
                if (variant === 'ghost') e.currentTarget.style.color = variantStyles.ghost.color as string;
            }}
            {...props}
        >
            {children}
        </button>
    );
}
