const API_BASE_URL = "/api";

async function apiRequest(endpoint, data) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch {
    throw new Error(
      "Cannot connect to the server. Please make sure the backend is running."
    );
  }

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result.message || "Something went wrong. Please try again."
    );
  }

  return result;
}

export async function registerUser({ fullName, email, password }) {
  return apiRequest("/auth/register", {
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    password,
  });
}

export async function loginUser({ email, password }) {
  const result = await apiRequest("/auth/login", {
    email: email.trim().toLowerCase(),
    password,
  });

  if (result.token) {
    localStorage.setItem("apnishaadi_token", result.token);
  }

  if (result.user) {
    localStorage.setItem(
      "apnishaadi_user",
      JSON.stringify(result.user)
    );
  }

  return result;
}

export function logoutUser() {
  localStorage.removeItem("apnishaadi_token");
  localStorage.removeItem("apnishaadi_user");
}

export function getAuthToken() {
  return localStorage.getItem("apnishaadi_token");
}

export function getCurrentUser() {
  const user = localStorage.getItem("apnishaadi_user");

  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}