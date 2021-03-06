import React, { useState, useEffect } from "react";
import { Form, Input, Button, InputNumber, Radio, message } from "antd";
import axios from "axios";
import "./App.css";

const instance = axios.create({
  baseURL: "https://botmam.herokuapp.com",
});
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

function App() {
  const [loading, setLoading] = useState(false);
  const [isAuth, setAuth] = useState(false);
  useEffect(() => {
    setAuth(!!localStorage.getItem("token"));
  }, [loading]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { data } = await instance.post("/login", values);
      setLoading(false);
      localStorage.setItem("token", data?.token);
    } catch (err) {
      message.error("Something went wrong.");
      setLoading(false);
    }
  };

  const onAction = async (values) => {
    try {
      setLoading(true);
      const { data } = await instance.post("/actions", values, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setLoading(false);

      if (data.done) {
        message.success("Done Successfully!");
      } else {
        message.error("Please try again.");
      }
    } catch (err) {
      message.error("Something went wrong.");
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error("Please try again.");
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>BotMam</p>
      </header>
      {isAuth ? (
        <Form
          {...layout}
          name="nest-messages"
          onFinish={onAction}
          style={{ width: "40%", margin: "20px auto", minWidth: 250 }}
          initialValues={{
            hashtag: "computer",
            usersCountToFollow: 3,
            likesCountToLike: 0,
            mode: "follow",
            comment: "",
          }}
        >
          <Form.Item
            name={"hashtag"}
            label="Hashtag"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={"usersCountToFollow"}
            label="Users Count To Follow"
            rules={[
              {
                type: "number",
                min: 0,
                max: 99,
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            name={"likesCountToLike"}
            label="Likes Count To Like"
            rules={[
              {
                type: "number",
                min: 0,
                max: 99,
              },
            ]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item label="Mode" name="mode">
            <Radio.Group value={""}>
              <Radio.Button value="follow">Follow</Radio.Button>
              <Radio.Button value="">Like and Comment</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item name={"comment"} label="Comment">
            <Input.TextArea />
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          style={{ width: "40%", margin: "20px auto", minWidth: 250 }}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
}

export default App;
