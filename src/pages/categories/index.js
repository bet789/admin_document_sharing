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
  Popconfirm,
  Col,
  Row,
} from "antd";
import {
  SaveOutlined,
  SyncOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import BreadcrumbCustom from "../../common/breadcrumb.js";
import {
  deleteCategory,
  getAllCategory,
  getCategoryPaging,
  inserCategory,
  updateCategory,
  getAllBranch,
} from "../../helpers/helper.js";
import { textConfirmDelete } from "../../common/const.js";

export default function CategoriesPages() {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const [loading, setLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [textSave, setTextSave] = useState("Lưu");
  const [data, setData] = useState();
  const [listBranch, setListBranch] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  useEffect(() => {
    fetchListBranch();
    fetchAllCategory();
  }, []);

  useEffect(() => {
    fetchCategoryPaging();
  }, [JSON.stringify(tableParams)]);

  const fetchListBranch = async () => {
    const _res = await getAllBranch();
    setListBranch(_res.data || []);
  };

  const fetchAllCategory = async () => {
    const _res = await getAllCategory();
    setListCategory(_res || []);
  };

  const fetchCategoryPaging = async () => {
    setLoadingTable(true);

    const param = {
      pageIndex: tableParams.pagination.current,
      pageSize: tableParams.pagination.pageSize,
    };

    const _res = await getCategoryPaging(param);
    setData(_res?.data || []);
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
    setLoading(true);
    if (!values.id) {
      const _req = {
        name: values.name,
        branchId: values.branhId || null,
        parentId: values.parentId || null,
        icon: null,
      };
      //Insert the role
      const _res = await inserCategory(_req);
      if (_res?.data === null) {
        setLoading(false);
        return api["error"]({
          message: "Lỗi",
          description: _res?.message,
        });
      } else {
        setLoading(false);
        fetchCategoryPaging();
        fetchAllCategory();
        return api["success"]({
          message: "Thành công",
          description: "Thêm chuyên mục thành công!",
        });
      }
    } else {
      const _req = {
        id: values.id,
        name: values.name,
        branchId: values.branhId || null,
        parentId: values.parentId || null,
        icon: null,
      };
      const _res = await updateCategory(_req);
      if (_res?.data === null) {
        setLoading(false);
        return api["error"]({
          message: "Lỗi",
          description: _res?.message,
        });
      } else {
        setLoading(false);
        fetchCategoryPaging();
        return api["success"]({
          message: "Thành công",
          description: "Cập nhật chuyên mục thành công!",
        });
      }
    }
  };

  const onFinishFailed = (values) => {};

  const onReset = () => {
    form.resetFields();
    fetchCategoryPaging();
    setTextSave("Lưu");
  };

  const onSearch = async () => {
    setLoadingTable(true);
    const param = {
      pageIndex: 1,
      pageSize: tableParams.pagination.pageSize,
      branchId: form.getFieldValue("branhId") || "",
      name: form.getFieldValue("name") || "",
    };

    const _res = await getCategoryPaging(param);
    setData(_res?.data || []);
    setLoadingTable(false);
  };

  const onEdit = (id) => {
    setTextSave("Cập nhật");
    const dataEdit = data.filter((item) => item.id === id);
    const dataBranch = listBranch.filter(
      (item) => item.name === dataEdit[0].branchName
    );
    form.setFieldsValue({
      id: dataEdit[0].id,
      name: dataEdit[0].name,
      branhId: dataBranch[0].id || null,
      parentId: dataEdit[0].parentId || null,
    });
  };

  const onDelete = async (id) => {
    const _res = await deleteCategory(id);
    if (_res?.status !== 1) {
      setLoading(false);
      return api["error"]({
        message: "Lỗi",
        description: _res?.message,
      });
    } else {
      setLoading(false);
      fetchCategoryPaging();
      return api["success"]({
        message: "Thành công",
        description: "Xóa chuyên mục thành công!",
      });
    }
  };

  const columns = [
    {
      title: "Tên chi nhánh",
      dataIndex: "branchName",
      key: "branchName",
    },
    {
      title: "Chuyên mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Chuyên mục cha",
      dataIndex: "parentCategoryName",
      key: "parentCategoryName",
      render: (_, record) => {
        return `${
          record.parentCategoryName ? record.parentCategoryName : "___"
        } (${record.branchName})`;
      },
    },
    {
      title: "Hành động",
      dataIndex: "",
      key: "x",
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
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Form.Item
              label="Chi nhánh"
              name="branhId"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn chi nhánh!",
                },
              ]}
            >
              <Select
                showSearch
                style={{
                  width: "100%",
                }}
                placeholder="Chọn chi nhánh"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").includes(input)
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
                      label: `${item.name}`,
                    };
                  })
                }
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Chuyên mục"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Nhập chuyên mục!",
                },
              ]}
            >
              <Input placeholder="Nhập chuyên mục" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Chuyên mục cha"
              name="parentId"
              rules={[
                {
                  message: "Vui lòng chọn chuyên mục cha!",
                },
              ]}
            >
              <Select
                allowClear
                showSearch
                style={{
                  width: "100%",
                }}
                placeholder="Chọn chuyên mục cha"
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
                  listCategory &&
                  listCategory?.map((item, i) => {
                    if (!item.isDelete)
                      return {
                        value: item.id,
                        label: `${item.name} (${item.branchName})`,
                      };
                  })
                }
              />
            </Form.Item>
          </Col>
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
              onClick={onSearch}
              icon={<SearchOutlined />}
            >
              Tìm Kiếm
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
