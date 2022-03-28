import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const roomsApi = createApi({
  reducerPath: "roomsApi",
  tagTypes: ["rooms"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:9000",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }),
  endpoints: (build) => ({
    getAllRooms: build.query<any, any>({
      query: () => ({
        url: "/room",
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      providesTags: (result) => ["rooms"],
    }),
    createRooms: build.mutation<any, any>({
      query: (data: any) => ({
        url: "/room",
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: data,
      }),
      invalidatesTags: ["rooms"],
    }),
  }),
});
