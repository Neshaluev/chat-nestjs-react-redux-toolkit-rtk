import React from "react";
import { MoreOutlined } from "@ant-design/icons";
import { Button, Popover } from "antd";

interface IMessage {
  text: string;
  user: string;
}

const Message = (message: IMessage) => {
  const [visible, setVisisble] = React.useState<boolean>(false);

  const handleVisibleChange = (visible: boolean) => {
    setVisisble(visible);
  };

  const content = (
    <>
      <div>
        <a onClick={() => setVisisble(false)}>kick user</a>
      </div>
      <div>
        <a onClick={() => setVisisble(false)}>ban user</a>
      </div>
      <div>
        <a onClick={() => setVisisble(false)}>Close</a>
      </div>
    </>
  );

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        justifyContent: "space-between",
      }}
    >
      <p>
        <b>{message.user}: </b>
        {message.text}
      </p>
      <p>
        <Popover
          content={content}
          title="User Panel"
          trigger="click"
          visible={visible}
          onVisibleChange={handleVisibleChange}
        >
          <MoreOutlined />
        </Popover>
      </p>
    </div>
  );
};

export default Message;
