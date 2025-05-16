import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import InfiniteScroll from 'react-infinite-scroll-component';
import './ItemList.css';

const ItemList = ({
    items,
    onLoadMore,
    hasMore,
    isLoading,
    onSelect,
    onDragEnd,
}) => {
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="items">
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        id="scrollableDiv"
                        style={{ height: '500px', overflow: 'auto' }}
                    >
                        <InfiniteScroll
                            dataLength={items.length}
                            next={onLoadMore}
                            hasMore={hasMore}
                            loader={<h4>Loading...</h4>}
                            scrollableTarget="scrollableDiv"
                        >
                            {/* Сообщение при пустом списке */}
                            {items.length === 0 && !isLoading && (
                                <div
                                    style={{
                                        padding: '20px',
                                        textAlign: 'center',
                                        border: '1px solid #eee',
                                        margin: '10px',
                                    }}
                                >
                                    No items found
                                </div>
                            )}

                            {/* Список элементов */}
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
                                            style={{
                                                ...provided.draggableProps
                                                    .style,
                                                border: '1px solid #ddd',
                                                padding: '10px',
                                                margin: '5px',
                                                backgroundColor: item.selected
                                                    ? '#e3f2fd'
                                                    : 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={item.selected}
                                                onChange={() =>
                                                    onSelect(
                                                        item.id,
                                                        !item.selected
                                                    )
                                                }
                                                style={{ marginRight: '10px' }}
                                            />
                                            <span>{item.text}</span>
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
    );
};

export default ItemList;
