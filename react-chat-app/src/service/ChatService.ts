import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import io, { Socket } from "socket.io-client";

import { token, baseUrl } from "../core/axios";

let socket: Socket;

function getSocket() {
  if (!socket) {
    socket = io(baseUrl, {
      query: {
        token,
      },
    });
  }
  return socket;
}

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/",
  }),

  endpoints: (builder) => ({
    getUsersRoom: builder.query<any, any>({
      queryFn: () => ({ data: [] }),
      async onCacheEntryAdded(
        roomId,
        { cacheDataLoaded, cacheEntryRemoved, updateCachedData }
      ) {
        try {
          await cacheDataLoaded;

          const socket = io(baseUrl, {
            query: {
              token,
            },
          });

          await socket.on("join", (users) => {
            updateCachedData((draft) => {
              if (Array.isArray(users)) {
                draft.splice(0, draft.length, ...users);
              } else {
                draft.push(users);
              }
            });
          });

          await cacheEntryRemoved;

          socket.off("connect");
          socket.off("join");
        } catch (error) {}
      },
    }),

    getMessages: builder.query<any[], any>({
      queryFn: () => ({ data: [] }),

      async onCacheEntryAdded(
        roomId,
        { cacheDataLoaded, cacheEntryRemoved, updateCachedData }
      ) {
        try {
          await cacheDataLoaded;
          const socket = io(baseUrl, {
            query: {
              token,
            },
          });

          await socket.emit("join", {
            roomId: roomId,
          });

          await socket.on("message", (messages) => {
            updateCachedData((draft) => {
              if (Array.isArray(messages)) {
                draft.splice(0, draft.length, ...messages);
              } else {
                draft.push(messages);
              }
            });
          });

          await cacheEntryRemoved;

          socket.off("connect");
          socket.off("message");
          socket.off("join");
        } catch (error) {}
      },
    }),
    sendMessage: builder.mutation<any, any>({
      queryFn: (chatMessageContent: string) => {
        const socket = getSocket();

        return new Promise((resolve) => {
          socket.emit("message", chatMessageContent, (message: any) => {
            resolve({ data: message });
          });
        });
      },
    }),
    leaveRoom: builder.mutation<any, any>({
      queryFn: (roomId: string) => {
        const socket = getSocket();

        return new Promise((resolve) => {
          socket.emit("leave", roomId, (message: any) => {
            console.log("leave room", message);
          });
        });
      },
    }),
  }),
});

export default chatApi;
