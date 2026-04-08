/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { MdInbox, MdSlideshow, MdStore, MdUpload, MdClose } from "react-icons/md";

interface AppState {
  page: string;
  setPage: (item: any) => void;
}

interface AppState2 {
  page: string;
  sidebarState: boolean;
  setsidebarState: (item: any) => void;
  setPage: (item: any) => void;
}

const navItems = [
  { key: "orders", label: "Orders", icon: MdInbox },
  { key: "store", label: "Store", icon: MdStore },
  { key: "upload", label: "Upload", icon: MdUpload },
];

const SideNav: React.FC<AppState> = ({ page, setPage }) => {
  return (
    <div className="hidden md:flex flex-col w-60 min-h-screen pt-20 bg-gray-950 border-r border-gray-800/60">
      <nav className="px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const active = page === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setPage(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-roboto font-medium transition-colors ${
                active
                  ? "bg-purple-500/15 text-purple-400"
                  : "text-gray-400 hover:bg-gray-800/60 hover:text-gray-200"
              }`}
            >
              <item.icon size={22} className={active ? "text-purple-400" : "text-gray-500"} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

const MobileNav: React.FC<AppState2> = ({ page, setPage, sidebarState, setsidebarState }) => {
  return (
    <>
      {sidebarState && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setsidebarState(false)}
        />
      )}

      <div
        className={`md:hidden fixed top-0 left-0 w-64 h-full bg-gray-950 shadow-2xl z-40 transition-transform duration-300 ${
          sidebarState ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-5 border-b border-gray-800/60">
          <span className="text-lg font-dayone text-gray-100">Menu</span>
          <button
            onClick={() => setsidebarState(false)}
            className="p-1 rounded-md hover:bg-gray-800 text-gray-400"
          >
            <MdClose size={22} />
          </button>
        </div>

        <nav className="px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = page === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  setPage(item.key);
                  setsidebarState(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-roboto font-medium transition-colors ${
                  active
                    ? "bg-purple-500/15 text-purple-400"
                    : "text-gray-400 hover:bg-gray-800/60 hover:text-gray-200"
                }`}
              >
                <item.icon size={22} className={active ? "text-purple-400" : "text-gray-500"} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <button
        className="md:hidden fixed bottom-6 left-6 w-14 h-14 rounded-full bg-purple-600 text-white shadow-lg shadow-purple-600/30 hover:bg-purple-700 transition-colors z-30 flex items-center justify-center"
        onClick={() => setsidebarState(!sidebarState)}
      >
        <MdSlideshow size={26} />
      </button>
    </>
  );
};

export default SideNav;
export { MobileNav };
