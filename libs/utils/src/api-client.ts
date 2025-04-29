import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig, // Import InternalAxiosRequestConfig
  AxiosResponse,
  AxiosError,
  AxiosRequestHeaders, // Import AxiosRequestHeaders for stricter header typing
} from 'axios';

// Define the base URL for the API.
// Falls back to localhost if the environment variable is not set.
const API_BASE_URL: string =
  process.env['NEXT_PUBLIC_API_BASE_URL'] || 'http://localhost:3333';

// Interface for expected API error data structure.
interface ApiErrorData {
  message: string;
  statusCode?: number; // Example: include other potential error fields
  error?: string;
  [key: string]: any; // Allow other properties for flexibility
}

// Helper function to safely get the auth token from localStorage.
// Returns null if localStorage is not available (e.g., server-side rendering).
const getAuthToken = (): string | null => {
  // Check if running in a browser environment
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null; // Return null if not in a browser
};

// Create an Axios instance with default configuration.
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  } as AxiosRequestHeaders, // Assert initial headers type
  // Optional: Set a timeout for requests
  // timeout: 10000, // 10 seconds
});

// --- Request Interceptor ---
// Modifies outgoing requests, e.g., to add authorization headers.
apiClient.interceptors.request.use(
  // Use InternalAxiosRequestConfig for the config parameter
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getAuthToken();

    // InternalAxiosRequestConfig guarantees headers is defined.
    if (token) {
      // Directly set the header using the .set() method provided by AxiosHeaders/AxiosRequestHeaders
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    // Return the modified config object.
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    // Log request errors.
    console.error('Axios Request Interceptor Error:', error);
    // Reject the promise so the error propagates.
    return Promise.reject(error);
  }
);

// --- Response Interceptor ---
// Processes responses before they are returned to the caller.
// Handles successful responses and errors globally.
apiClient.interceptors.response.use(
  // On Success: Extract and return the data directly from the response.
  // The generic <T> allows the caller to specify the expected data type.
  <T = any>(response: AxiosResponse<T>): T => {
    // This interceptor ensures that successful responses return only the data.
    return response.data;
  },
  // On Error: Process API errors.
  (error: AxiosError<ApiErrorData>): Promise<ApiErrorData | AxiosError> => {
    // Log the error details.
    console.error(
      'Axios Response Interceptor Error:',
      error.response?.data || error.message
    );

    // Handle specific error statuses, like 401 Unauthorized.
    if (error.response && error.response.status === 401) {
      console.log(
        'Unauthorized access - 401. Redirecting or clearing token...'
      );
      // Example: Clear token and redirect to login
      // if (typeof window !== 'undefined') {
      //   localStorage.removeItem('authToken');
      //   window.location.href = '/login';
      // }
    }

    // Reject the promise with the specific error data from the API response if available.
    // Otherwise, reject with the full AxiosError object.
    // This allows calling code to catch and handle specific API error structures.
    if (error.response && error.response.data) {
      return Promise.reject(error.response.data);
    } else {
      // If no response data, reject with the original Axios error
      return Promise.reject(error);
    }
  }
);

// --- API Helper Object ---
// Provides typed methods for common HTTP requests (GET, POST, PUT, DELETE, PATCH).
// These methods leverage the configured Axios instance and its interceptors.
// The return types are Promise<T>, reflecting that the interceptor unwraps the response data.
// We use type assertion `as Promise<T>` because the interceptor modifies the standard Axios return type.
export const api = {
  /**
   * Performs a GET request.
   * @param url The URL endpoint.
   * @param config Optional Axios request configuration.
   * @returns Promise resolving with the response data of type T.
   */
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.get<T>(url, config) as Promise<T>, // Assert return type

  /**
   * Performs a POST request.
   * @param url The URL endpoint.
   * @param data Optional data payload to send.
   * @param config Optional Axios request configuration.
   * @returns Promise resolving with the response data of type T.
   */
  post: <T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> => apiClient.post<T>(url, data, config) as Promise<T>, // Assert return type

  /**
   * Performs a PUT request.
   * @param url The URL endpoint.
   * @param data Optional data payload to send.
   * @param config Optional Axios request configuration.
   * @returns Promise resolving with the response data of type T.
   */
  put: <T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> => apiClient.put<T>(url, data, config) as Promise<T>, // Assert return type

  /**
   * Performs a DELETE request.
   * @param url The URL endpoint.
   * @param config Optional Axios request configuration.
   * @returns Promise resolving with the response data of type T.
   */
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.delete<T>(url, config) as Promise<T>, // Assert return type

  /**
   * Performs a PATCH request.
   * @param url The URL endpoint.
   * @param data Optional data payload to send.
   * @param config Optional Axios request configuration.
   * @returns Promise resolving with the response data of type T.
   */
  patch: <T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> => apiClient.patch<T>(url, data, config) as Promise<T>, // Assert return type

  /**
   * Exposes the raw Axios instance if needed for more advanced use cases
   * or direct access to interceptors elsewhere.
   */
  instance: apiClient,
};

// Export the api helper object as the default export.
export default api;
