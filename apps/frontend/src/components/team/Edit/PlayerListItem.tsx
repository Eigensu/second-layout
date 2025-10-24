"use client";

import React from "react";
import { Avatar } from "@/components/ui/Avatar";

export type EditPlayer = {
  id: string;
  name: string;
  team?: string;
  role?: string;
  points?: number;
};

interface PlayerListItemProps {
  player: EditPlayer;
  subtitle?: string;
  rightText?: string;
  disabled?: boolean;
  onClick?: (playerId: string) => void;
}

export const PlayerListItem: React.FC<PlayerListItemProps> = ({
  player,
  subtitle,
  rightText,
  disabled,
  onClick,
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onClick?.(player.id)}
      className={`flex items-center gap-3 p-3 border rounded-lg text-left transition-colors w-full ${
        disabled
          ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
          : "hover:bg-gray-50 border-gray-200"
      }`}
    >
      <Avatar name={player.name} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 truncate">{player.name}</div>
        <div className="text-xs text-gray-500 truncate">{subtitle}</div>
      </div>
      {rightText && (
        <div className="text-right text-sm text-success-600 whitespace-nowrap">{rightText}</div>
      )}
    </button>
  );
};
