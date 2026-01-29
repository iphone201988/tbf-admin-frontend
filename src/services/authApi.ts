import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8002/api/v1";

export interface AdminLoginResponse {
  data: {
    token: string;
    admin: {
      _id: string;
      adminEmail: string;
      name?: string;
      isAdmin: boolean;
    };
  };
  message: string;
  success: boolean;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface GetAdminResponse {
  data: {
    admin: {
      _id: string;
      adminEmail: string;
      name?: string;
      isAdmin: boolean;
    };
  };
  message: string;
  success: boolean;
}

export interface DashboardStatsResponse {
  data: {
    totalUsers: number;
    activePolls: number;
    totalVotes: number;
    totalNotifications: number;
  };
  message: string;
  success: boolean;
}

export interface User {
  _id: string;
  name: string;
  isActive: boolean;
  status: string;
  activity: string;
  signedUp: string;
}

export interface Poll {
  _id: string;
  pollName: string;
  createdByName: string;
  status: string;
  totalVotes: number;
  createdAt: string;
  pollDuration: string;
  options: { _id: string; optionText: string; voteCount: number }[];
  shareAble?: string | null;
}

export interface GetUsersResponse {
  data: {
    users: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  message: string;
  success: boolean;
}

export interface DeleteUserResponse {
  message: string;
  success: boolean;
}

export interface UpdateUserStatusResponse {
  data: { userId: string; isActive: boolean };
  message: string;
  success: boolean;
}

export interface GetPollsResponse {
  data: {
    polls: Poll[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  message: string;
  success: boolean;
}

export interface GetPollByIdResponse {
  data: {
    poll: Poll;
  };
  message: string;
  success: boolean;
}

export interface DeletePollResponse {
  message: string;
  success: boolean;
}

export interface CreatePollRequest {
  pollName: string;
  pollDuration: string; // ISO date string
  options: { optionText: string }[];
}

export interface CreatePollResponse {
  data: {
    poll: Poll;
  };
  message: string;
  success: boolean;
}

export interface CreatePollQuestionRequest {
  question: string;
  endTime: string; // ISO date string
}

export interface CreatePollQuestionResponse {
  data: {
    pollQuestion: {
      _id: string;
      question: string;
      endTime: string;
      createdAt: string;
    };
  };
  message: string;
  success: boolean;
}

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
  voter: { id: string | null; name: string; deviceType?: string } | null;
  voterCity: string | null;
  voterCountry: string | null;
  voterDeviceName: string | null;
  poll: { id: string | null; name: string; createdByName: string };
  locationMessage: string | null;
}

export interface GetNotificationsResponse {
  data: {
    notifications: NotificationItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  message: string;
  success: boolean;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as { auth?: { token?: string | null } })?.auth?.token;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Users", "Polls", "Notifications", "PollQuestions"],
  endpoints: (builder) => ({
    adminLogin: builder.mutation<AdminLoginResponse, AdminLoginRequest>({
      query: (body) => ({
        url: "/admin/login",
        method: "POST",
        body,
      }),
    }),
    getAdmin: builder.query<GetAdminResponse, void>({
      query: () => "/admin/me",
    }),
    getDashboardStats: builder.query<DashboardStatsResponse, void>({
      query: () => "/admin/dashboard",
    }),
    getUsers: builder.query<GetUsersResponse, { page?: number; limit?: number; search?: string; status?: string }>({
      query: ({ page = 1, limit = 10, search, status }) => {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(limit));
        if (search) params.set("search", search);
        if (status && status !== "all") params.set("status", status);
        return `/admin/users?${params.toString()}`;
      },
      providesTags: ["Users"],
    }),
    updateUserStatus: builder.mutation<UpdateUserStatusResponse, { userId: string; isActive: boolean }>({
      query: ({ userId, isActive }) => ({
        url: `/admin/users/${userId}/status`,
        method: "PATCH",
        body: { isActive },
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation<DeleteUserResponse, string>({
      query: (userId) => ({
        url: `/admin/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
    getPolls: builder.query<GetPollsResponse, { page?: number; limit?: number; search?: string; status?: string }>({
      query: ({ page = 1, limit = 10, search, status }) => {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(limit));
        if (search) params.set("search", search);
        if (status && status !== "all") params.set("status", status);
        return `/admin/polls?${params.toString()}`;
      },
      providesTags: ["Polls"],
    }),
    getPollByIdAdmin: builder.query<GetPollByIdResponse, string>({
      query: (pollId) => `/admin/polls/${pollId}`,
      providesTags: (_result, _err, id) => [{ type: "Polls", id }],
    }),
    deletePoll: builder.mutation<DeletePollResponse, string>({
      query: (pollId) => ({
        url: `/admin/polls/${pollId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Polls"],
    }),
    createPoll: builder.mutation<CreatePollResponse, CreatePollRequest>({
      query: (body) => ({
        url: "/poll",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Polls"],
    }),
    createPollQuestion: builder.mutation<CreatePollQuestionResponse, CreatePollQuestionRequest>({
      query: (body) => ({
        url: "/admin/poll-questions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PollQuestions"],
    }),
    deletePollQuestion: builder.mutation<any, string>({
      query: (questionId) => ({
        url: `/admin/poll-questions/${questionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PollQuestions"],
    }),
    getPollQuestions: builder.query<any, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => `/poll/questions?page=${page}&limit=${limit}`,
      providesTags: ["PollQuestions"],
    }),
    getNotifications: builder.query<
      GetNotificationsResponse,
      { page?: number; limit?: number; search?: string; type?: string }
    >({
      query: ({ page = 1, limit = 10, search, type }) => {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(limit));
        if (search) params.set("search", search);
        if (type && type !== "all") params.set("type", type);
        return `/admin/notifications?${params.toString()}`;
      },
      providesTags: ["Notifications"],
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useGetAdminQuery,
  useGetDashboardStatsQuery,
  useGetUsersQuery,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
  useGetPollsQuery,
  useGetPollByIdAdminQuery,
  useDeletePollMutation,
  useCreatePollMutation,
  useCreatePollQuestionMutation,
  useDeletePollQuestionMutation,
  useGetPollQuestionsQuery,
  useGetNotificationsQuery,
} = authApi;
