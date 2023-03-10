import React, { useEffect, useState } from "react";
import {
  Divider,
  Form,
  Input,
  Button,
  Space,
  Table,
  notification,
  Popconfirm,
} from "antd";
import {
  SaveOutlined,
  SyncOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import BreadcrumbCustom from "../../common/breadcrumb.js";
import {
  deleteRole,
  getAllRoles,
  inserRole,
  updateRole,
} from "../../helpers/helper.js";
import { textConfirmDelete } from "../../common/const.js";

export default function RolesPages() {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const [loading, setLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [textSave, setTextSave] = useState("Lưu");
  const [data, setData] = useState();

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const fetchData = async () => {
    setLoadingTable(true);

    const _res = await getAllRoles();
    const _item = _res?.map((item) => {
      return {
        id: item.id,
        roleName: item.roleName,
      };
    });

    setData(_item || []);
    setLoadingTable(false);
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams)]);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  const onFinish = async (values) => {
    console.log(values);
    setLoading(true);

    if (!values.id) {
      //Insert the role
      const _res = await inserRole(values);
      if (_res?.data === null) {
        setLoading(false);
        return api["error"]({
          message: "Lỗi",
          description: _res?.message,
        });
      } else {
        setLoading(false);
        fetchData();
        return api["success"]({
          message: "Thành công",
          description: "Thêm vai trò thành công!",
        });
      }
    } else {
      const _res = await updateRole(values);
      if (_res?.data === null) {
        setLoading(false);
        return api["error"]({
          message: "Lỗi",
          description: _res?.message,
        });
      } else {
        setLoading(false);
        fetchData();
        return api["success"]({
          message: "Thành công",
          description: "Cập nhật vai trò thành công!",
        });
      }
    }
  };

  const onFinishFailed = (values) => {};

  const onReset = () => {
    form.resetFields();
    fetchData();
    setTextSave("Lưu");
  };

  const onEdit = (id) => {
    setTextSave("Cập nhật");
    const dataEdit = data.filter((item) => item.id === id);
    form.setFieldsValue({
      roleName: dataEdit[0].roleName,
      id: dataEdit[0].id,
    });
  };

  const onDelete = async (id) => {
    const _res = await deleteRole(id);
    if (_res?.status !== 1) {
      setLoading(false);
      return api["error"]({
        message: "Lỗi",
        description: _res?.message,
      });
    } else {
      setLoading(false);
      fetchData();
      return api["success"]({
        message: "Thành công",
        description: "Xóa vai trò thành công!",
      });
    }
  };

  const columns = [
    {
      title: "Tên Vai trò",
      dataIndex: "roleName",
      key: "roleName",
      width: "80%",
    },
    {
      title: "Hành động",
      dataIndex: "",
      key: "x",
      width: "20%",
      render: (_, record) => {
        if (record.roleName !== "ADMIN")
          return (
            <Space>
              <Button
                icon={<EditOutlined />}
                size="small"
                onClick={() => onEdit(record.id)}
                shape="circle"
              />
              <Popconfirm
                placement="top"
                title={textConfirmDelete}
                description={""}
                onConfirm={() => onDelete(record.id)}
                okText="Xóa"
                cancelText="Hủy"
              >
                <Button icon={<DeleteOutlined />} size="small" shape="circle" />
              </Popconfirm>
            </Space>
          );
      },
    },
  ];

  document.title = "QL Vai Trò";
  return (
    <div>
      {contextHolder}
      <BreadcrumbCustom parentTitle={"QL Vai Trò"} subTitle={"Vai Trò"} />
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
        <Form.Item name="id" label="Id" hidden={true}>
          <Input name="id" />
        </Form.Item>
        <Form.Item
          label="Tên vai trò"
          name="roleName"
          rules={[
            {
              pattern: new RegExp(
                /[^_~`@#$%^&*()_={},.<>/?|àáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ]/u
              ),
              message:
                "Vui lòng không nhập tiếng việt có dấu và ký tự đặc biệt!",
            },
            {
              required: true,
              message: "Vui lòng nhập tên vai trò!",
            },
          ]}
        >
          <Input placeholder="Nhập tên vai trò" />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading ? true : false}
              icon={<SaveOutlined />}
            >
              {textSave}
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

      <Divider />

      <Table
        size="middle"
        columns={columns}
        rowKey={(record) => {
          return record.id;
        }}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loadingTable}
        onChange={handleTableChange}
      />
    </div>
  );
}
