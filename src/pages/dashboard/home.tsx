import { Card, CardContent } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { Car, FileText, Users } from "lucide-react"
import { useState } from "react"
// import api from "@/utils/api"

const dashboardCards = [
  {
    title: "Vehicles",
    key: "available_cars",
    icon: <Car className="h-6 w-6 text-green-600" />,
    link: "/vehicles",
  },

  {
    title: "Invoices",
    key: "pending_invoices",
    icon: <FileText className="h-6 w-6 text-red-600" />,
    link: "/invoices",
  },
  {
    title: "Customers",
    key: "customers_count",
    icon: <Users className="h-6 w-6 text-blue-600" />,
    link: "/customers",
  },
]

type DashboardStats = {
  available_cars: number
  booked_cars: number
  pending_invoices: number
  customers_count: number
}

export default function DashboardPage() {
  const [stats] = useState<DashboardStats>({
    available_cars: 0,
    booked_cars: 0,
    pending_invoices: 0,
    customers_count: 0,
  })

  // useEffect(() => {
  //   const fetchStats = async () => {
  //     const token =
  //       localStorage.getItem("access_token") ||
  //       sessionStorage.getItem("access_token")

  //     const headers = token ? { Authorization: `Bearer ${token}` } : {}

  //     const response = await api.get("/admin/dashboard-summary/", { headers })
  //     setStats(response.data)
  //   }

  //   fetchStats()
  // }, [])

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-6">
        Dashboard Overview
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardCards.map((card) => (
          <Link key={card.title} to={card.link}>
            <Card className="bg-white hover:bg-gray-50 transition-all shadow-md hover:shadow-lg cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center py-6">
                <div className="mb-3">{card.icon}</div>

                <h3 className="text-md font-medium text-gray-800">
                  {card.title}
                </h3>

                <p className="text-2xl font-bold mt-2">
                  {stats[card.key as keyof DashboardStats] ?? "..."}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
