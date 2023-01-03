import React, { useEffect, useState } from "react";
import qs from "qs";
import {
  Row,
  Col,
  Typography,
  Pagination,
  Image,
  Card,
  Spin,
  Button,
  Modal,
  message,
  Tooltip,
  Input,
  Space,
} from "antd";
import {
  CloudUploadOutlined,
  CopyOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { mediaServer } from "../../helpers/config";
import {
  API_MEDIA_GET_ALL_FILE_BY_COLLECTIONID,
  API_MEDIA_DELETE_FILE,
} from "../../helpers/url_helper";
import DraggerUpload from "../../components/common/dragger";
import { formatBytes } from "../../common/function";
const { Paragraph } = Typography;

export default function MediaPages() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    dataPagingnation: {
      pageIndex: 1,
      pageSize: 16,
    },
  });

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(pagination)]);

  const fetchData = async (params) => {
    console.log("🚀 ~ file: index.js:48 ~ fetchData ~ params", params);
    setLoading(true);

    const response = await fetch(
      `${
        mediaServer.API_URL
      }${API_MEDIA_GET_ALL_FILE_BY_COLLECTIONID}?collectionId=${
        mediaServer.COLLECTIONID
      }&fileName=${params ? params : ""}&${qs.stringify(
        pagination.dataPagingnation
      )}`,
      {
        method: "GET",
        headers: {
          Authorization: mediaServer.TOKEN,
        },
      }
    );
    const _res = await response.json();
    setData(_res || []);
    setLoading(false);
  };

  const onChangePaging = (_page, _pageSize) => {
    const dataPagingnation = {
      pageIndex: _page,
      pageSize: _pageSize,
    };

    setPagination({ dataPagingnation });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    fetchData();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleCopyLinkImage = (linkImage) => {
    navigator.clipboard.writeText(linkImage);
    message.success(`Sao chép liên kết  ${linkImage} thành công.`);
  };

  const handleDeleteImage = async (idImage) => {
    setLoading(true);
    const response = await fetch(
      `${mediaServer.API_URL}${API_MEDIA_DELETE_FILE}?id=${idImage}`,
      {
        method: "DELETE",
        headers: {
          Authorization: mediaServer.TOKEN,
        },
      }
    );
    const _res = await response.json();
    if (_res.status === 1) {
      fetchData();
      message.success(`Xóa file thành công.`);
    } else {
      message.success(`Xóa file thất bại.`);
    }
    setLoading(false);
  };

  const afterCloseModal = () => {
    fetchData();
  };

  const onSearch = (value) => {
    console.log(value);
    fetchData(value);
  };

  document.title = "Media Server";
  return (
    <>
      <Row gutter={[16, 16]} style={{ padding: 24 }}>
        <Col xs={24}>
          <Typography.Title level={3} style={{ margin: 0 }}>
            Media
          </Typography.Title>
        </Col>
        <Col xs={24}>
          <Space>
            <Input.Search
              placeholder="Nhập tên file"
              allowClear
              onSearch={onSearch}
              style={{
                width: 200,
              }}
              enterButton
            />

            <Button
              type="primary"
              icon={<CloudUploadOutlined />}
              onClick={showModal}
            >
              Upload File
            </Button>
          </Space>
        </Col>

        {loading && (
          <Col span={24} className="loading">
            <Spin />
          </Col>
        )}

        {!loading && (
          <>
            <Col xs={24}>
              <Image.PreviewGroup>
                <Row gutter={[16, 16]} className="list-media-server">
                  {data &&
                    data.data?.map((item, i) => {
                      return (
                        <Col xs={12} sm={6} xl={3} key={i}>
                          <Card
                            loading={loading}
                            cover={
                              <Image
                                src={mediaServer.URL_IMAGE + item.path}
                                alt={item.fileName}
                              />
                            }
                            actions={[
                              <Tooltip placement="top" title={"Xóa"}>
                                <DeleteOutlined
                                  key="delete"
                                  onClick={() => handleDeleteImage(item.id)}
                                />
                              </Tooltip>,

                              <Tooltip
                                placement="top"
                                title={"Sao chép đường dẫn"}
                              >
                                <CopyOutlined
                                  key="copy"
                                  onClick={() =>
                                    handleCopyLinkImage(
                                      mediaServer.URL_IMAGE + item.path
                                    )
                                  }
                                />
                              </Tooltip>,
                            ]}
                          >
                            <Paragraph>
                              <span style={{ fontWeight: 500 }}>
                                {item.fileName}
                              </span>
                              ({formatBytes(item.size)})
                            </Paragraph>
                          </Card>
                        </Col>
                      );
                    })}
                </Row>
              </Image.PreviewGroup>
            </Col>
            <Col span={24}>
              <Pagination
                current={pagination.dataPagingnation.pageIndex || 1}
                total={data.totalRecord}
                onChange={onChangePaging}
                pageSize={pagination.dataPagingnation.pageSize || 10}
              />
            </Col>
          </>
        )}
      </Row>

      <Modal
        title="Tải tệp lên"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        maskClosable={false}
        afterClose={afterCloseModal}
      >
        <DraggerUpload />
      </Modal>
    </>
  );
}
