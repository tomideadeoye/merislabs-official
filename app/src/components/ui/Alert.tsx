import * as React from 'react';

export const Alert: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  React.useEffect(() => {
    console.info('[Alert] mounted');
    return () => console.info('[Alert] unmounted');
  }, []);
  return (
    <div role= "alert" className = "p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700" {...props }>
      { children }
      </div>
  );
};

export const AlertDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ children, ...props }) => (
  <p className= "text-sm" { ...props }> { children } </p>
);

export const AlertTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, ...props }) => (
  <h4 className= "font-bold" { ...props }> { children } </h4>
);
