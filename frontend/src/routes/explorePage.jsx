import { Navbar, NavbarContent, NavbarItem } from "@nextui-org/navbar";
import { BiSearch } from "react-icons/bi";
import { Outlet } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import Nav from "../components/nav";

const ExplorePage = () => {
  return (
    <AppLayout>
      <Nav />
      <div className="w-full px-5 flex flex-colI justify-center items-center">
        <Navbar className=" w-full">
          <NavbarContent className="w-full">
            <NavbarItem className="w-full">
              <div className="relative w-full flex gap-1 items-center border-1 border-secondary-foreground/10 py-2 px-3 rounded-xl">
                <BiSearch />
                <input
                  placeholder="search movies"
                  className="outline-none w-full focus:ring-0 bg-transparent"
                  type="text"
                />
              </div>
            </NavbarItem>
          </NavbarContent>
        </Navbar>
      </div>

      <main className="w-full flex flex-col mx-auto mt-4">
        <Outlet />
      </main>

      <footer className="mt-9 mb-10">I am Footer</footer>
    </AppLayout>
  );
};

export default ExplorePage;
