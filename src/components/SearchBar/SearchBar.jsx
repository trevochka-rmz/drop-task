import React, { useState, useEffect } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
    const [inputValue, setInputValue] = useState('');
    const [debouncedValue, setDebouncedValue] = useState('');

    // Дебаунс для поиска (задержка 300мс)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(inputValue);
        }, 300);

        return () => {
            clearTimeout(timer);
        };
    }, [inputValue]);

    // Вызываем поиск после дебаунса
    useEffect(() => {
        onSearch(debouncedValue);
    }, [debouncedValue, onSearch]);

    const handleChange = (e) => {
        setInputValue(e.target.value);
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
                        onClick={() => setInputValue('')}
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
