'use client';

import React from 'react';

export type CardVariant =
  | 'default'
  | 'compact'
  | 'feature'
  | 'kpi'
  | 'interactive'
  | 'ai'
  | 'accent'
  | 'status-success'
  | 'status-warning'
  | 'status-error'
  | 'status-info';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  is3D?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const VARIANT_CLASS_MAP: Record<CardVariant, string> = {
  default: 'card-standard',
  compact: 'card-compact',
  feature: 'card-feature',
  kpi: 'card-kpi',
  interactive: 'card-interactive',
  ai: 'card-ai',
  accent: 'card-accent',
  'status-success': 'card-status-success',
  'status-warning': 'card-status-warning',
  'status-error': 'card-status-error',
  'status-info': 'card-status-info',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', is3D = false, className = '', children, style, ...props }, ref) => {
    const variantClass = VARIANT_CLASS_MAP[variant] || 'card-standard';
    const threeDClass = is3D ? 'card-3d' : '';
    const combinedClasses = [variantClass, threeDClass, className].filter(Boolean).join(' ');

    return (
      <div ref={ref} className={combinedClasses} style={style} {...props}>
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = '', children, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={className}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 12,
          marginBottom: 12,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardHeader.displayName = 'CardHeader';

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div';
  className?: string;
  children?: React.ReactNode;
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ as: Component = 'h3', className = '', children, style, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`font-display ${className}`.trim()}
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: 0,
          lineHeight: 1.3,
          letterSpacing: '-0.01em',
          ...style,
        }}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
CardTitle.displayName = 'CardTitle';

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string;
  children?: React.ReactNode;
}

export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className = '', children, style, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={className}
        style={{
          fontSize: 12.5,
          color: 'var(--text-muted)',
          margin: '3px 0 0',
          lineHeight: 1.5,
          ...style,
        }}
        {...props}
      >
        {children}
      </p>
    );
  }
);
CardDescription.displayName = 'CardDescription';

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = '', children, style, ...props }, ref) => {
    return (
      <div ref={ref} className={className} style={{ ...style }} {...props}>
        {children}
      </div>
    );
  }
);
CardContent.displayName = 'CardContent';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = '', children, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={className}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginTop: 16,
          paddingTop: 12,
          borderTop: '1px solid var(--border-subtle)',
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardFooter.displayName = 'CardFooter';

export interface CardIconProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export const CardIcon = React.forwardRef<HTMLDivElement, CardIconProps>(
  ({ size = 'md', className = '', children, style, ...props }, ref) => {
    const sizeClass =
      size === 'sm'
        ? 'card-icon-container-sm'
        : size === 'lg'
        ? 'card-icon-container-lg'
        : '';
    const combinedClasses = `card-icon-container ${sizeClass} ${className}`.trim();

    return (
      <div ref={ref} className={combinedClasses} style={style} {...props}>
        {children}
      </div>
    );
  }
);
CardIcon.displayName = 'CardIcon';
