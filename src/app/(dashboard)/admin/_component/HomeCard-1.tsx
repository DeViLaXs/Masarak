import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Building2, User, Mails, CircleDollarSign } from "lucide-react";

export default function HomeCard1() {
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
          <CardTitle>المستخدمين النشطين </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-orange-500">1456</h1>
          <div className="bg-orange-400/25 p-3 rounded-[12px]">
            <User className="text-orange-500"/>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>إجمالي الرسائل</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-green-500">156</h1>
          <div className="bg-green-400/25 p-3 rounded-[12px]">
            <Mails className="text-green-500"/>
          </div>
        </CardContent> 
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>إيرادات الشهر</CardTitle>
        </CardHeader>   
        <CardContent className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-purple-500">285K</h1>
          <div className="bg-purple-400/25 p-3 rounded-[12px]">
            <CircleDollarSign className="text-purple-500"/>
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
}
