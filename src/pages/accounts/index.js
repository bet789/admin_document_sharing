import React from "react";
import { Divider } from "antd";

import BreadcrumbCustom from "../../common/breadcrumb.js";

document.title = "Tài Khoản";
export default function AccountsPages() {
  return (
    <div>
      <BreadcrumbCustom parentTitle={"QL Tài Khoản"} subTitle={"Tài Khoản"} />
      <Divider />
    </div>
  );
}
