import React, { useState } from "react";
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
  message,
  Upload,
  Select,
} from "antd";
import {
  PlusOutlined,
  SyncOutlined,
  SaveOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";

import {
  API_MEDIA_DELETE_FILE,
  API_MEDIA_UPLOAD,
} from "../../helpers/url_helper";
import BreadcrumbCustom from "../../common/breadcrumb.js";
import { mediaServer } from "../../helpers/config.js";
import { CKEditor } from "ckeditor4-react";

document.title = "Bài Viết";
export default function PostPages() {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [open, setOpen] = useState(true);
  const [textSave, setTextSave] = useState("Lưu");
  const [loading, setLoading] = useState(false);
  const [fileThumb, setFileThumb] = useState([]);

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFinish = async (values) => {
    console.log("🚀 ~ file: index.js:40 ~ PostPages ~ values", values);
  };

  const onFinishFailed = async (values) => {};

  const propsUpload = {
    multiple: false,
    name: "file",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} tải lên thành công.`);
      } else if (status === "error") {
        message.error(`${info.file.name} tải lên thất bại.`);
      }
    },
    async customRequest(options) {
      const { onSuccess, onError, file, onProgress } = options;

      const fmData = new FormData();
      const config = {
        onUploadProgress: (event) => {
          const percent = Math.floor((event.loaded / event.total) * 100);
          onProgress({ percent: (event.loaded / event.total) * 100 });
        },
      };
      fmData.append("file", file);
      try {
        const response = await fetch(
          `${mediaServer.API_URL}${API_MEDIA_UPLOAD}${mediaServer.COLLECTIONID}`,
          {
            method: "POST",
            headers: {
              Authorization: mediaServer.TOKEN,
              contentType: "",
            },
            body: fmData,
          },
          config
        );
        const _res = await response.json();
        setFileThumb(_res);
        onSuccess("Ok");
      } catch (err) {
        console.log("Eroor: ", err);
        const error = new Error("Some error");
        onError({ err });
      }
    },
    async onRemove() {
      console.log("onRemove");
      // const response = await fetch(
      //   `${mediaServer.API_URL}${API_MEDIA_DELETE_FILE}?id=${file.name}`,
      //   {
      //     method: "DELETE",
      //     headers: {
      //       Authorization: mediaServer.TOKEN,
      //     },
      //   }
      // );
      // const _res = await response.json();
      // if (_res.status === 1) {
      //   message.success(`Xóa file thành công.`);
      // } else {
      //   message.success(`Xóa file thất bại.`);
      // }
    },
    onPreview(file) {
      console.log("onPreview");
    },
  };

  return (
    <div>
      <BreadcrumbCustom parentTitle={"QL Bài Viết"} subTitle={"Bài Viết"} />
      <Divider />
      <Space wrap>
        <Button type="primary" icon={<PlusOutlined />} onClick={showDrawer}>
          Thêm mới
        </Button>
      </Space>

      <Drawer
        title="Thêm mới bài viết"
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
        >
          <Form.Item name="id" label="Id" hidden={true}>
            <Input />
          </Form.Item>
          <Row gutter={[16, 16]}>
            <Col span={12}>
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
            <Col span={12}>
              <Form.Item
                label="Đường dẫn "
                name="path"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập đường dẫn bài viết",
                  },
                ]}
              >
                <Input placeholder="Nhập đường dẫn bài viết" />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="Hình đại diện"
                name="thumbnail"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng tải lên hình đại diện",
                  },
                ]}
              >
                <Upload {...propsUpload} listType="picture" maxCount={1}>
                  <Button icon={<CloudUploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Chuyên mục"
                name="category"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn chuyên mục",
                  },
                ]}
              >
                <Select
                  showSearch
                  style={{
                    width: "100%",
                  }}
                  placeholder="Chọn chuyên mục"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "").includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  options={[
                    {
                      value: "1",
                      label: "Not Identified",
                    },
                    {
                      value: "2",
                      label: "Closed",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Nội dung"
                name="content"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập nội dung",
                  },
                ]}
              >
                <CKEditor
                  initData=""
                  onInstanceReady={() => {
                    console.log("Editor is ready!");
                  }}
                  config={{
                    filebrowserBrowseUrl: "/media-public",
                    // filebrowserUploadUrl: "/uploader/upload.php",
                  }}
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
                onClick={onReset}
                icon={<SyncOutlined />}
              >
                Làm Mới
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
