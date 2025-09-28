import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'default' | 'ghost'
}

export default function Button({ variant = 'default', className = '', ...props }: ButtonProps) {
    const base = 'inline-flex items-center px-3 py-1 rounded-md text-sm font-medium'
    const variantCls = variant === 'ghost' ? 'bg-transparent text-gray-800' : 'bg-blue-600 text-white'
    return <button className={`${base} ${variantCls} ${className}`} {...props} />
}
