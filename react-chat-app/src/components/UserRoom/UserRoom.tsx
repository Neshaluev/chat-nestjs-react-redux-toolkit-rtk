import React from "react";

interface IUserRoom {
  username: string;
}

const UserRoom = ({ username }: IUserRoom) => {
  return <div>{username}</div>;
};

export default UserRoom;
