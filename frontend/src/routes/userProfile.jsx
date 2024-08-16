import { Navbar, NavbarContent, NavbarItem } from "@nextui-org/navbar";
import { Link, Outlet, useLocation } from "react-router-dom";
import Applayout from "../components/AppLayout";
import Nav from "../components/nav";

const routes = [
   { label: "Profile", path: "/my_profile/edit" },
   { label: "Your Orders", path: "/my_profile/orders" },
   { label: "Account Settings", path: "/my_profile/settings" },
];

const UserProfilePage = () => {
   const { pathname } = useLocation()

   return (
      <Applayout>
         <Nav />
         <Navbar>
            <NavbarContent>
               {routes.map(o =>
                  <Link to={o.path}>
                     <NavbarItem className={`${pathname === o.path ? "border-foreground-500" : "border-transparent"} text-xs sm:text-md border-b-1 hover:border-foreground-600`}>{o.label}</NavbarItem>
                  </Link>)}
            </NavbarContent>
         </Navbar>
         <main className="w-full sm:container mx-auto">
            <Outlet />
         </main>
      </Applayout>
   );
};

export default UserProfilePage;
