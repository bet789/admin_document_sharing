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
  Row,
  Col,
  Select,
} from "antd";
import {
  SaveOutlined,
  SyncOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import BreadcrumbCustom from "../../common/breadcrumb.js";
import {
  getAllRoles,
  getUserPaging,
  inserUser,
  updateUser,
  deleteUser,
  getAllBranch,
} from "../../helpers/helper.js";
import { textConfirmDelete } from "../../common/const.js";

export default function AccountsPages() {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const [loading, setLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [listRole, setListRole] = useState([]);
  const [listBranch, setListBranch] = useState([]);
  const [textSave, setTextSave] = useState("Lưu");
  const [data, setData] = useState();
  const [showBranch, setShowBranch] = useState(true);

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  useEffect(() => {
    fetchDataBranch();
    fetchDataRole();
  }, []);

  useEffect(() => {
    fetchDataAccount();
  }, [JSON.stringify(tableParams)]);

  const fetchDataAccount = async () => {
    setLoadingTable(true);
    const paramReq = {
      pageIndex: tableParams.pagination.current,
      pageSize: tableParams.pagination.pageSize,
    };
    const _res = await getUserPaging(paramReq);
    console.log("🚀 ~ file: index.js:67 ~ fetchDataAccount ~ _res:", _res);
    setData(_res.data || []);
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        total: _res?.totalRecord,
      },
    });
    setLoadingTable(false);
  };

  const fetchDataRole = async () => {
    setLoading(true);
    const _res = await getAllRoles();
    setListRole(_res || []);
    setLoading(false);
  };

  const fetchDataBranch = async () => {
    setLoading(true);
    const _res = await getAllBranch();
    setListBranch(_res?.data || []);
    setLoading(false);
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
      const _res = await inserUser(values);
      if (_res?.data === null) {
        setLoading(false);
        return api["error"]({
          message: "Lỗi",
          description: _res?.message,
        });
      } else {
        setLoading(false);
        fetchDataAccount();
        return api["success"]({
          message: "Thành công",
          description: "Thêm người dùng thành công!",
        });
      }
    } else {
      const _res = await updateUser(values);
      if (_res?.data === null) {
        setLoading(false);
        return api["error"]({
          message: "Lỗi",
          description: _res?.message,
        });
      } else {
        setLoading(false);
        fetchDataAccount();
        return api["success"]({
          message: "Thành công",
          description: "Cập nhật người dùng thành công!",
        });
      }
    }
  };

  const onFinishFailed = (values) => {};

  const onReset = () => {
    form.resetFields();
    fetchDataAccount();
    setTextSave("Lưu");
  };

  const onEdit = (id) => {
    setTextSave("Cập nhật");
    const dataEdit = data.filter((item) => item.id === id);
    form.setFieldsValue({
      id: dataEdit[0].id,
      roleId: dataEdit[0].roleId,
      branchId: dataEdit[0].branchId,
      fullName: dataEdit[0].fullName,
      userName: dataEdit[0].userName,
    });

    if (dataEdit[0].roleName === "ADMIN") setShowBranch(false);
    else setShowBranch(true);
  };

  const onDelete = async (id) => {
    const _res = await deleteUser(id);
    if (_res?.status !== 1) {
      setLoading(false);
      return api["error"]({
        message: "Lỗi",
        description: _res?.message,
      });
    } else {
      setLoading(false);
      fetchDataAccount();
      return api["success"]({
        message: "Thành công",
        description: "Xóa người dùng thành công!",
      });
    }
  };

  const onSelectRole = (id, data) => {
    if (data.label === "ADMIN") setShowBranch(false);
    else setShowBranch(true);
  };

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Vai trò",
      dataIndex: "roleName",
      key: "roleName",
    },
    {
      title: "Chi nhánh",
      dataIndex: "branchName",
      key: "branchName",
    },
    {
      title: "Hành động",
      dataIndex: "",
      key: "x",
      width: "20%",
      render: (_, record) => {
        if (record.userName === "admin") return;

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

  document.title = "QL Tài Khoản";
  return (
    <div>
      {contextHolder}
      <BreadcrumbCustom parentTitle={"QL Tài Khoản"} subTitle={"Tài Khoản"} />
      <Divider />

      <Form
        form={form}
        name="basic"
        layout="vertical"
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
        <Form.Item name="id" label="Id" hidden={true}>
          <Input name="id" />
        </Form.Item>
        <Row gutter={[16, 0]}>
          <Col span={6}>
            <Form.Item
              label="Họ và tên"
              name="fullName"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập họ và tên",
                },
              ]}
            >
              <Input placeholder="Nhập họ và tên" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Tên đăng nhập"
              name="userName"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên đăng nhập!",
                },
              ]}
            >
              <Input placeholder="Nhập tên đăng nhập" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Mật khẩu "
              name="password"
              rules={[
                {
                  required:
                    textSave.toUpperCase() === "CẬP NHẬT" ? false : true,
                  message: "Vui lòng nhập mật khẩu",
                },
              ]}
            >
              <Input.Password
                placeholder="Nhập mật khẩu"
                autoComplete="new-password"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Vai trò"
              name="roleId"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn vai trò!",
                },
              ]}
            >
              <Select
                allowClear
                showSearch
                style={{
                  width: "100%",
                }}
                onSelect={onSelectRole}
                placeholder="Chọn vai trò"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input)
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                options={
                  listRole &&
                  listRole?.map((item, i) => {
                    return {
                      value: item.id,
                      label: item.roleName,
                    };
                  })
                }
              />
            </Form.Item>
          </Col>

          {showBranch && (
            <Col span={6}>
              <Form.Item
                label="Chi nhánh"
                name="branchId"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn chi nhánh!",
                  },
                ]}
              >
                <Select
                  allowClear
                  showSearch
                  style={{
                    width: "100%",
                  }}
                  placeholder="Chọn chi nhánh"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "").toLowerCase().includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  options={
                    listBranch &&
                    listBranch?.map((item, i) => {
                      return {
                        value: item.id,
                        label: item.name,
                      };
                    })
                  }
                />
              </Form.Item>
            </Col>
          )}
        </Row>
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
