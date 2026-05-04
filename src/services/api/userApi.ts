export interface UserApiResponse {
  name: string;
  email: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  [key: string]: unknown;
}

const getBackendUrl = () =>
  process.env.EXPO_PUBLIC_BACKEND_URL ||
  process.env.EXPO_PUBLIC_BACKEND_URL ||
  "";

export async function getUser(): Promise<UserApiResponse> {
  const backendUrl = getBackendUrl();

  if (!backendUrl) {
    return { name: "John Doe", email: "john.doe@example.com" };
  }

  const response = await fetch(`${backendUrl}/api/user`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get user data");
  }

  return response.json();
}

export async function updateUser(data: UpdateUserPayload): Promise<string> {
  const backendUrl = getBackendUrl();

  if (!backendUrl) {
    return "User updated";
  }

  const response = await fetch(`${backendUrl}/api/user`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  return response.text();
}

export default {
  getUser,
  updateUser,
};
