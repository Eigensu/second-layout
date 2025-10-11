from beanie import Document, Indexed
from pydantic import Field, HttpUrl, ConfigDict
from datetime import datetime
from typing import Optional
from enum import Enum


class SponsorTier(str, Enum):
    """Sponsor tier levels"""
    PLATINUM = "platinum"
    GOLD = "gold"
    SILVER = "silver"
    BRONZE = "bronze"


class Sponsor(Document):
    """Sponsor document model for MongoDB using Beanie ODM"""

    name: Indexed(str, unique=True)  # type: ignore
    tier: SponsorTier
    logo_url: HttpUrl
    website_url: Optional[HttpUrl] = None
    description: Optional[str] = None
    is_active: bool = True
    display_order: int = 0  # For controlling display order on frontend
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "sponsors"  # MongoDB collection name
        use_state_management = True
        indexes = [
            "name",
            "tier",
            [("display_order", 1)],
            [("created_at", -1)],
        ]

    def __repr__(self):
        return f"<Sponsor {self.name} ({self.tier})>"

    def __str__(self):
        return self.name
