import React, { useEffect, useState } from "react";
import {
  Divider,
  Form,
  Input,
  Button,
  Space,
  Table,
  notification,
  Select,
  Checkbox,
} from "antd";
import { SaveOutlined, SyncOutlined } from "@ant-design/icons";

import BreadcrumbCustom from "../../common/breadcrumb.js";
import { getAllRoles, getByRoleId } from "../../helpers/helper.js";

const { Option } = Select;

export default function ActionsPages() {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const [loading, setLoading] = useState(false);
  const [dataRole, setDataRole] = useState();

  const fetchData = async () => {
    const _res = await getAllRoles();
    const _item = _res?.map((item) => {
      return {
        id: item.id,
        roleName: item.roleName,
      };
    });

    setDataRole(_item || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onFinish = async (values) => {};

  const onFinishFailed = (values) => {};

  const onReset = () => {
    form.resetFields();
    fetchData();
  };

  const onChangeRole = async (value) => {
    const _res = await getByRoleId(value);
    console.log("🚀 ~ file: index.js:61 ~ onChangeRole ~ _res", _res);
    const _item = _res?.map((item) => {
      return {
        id: item.id,
        name: item.name,
      };
    });
  };

  document.title = "QL Hành Động";
  return (
    <div>
      {contextHolder}
      <BreadcrumbCustom parentTitle={"QL Hành Động"} subTitle={"Hành Động"} />
      <Divider />

      <Form
        form={form}
        name="basic"
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 6,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Tên vai trò"
          name="roleName"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn tên vai trò",
            },
          ]}
        >
          <Select
            placeholder="Chọn tên vai trò"
            onChange={onChangeRole}
            allowClear
          >
            {dataRole &&
              dataRole?.map((item) => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.roleName}
                  </Option>
                );
              })}
          </Select>
        </Form.Item>

        <Form.Item name="roleAction" label="Id" hidden={true}>
          <Input name="id" />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading ? true : false}
              icon={<SaveOutlined />}
            >
              Lưu
            </Button>
            <Button
              type="primary"
              htmlType="button"
              onClick={onReset}
              icon={<SyncOutlined />}
            >
              Làm Mới
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}
