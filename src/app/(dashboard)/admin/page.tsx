"use client"
import HomeCard1 from "@/app/(dashboard)/admin/_component/HomeCard-1";
import HomeCard2 from "@/app/(dashboard)/admin/_component/HomeCard-2";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export default function AdminPage() {

//   const test =useQuery({
//   queryKey: ['test'],
//   queryFn: async () => {
//     const res = await api.get("/Account/TEST")
//     console.log(res.data)
//     return res.data
//   },
// })

  return (
    <div className="px-6 max-sm:px-4 py-1">
      <HomeCard1 />
      <HomeCard2 />
      {/* <h1>{test.data}</h1> */}
    </div>
  );
}
