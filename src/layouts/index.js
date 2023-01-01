import React, { useEffect, useState } from "react";
import { Layout, Menu, Avatar, Dropdown, Space, Typography } from "antd";
import {
  SwitcherOutlined,
  FormOutlined,
  UserSwitchOutlined,
  FileImageOutlined,
  UngroupOutlined,
} from "@ant-design/icons";

import DashboardPage from "../pages/dashboard";
import AccountsPages from "../pages/accounts";
import PostPages from "../pages/posts";
import CategoriesPages from "../pages/categories";
import RolesPages from "../pages/roles";
import BranchsPages from "../pages/branchs";
import MediaPages from "../pages/media";

import { useNavigate, useLocation, Link } from "react-router-dom";

import logo from "../assets/images/taipei101.png";
import ActionsPages from "../pages/actions";
import GGAuthenticatorPages from "../pages/ggAuthenticator";

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
      {
        label: "GG Authenticator",
        key: "gg-authenticator",
        path: "/gg-authenticator",
        component: <GGAuthenticatorPages />,
        icon: null,
      },
      {
        label: "Vai trò",
        key: "roles",
        path: "/roles",
        component: <RolesPages />,
        icon: null,
      },
      {
        label: "Phân quyền",
        key: "actions",
        path: "/actions",
        component: <ActionsPages />,
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
  {
    label: "QL Chi Nhánh",
    key: "manage-branchs",
    icon: <UngroupOutlined />,
    children: [
      {
        label: "Chi Nhánh",
        key: "branchs",
        path: "/branchs",
        component: <BranchsPages />,
        icon: null,
      },
    ],
  },
  {
    label: "QL Media",
    key: "manage-media",
    icon: <FileImageOutlined />,
    children: [
      {
        label: "Media",
        key: "media",
        path: "/media",
        component: <MediaPages />,
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

const infoUsers = sessionStorage.getItem("infoUsers")
  ? JSON.parse(sessionStorage.getItem("infoUsers"))
  : null;

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
      element.children &&
        element.children.forEach((elementChildren) => {
          if (elementChildren.path === location.pathname) {
            _item = elementChildren;
            return;
          }
        });
    });
    if (!_item) return navigate("/404");

    setSelectedKeys(_item.key);
    handleSetOpenKeys(_item.key);
    setComponents(_item.component);
  }, [location.pathname]);

  const onClickItemMenu = (item) => {
    authProtectedRoutes.forEach((element) => {
      element.children &&
        element.children.forEach((elementChildren) => {
          if (elementChildren.key === item.key) {
            return navigate(elementChildren.path);
          }
        });
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

  const handleSetOpenKeys = (expression) => {
    switch (expression) {
      case "posts":
        setOpenKeys(["manage-posts"]);
        break;
      case "categories":
        setOpenKeys(["manage-categories"]);
        break;
      case "media":
        setOpenKeys(["manage-media"]);
        break;
      case "branchs":
        setOpenKeys(["manage-branchs"]);
        break;
      default:
        setOpenKeys(["manage-accounts"]);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header className="header">
        <div className="logo">
          <img src={logo} alt="" />
        </div>
        <Dropdown
          menu={{
            items,
          }}
        >
          <Space className="ant-space-item-header">
            <Avatar
              style={{
                backgroundColor: `#${Math.floor(
                  Math.random() * 16777215
                ).toString(16)}`,
                verticalAlign: "middle",
              }}
              size={30}
            >
              {infoUsers.fullName.charAt(0)}
            </Avatar>
            <div className="group-info-sidebar">
              <Text className="username-sidebar" strong>
                {infoUsers.fullName}
              </Text>
              <Text className="rolename-sidebar">{infoUsers.roleName}</Text>
            </div>
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
