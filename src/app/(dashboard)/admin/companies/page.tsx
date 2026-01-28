"use client";

import CompaniesCard from "@/components/admin-component/CompaniesCard";
import { DataTable } from "@/components/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { data, type UserTable } from "@/lib/data";
import { createColumnHelper } from "@tanstack/react-table";

export default function CompaniesPage() {
  const columnHelper = createColumnHelper<UserTable>();

  const columns = [
    columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="mr-3"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="mr-3"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    }),
    columnHelper.accessor("companyName", {
      header: () => "اسم الشركة",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("email", {
      header: () => "البريد الالكتروني",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("phoneNumber", {
      header: () => "رقم الهاتف",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("createAt", {
      header: () => "تاريخ التسجيل",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("status", {
      header: () => "الحالة",
      cell: (info) => info.getValue(),
    }),
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">إدارة الشركات</h1>
      <CompaniesCard />
      <div className=" w-full h-full flex-col justify-center items-center p-10 border-2 ">
        <DataTable<UserTable, any> columns={columns} data={data} />
      </div>
    </div>
  );
}
