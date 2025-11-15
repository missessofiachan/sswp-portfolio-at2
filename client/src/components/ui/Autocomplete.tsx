/**
 * @file Autocomplete.tsx
 * @description Reusable autocomplete component with dropdown suggestions and search highlighting
 * @version 1.0.0
 */

import { sprinkles } from '@client/app/sprinkles.css';
import { vars } from '@client/app/theme.css';
import { highlightSearch } from '@client/utils/searchHighlight';
import { style } from '@vanilla-extract/css';
import { useEffect, useRef, useState } from 'react';
import { FiSearch } from 'react-icons/fi';

// Generic item type for autocomplete
export interface AutocompleteItem {
  id: string;
  name: string;
  description?: string;
  [key: string]: unknown; // Allow additional properties
}

interface AutocompleteProps<T extends AutocompleteItem> {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (item: T) => void;
  items: T[] | undefined;
  placeholder?: string;
  ariaLabel?: string;
  maxSuggestions?: number;
  disabled?: boolean;
  searchFields?: (keyof T)[]; // Fields to search in
  renderItem?: (item: T, searchTerm: string) => React.ReactNode; // Custom item renderer
  formatItem?: (item: T) => { name: string; description?: string; price?: string }; // Format item for display
}

const autocompleteContainer = style({
  position: 'relative',
  width: '100%',
});

const inputWrapper = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
});

const searchIcon = style({
  position: 'absolute',
  left: vars.space.md,
  pointerEvents: 'none',
  color: vars.color.textMuted,
  zIndex: 1,
});

const input = style({
  width: '100%',
  padding: `${vars.space.sm} ${vars.space.md} ${vars.space.sm} 2.5rem`,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  fontSize: '1rem',
  backgroundColor: vars.color.surface,
  color: vars.color.text,
  transition: 'border-color 0.2s, box-shadow 0.2s',

  ':focus': {
    outline: 'none',
    borderColor: vars.color.accent,
    boxShadow: `0 0 0 3px ${vars.color.focus}`,
  },

  ':disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
});

const dropdown = style({
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  zIndex: 1000,
  maxHeight: '300px',
  overflowY: 'auto',
  marginTop: vars.space.xs,
  borderRadius: vars.radius.md,
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  boxShadow: vars.shadow.lg,
});

const suggestionItem = style({
  padding: `${vars.space.sm} ${vars.space.md}`,
  cursor: 'pointer',
  borderBottom: `1px solid ${vars.color.border}`,
  transition: 'background-color 0.15s',

  ':last-child': {
    borderBottom: 'none',
  },

  ':hover': {
    backgroundColor: vars.color.surfaceMuted,
  },
});

const highlightedItem = style({
  backgroundColor: vars.color.surfaceMuted,
});

const itemName = style({
  fontWeight: 600,
  fontSize: '0.95rem',
  color: vars.color.text,
  marginBottom: vars.space.xs,
});

const itemDescription = style({
  fontSize: '0.875rem',
  color: vars.color.textMuted,
  marginTop: vars.space.xs,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const itemPrice = style({
  fontSize: '0.875rem',
  color: vars.color.accent,
  fontWeight: 600,
  marginTop: vars.space.xs,
});

/**
 * Autocomplete component with search highlighting and keyboard navigation
 *
 * @example
 * ```tsx
 * <Autocomplete
 *   value={searchTerm}
 *   onChange={setSearchTerm}
 *   items={products}
 *   onSelect={(product) => navigate(`/products/${product.id}`)}
 *   placeholder="Search products..."
 *   maxSuggestions={5}
 * />
 * ```
 */
export default function Autocomplete<T extends AutocompleteItem>({
  value,
  onChange,
  onSelect,
  items = [],
  placeholder = 'Search...',
  ariaLabel = 'Search',
  maxSuggestions = 5,
  disabled = false,
  searchFields = ['name', 'description'],
  renderItem,
  formatItem,
}: AutocompleteProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filter items based on search query
  const suggestions = items
    .filter((item) => {
      if (!value.trim()) return false;
      const query = value.toLowerCase();
      return searchFields.some((field) => {
        const fieldValue = item[field];
        if (typeof fieldValue === 'string') {
          return fieldValue.toLowerCase().includes(query);
        }
        return false;
      });
    })
    .slice(0, maxSuggestions);

  // Reset highlighted index when suggestions change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [suggestions.length, value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsOpen(newValue.trim().length > 0 && suggestions.length > 0);
    setHighlightedIndex(-1);
  };

  const handleInputFocus = () => {
    if (value.trim().length > 0 && suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  const handleSelect = (item: T) => {
    const displayName = formatItem ? formatItem(item).name : item.name;
    onChange(displayName);
    setIsOpen(false);
    setHighlightedIndex(-1);
    if (onSelect) {
      onSelect(item);
    }
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSelect(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && suggestionsRef.current) {
      const highlightedElement = suggestionsRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    }
  }, [highlightedIndex]);

  const renderSuggestion = (item: T, index: number) => {
    if (renderItem) {
      return renderItem(item, value);
    }

    const formatted = formatItem
      ? formatItem(item)
      : { name: item.name, description: item.description };
    const isHighlighted = index === highlightedIndex;

    return (
      <div
        key={item.id}
        role="option"
        aria-selected={isHighlighted}
        onClick={() => handleSelect(item)}
        onMouseEnter={() => setHighlightedIndex(index)}
        className={`${suggestionItem} ${isHighlighted ? highlightedItem : ''}`}
      >
        <div className={itemName}>{highlightSearch(formatted.name, value)}</div>
        {formatted.description && (
          <div className={itemDescription}>{highlightSearch(formatted.description, value)}</div>
        )}
        {'price' in formatted && formatted.price && (
          <div className={itemPrice}>{formatted.price}</div>
        )}
      </div>
    );
  };

  return (
    <div ref={dropdownRef} className={autocompleteContainer}>
      <div className={inputWrapper}>
        <FiSearch className={searchIcon} size={18} aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label={ariaLabel}
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls="autocomplete-suggestions"
          disabled={disabled}
          autoComplete="off"
          className={input}
        />
      </div>
      {isOpen && suggestions.length > 0 && (
        <div id="autocomplete-suggestions" ref={suggestionsRef} className={dropdown} role="listbox">
          {suggestions.map((item, index) => renderSuggestion(item, index))}
        </div>
      )}
    </div>
  );
}
