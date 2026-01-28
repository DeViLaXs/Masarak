import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import {
  Building2,
  User,
  Mails,
  CircleDollarSign,
  Clock,
  Verified,
  ShieldCheck,
  CircleX,
  Mail,
  MailCheck,
  MailOpen,
  Reply,
} from "lucide-react";

export default function FeedbackCard() {
  return (
    <div className="grid grid-cols-4 gap-4 ">
      <Card>
        <CardHeader>
          <CardTitle>إجمالي الرسائل</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-500">156</h1>
          <div className="bg-blue-400/25 p-3 rounded-[12px]">
            <Mails className="text-blue-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>غير مقروء</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-orange-500">23</h1>
          <div className="bg-orange-400/25 p-3 rounded-[12px]">
            <Mail className="text-orange-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>مقروءة</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-green-500">98</h1>
          <div className="bg-green-400/25 p-3 rounded-[12px]">
            <MailOpen className="text-green-700" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>تم الرد عليها</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-purple-500">35</h1>
          <div className="bg-purple-400/25 p-3 rounded-[12px]">
            <Reply className="text-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
