import React from "react";
import { Divider } from "antd";

import BreadcrumbCustom from "../../common/breadcrumb.js";

document.title = "Bài Viết";
export default function PostPages() {
  return (
    <div>
      <BreadcrumbCustom parentTitle={"QL Bài Viết"} subTitle={"Bài Viết"} />
      <Divider />
    </div>
  );
}
