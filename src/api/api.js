const API_URL = 'drop-task-backend-production-b4d7.up.railway.app/api';
// const API_URL = 'https://drop-task-backend.onrender.com/api';

// Обертка для fetch с обработкой ошибок
const fetchApi = async (endpoint, options = {}) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = new Error(`HTTP error! status: ${response.status}`);
        error.status = response.status;
        throw error;
    }

    return response.json();
};

// API для работы с элементами
export const fetchItems = (page, limit = 20, search = '') => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (search) params.append('search', search);

    return fetchApi(`/items?${params.toString()}`);
};

// API для работы с состоянием
export const fetchState = () => fetchApi('/state');

// API для обновления порядка
export const updateOrder = (order) =>
    fetchApi('/update-order', {
        method: 'POST',
        body: JSON.stringify({ order }),
    });

// API для обновления выбора
export const updateSelection = (id, selected) =>
    fetchApi('/update-selection', {
        method: 'POST',
        body: JSON.stringify({ id, selected }),
    });

// API для массового выбора
export const updateMultipleSelections = (ids, selected) =>
    fetchApi('/update-selection', {
        method: 'POST',
        body: JSON.stringify({ ids, selected }),
    });
