import NavigationSidebar from "@/components/navigation/navigation-sidebar";
import React from "react";

const MainLayout = async ({children} : {children: React.ReactNode}) => {
    return (
      <div className="h-full">
        <div className="hidden md:flex flex-col fixed inset-y-0 z-30 h-full w-[78px] ">
            <NavigationSidebar/>
        </div>
        <main className="md:pl-[78px] h-full">
            {children}
        </main>
      </div>
    );
}
 
export default MainLayout;