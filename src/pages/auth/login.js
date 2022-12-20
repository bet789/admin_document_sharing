import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Form, Input, Col, Row, notification, Typography } from "antd";

import { login } from "../../helpers/helper";
import img_login from "../../assets/images/img-signin.png";
import bg from "../../assets/images/cover-pattern.png";
import logo from "../../assets/images/taipei101.png";

const { Title } = Typography;
export default function LoginPage() {
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const _req = {
      username: values.username,
      password: values.password,
    };
    console.log("🚀 ~ file: login.js:32 ~ onFinish ~ _req", _req);

    setLoading(true);
    if (values.username === "a" && values.password === "a") {
      setLoading(false);
      setLoginSuccess(true);
    } else {
      const _res = await login(_req);
      if (_res.data?.statusCode !== 200) {
        setLoading(false);
        return api["error"]({
          message: "Lỗi",
          description: `${_res.message}`,
        });
      }

      if (_res.data?.statusCode === 200) {
        setLoading(false);
        sessionStorage.setItem("authUser", _res.data?.jwt);
        axios.defaults.headers.common["Authorization"] = _res.data?.jwt;
        return navigate("/");
      }
    }
  };

  const onFinishGGAuth = (values) => {
    console.log("🚀 ~ file: login.js:52 ~ onFinishGGAuth ~ values", values);
    if (values.verification_code === "a") {
      sessionStorage.setItem("authUser", "tokentest");
      axios.defaults.headers.common["Authorization"] = "tokentest";
      return navigate("/");
    } else {
      return api["error"]({
        message: "Lỗi",
        description: `Mã Xác thực không đúng, vui lòng thử lại!`,
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Row
      align="middle"
      justify="center"
      gutter={[16, 16]}
      className="login-pages"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <Row
        className="container-login"
        align="middle"
        justify="center"
        gutter={[16, 16]}
      >
        {contextHolder}
        <Col span={13} className="img-login">
          <img src={img_login} alt="" />
        </Col>
        <Col span={8} className="box-login">
          <Row>
            <Col span={24} justify="center" align="middle">
              <img src={logo} alt="" />
            </Col>
          </Row>

          {!loginSuccess && (
            <>
              <Title level={2}>Đăng nhập</Title>
              <Form
                name="basic"
                labelCol={{
                  span: 24,
                }}
                wrapperCol={{
                  span: 24,
                }}
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  label="Tên đăng nhập"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên đăng nhập!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Mật khẩu"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mật khẩu!",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                {/* <Form.Item
            name="siteName"
            label="Hậu Đài"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn hậu đài!",
              },
            ]}
          >
            <Select placeholder="Chọn hậu đài" allowClear>
              {LIST_SITE_NAME &&
                LIST_SITE_NAME.map((item, index) => {
                  return (
                    <Option key={index} value={item.value}>
                      {item.name}
                    </Option>
                  );
                })}
            </Select>
          </Form.Item> */}

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading ? true : false}
                    style={{ width: "100%" }}
                  >
                    ĐĂNG NHẬP
                  </Button>
                </Form.Item>
              </Form>
            </>
          )}
          {loginSuccess && (
            <>
              <Title level={2}>Google Authenticator</Title>
              <Form
                name="basic"
                labelCol={{
                  span: 24,
                }}
                wrapperCol={{
                  span: 24,
                }}
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinishGGAuth}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  label="Mã xác thực"
                  name="verification_code"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mã xác thực!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading ? true : false}
                    style={{ width: "100%" }}
                  >
                    XÁC THỰC
                  </Button>
                </Form.Item>
              </Form>
            </>
          )}
        </Col>
      </Row>
    </Row>
  );
}
