import { Button, Col, PageHeader, Row } from "antd";
import React from "react";
import { useParams } from "react-router-dom";

import Editor from "../components/Editor/Editor";
import Message from "../components/Message/Message";
import UserRoom from "../components/UserRoom/UserRoom";
import chatApi from "../service/ChatService";

const Chat = () => {
  const { id } = useParams();

  const [textMessage, setTextMessage] = React.useState("");

  const { data: messagesData, isLoading } = chatApi.useGetMessagesQuery(id);

  const { data: userData, refetch } = chatApi.useGetUsersRoomQuery(id);

  const [leaveRoom] = chatApi.useLeaveRoomMutation();

  const [sendMessage, { isLoading: loading }] =
    chatApi.useSendMessageMutation();

  const handleMessage = async () => {
    sendMessage({ text: textMessage });
    setTextMessage("");
  };

  const handleLeaveRoom = async () => {
    leaveRoom(id);
    window.history.back();
  };

  return (
    <div>
      <PageHeader
        ghost={false}
        onBack={() => handleLeaveRoom()}
        title="Room Chat"
        extra={[
          <Button key="1" type="primary" danger>
            Delete Room
          </Button>,
        ]}
      />
      <Row justify="center">
        <Col span={16}>
          <Row>
            <Col span={4}>
              <div>
                <h3>Users: </h3>
              </div>
              <div>
                {userData?.map((user: any) => (
                  <UserRoom key={user.id} username={user.username} />
                ))}
              </div>
            </Col>
            <Col span={16}>
              <Row>
                <Col span={24}>
                  <div>
                    <h2>Chat</h2>
                  </div>

                  {messagesData?.map((message: any) => (
                    <Message
                      key={message.id}
                      text={message.text}
                      user={message.user.username}
                    />
                  ))}
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Editor
                    onChange={(e: any) => setTextMessage(e.target.value)}
                    onSubmit={handleMessage}
                    value={textMessage}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Chat;
