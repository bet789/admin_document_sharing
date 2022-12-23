import React, { useEffect, useState } from "react";
import { Divider, Form, Input, Button, Space, Table } from "antd";
import { SaveOutlined, SyncOutlined, EditOutlined } from "@ant-design/icons";
import qs from "qs";

import BreadcrumbCustom from "../../common/breadcrumb.js";
import { getAllRoles } from "../../helpers/helper.js";
const columns = [
  {
    title: "Tên Vai trò",
    dataIndex: "roleName",
    // render: (name) => `${name.first} ${name.last}`,
  },
  {
    title: "Hành động",
    dataIndex: "",
    key: "x",
    render: () => (
      <Space>
        <Button icon={<EditOutlined />} />
      </Space>
    ),
  },
];

const getRandomuserParams = (params) => ({
  results: params.pagination?.pageSize,
  page: params.pagination?.current,
  ...params,
});

export default function RolesPages() {
  const [form] = Form.useForm();
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
    console.log(_res);
    // fetch(
    //   `https://randomuser.me/api?${qs.stringify(
    //     getRandomuserParams(tableParams)
    //   )}`
    // )
    //   .then((res) => res.json())
    //   .then(({ results }) => {
    //     setData(results);
    //     setLoadingTable(false);
    //     setTableParams({
    //       ...tableParams,
    //       pagination: {
    //         ...tableParams.pagination,
    //         total: 200,
    //       },
    //     });
    //   });
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

  const onFinish = (values) => {};

  const onFinishFailed = (values) => {};

  const onReset = () => {
    form.resetFields();
  };

  document.title = "QL Vai Trò";
  return (
    <div>
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
        <Form.Item
          label="Tên vai trò"
          name="roleName"
          rules={[
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
        columns={columns}
        rowKey={(record) => {
          // console.log(record);
          return record.login.uuid;
        }}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loadingTable}
        onChange={handleTableChange}
      />
    </div>
  );
}
