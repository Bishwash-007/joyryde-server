import axios from "axios";

const BaseURL = "http://localhost:4000/api"; // Replace with your API base URL

const apiClient = axios.create({
  baseURL: BaseURL,
  headers: {
    "Content-Type": "application/json",
    // bearerToken: localStorage.getItem("token") || "",
  },
});

// User Registration
export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post("/signup", userData);
    console.log("Registration Response:", response.data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// User Login
export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post("/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

registerUser({
  email: "drewwbishwash@gmail.com",
  password: "H3ll0w0rld!",
  role: "customer",
});
