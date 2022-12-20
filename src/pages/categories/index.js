import React from "react";
import { Divider } from "antd";

import BreadcrumbCustom from "../../common/breadcrumb.js";

document.title = "Chuyên Mục";
export default function CategoriesPages() {
  return (
    <div>
      <BreadcrumbCustom parentTitle={"QL Chuyên Mục"} subTitle={"Chuyên Mục"} />
      <Divider />
    </div>
  );
}
