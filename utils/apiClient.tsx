import axios from "axios"

// Create an Axios instance
const apiClient = axios.create({
  baseURL: "http://localhost:5000/api", // Base URL for your API
//   timeout: 10000, // Set a timeout for requests (optional)
})

// Add a request interceptor to include the token in the Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") // Retrieve the token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}` // Add the token to the Authorization header
    }
    return config
  },
  (error) => {
    // Handle request errors
    console.error("Request error:", error)
    return Promise.reject(error)
  }
)

// Add a response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    // Return the response data if the request is successful
    return response
  },
  (error) => {
    // Handle response errors
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      console.error("Response error:", error.response.data)
      if (error.response.status === 401) {
        // Handle unauthorized errors (e.g., token expired)
        console.warn("Unauthorized! Redirecting to login...")
        localStorage.removeItem("token") // Clear the token
        window.location.href = "/login" // Redirect to the login page
      } else if (error.response.status === 403) {
        console.warn("Forbidden! You do not have access to this resource.")
      } else if (error.response.status === 404) {
        console.warn("Resource not found!")
      } else if (error.response.status >= 500) {
        console.error("Server error! Please try again later.")
      }
    } else if (error.request) {
      // Request was made but no response was received
      console.error("No response received:", error.request)
    } else {
      // Something else caused the error
      console.error("Error:", error.message)
    }

    // Reject the promise with the error object
    return Promise.reject(error)
  }
)

export default apiClient