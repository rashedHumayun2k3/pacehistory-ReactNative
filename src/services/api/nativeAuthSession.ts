export interface NativeAuthSession {
  user?: {
    id?: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  };
  accessToken?: string;
  error?: string;
}

export async function GET(): Promise<NativeAuthSession> {
  return {};
}

export async function POST(): Promise<NativeAuthSession> {
  return {};
}

export default {
  GET,
  POST,
};
