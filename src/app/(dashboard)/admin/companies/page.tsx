"use client";

import CompaniesCard from "@/app/(dashboard)/admin/_component/CompaniesCard";
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
    <div className="px-6 max-sm:p-4 py-1">
      {/* <h1 className="text-2xl max-sm:text-xl font-bold mb-6 max-sm:mb-4">
        إدارة الشركات
      </h1> */}
      <CompaniesCard />
      <div className="w-full h-full flex-col justify-center items-center mt-6 p-10 max-sm:p-0 border-2 max-sm:border-none">
        <DataTable<UserTable, any> columns={columns} data={data} />
      </div>
    </div>
  );
}
