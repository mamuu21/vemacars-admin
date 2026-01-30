import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "lucide-react"
import { useLogout } from "@/utils/auth"

export default function Navbar() {
  const logout = useLogout()

  return (
    <header className="w-full h-16 px-6 border-b flex items-center justify-between bg-white shadow-sm">
      <h1 className="text-xl font-semibold"></h1>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {/* 👇 BOTH name + avatar live here */}
          <div className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm font-medium text-gray-700">
              Admin
            </span>

            <Avatar className="bg-gray-100 hover:bg-gray-200 transition">
              <AvatarFallback className="bg-transparent">
                <User className="h-5 w-5 text-gray-700" />
              </AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem
            onClick={logout}
            className="text-red-600 focus:text-red-600"
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
