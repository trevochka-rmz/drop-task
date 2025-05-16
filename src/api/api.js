const API_URL = 'https://drop-task-backend.onrender.com/api';

// Логирование запросов
const logRequest = (method, endpoint, data) => {
    console.log(`[API] ${method} ${endpoint}`, data || '');
    return data;
};

// Логирование ответов
const logResponse = (response) => {
    console.log('[API] Response:', response);
    return response;
};

// Обработка ошибок
const handleError = (error, context) => {
    console.error(`[API Error] ${context}:`, error);
    throw error;
};

export const fetchItems = async (page, search, limit = 20) => {
    try {
        const endpoint = `/items?page=${page}&search=${search}&limit=${limit}`;
        logRequest('GET', endpoint);

        const response = await fetch(API_URL + endpoint);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return logResponse(data);
    } catch (error) {
        // Возвращаем пустые данные при ошибке
        return (
            handleError(error, 'fetchItems') || {
                items: [],
                total: 0,
                hasMore: false,
            }
        );
    }
};

export const fetchState = async () => {
    try {
        const response = await fetch(`${API_URL}/state`);

        if (!response.ok) {
            if (response.status === 404) {
                // Возвращаем состояние по умолчанию если эндпоинт не найден
                return { order: null, selected: [] };
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching state:', error);
        return { order: null, selected: [] };
    }
};

export const updateOrder = async (order) => {
    try {
        logRequest('POST', '/update-order', { order });

        const response = await fetch(`${API_URL}/update-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ order }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        return handleError(error, 'updateOrder');
    }
};

export const updateSelection = async (id, selected) => {
    try {
        logRequest('POST', '/update-selection', { id, selected });

        const response = await fetch(`${API_URL}/update-selection`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, selected }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        return handleError(error, 'updateSelection');
    }
};
