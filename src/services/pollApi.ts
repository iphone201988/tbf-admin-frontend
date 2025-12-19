import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8002/api/v1";

export interface PollOption {
  _id: string;
  optionText: string;
  voteCount: number;
}

export interface PollData {
  _id: string;
  pollName: string;
  pollDuration: string;
  isPollActive: boolean;
  options: PollOption[];
  shareAble?: string;
  myVote?: string | null;
}

export interface GetPollResponse {
  data: {
    poll: PollData;
    myVote?: string | null;
  };
  success: boolean;
  message: string;
}

export interface VoteRequest {
  pollId: string;
  optionId: string;
  uniqueDeviceId?: string;
  anonymousClientId?: string;
  voterCity?: string;
  voterCountry?: string;
  voterDeviceName?: string;
}

export interface VoteResponse {
  data: {
    poll: PollData;
  };
  success: boolean;
  message: string;
}

export const pollApi = createApi({
  reducerPath: "pollApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as { auth?: { token?: string | null } })?.auth?.token;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getPoll: builder.query<GetPollResponse, { pollId: string; uniqueDeviceId?: string; anonymousClientId?: string }>({
      query: ({ pollId, uniqueDeviceId, anonymousClientId }) => {
        const params = new URLSearchParams();
        if (uniqueDeviceId) params.set("uniqueDeviceId", uniqueDeviceId);
        if (anonymousClientId) params.set("anonymousClientId", anonymousClientId);
        const qs = params.toString();
        return `/poll/${pollId}${qs ? `?${qs}` : ""}`;
      },
    }),
    votePoll: builder.mutation<VoteResponse, VoteRequest>({
      query: ({ pollId, ...body }) => ({
        url: `/poll/${pollId}/vote`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetPollQuery, useVotePollMutation } = pollApi;

