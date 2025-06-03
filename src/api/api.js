const API_URL = 'https://drop-task-backend.onrender.com/api';

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

export const fetchItems = (page, limit = 20, search = '') => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (search) params.append('search', search);

    return fetchApi(`/items?${params.toString()}`);
};

export const fetchState = () => fetchApi('/state');

export const updateSelection = (id, selected) =>
    fetchApi('/update-selection', {
        method: 'POST',
        body: JSON.stringify({ id, selected }),
    });
