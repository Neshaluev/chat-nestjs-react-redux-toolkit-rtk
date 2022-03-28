import { Button, Modal } from "antd";
import React from "react";

const CreateRoomForm = () => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const showModal = () => setIsModalVisible(true);
  const hideModal = () => setIsModalVisible(false);

  const handleOkModal = () => {
    console.log("OK");
    hideModal();
  };
  return (
    <>
      <Button key="1" type="primary" onClick={showModal}>
        Create Room
      </Button>

      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onOk={handleOkModal}
        onCancel={hideModal}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
};

export default CreateRoomForm;
