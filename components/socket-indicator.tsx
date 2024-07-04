"use client";

import { Badge } from "@/components/ui/badge";
import { useSocket } from "@/components/providers/socket-provider";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();
  if (!isConnected) {
    return (
      <Badge variant="outline" className="text-white border-none bg-yellow-600">
        Fallback: Polling every 1s
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-white border-none bg-emerald-600">
      Live: Real-time updates
    </Badge>
  );
};
