// import React from "react";
// import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
// import defaultProfileImg from "../../assets/images/profile.png";

// const Header = () => {
//   const { currentUser } = useSelector((state) => state.user);
//   return (
//     <>
//       <div className="bg-slate-400 p-4 flex justify-between items-center">
//         <h1
//           className="h-min text-4xl font-bold relative"
//           style={{
//             color: "transparent",
//             WebkitTextStroke: "0.7px",
//             WebkitTextStrokeColor: "#fff",
//           }}
//         >
//           Come
//           <span
//             className="shadow-xl rounded-lg text-slate-700 text-2xl absolute left-1 top-[-10px] text-center"
//             style={{
//               WebkitTextStroke: "0",
//             }}
//           >
//             Dream Tours
//           </span>
//         </h1>
//         <ul className="flex flex-wrap items-center justify-end gap-2 text-white font-semibold list-none">
//           <li className="hover:underline hover:scale-105 transition-all duration-150">
//             <Link to={`/`}>Home</Link>
//           </li>
//           <li className="hover:underline hover:scale-105 transition-all duration-150">
//             <Link to={`/search`}>Packages</Link>
//           </li>
//           <li className="hover:underline hover:scale-105 transition-all duration-150">
//             <Link to={`/about`}>About</Link>
//           </li>
//           <li className="w-10 h-10 flex items-center justify-center">
//             {currentUser ? (
//               <Link
//                 to={`/profile/${
//                   currentUser.user_role === 1 ? "admin" : "user"
//                 }`}
//               >
//                 <img
//                   src={currentUser.avatar || defaultProfileImg}
//                   alt={currentUser.username}
//                   className="border w-10 h-10 border-black rounded-[50%]"
//                 />
//               </Link>
//             ) : (
//               <Link to={`/login`}>Login</Link>
//             )}
//           </li>
//         </ul>
//       </div>
//     </>
//   );
// };

// export default Header;
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, User, Settings, LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
// import { logoutUser } from "../../redux/userSlice"; // adjust path

const Header = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const navItems = [
    { to: "/search", label: "Destinations" },
    { to: "/hotels", label: "Hotels" },
    { to: "/flights", label: "Flights" },
    { to: "/reviews", label: "Reviews" },
  ];

  const logout = () => {
    dispatch(logoutUser());
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-[#002b11] rounded-full">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <span className="text-xl font-bold text-[#002b11]">TravelHub</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[#002b11]",
                  pathname === item.to
                    ? "text-[#002b11] font-semibold"
                    : "text-gray-600"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-1 text-sm text-gray-600">
              <Globe className="h-4 w-4" />
              <span>INR</span>
            </div>

            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={currentUser.avatar || "/placeholder.svg"}
                        alt={currentUser.name}
                      />
                      <AvatarFallback className="bg-[#002b11] text-white">
                        {currentUser.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{currentUser.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {currentUser.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile/user">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  {currentUser.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                  //  onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                className="bg-[#002b11] hover:bg-[#002b11]/90 text-white rounded-full px-6"
                asChild
              >
                <Link to="/login">Sign in</Link>
              </Button>
            )}

            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
