import React, { useEffect, useState } from "react";
import {
  Divider,
  Form,
  Button,
  Space,
  notification,
  Select,
  Checkbox,
  Spin,
} from "antd";
import { SaveOutlined, SyncOutlined } from "@ant-design/icons";
import BreadcrumbCustom from "../../common/breadcrumb.js";
import {
  getAllRoles,
  getCategoryByRoleId,
  getAllCategory,
  insertManyRoleActionCategory,
} from "../../helpers/helper.js";

const { Option } = Select;

export default function ActionsCategorysPages() {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [dataRoleAction, setDataRoleAction] = useState();
  const [allActions, setAllActions] = useState([]);

  const [checkedList, setCheckedList] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const [indeterminate, setIndeterminate] = useState(true);

  const fetchDataRole = async () => {
    setLoading(true);
    const _res = await getAllRoles();
    setDataRoleAction(_res || []);
    setLoading(false);
  };

  const fetchGetAllActions = async () => {
    setLoading(true);
    const _res = await getAllCategory();
    setAllActions(_res || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchDataRole();
    fetchGetAllActions();
  }, []);

  const getListActionIds = (listAction) => {
    var listActionIds = [];
    listAction.forEach((element) => {
      const text = element.toString().trim();
      const _s = text.indexOf("(");
      const _e = text.indexOf(")");
      const _branch = text.slice(_s + 1, _e).trim();
      const _category = text.slice(0, _s - 1).trim();

      allActions.forEach((_itemAction) => {
        if (
          _branch === _itemAction.branchName &&
          _category === _itemAction.name
        )
          listActionIds.push(_itemAction.id);
      });
    });

    return listActionIds.join();
  };

  const onFinish = async (values) => {
    setLoadingSubmit(true);
    const _req = {
      roleId: values.roleId,
      categoryIds: getListActionIds(checkedList),
    };
    const _res = await insertManyRoleActionCategory(_req);
    if (_res.status === 1) {
      setLoadingSubmit(false);
      return api["success"]({
        message: "Thành công",
        description: "Cập nhật quyền thành công!",
      });
    } else {
      setLoadingSubmit(false);
      return api["error"]({
        message: "Lỗi",
        description: "Cập nhật quyền thất bại!",
      });
    }
  };

  const onFinishFailed = (values) => {};

  const onReset = () => {
    form.resetFields();
    fetchDataRole();
    fetchGetAllActions();
  };

  const onChangeRole = async (value) => {
    setLoading(true);
    const _res = await getCategoryByRoleId(value);
    const _items = _res?.map((item) => {
      return `${item.name} (${item.branchName})`;
    });
    setCheckedList(_items);
    setLoading(false);
  };

  const onChange = (list) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < allActions.length);
    setCheckAll(list.length === allActions.length);
  };

  const onCheckAllChange = (e) => {
    const _allActions = allActions?.map((item) => {
      return `${item.name} (${item.branchName})`;
    });

    setCheckedList(e.target.checked ? _allActions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  document.title = "QL Phân Quyền Chuyên mục";
  return (
    <div>
      {contextHolder}
      <BreadcrumbCustom
        parentTitle={"QL Phân Quyền Chuyên mục"}
        subTitle={"Phân Quyền Chuyên mục"}
      />
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
          name="roleId"
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
            {dataRoleAction &&
              dataRoleAction?.map((item) => {
                if (item.roleName === "ADMIN") return;
                return (
                  <Option key={item.id} value={item.id}>
                    {item.roleName}
                  </Option>
                );
              })}
          </Select>
        </Form.Item>

        <Form.Item name="roleAction" label="Phân quyền">
          {loading ? (
            <Spin />
          ) : (
            <Space direction="vertical">
              <Checkbox
                indeterminate={indeterminate}
                onChange={onCheckAllChange}
                checked={checkAll}
              >
                Chọn tất cả
              </Checkbox>
              <Checkbox.Group
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
                className="checkbox-custom"
                options={allActions?.map((item) => {
                  return `${item.name} (${item.branchName})`;
                })}
                value={checkedList}
                onChange={onChange}
              />
            </Space>
          )}
        </Form.Item>
        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={loadingSubmit ? true : false}
              icon={<SaveOutlined />}
            >
              Cập nhật
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
    </div>
  );
}
