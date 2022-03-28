import React from "react";

import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const Loader = () => {
  const antIcon = <LoadingOutlined className="loader-icon" spin />;
  const Loader = (
    <div className="loader">
      <Spin indicator={antIcon} />
    </div>
  );
  return Loader;
};

export default Loader;
