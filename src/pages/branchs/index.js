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
  deleteBranch,
  getAllBranch,
  inserBranch,
  updateBranch,
} from "../../helpers/helper.js";
import { textConfirmDelete } from "../../common/const.js";

export default function BranchsPages() {
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

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams)]);

  const fetchData = async () => {
    setLoadingTable(true);

    const param = {
      pageIndex: tableParams.pagination.current,
      pageSize: tableParams.pagination.pageSize,
    };
    const _res = await getAllBranch(param);
    const _item = _res.data?.map((item) => {
      return {
        id: item.id,
        name: item.name,
        icon: item.icon,
      };
    });

    setData(_item || []);
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        total: _res.totalRecord,
      },
    });

    setLoadingTable(false);
  };

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
      const _req = {
        name: values.name,
        icon: null,
      };
      //Insert the role
      const _res = await inserBranch(_req);
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
          description: "Thêm chi nhánh thành công!",
        });
      }
    } else {
      const _req = {
        id: values.id,
        name: values.name,
        icon: null,
      };
      const _res = await updateBranch(_req);
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
          description: "Cập nhật chi nhánh thành công!",
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
      name: dataEdit[0].name,
      id: dataEdit[0].id,
    });
  };

  const onDelete = async (id) => {
    const _res = await deleteBranch(id);
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
        description: "Xóa chi nhánh thành công!",
      });
    }
  };

  const columns = [
    {
      title: "Tên chi nhánh",
      dataIndex: "name",
      key: "name",
      width: "80%",
    },
    // {
    //   title: "Icon",
    //   dataIndex: "icon",
    //   key: "icon",
    // },
    {
      title: "Hành động",
      dataIndex: "",
      key: "x",
      width: "20%",
      render: (_, record) => (
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
      ),
    },
  ];

  document.title = "QL Chi Nhánh";
  return (
    <div>
      {contextHolder}
      <BreadcrumbCustom parentTitle={"QL Chi Nhánh"} subTitle={"Chi Nhánh"} />
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
          label="Tên chi nhánh"
          name="name"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên chi nhánh!",
            },
          ]}
        >
          <Input placeholder="Nhập tên chi nhánh" />
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
