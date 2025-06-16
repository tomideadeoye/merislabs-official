import * as React from 'react';

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onValueChange,
  children,
  ...props
}) => {
  React.useEffect(() => {
    console.info('[RadioGroup] mounted', { value });
    return () => console.info('[RadioGroup] unmounted');
  }, []);
  return (
    <div role="radiogroup" {...props}>
      {React.Children.map(children, (child) => {
        if (
          React.isValidElement(child) &&
          (child.type as any).displayName === 'RadioGroupItem'
        ) {
          const radioChild = child as React.ReactElement<RadioGroupItemProps>;
          return React.cloneElement(radioChild, {
            checked: radioChild.props.value === value,
            onChange: () => onValueChange?.(radioChild.props.value),
          });
        }
        return child;
      })}
    </div>
  );
};

export interface RadioGroupItemProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  checked?: boolean;
}

export const RadioGroupItem: React.FC<RadioGroupItemProps> = ({
  value,
  checked,
  ...props
}) => {
  return (
    <label style={{ marginRight: 8 }}>
      <input type="radio" value={value} checked={checked} {...props} /> {value}
    </label>
  );
};

RadioGroupItem.displayName = 'RadioGroupItem';
