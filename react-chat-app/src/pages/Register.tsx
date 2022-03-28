import { Col, Row, Form, Input, Button, Layout } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/redux";
import { signUp } from "../redux/reducers/ActionCreators";

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = () => {
    if (username != "" && password != "") {
      const userData = { username, password };
      dispatch(signUp({ userData, navigate }));
    }
  };

  return (
    <Layout className="vh100">
      <Row justify="center" className="form-center">
        <Col span={8}>
          <Form
            className="form-auth"
            name="basic"
            layout="vertical"
            autoComplete="off"
            onSubmitCapture={handleSubmit}
          >
            <Form.Item>
              <h2>Create your account</h2>
            </Form.Item>
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input onChange={(e) => setUsername(e.target.value)} />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password onChange={(e) => setPassword(e.target.value)} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Sign Up
              </Button>
            </Form.Item>
            <Form.Item>
              <h4>Have an account? </h4>
              <Link to="/sign-in" className="accent-link">
                Log in now
              </Link>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Layout>
  );
};

export default Register;
