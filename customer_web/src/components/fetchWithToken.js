
export const fetchWithToken = async (url, options = {}) => {
    const token = localStorage.getItem("customerToken");

    const headers = {
        ...options.headers,
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    const fetchOptions = {
        ...options,
        headers,
    };

    return fetch(url, fetchOptions);
};
