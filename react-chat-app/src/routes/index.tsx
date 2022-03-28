import * as React from "react";

import Chat from "../pages/Chat";
import Rooms from "../pages/Rooms";
import Login from "../pages/Login";
import Register from "../pages/Register";
import CreateRoom from "../pages/CreateRoom";

export const routes = [
  {
    path: "/",
    element: <Rooms />,
    name: "Rooms",
  },
  {
    path: "/sign-in",
    element: <Login />,
    name: "Login",
  },
  {
    path: "/sign-up",
    element: <Register />,
    name: "Registeration",
  },
  {
    path: "/chat/:id",
    element: <Chat />,
    name: "Chat",
  },
  {
    path: "/create-room",
    element: <CreateRoom />,
    name: "Create Room",
  },
];
