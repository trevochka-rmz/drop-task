import React, { useState, useEffect } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
    const [inputValue, setInputValue] = useState('');
    const [debouncedValue, setDebouncedValue] = useState('');

    // Дебаунс для уменьшения количества запросов при вводе
    useEffect(() => {
        console.log('Search input changed:', inputValue);
        const timer = setTimeout(() => {
            console.log('Debounced search:', inputValue);
            setDebouncedValue(inputValue);
        }, 300);

        return () => {
            console.log('Clearing search timeout');
            clearTimeout(timer);
        };
    }, [inputValue]);

    useEffect(() => {
        console.log('Triggering search for:', debouncedValue);
        onSearch(debouncedValue);
    }, [debouncedValue, onSearch]);

    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleClear = () => {
        setInputValue('');
        setDebouncedValue('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(inputValue);
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
};

export default SearchBar;
