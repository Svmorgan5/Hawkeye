from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from flask_sqlalchemy import SQLAlchemy
from datetime import date, datetime
from typing import List
from sqlalchemy import Table, Enum
from enum import Enum as PyEnum


class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

class User(Base):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(db.String(150), nullable=False)
    phone: Mapped[str] = mapped_column(db.String(25), nullable=True, unique=True)
    email: Mapped[str] = mapped_column(db.String(150), nullable=False, unique=True)
    password: Mapped[str] = mapped_column(db.String(150), nullable=False)
    image: Mapped[str] = mapped_column(db.String(255), nullable=True) # URL or path to the user's image
    role: Mapped[str] = mapped_column(db.String(50), nullable=False)  # e.g., 'admin', 'viewer', 'owner', etc.
    
    institution_id: Mapped[int] = mapped_column(db.ForeignKey('institutions.id'), nullable=True)
    institution: Mapped["Institution"] = relationship("Institution", back_populates="users")
    cameras: Mapped[List["Camera"]] = relationship("Camera", back_populates="user")

class Institution(Base):
    __tablename__ = 'institutions'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(db.String(150), nullable=False, unique=True)
    is_school: Mapped[bool] = mapped_column(db.Boolean, nullable=False)
    # Add more fields as needed (address, type, etc.)

    users: Mapped[List["User"]] = relationship("User", back_populates="institution")
    members: Mapped[List["Member"]] = relationship("Member", back_populates="institution")
    cameras: Mapped[List["Camera"]] = relationship("Camera", back_populates="institution")  



# Association table for many-to-many relationship between Camera and Alert
camera_alert = Table(
    "camera_alert",
    Base.metadata,
    db.Column("camera_id", db.ForeignKey("cameras.id"), primary_key=True),
    db.Column("alert_id", db.ForeignKey("alerts.id"), primary_key=True),
)
## 

camera_member = Table(
    "camera_member",
    Base.metadata,
    db.Column("camera_id", db.ForeignKey("cameras.id"), primary_key=True),
    db.Column("member_id", db.ForeignKey("members.id"), primary_key=True),
)

class AlertType(PyEnum):
    SCHEDULED = "scheduled"
    TEST = "test"
    REAL = "real"
    ARCHIVED = "archived"

class Alert(Base):
    __tablename__ = 'alerts'

    id: Mapped[int] = mapped_column(primary_key=True)
    message: Mapped[str] = mapped_column(db.String(255), nullable=False)
    alert_type: Mapped[AlertType] = mapped_column(Enum(AlertType), nullable=False)
    timestamp: Mapped[date] = mapped_column(db.DateTime, nullable=False)
    code: Mapped[str] = mapped_column(db.String(50), nullable=False)  
    location: Mapped[str] = mapped_column(db.String(150), nullable=False)  # Location of the alert
    scheduled_time: Mapped[datetime] = mapped_column(db.DateTime, nullable=True) 
    # Add other fields as needed (e.g., status, scheduled_time, etc.)

    cameras: Mapped[List["Camera"]] = relationship(
        "Camera",
        secondary=camera_alert,
        back_populates="alerts"
    )

class Camera(Base):
    __tablename__ = 'cameras'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(db.String(100), nullable=False)
    location: Mapped[str] = mapped_column(db.String(150))
    user_id: Mapped[int] = mapped_column(db.ForeignKey('users.id'), nullable=False)
    institution_id: Mapped[int] = mapped_column(db.ForeignKey('institutions.id'), nullable=True)  

    snapshot_url: Mapped[str] = mapped_column(db.String(255), nullable=True)  
    stream_url: Mapped[str] = mapped_column(db.String(255), nullable=True)
    alerts: Mapped[List["Alert"]] = relationship(
        "Alert",
        secondary=camera_alert,
        back_populates="cameras"
    )

    user: Mapped["User"] = relationship("User", back_populates="cameras")
    institution: Mapped["Institution"] = relationship("Institution", back_populates="cameras")  
    members: Mapped[List["Member"]] = relationship(
        "Member",
        secondary=camera_member,
        back_populates="cameras"
    )

class Member(Base):
    __tablename__ = 'members'
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(db.String(150), nullable=False, unique=True)
    name: Mapped[str] = mapped_column(db.String(150), nullable=False)
    role: Mapped[str] = mapped_column(db.String(50), nullable=False)  # e.g., 'admin', 'viewer', 'owner', etc.
    groups: Mapped[str] = mapped_column(db.String(150), nullable=True)  # Comma-separated list of groups
    image: Mapped[str] = mapped_column(db.String(255), nullable=True)  # URL or path to the member's image

    created_by_user_id: Mapped[int] = mapped_column(db.ForeignKey('users.id'), nullable=False)
    created_by_user: Mapped["User"] = relationship("User")

    cameras: Mapped[List["Camera"]] = relationship(
        "Camera",
        secondary=camera_member,
        back_populates="members"
    )

    institution_id: Mapped[int] = mapped_column(db.ForeignKey('institutions.id'), nullable=True)
    institution: Mapped["Institution"] = relationship("Institution", back_populates="members")


