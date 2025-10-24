export interface Player {
  id: string;
  name: string;
  team: string;
  points: number;
  price: number;
  slotLabel?: string;
  image?: string;
  stats?: {
    matches: number;
    runs?: number;
    wickets?: number;
    average?: number;
  };
}

export interface PlayerCardProps {
  player: Player;
  isSelected: boolean;
  isCaptain?: boolean;
  isViceCaptain?: boolean;
  onSelect: (playerId: string) => void;
  onSetCaptain?: (playerId: string) => void;
  onSetViceCaptain?: (playerId: string) => void;
  onReplace?: (playerId: string) => void;
  showActions?: boolean;
  compact?: boolean;
  className?: string;
  compactShowPrice?: boolean;
  disabled?: boolean;
}

export interface PlayerListProps {
  players: Player[];
  selectedPlayers: string[];
  captainId?: string;
  viceCaptainId?: string;
  onPlayerSelect: (playerId: string) => void;
  onSetCaptain?: (playerId: string) => void;
  onSetViceCaptain?: (playerId: string) => void;
  /** Overall maximum selection */
  maxSelections?: number;
  /** Optional active slot filter */
  filterSlot?: number;
  /** Called if a selection is blocked due to limits */
  onBlockedSelect?: (reason: string) => void;
  showActions?: boolean;
  compact?: boolean;
  className?: string;
  /** When compact, show price instead of points on the right */
  compactShowPrice?: boolean;
  /** Function to determine if a player should be disabled */
  isPlayerDisabled?: (player: Player) => boolean;
}
