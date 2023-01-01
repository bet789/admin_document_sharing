import React, { useState, useEffect } from "react";
import { Divider, Table, Typography, Image } from "antd";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import BreadcrumbCustom from "../../common/breadcrumb.js";
import { GAuthGetAllManualEntryKeys } from "../../helpers/helper.js";

export default function GGAuthenticatorPages() {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetListInfoGGAuthenticator();
  }, []);

  const fetListInfoGGAuthenticator = async () => {
    setLoading(true);
    const _res = await GAuthGetAllManualEntryKeys();
    setData(_res);
    setLoading(false);
  };

  const columns = [
    {
      title: "Tên đăng nhập",
      key: "userName",
      dataIndex: "userName",
      render: (text, record) => {
        return record.user?.userName;
      },
    },
    {
      title: "Họ và tên",
      key: "fullName",
      dataIndex: "fullName",
      render: (text, record) => {
        return record.user?.fullName;
      },
    },
    {
      title: "Vai trò",
      key: "roleName",
      dataIndex: "roleName",
      render: (text, record) => {
        return record.user?.roleName;
      },
    },
    {
      title: "Chi nhánh",
      key: "branchName",
      dataIndex: "branchName",
      render: (text, record) => {
        return record.user?.branchName;
      },
    },
    {
      title: "Manual Entry  Key",
      key: "manualEntryKey",
      dataIndex: "manualEntryKey",
      render: (text, record) => {
        return <Typography.Paragraph copyable>{text}</Typography.Paragraph>;
      },
    },
    {
      title: "QR Code",
      key: "qrCodeSetupImageUrl",
      dataIndex: "qrCodeSetupImageUrl",
      render: (text) => {
        return <Image src={text} />;
      },
    },
    {
      title: "Trạng thái",
      key: "isDelete",
      dataIndex: "isDelete",
      render: (text, record) => {
        return !record.user?.isDelete ? (
          <CheckCircleTwoTone twoToneColor="#52c41a" />
        ) : (
          <CloseCircleTwoTone twoToneColor="#eb2f96" />
        );
      },
    },
  ];

  document.title = "QL GGAuthenticator";
  return (
    <div>
      <BreadcrumbCustom parentTitle={"QL GGAuthenticator"} />
      <Divider />

      <Table columns={columns} dataSource={data} loading={loading} />
    </div>
  );
}
