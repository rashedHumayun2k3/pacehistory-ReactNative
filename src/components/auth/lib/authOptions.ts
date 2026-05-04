export interface NativeAuthOptions {
  googleClientId: string;
  scopes: string[];
  sessionMaxAgeSeconds: number;
}

export const authOptions: NativeAuthOptions = {
  googleClientId:
    process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    "",
  scopes: ["openid", "email", "profile"],
  sessionMaxAgeSeconds: 30 * 24 * 60 * 60,
};

export async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken?: string;
  accessTokenExpires?: number;
  refreshToken?: string;
  error?: string;
}> {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id:
          process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ||
          process.env.GOOGLE_CLIENT_ID ||
          "",
        client_secret:
          process.env.EXPO_PUBLIC_GOOGLE_CLIENT_SECRET ||
          process.env.GOOGLE_CLIENT_SECRET ||
          "",
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }).toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return {
      accessToken: data.access_token,
      accessTokenExpires: Date.now() + data.expires_in * 1000,
      refreshToken: data.refresh_token ?? refreshToken,
    };
  } catch (error) {
    console.error("Refresh token error", error);
    return { error: "RefreshAccessTokenError" };
  }
}

export default authOptions;
