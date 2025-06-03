import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
    fetchItems,
    fetchState,
    updateSelection,
    updateMultipleSelections,
    updateOrder,
} from './api/api.js';
import SearchBar from './components/SearchBar/SearchBar.jsx';
import './App.css';

function App() {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCount, setSelectedCount] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    // Загрузка данных
    const loadItems = useCallback(
        async (reset = false) => {
            if (isLoading) {
                console.log('Load items skipped: already loading');
                return;
            }

            console.log(
                `Loading items: reset=${reset}, page=${page}, search="${searchTerm}"`
            );
            setIsLoading(true);
            const currentPage = reset ? 1 : page;

            try {
                const data = await fetchItems(currentPage, 20, searchTerm);
                console.log('Fetched data:', {
                    items: data.items.length,
                    total: data.total,
                    hasMore: data.hasMore,
                    page: data.page,
                });

                setItems((prev) => {
                    const newItems = reset
                        ? data.items
                        : [...prev, ...data.items];
                    const uniqueItems = Array.from(
                        new Map(
                            newItems.map((item) => [item.id, item])
                        ).values()
                    );
                    console.log(
                        `Items updated: ${
                            uniqueItems.length
                        } total, duplicates: ${
                            newItems.length - uniqueItems.length
                        }, reset: ${reset}`
                    );
                    return uniqueItems;
                });

                setPage(currentPage + 1);
                setHasMore(data.hasMore);
                console.log(
                    `Page updated to ${currentPage + 1}, hasMore=${
                        data.hasMore
                    }`
                );
            } catch (error) {
                console.error('Failed to load items:', error);
                // Показываем ошибку пользователю
                setItems([]); // Очищаем список при ошибке
                setHasMore(false);
            } finally {
                setIsLoading(false);
            }
        },
        [page, searchTerm, isLoading]
    );
    useEffect(() => {
        console.log('App State Update:', {
            itemsCount: items.length,
            page,
            hasMore,
            searchTerm,
            selectedCount,
        });
    }, [items, page, hasMore, searchTerm, selectedCount]);
    // Загрузка начального состояния
    useEffect(() => {
        const initApp = async () => {
            try {
                const state = await fetchState();
                console.log('Initial state:', state);
                setSelectedCount(state.selectedCount || 0);
                await loadItems(true);
            } catch (error) {
                console.error('Initialization failed:', error);
            }
        };

        initApp();
    }, []);

    // Обработчик поиска
    const handleSearch = (term) => {
        console.log('Search term changed:', term);
        setSearchTerm(term);
        setPage(1);
        setHasMore(true);
        loadItems(true);
    };

    // Обработчик выбора элемента
    const handleSelect = async (id, selected) => {
        try {
            await updateSelection(id, selected);
            setItems((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, selected } : item
                )
            );
            setSelectedCount((prev) => (selected ? prev + 1 : prev - 1));
        } catch (error) {
            console.error('Failed to update selection:', error);
        }
    };

    // Обработчик массового выбора
    const handleSelectMultiple = async (ids, selected) => {
        try {
            await updateMultipleSelections(ids, selected);
            setItems((prev) =>
                prev.map((item) =>
                    ids.includes(item.id) ? { ...item, selected } : item
                )
            );
            setSelectedCount((prev) =>
                selected ? prev + ids.length : prev - ids.length
            );
        } catch (error) {
            console.error('Failed to update multiple selections:', error);
        }
    };

    // Обработчик перетаскивания
    const handleDragEnd = async (result) => {
        setIsDragging(false);

        if (!result.destination) return;

        const newItems = Array.from(items);
        const [movedItem] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, movedItem);

        setItems(newItems);

        try {
            await updateOrder(newItems.map((item) => item.id));
        } catch (error) {
            console.error('Failed to update order:', error);
        }
    };

    return (
        <div className="app-container">
            <h1>Items List (1 - 1,000,000)</h1>
            <div className="status-bar">
                <span>Selected: {selectedCount}</span>
                <span>Loaded: {items.length}</span>
                {isLoading && <span>Loading...</span>}
            </div>
            <div className="debug-info">
                <p>Loaded: {items.length} items</p>
                <p>Search: "{searchTerm}"</p>
                <p>Selected: {selectedCount}</p>
                <p>Has more: {hasMore.toString()}</p>
            </div>
            <SearchBar onSearch={handleSearch} />

            <DragDropContext
                onDragStart={() => setIsDragging(true)}
                onDragEnd={handleDragEnd}
            >
                <div id="scrollable-container" className="items-container">
                    <InfiniteScroll
                        dataLength={items.length}
                        next={() => {
                            console.log(
                                'InfiniteScroll: Triggering next, page:',
                                page,
                                'hasMore:',
                                hasMore
                            );
                            loadItems();
                        }}
                        hasMore={hasMore}
                        loader={
                            <div className="loader">Loading more items...</div>
                        }
                        endMessage={
                            <p style={{ textAlign: 'center' }}>
                                No more items to load
                            </p>
                        }
                        onScroll={() =>
                            console.log('InfiniteScroll: Scrolling')
                        }
                    >
                        {items.length === 0 && !isLoading && searchTerm ? (
                            <div className="empty-message">
                                No items match your search
                            </div>
                        ) : items.length === 0 && !isLoading ? (
                            <div className="error-message">
                                Failed to load items. Please try again.
                            </div>
                        ) : (
                            items.map((item, index) => (
                                <div
                                    key={item.id}
                                    className={`item ${
                                        item.selected ? 'selected' : ''
                                    } ${isDragging ? 'dragging' : ''}`}
                                    draggable
                                    onDragStart={(e) =>
                                        e.dataTransfer.setData(
                                            'text/plain',
                                            index
                                        )
                                    }
                                >
                                    <input
                                        type="checkbox"
                                        checked={item.selected}
                                        onChange={(e) =>
                                            handleSelect(
                                                item.id,
                                                e.target.checked
                                            )
                                        }
                                    />
                                    <span>{item.text}</span>
                                </div>
                            ))
                        )}
                    </InfiniteScroll>
                </div>
            </DragDropContext>
        </div>
    );
}

export default App;
