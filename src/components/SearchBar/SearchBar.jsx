import React, { useState, useEffect } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch }) {
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        console.log('Input changed:', inputValue);
        const timer = setTimeout(() => {
            console.log('Debounced search:', inputValue);
            onSearch(inputValue);
        }, 500);

        return () => {
            console.log('Clearing timeout');
            clearTimeout(timer);
        };
    }, [inputValue, onSearch]);

    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleClear = () => {
        setInputValue('');
        onSearch('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Search button clicked:', inputValue);
        onSearch(inputValue); // Немедленный поиск
    };

    return (
        <form onSubmit={handleSubmit} className="search-bar">
            <div className="search-input-container">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    placeholder="Search items..."
                    className="search-input"
                    aria-label="Search items"
                />
                {inputValue && (
                    <button
                        type="button"
                        className="clear-button"
                        onClick={handleClear}
                        aria-label="Clear search"
                    >
                        ×
                    </button>
                )}
            </div>
            <button type="submit" className="search-button">
                Search
            </button>
        </form>
    );
}

export default SearchBar;
