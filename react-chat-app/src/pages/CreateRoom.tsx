import { Col, Row, Form, Input, Button, Layout } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { roomsApi } from "../service/RoomsService";

const CreateRoom = () => {
  const navigate = useNavigate();

  const [name, setUsername] = React.useState("");
  const [description, setDescription] = React.useState("");

  const [createRoom, { isLoading, isSuccess }] =
    roomsApi.useCreateRoomsMutation();

  const handleSubmit = () => {
    console.log("send Description", name, description);
    createRoom({
      name,
      description,
      avatar: "",
    });
  };

  if (isSuccess) navigate("/");

  return (
    <Layout className="vh100">
      <Row justify="center" align="middle" className="form-center">
        <Col span={8}>
          <Form
            className="form-auth"
            name="basic"
            layout="vertical"
            autoComplete="off"
            onSubmitCapture={handleSubmit}
          >
            <Form.Item>
              <h2>Create Room</h2>
            </Form.Item>
            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input onChange={(e) => setUsername(e.target.value)} />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: "Please input your description!" },
              ]}
            >
              <Input onChange={(e) => setDescription(e.target.value)} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Create Room
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Layout>
  );
};

export default CreateRoom;
