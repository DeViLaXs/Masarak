import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Building2,
  User,
  Mails,
  CircleDollarSign,
  Clock,
  Verified,
  ShieldCheck,
  CircleX,
} from "lucide-react";

export default function CompaniesCard() {
  return (
    <div className="grid grid-cols-4 gap-4 ">
      <Card>
        <CardHeader>
          <CardTitle>إجمالي الشركات</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-500">247</h1>
          <div className="bg-blue-400/25 p-3 rounded-[12px]">
            <Building2 className="text-blue-500"/>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>في انتظار التوثيق</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-orange-500">18</h1>
          <div className="bg-orange-400/25 p-3 rounded-[12px]">
            <Clock className="text-orange-500"/>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>شركات موثقة</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-green-500">195</h1>
          <div className="bg-green-400/25 p-3 rounded-[12px]">
            <ShieldCheck className="text-green-700" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>شركات مرفوضة</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-red-500">34</h1>
          <div className="bg-red-400/25 p-3 rounded-[12px]">
            <CircleX className="text-red-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
