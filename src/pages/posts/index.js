import React, { useState, useEffect } from "react";
import { CKEditor } from "ckeditor4-react";
import dayjs from "dayjs";
import {
  Divider,
  Space,
  Button,
  Drawer,
  notification,
  Popconfirm,
  Row,
  Col,
  Form,
  Input,
  Select,
  Checkbox,
  Table,
  Image,
} from "antd";
import {
  PlusOutlined,
  SyncOutlined,
  SaveOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  SearchOutlined,
} from "@ant-design/icons";
import {
  deletePost,
  getAllCategory,
  getPostPaging,
  inserPost,
  updatePost,
  getPostById,
} from "../../helpers/helper";

import BreadcrumbCustom from "../../common/breadcrumb.js";
import { textConfirmDelete } from "../../common/const.js";
import { ellipsisMiddle } from "../../common/function";

document.title = "Bài Viết";
export default function PostPages() {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [open, setOpen] = useState(false);
  const [textSave, setTextSave] = useState("Lưu");
  const [loading, setLoading] = useState(false);
  const [fileThumb, setFileThumb] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const [listPost, setListPost] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const [content, setContent] = useState();
  const [checkedShow, setCheckedShow] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  useEffect(() => {
    fetchPostPaging();
  }, [JSON.stringify(tableParams)]);

  useEffect(() => {
    fetchAllCategory();
  }, []);

  useEffect(() => {}, [content]);

  const fetchAllCategory = async () => {
    const _res = await getAllCategory();
    setListCategory(_res || []);
  };

  const fetchPostPaging = async () => {
    setLoadingTable(true);
    const param = {
      pageIndex: tableParams.pagination.current,
      pageSize: tableParams.pagination.pageSize,
    };
    const _res = await getPostPaging(param);
    setListPost(_res?.data?.data || []);
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        total: _res.data?.totalRecord,
      },
    });
    setLoadingTable(false);
  };

  const showDrawer = () => {
    setOpen(true);
    form.resetFields();
    setContent("");
    setShowEditor(true);
    setTextSave("Lưu");
  };

  const onClose = () => {
    setOpen(false);
    setShowEditor(false);
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFinish = async (values) => {
    const _req = {
      categoryId: values.categoryId,
      title: values.title,
      thumbnail: values.thumbnail,
      description: values.description,
      content: values.content,
      status: values.status === undefined ? 0 : values.status ? 0 : 1,
    };

    if (!values.id) {
      const _res = await inserPost(_req);
      if (_res?.data === null) {
        setLoading(false);
        if (_res?.status === -1) {
          return api["error"]({
            message: "Lỗi",
            description: "Bạn không có quyền sử dụng chức năng này!",
          });
        }
        return api["error"]({
          message: "Lỗi",
          description: _res?.message,
        });
      } else {
        setLoading(false);
        fetchPostPaging();
        onClose();
        return api["success"]({
          message: "Thành công",
          description: "Thêm bài viết thành công!",
        });
      }
    } else {
      _req.id = values.id;
      const _res = await updatePost(_req);
      if (_res?.data === null) {
        setLoading(false);
        if (_res?.status === -1) {
          return api["error"]({
            message: "Lỗi",
            description: "Bạn không có quyền sử dụng chức năng này!",
          });
        }
        return api["error"]({
          message: "Lỗi",
          description: _res?.message,
        });
      } else {
        setLoading(false);
        fetchPostPaging();
        onClose();
        return api["success"]({
          message: "Thành công",
          description: "Cập nhật viết thành công!",
        });
      }
    }
  };

  const onFinishFailed = async (values) => {};

  const onEdit = async (id) => {
    setTextSave("Cập nhật");
    // const dataEdit = listPost.filter((item) => item.id === id);

    const dataEdit = await getPostById({ id: id, isEdit: true });

    console.log("🚀 ~ file: index.js:181 ~ onEdit ~ dataEdit:", dataEdit);

    form.setFieldsValue({
      id: dataEdit?.data?.id,
      categoryId: dataEdit?.data?.categoryId,
      title: dataEdit?.data?.title,
      description: dataEdit?.data?.description,
      thumbnail: dataEdit?.data?.thumbnail,
      content: dataEdit?.data?.content,
    });

    setOpen(true);
    setShowEditor(true);
    setFileThumb(dataEdit?.data?.thumbnail);
    setCheckedShow(dataEdit?.data?.status === 0 ? true : false);
    setContent(dataEdit?.data?.content);
  };

  const onDelete = async (id) => {
    const _res = await deletePost(id);
    if (_res?.status !== 1) {
      setLoading(false);
      if (_res?.status === -1) {
        return api["error"]({
          message: "Lỗi",
          description: "Bạn không có quyền sử dụng chức năng này!",
        });
      }

      return api["error"]({
        message: "Lỗi",
        description: _res?.message,
      });
    } else {
      setLoading(false);
      fetchPostPaging();
      return api["success"]({
        message: "Thành công",
        description: "Xóa bài viết thành công!",
      });
    }
  };

  const onChangeChecked = (e) => {
    form.setFieldsValue({
      status: e.target.checked,
    });
    setCheckedShow(!checkedShow);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setListCategory([]);
    }
  };

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text) => {
        return ellipsisMiddle(text, 50);
      },
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text) => {
        return ellipsisMiddle(text, 100);
      },
    },
    {
      title: "Chuyên mục",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Hình đại diện",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (_, record) => {
        if (record.thumbnail)
          return (
            <Image
              className="img-table"
              width={100}
              height={50}
              src={record.thumbnail}
            />
          );
      },
    },
    {
      title: "Lượt xem",
      dataIndex: "counts",
      key: "counts",
    },
    {
      title: "Người tạo",
      dataIndex: "userFullName",
      key: "userFullName",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdTime",
      key: "createdTime",
      render: (text) => {
        return dayjs(text).format("DD-MM-YYYY HH:mm:ss");
      },
    },
    {
      title: "Hiển thị",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        return text === 0 ? (
          <CheckCircleTwoTone twoToneColor="#52c41a" />
        ) : (
          <CloseCircleTwoTone twoToneColor="#eb2f96" />
        );
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

  const handleClickChosenImageThumb = () => {
    window.open(
      "/media-public",
      "_blank",
      "location=yes,height=888,width=1535,scrollbars=yes,status=yes"
    );
  };

  return (
    <div>
      {contextHolder}
      <BreadcrumbCustom parentTitle={"QL Bài Viết"} subTitle={"Bài Viết"} />
      <Divider />
      <Space wrap>
        <Button type="primary" icon={<PlusOutlined />} onClick={showDrawer}>
          Thêm mới
        </Button>
      </Space>
      <Drawer
        title="Bài viết"
        width={1280}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
      >
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
          className="form-post"
        >
          <Form.Item name="id" label="Id" hidden={true}>
            <Input />
          </Form.Item>
          <Row gutter={[16, 0]}>
            <Col span={24}>
              <Form.Item
                label="Tiêu đề "
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tiêu đề bài viết",
                  },
                ]}
              >
                <Input placeholder="Nhập tiêu đề bài viết" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Mô tả"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mô tả bài viết",
                  },
                ]}
              >
                <Input.TextArea placeholder="Nhập đường dẫn bài viết" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Chuyên mục cha"
                name="categoryId"
                rules={[
                  {
                    required: true,
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
                  placeholder="Chọn chuyên mục"
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
            <Col span={12}>
              <Form.Item
                label="Hình đại diện"
                name="thumbnail"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập đường dẫn hình ảnh",
                  },
                ]}
              >
                <Input
                  placeholder="Nhập đường dẫn hình ảnh"
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Button
                type="primary"
                onClick={handleClickChosenImageThumb}
                icon={<SearchOutlined />}
              >
                Chọn hình
              </Button>
            </Col>

            <Col span={24}>
              <Form.Item label="Mô tả" name="status">
                <Checkbox
                  onChange={onChangeChecked}
                  defaultChecked={true}
                  checked={checkedShow}
                >
                  Hiển thị
                </Checkbox>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Nội dung"
                name="content"
                rules={[
                  {
                    message: "Vui lòng nhập nội dung",
                  },
                ]}
              >
                {showEditor && (
                  <CKEditor
                    initData={content}
                    onInstanceReady={({ editor }) => {
                      console.log("Editor is ready!");
                    }}
                    onChange={({ editor }) => {
                      form.setFieldsValue({ content: editor.getData() });
                    }}
                    config={{
                      filebrowserBrowseUrl: "/media-public",
                      // filebrowserUploadUrl: "/uploader/upload.php",
                    }}
                  />
                )}
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
                onClick={onReset}
                icon={<SyncOutlined />}
              >
                Làm Mới
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>

      <Divider />

      <Table
        size="middle"
        columns={columns}
        rowKey={(record) => {
          return record.id;
        }}
        dataSource={listPost}
        pagination={tableParams.pagination}
        loading={loadingTable}
        onChange={handleTableChange}
      />
    </div>
  );
}
