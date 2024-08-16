import { Button } from "@nextui-org/button";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/navbar";
import { useState } from "react";

import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./sheet";
import useLogout from "../hooks/useLogout.js"; // Import the useLogout hook
import { useSelector } from "react-redux";

const routes = [
  {
    r: "/explore/movie",
    label: "Movies",
  },
];

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const path = useLocation();
  const logout = useLogout();

  // Access user state from Redux, handling the case where user or username might be null
  const user = useSelector((state) => state.auth.user);
  const username = user ? user.username : "Guest";

  const userSettings = [
    { label: "My Profile", path: "/my_profile/edit" },
    { label: "My Orders", path: "/my_profile/orders" },
    { label: "Delete Account Settings", path: "/my_profile/settings" },
  ];

  return (
    <Navbar
      className="z-50"
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarMenuToggle
        className="sm:hidden w-8"
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      />

      <NavbarContent className="hidden sm:flex" justify="center">
        <NavbarBrand>
          <p className="font-bold text-inherit">FilmFlare</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="flex sm:hidden" justify="start">
        <NavbarBrand>
          <p className="font-bold text-inherit">FilmFlare</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex w-full gap-4" justify="start">
        {routes.map((r) => (
          <NavbarItem
            key={r.label}
            className={`${
              path.pathname === r.r &&
              "border-b border-primary-500 text-primary-400"
            }`}
          >
            <Link to={r.r}>{r.label}</Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <Sheet>
        <SheetTrigger>
          <NavbarContent justify="center">User</NavbarContent>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetTitle className="mb-5 flex flex-col">
            <Link to={"/my_profile"}>{username}</Link>
          </SheetTitle>

          <ul>
            {userSettings.map((u) => (
              <li key={u.label} className="space-y-1">
                <Link to={u.path}>
                  <Button
                    className="border-0 w-full grid grid-cols-[1fr_auto]"
                    variant="light"
                    startContent={u.icon}
                    color=""
                  >
                    {u.label}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </SheetContent>
      </Sheet>

      {/* Logout button */}
      <NavbarContent justify="end">
        <Button
          className="border-0"
          variant="light"
          color="error"
          onClick={logout}
        >
          Logout
        </Button>
      </NavbarContent>

      <NavbarMenu className="z-50">
        {routes.map((r) => (
          <NavbarMenuItem
            key={r.label}
            className={`${
              path.pathname === r.r &&
              "border-b border-primary-500 text-primary-400"
            }`}
          >
            <Link to={r.r}>{r.label}</Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default Nav;
