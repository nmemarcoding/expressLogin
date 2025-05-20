/**
 * API Configuration for Dynamic Environments
 * 
 * This file handles determining the correct API base URL based on the 
 * current environment (development, production) and network configuration.
 */

// Get the current hostname (e.g., localhost, 192.168.1.17)
const hostname = window.location.hostname;

// Default port for the API server
const API_PORT = '6330'; // Using the original port from the commented out code

// Determine the base URL for API requests
let BASE_URL;

// In production, we might use a specific API URL
if (process.env.REACT_APP_API_URL) {
  BASE_URL = process.env.REACT_APP_API_URL;
} 
// In development, use the current hostname with the API port
else {
  // If we're on localhost, use localhost for the API
  // Otherwise use the current hostname (like the local IP address)
  BASE_URL = `http://${hostname}:${API_PORT}/api/`;
}

export default BASE_URL;
