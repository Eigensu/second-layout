import asyncio
import argparse
import os
import sys
from datetime import datetime
from typing import List

from beanie.operators import RegEx

# Ensure backend root is on sys.path when running this file directly
# This makes imports like `config.database` and `app.models.user` resolve.
BACKEND_ROOT = os.path.dirname(os.path.dirname(__file__))
if BACKEND_ROOT not in sys.path:
    sys.path.append(BACKEND_ROOT)

from config.database import connect_to_mongo, close_mongo_connection
from app.models.user import User
from app.utils.security import get_password_hash


async def reset_passwords(identifiers: List[str], by: str, new_password: str, exact: bool) -> None:
    await connect_to_mongo()
    updated = 0
    failed = []

    for ident in identifiers:
        if by == "username":
            query = User.username == ident if exact else RegEx(User.username, f"^{ident}$", options="i")
        elif by == "email":
            query = User.email == ident if exact else RegEx(User.email, f"^{ident}$", options="i")
        elif by == "full_name":
            field = User.full_name
            query = (field == ident) if exact else RegEx(field, f"^{ident}$", options="i")
        else:
            failed.append((ident, f"unsupported selector: {by}"))
            continue

        user = await User.find_one(query)
        if not user:
            failed.append((ident, "not found"))
            continue
        user.hashed_password = get_password_hash(new_password)
        user.updated_at = datetime.utcnow()
        await user.save()
        updated += 1
        print(f"✓ reset password for {user.username} ({str(user.id)})")

    await close_mongo_connection()

    print(f"done. updated={updated} failed={len(failed)}")
    for ident, reason in failed:
        print(f"- {ident}: {reason}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("identifiers", nargs="+", help="usernames/emails/full names to match")
    parser.add_argument("--by", choices=["username", "email", "full_name"], default="username")
    parser.add_argument("--password", default="Qwerty@123")
    parser.add_argument("--exact", action="store_true", help="use exact match instead of case-insensitive")
    args = parser.parse_args()

    asyncio.run(reset_passwords(args.identifiers, args.by, args.password, args.exact))


if __name__ == "__main__":
    main()
