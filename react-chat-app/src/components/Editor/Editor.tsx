import { Button, Form } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React from "react";

const Editor = ({ onChange, onSubmit, submitting, value }: any) => (
  <>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        loading={submitting}
        onClick={onSubmit}
        type="primary"
      >
        Add Message
      </Button>
    </Form.Item>
  </>
);
export default Editor;
