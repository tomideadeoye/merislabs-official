'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Badge } from './badge';
import { Command, CommandGroup, CommandItem } from './command';
import { Command as CommandPrimitive } from 'cmdk';

import { useMultiSelectStore } from './multiSelectStore';

interface MultiSelectProps {
  id: string;
  className?: string;
  placeholder?: string;
  onChange?: (selected: string[]) => void;
}

export function MultiSelect({ id, className, placeholder = 'Select options...', onChange }: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');

  const store = useMultiSelectStore(); // Call the hook without arguments
  const options = store((state) => state.options);
  const selected = store((state) => state.selected);
  const removeSelected = store((state) => state.removeSelected);
  const setSelected = store((state) => state.setSelected);
  const addSelected = store((state) => state.addSelected);
  const setOptions = store((state) => state.setOptions);

  const handleUnselect = (item: string) => {
    removeSelected(item);
    if (onChange) onChange(store.getState().selected.filter((v) => v !== item));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (input.value === '' && selected.length > 0) {
          setSelected(selected.slice(0, -1));
          if (onChange) onChange(selected.slice(0, -1));
        }
      }
      if (e.key === 'Escape') {
        input.blur();
      }
    }
  };

  const selectables = options.filter((option) => !selected.includes(option.value));
  const inputLower = inputValue.toLowerCase();
  const match = selectables.some((option) => option.label.toLowerCase() === inputLower);

  return (
    <Command onKeyDown={handleKeyDown} className={`overflow-visible bg-transparent ${className}`}>
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap">
          {selected.map((item) => {
            const option = options.find((o) => o.value === item);
            return (
              <Badge key={item} className="bg-gray-700 hover:bg-gray-600 text-gray-200">
                {option?.label || item}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  title="Remove tag"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUnselect(item);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(item)}
                >
                  <X className="h-3 w-3 text-gray-400 hover:text-gray-300" />
                </button>
              </Badge>
            );
          })}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={selected.length === 0 ? placeholder : ''}
            className="ml-2 bg-transparent outline-none placeholder:text-gray-500 flex-1"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && (selectables.length > 0 || (!match && inputValue.trim())) ? (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-gray-800 border-gray-700 text-gray-200 shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto max-h-[300px]">
              {selectables
                .filter((option) => option.label.toLowerCase().includes(inputLower))
                .map((option) => {
                  return (
                    <CommandItem
                      key={option.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => {
                        setInputValue('');
                        addSelected(option.value);
                        if (onChange) onChange([...selected, option.value]);
                        if (window && window.console)
                          window.console.info('[MULTISELECT][TAGS][SELECTED]', { tag: option.value });
                      }}
                      className="cursor-pointer"
                    >
                      {option.label}
                    </CommandItem>
                  );
                })}
              {!match && inputValue.trim() && (
                <CommandItem
                  key={inputValue}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onSelect={() => {
                    setInputValue('');
                    setOptions([...options, { label: inputValue, value: inputValue }]);
                    addSelected(inputValue);
                    if (onChange) onChange([...selected, inputValue]);
                    if (window && window.console)
                      window.console.info('[MULTISELECT][TAGS][CREATED]', { tag: inputValue });
                  }}
                  className="cursor-pointer text-purple-400"
                >
                  Create &quot;{inputValue}&quot;
                </CommandItem>
              )}
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  );
}
