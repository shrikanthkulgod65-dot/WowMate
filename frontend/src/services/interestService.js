
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

/**
 * Common API request handler
 */
async function request(endpoint, options = {}) {
  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in to use interest features.");
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw new Error(
      "Unable to connect to Wowmate server. Please check whether the backend is running."
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || `Request failed with status ${response.status}`
    );
  }

  return data;
}

/**
 * Send interest to another member
 */
export async function sendInterest(receiverId) {
  if (!receiverId) {
    throw new Error("Receiver ID is required.");
  }

  return request("/interests", {
    method: "POST",
    body: JSON.stringify({ receiverId }),
  });
}

/**
 * Get interests sent by logged-in member
 */
export async function getSentInterests() {
  return request("/interests/sent");
}

/**
 * Get interests received by logged-in member
 */
export async function getReceivedInterests() {
  return request("/interests/received");
}

/**
 * Accept or reject a received interest
 */
export async function respondToInterest(interestId, status) {
  if (!interestId) {
    throw new Error("Interest ID is required.");
  }

  if (!["accepted", "rejected"].includes(status)) {
    throw new Error("Status must be accepted or rejected.");
  }

  return request(
    `/interests/${encodeURIComponent(interestId)}/respond`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }
  );
}

/**
 * Cancel a pending interest request
 */
export async function cancelInterest(interestId) {
  if (!interestId) {
    throw new Error("Interest ID is required.");
  }

  return request(
    `/interests/${encodeURIComponent(interestId)}`,
    {
      method: "DELETE",
    }
  );
}
