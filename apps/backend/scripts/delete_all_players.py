#!/usr/bin/env python3
"""
Delete all Players from the public players collection.

Usage:
  python scripts/delete_all_players.py           # interactive confirmation
  python scripts/delete_all_players.py --force   # no prompt

Notes:
- Uses Beanie ODM and existing DB settings from config.settings
- Targets the public `players` collection (model: app.models.player.Player)
"""

import argparse
import asyncio
import sys
import os
from typing import Optional

# Ensure backend project root is on sys.path so `config` and `app` can be imported
THIS_DIR = os.path.dirname(__file__)
BACKEND_ROOT = os.path.abspath(os.path.join(THIS_DIR, os.pardir))
if BACKEND_ROOT not in sys.path:
    sys.path.insert(0, BACKEND_ROOT)

from config.database import connect_to_mongo, close_mongo_connection
from app.models.player import Player as PublicPlayer


async def delete_all_players(force: bool = False) -> int:
    await connect_to_mongo()
    try:
        if not force:
            resp = input("This will DELETE ALL players. Type 'DELETE' to confirm: ").strip()
            if resp != "DELETE":
                print("Aborted. No changes made.")
                return 0

        # Count before deletion
        total = await PublicPlayer.find_all().count()
        if total == 0:
            print("No players found. Nothing to delete.")
            return 0

        result = await PublicPlayer.find_all().delete()
        # result is DeleteResult from Motor; acknowledged and deleted_count may be present
        deleted = getattr(result, "deleted_count", None)
        if deleted is None:
            # Fallback: assume all were deleted
            deleted = total
        print(f"Deleted {deleted} players from collection 'players'.")
        return int(deleted)
    finally:
        await close_mongo_connection()


def main(argv: Optional[list] = None) -> int:
    parser = argparse.ArgumentParser(description="Delete all public players")
    parser.add_argument("--force", action="store_true", help="Skip confirmation prompt")
    args = parser.parse_args(argv)

    try:
        return asyncio.run(delete_all_players(force=args.force)) or 0
    except KeyboardInterrupt:
        print("\nInterrupted.")
        return 130


if __name__ == "__main__":
    sys.exit(main())
