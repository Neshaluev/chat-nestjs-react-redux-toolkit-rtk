import { Col, Menu, Row } from "antd";
import { Header } from "antd/lib/layout/layout";
import React from "react";
import { Link } from "react-router-dom";
import { routes } from "../../routes";

const Navbar = () => {
  return (
    <Header>
      <Row justify="space-between">
        <Col span={12}>
          <div className="logo">Nest Chat</div>
        </Col>
        <Col span={6}>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["2"]}
            selectable={false}
          >
            {routes.map((R) => {
              return (
                <Menu.Item key={R.name}>
                  <Link to={R.path}>{R.name}</Link>
                </Menu.Item>
              );
            })}
          </Menu>
        </Col>
      </Row>
    </Header>
  );
};

export default Navbar;
