// CustomSearchAutocomplete.jsx
import React, { useState, useEffect, useRef } from 'react';

const CustomSearchAutocomplete = ({
  items = [],
  onSearch,
  onSelect,
  placeholder,
  loading = false,
  collapse = false, // <- accept collapse prop from parent
  onClear, // <- new prop called when clear/cross is clicked
}) => {
   const [inputValue, setInputValue] = useState('');
   const [isOpen, setIsOpen] = useState(false);
   const wrapperRef = useRef(null);
  // items default and collapse prop handled via params above
  
   useEffect(() => {
     function handleClickOutside(event) {
       if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
         setIsOpen(false);
       }
     }
     document.addEventListener('mousedown', handleClickOutside);
     return () => document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   // Close dropdown when parent sets collapse=true
   useEffect(() => {
     if (collapse) {
       setIsOpen(false);
    } else {
      // when parent releases collapse, reopen if appropriate
      if (inputValue.length > 0 && items.length > 0) {
        setIsOpen(true);
      }
     }
   }, [collapse, inputValue, items]);
   
   const handleInputChange = (e) => {
     const value = e.target.value;
     setInputValue(value);
     onSearch(value);
     // Do not reopen if parent requested collapse
     if (!collapse) {
       setIsOpen(value.length > 0);
     }
   };
   
   const handleItemSelect = (item) => {
     setInputValue(item.name);
     setIsOpen(false);
     onSelect(item);
   };
   
   const handleInputFocus = () => {
     if (!collapse && inputValue.length > 0 && items.length > 0) {
       setIsOpen(true);
     }
   };

   // clear / cross click handler
   const handleClearClick = (e) => {
     e.preventDefault();
     setInputValue('');
     setIsOpen(false);
     // notify parent search handler with empty query
     if (typeof onSearch === 'function') onSearch('');
     if (typeof onClear === 'function') onClear();
   };
   
   return (
     <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        style={{
          width: '100%',
          height: '44px',
          padding: '0 0 0 12px', // make room for clear icon on right
          border: '1px solid #e1e5e9',
          borderRadius: '18px',
          fontSize: '14px',
          outline: 'none'
        }}
      />

      {/* Cross / clear icon - show only when there is text */}
      {inputValue.length > 0 && !collapse && (
        <button
          aria-label="clear search"
          onClick={handleClearClick}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px',
            lineHeight: 1,
            padding: '4px',
            color: '#666'
          }}
        >
          ×
        </button>
      )}
      
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          border: '1px solid #e1e5e9',
          borderRadius: '18px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 1000,
          maxHeight: '300px',
          overflow: 'auto',
          marginTop: '4px'
        }}>
          {loading ? (
            <div style={{ padding: '12px', textAlign: 'center' }}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                style={{ margin: '0 auto', display: 'block' }}
                aria-hidden="true"
                focusable="false"
              >
                <circle cx="12" cy="12" r="10" stroke="#e6e9ec" strokeWidth="4" fill="none" />
                <path
                  d="M22 12a10 10 0 0 1-10 10"
                  stroke="#3498db"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 12 12"
                    to="360 12 12"
                    dur="0.9s"
                    repeatCount="indefinite"
                  />
                </path>
              </svg>
            </div>
          ) : items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemSelect(item)}
                style={{
                  padding: '12px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f8f9fa';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                {item._hit?._source?.images?.[0]?.url && (
                  <img
                    src={item._hit._source.images[0].url}
                    alt=""
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                  />
                )}
                <span style={{ flex: 1 }}>{item.name}</span>
              </div>
            ))
          ) : inputValue && (
            <div style={{ padding: '12px', textAlign: 'center' }}>No products found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomSearchAutocomplete;