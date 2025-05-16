import React, { useState, useEffect, useCallback } from 'react';
import ItemList from './components/ItemList/ItemList';
import SearchBar from './components/SearchBar/SearchBar';
import {
    fetchItems,
    fetchState,
    updateOrder,
    updateSelection,
} from './api/api';
import './App.css';

function App() {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Загрузка начального состояния
    useEffect(() => {
        const loadInitialState = async () => {
            try {
                const serverState = await fetchState();
                if (serverState.order) {
                    const data = await fetchItems(1, '', 20);
                    setItems(data.items);
                    setPage(2);
                    setHasMore(data.hasMore);
                }
            } catch (error) {
                console.error('Error loading initial state:', error);
            }
        };

        loadInitialState();
    }, []);

    const loadItems = useCallback(
        async (reset = false) => {
            if (isLoading) return;

            setIsLoading(true);
            const currentPage = reset ? 1 : page;

            try {
                const data = await fetchItems(currentPage, searchTerm);
                setItems((prev) =>
                    reset ? data.items : [...prev, ...data.items]
                );
                setPage(currentPage + 1);
                setHasMore(data.hasMore);
            } catch (error) {
                console.error('Error loading items:', error);
            } finally {
                setIsLoading(false);
            }
        },
        [page, searchTerm, isLoading]
    );

    useEffect(() => {
        loadItems(true);
    }, [searchTerm]);

    const handleSelect = async (id, selected) => {
        try {
            await updateSelection(id, selected);
            setItems((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, selected } : item
                )
            );
        } catch (error) {
            console.error('Error updating selection:', error);
        }
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const newItems = Array.from(items);
        const [reorderedItem] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, reorderedItem);

        setItems(newItems);
        await updateOrder(newItems.map((item) => item.id));
    };

    return (
        <div className="app">
            <h1>Items List (1-1,000,000)</h1>
            <SearchBar onSearch={setSearchTerm} />
            <ItemList
                items={items}
                onLoadMore={loadItems}
                hasMore={hasMore}
                isLoading={isLoading}
                onSelect={handleSelect}
                onDragEnd={handleDragEnd}
            />
        </div>
    );
}

export default App;
