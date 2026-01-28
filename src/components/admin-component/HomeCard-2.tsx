import { Activity, Clock, Mail } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
  CardFooter,
} from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";

export default function HomeCard2() {
  return (
    <div className="grid grid-cols-3 gap-4 mt-4 ">
      <Card className="bg-linear-to-r from-blue-500 to-blue-600 py-8">
        <CardHeader>
          <CardTitle size={"bold"} className="text-white ">
            طلبات التوثيق المعلقة
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white mb-4 mt-2">18</h1>
          <CardAction className="bg-white/20 rounded-[9px] p-3">
            <Clock className="text-white" />
          </CardAction>
        </CardContent>
        <CardFooter>
          <Link href="/">
            <Button
              variant={"default"}
              size={"sm"}
              className="text-white bg-white/10 hover:bg-white/20 px-5"
            >
              مراجعة الطلبات
            </Button>
          </Link>
        </CardFooter>
      </Card>

      <Card className="bg-linear-to-r from-orange-400 to-orange-600 py-8">
        <CardHeader>
          <CardTitle size={"bold"} className="text-white">
            رسائل غير مقروءة
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white mb-4 mt-2">23</h1>
          <CardAction className="bg-white/20 rounded-[9px] p-3 ">
            <Mail className="text-white" />
          </CardAction>
        </CardContent>
        <CardFooter>
          <Link href="/">
            <Button
              variant={"default"}
              size={"sm"}
              className="text-white bg-white/15 hover:bg-white/20 px-5"
            >
              عرض الرسائل
            </Button>
          </Link>
        </CardFooter>
      </Card>

      <Card className="bg-linear-to-r from-green-400 to-green-600 py-8">
        <CardHeader>
          <CardTitle size={"bold"} className="text-white">
            نشاط اليوم
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white mb-4 mt-2">47</h1>
          <CardAction className="bg-white/20 rounded-[9px] p-3">
            <Activity className="text-white" />
          </CardAction>
        </CardContent>
        <CardFooter>
          <Link href="/">
            <Button
              variant={"default"}
              size={"sm"}
              className="text-white bg-white/20 hover:bg-white/20 px-5"
            >
              عرض التفاصيل
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
