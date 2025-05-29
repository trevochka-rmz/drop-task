import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import InfiniteScroll from 'react-infinite-scroll-component';

const ItemList = ({
    items,
    onLoadMore,
    hasMore,
    isLoading,
    onSelect,
    onSelectMultiple,
    onDragEnd,
}) => {
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    const handleItemSelect = (id, selected) => {
        if (selectionMode) {
            setSelectedIds((prev) =>
                selected
                    ? [...prev, id]
                    : prev.filter((itemId) => itemId !== id)
            );
        } else {
            onSelect(id, selected);
        }
    };

    const applyBulkSelection = () => {
        if (selectedIds.length > 0) {
            onSelectMultiple(selectedIds, true);
        }
        setSelectionMode(false);
        setSelectedIds([]);
    };

    const cancelSelection = () => {
        setSelectionMode(false);
        setSelectedIds([]);
    };

    return (
        <div className="list-container">
            <div className="list-controls">
                {selectionMode ? (
                    <>
                        <button
                            onClick={applyBulkSelection}
                            className="control-button apply-button"
                        >
                            Apply Selection ({selectedIds.length})
                        </button>
                        <button
                            onClick={cancelSelection}
                            className="control-button cancel-button"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setSelectionMode(true)}
                        className="control-button select-button"
                    >
                        Multi-Select Mode
                    </button>
                )}
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="items">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            id="scrollableDiv"
                            className="scroll-container"
                        >
                            <InfiniteScroll
                                dataLength={items.length}
                                next={onLoadMore}
                                hasMore={hasMore}
                                loader={
                                    <div className="loader">
                                        {isLoading
                                            ? 'Loading more items...'
                                            : ''}
                                    </div>
                                }
                                scrollableTarget="scrollableDiv"
                                scrollThreshold="100px"
                            >
                                {items.length === 0 && !isLoading && (
                                    <div className="empty-message">
                                        No items found
                                    </div>
                                )}

                                {items.map((item, index) => (
                                    <Draggable
                                        key={item.id}
                                        draggableId={String(item.id)}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={`item ${
                                                    item.selected ||
                                                    selectedIds.includes(
                                                        item.id
                                                    )
                                                        ? 'selected'
                                                        : ''
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        item.selected ||
                                                        selectedIds.includes(
                                                            item.id
                                                        )
                                                    }
                                                    onChange={(e) =>
                                                        handleItemSelect(
                                                            item.id,
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="item-checkbox"
                                                />
                                                <span className="item-text">
                                                    {item.text}
                                                </span>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </InfiniteScroll>
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default ItemList;
