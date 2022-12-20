import React, { useEffect, useState } from "react";
import { Layout, Menu, Avatar, Dropdown, Space, Typography } from "antd";
import {
  SwitcherOutlined,
  FormOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";

import DashboardPage from "../pages/dashboard";
import AccountsPages from "../pages/accounts";
import PostPages from "../pages/posts";
import CategoriesPages from "../pages/categories";

import { useNavigate, useLocation, Link } from "react-router-dom";

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const authProtectedRoutes = [
  // {
  //   label: "Tổng Quan",
  //   key: "dashboard",
  //   icon: <DashboardOutlined />,
  //   children: [
  //     {
  //       label: "Tổng Quan",
  //       key: "subdashboard",
  //       path: "/dashboard",
  //       component: <DashboardPage />,
  //       icon: null,
  //     },
  //   ],
  // },
  {
    label: "QL Tài Khoản",
    key: "manage-accounts",
    icon: <UserSwitchOutlined />,
    children: [
      {
        label: "Tài Khoản",
        key: "accounts",
        path: "/accounts",
        component: <AccountsPages />,
        icon: null,
      },
    ],
  },
  {
    label: "QL Bài Viết",
    key: "manage-posts",
    icon: <FormOutlined />,
    children: [
      {
        label: "Bài Viết",
        key: "posts",
        path: "/posts",
        component: <PostPages />,
        icon: null,
      },
    ],
  },
  {
    label: "QL Chuyên Mục",
    key: "manage-categories",
    icon: <SwitcherOutlined />,
    children: [
      {
        label: "Chuyên Mục",
        key: "categories",
        path: "/categories",
        component: <CategoriesPages />,
        icon: null,
      },
    ],
  },
];

const itemsMenuSideBar = authProtectedRoutes.map((item, index) => {
  if (item.path === "/") return null;
  return getItem(
    item.label,
    item.key,
    item.icon,
    item.children?.map((itemChildren) => {
      return getItem(itemChildren.label, itemChildren.key, itemChildren.icon);
    })
  );
});

const items = [
  {
    key: "1",
    label: <Link to="/logout">Đăng Xuất</Link>,
  },
];

// submenu keys of first level
const rootSubmenuKeys = authProtectedRoutes.map((item, index) => {
  return item.key;
});

const ColorList = ["#f56a00", "#7265e6", "#ffbf00", "#00a2ae"];

const AuthProtectedLayout = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [components, setComponents] = useState(null);
  const [openKeys, setOpenKeys] = useState(["manage-accounts"]);
  const [selectedKeys, setSelectedKeys] = useState("accounts");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    //set navigation defaults for url "/"
    if (location.pathname === "/") return navigate("/accounts");

    let _item = "";
    authProtectedRoutes.forEach((element) => {
      if (element.children && element.children.length > 0) {
        if (element.children[0].path === location.pathname) {
          console.log(element.children[0].path);
          _item = element;
          return;
        }
      }
    });
    if (!_item) return navigate("/404");
    setSelectedKeys(_item.children[0].key);
    setComponents(_item.children[0].component);
  }, [location.pathname]);

  const onClickItemMenu = (item) => {
    authProtectedRoutes.forEach((element) => {
      if (element.children && element.children.length > 0) {
        if (element.children[0].key === item.key) {
          return navigate(element.children[0].path);
        }
      }
    });
  };

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header className="header">
        <div className="logo"></div>
        <Dropdown
          menu={{
            items,
          }}
        >
          <Space className="ant-space-item-header">
            <Avatar
              style={{
                backgroundColor:
                  ColorList[Math.floor(Math.random() * ColorList.length)],
                verticalAlign: "middle",
              }}
              size={30}
            >
              Dee
            </Avatar>
            <Text className="username-sidebar" strong>
              A Dee
            </Text>
          </Space>
        </Dropdown>
      </Header>
      <Layout>
        <Sider
          width={250}
          className="site-layout-background"
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKeys]}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            items={itemsMenuSideBar}
            onClick={(item) => onClickItemMenu(item)}
          />
        </Sider>
        <Layout>
          <Content
            className="site-layout-background"
            style={{
              padding: 12,
              margin: 0,
            }}
          >
            {components}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default AuthProtectedLayout;
