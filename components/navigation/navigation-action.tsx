"use client";

import { Plus } from "lucide-react";
import { ActionTooltip } from "@/components/action-tooltip";

export const NavigationAction = () => {
    return (
      <div>
        <ActionTooltip label="Add a server" side="right" align="center">
          <button className="group flex item-center">
            <div
              className="flex justify-center items-center h-[48px] w-[48px] rounded-[24px]
                group-hover:rounded-[16px] transition-all overflow-hidden
                dark:bg-neutral-700 group-hover: bg-emerald-500"
            >
              <Plus
                className="group-hover:text-white transition text-emerald-500"
                size={25}
              />
            </div>
          </button>
        </ActionTooltip>
      </div>
    );
}