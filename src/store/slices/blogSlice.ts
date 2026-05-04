/* eslint-disable @typescript-eslint/no-explicit-any */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface IBlog {
  blogId: number;
  title: string;
  titleCode: string;
  blogContentShort: string;
  blogContentP1: string;
  blogContentP2: string;
  blogContentP3: string;
  blogContentP4: string;
  blogContentP5: string;
  blogContentP6: string;
  blogContentP7: string;
  blogContentP8: string;
  blogContentP9: string;
  blogContentP10: string;
  blogContentP11: string;
  blogContentP12: string;
  blogContentP13: string;
  blogContentP14: string;
  blogContentP15: string;
  languageCode: string;
  authorId: number;
  category: string;
  isPublished: boolean;
  coverImageUrl?: string;
  isActive: boolean;
  tags: string;
  authorName: string;
  authorImageUrl: string;
  createdAt?: Date | string;
  youTubeLink: string;
}

interface BlogState {
  blogPosts: IBlog[];
  selectedBlogPost: IBlog | null;
  isSuccessCreatingBlog: string | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  actionResult: any;
  totalBlogs: number;
  blogListSimilarTag: IBlog[];
}

const initialState: BlogState = {
  blogPosts: [],
  selectedBlogPost: null,
  isSuccessCreatingBlog: null,
  loading: false,
  error: null,
  successMessage: null,
  actionResult: null,
  totalBlogs: 0,
  blogListSimilarTag: [],
};

const getBackendUrl = () =>
  process.env.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL || "";

const getAccessToken = async () => AsyncStorage.getItem("accessToken");

const buildAuthHeaders = async () => {
  const accessToken = await getAccessToken();

  return {
    Accept: "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
};

const emptyBlog = (overrides: Partial<IBlog>): IBlog => ({
  blogId: 0,
  title: "",
  titleCode: "",
  blogContentShort: "",
  blogContentP1: "",
  blogContentP2: "",
  blogContentP3: "",
  blogContentP4: "",
  blogContentP5: "",
  blogContentP6: "",
  blogContentP7: "",
  blogContentP8: "",
  blogContentP9: "",
  blogContentP10: "",
  blogContentP11: "",
  blogContentP12: "",
  blogContentP13: "",
  blogContentP14: "",
  blogContentP15: "",
  languageCode: "en",
  authorId: 0,
  category: "",
  isPublished: true,
  isActive: true,
  tags: "",
  authorName: "",
  authorImageUrl: "",
  youTubeLink: "",
  ...overrides,
});

const sampleBlogs: IBlog[] = [
  emptyBlog({
    blogId: 1,
    title: "Sample Blog",
    titleCode: "sample-blog",
    blogContentShort: "Blog content will load here when the backend is configured.",
    authorName: "PaceHistory",
    category: "General",
    tags: "running",
  }),
];

export const fetchGetBlogListResult = createAsyncThunk<
  IBlog[],
  {
    authorName?: string;
    tagName?: string;
    blogName?: string;
    pageIndex?: number;
    pageSize?: number;
  },
  { rejectValue: string }
>(
  "blog/fetchGetBlogListResult",
  async (
    { authorName, tagName, blogName, pageIndex = 1, pageSize = 10 },
    { rejectWithValue }
  ) => {
    const backendUrl = getBackendUrl();

    if (!backendUrl) {
      return pageIndex === 1 ? sampleBlogs : [];
    }

    const apiUrl = `${backendUrl}/Group/GetBlogListByAdmin?authorName=${
      authorName || ""
    }&tagName=${tagName || ""}&blogName=${blogName || ""}&pageIndex=${pageIndex}&pageSize=${pageSize}`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: await buildAuthHeaders(),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || "An unexpected error occurred");
      }

      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchGetTotalBlogsResult = createAsyncThunk<
  number,
  void,
  { rejectValue: string }
>("blog/fetchGetTotalBlogsResult", async (_, { rejectWithValue }) => {
  const backendUrl = getBackendUrl();

  if (!backendUrl) {
    return sampleBlogs.length;
  }

  const apiUrl = `${backendUrl}/Group/GetTotalBlogs`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData?.message || "Failed to fetch total blogs count.");
    }

    return (await response.json()) as number;
  } catch (error: any) {
    console.error("Error fetching total blogs:", error);
    return rejectWithValue("An unexpected error occurred while fetching the total blog count.");
  }
});

export const fetchAddOrUpdateBlog = createAsyncThunk(
  "blog/fetchAddOrUpdateBlog",
  async (blogData: IBlog, { rejectWithValue }) => {
    const accessToken = await getAccessToken();
    const backendUrl = getBackendUrl();

    if (!accessToken) {
      return rejectWithValue("Authentication token is missing");
    }

    if (!backendUrl) {
      return blogData;
    }

    const apiUrl = `${backendUrl}/Group/InsertUpdateBlog`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(blogData),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || "An unexpected error occurred");
      }

      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBlogDetailsByTitleCode = createAsyncThunk(
  "group/fetchBlogDetailsByTitleCode",
  async (titleCode: string, { rejectWithValue }) => {
    const backendUrl = getBackendUrl();

    if (!backendUrl) {
      return sampleBlogs.find((blog) => blog.titleCode === titleCode) || sampleBlogs[0];
    }

    const apiUrl = `${backendUrl}/Group/BlogDetailsByTitleCode/${titleCode}`;
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || "An unexpected error occurred");
      }
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBlogDetailsById = createAsyncThunk(
  "group/BlogDetailsById",
  async (blogId: number, { rejectWithValue }) => {
    const backendUrl = getBackendUrl();

    if (!backendUrl) {
      return sampleBlogs.find((blog) => blog.blogId === blogId) || sampleBlogs[0];
    }

    const apiUrl = `${backendUrl}/Group/BlogDetailsById/${blogId}`;
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || "An unexpected error occurred");
      }
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRelatedBlogsByTags = createAsyncThunk<
  IBlog[],
  { currentBlogCode: string },
  { rejectValue: string }
>(
  "blog/fetchRelatedBlogsByTags",
  async ({ currentBlogCode }, { rejectWithValue }) => {
    const backendUrl = getBackendUrl();

    if (!backendUrl) {
      return sampleBlogs.filter((blog) => blog.titleCode !== currentBlogCode);
    }

    const apiUrl = `${backendUrl}/Group/GetRelatedBlogsByTags/${currentBlogCode}`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: await buildAuthHeaders(),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || "An unexpected error occurred");
      }
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const blogSlice = createSlice({
  name: "trackingRouteInsertUpdate",
  initialState,
  reducers: {
    resetBlogState: (state) => {
      state.isSuccessCreatingBlog = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddOrUpdateBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAddOrUpdateBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.actionResult = action.payload;
        state.isSuccessCreatingBlog = "Route saved successfully";
      })
      .addCase(fetchAddOrUpdateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to save blog";
      })
      .addCase(fetchGetBlogListResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGetBlogListResult.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.blogPosts = action.payload;
      })
      .addCase(fetchGetBlogListResult.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error?.message || "Failed to fetch blog posts";
      })
      .addCase(fetchGetTotalBlogsResult.fulfilled, (state, action) => {
        state.totalBlogs = action.payload;
      })
      .addCase(fetchBlogDetailsById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBlogDetailsById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBlogPost = action.payload;
      })
      .addCase(fetchBlogDetailsById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch blog details";
      })
      .addCase(fetchBlogDetailsByTitleCode.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBlogDetailsByTitleCode.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBlogPost = action.payload;
      })
      .addCase(fetchBlogDetailsByTitleCode.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch blog details";
      })
      .addCase(fetchRelatedBlogsByTags.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRelatedBlogsByTags.fulfilled, (state, action) => {
        state.loading = false;
        state.blogListSimilarTag = action.payload;
      })
      .addCase(fetchRelatedBlogsByTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch related blogs";
      });
  },
});

export const { resetBlogState } = blogSlice.actions;
export default blogSlice.reducer;
