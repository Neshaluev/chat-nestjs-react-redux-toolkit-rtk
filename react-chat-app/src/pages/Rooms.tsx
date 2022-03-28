import { Button, Layout, List, PageHeader, Typography, Modal } from "antd";
import { Content } from "antd/lib/layout/layout";
import React from "react";
import { Link } from "react-router-dom";

import Loader from "../components/Loader/Loader";

import Navbar from "../components/Navbar/Navbar";

import { roomsApi } from "../service/RoomsService";

const Rooms = () => {
  const { data, isLoading } = roomsApi.useGetAllRoomsQuery("");

  const isLoadingRoom = data && isLoading === false;

  console.log("isLoadingRoom", isLoadingRoom);

  return (
    <Layout>
      <Navbar />
      <Content>
        <PageHeader
          ghost={false}
          title="Room"
          subTitle="This is a list rooms"
          extra={[
            <Button key="1" type="primary">
              <Link to={"/create-room"}> Create Room </Link>
            </Button>,
          ]}
        />
        {isLoadingRoom ? (
          <List
            bordered
            dataSource={data}
            renderItem={(item: any) => (
              <List.Item
                actions={[
                  <Button type="default">
                    <Link to={`/chat/${item.id}`}>Join Room</Link>{" "}
                  </Button>,
                ]}
              >
                <Typography.Text>[{item.name}]:</Typography.Text>
                {item.description}
              </List.Item>
            )}
          />
        ) : (
          <Loader />
        )}
      </Content>
    </Layout>
  );
};

export default Rooms;
