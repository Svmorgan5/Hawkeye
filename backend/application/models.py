from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from flask_sqlalchemy import SQLAlchemy
from datetime import date, datetime
from typing import List
from sqlalchemy import Table, Enum
from enum import Enum as PyEnum


class Base(DeclarativeBase):
    pass

# Initialize SQLAlchemy with custom base

db = SQLAlchemy(model_class=Base,
                engine_options={
        "pool_pre_ping": True,  # ping before each checkout
        "pool_recycle": 280,    # recycle idle conns < Render 5‑min timeout
        # "pool_size": 10,      # optional tuning
        # "max_overflow": 20,
    },)

# Many-to-many tables linking users/members to institutions
user_institution = Table(
    "user_institution",
    Base.metadata,
    db.Column("user_id", db.ForeignKey("users.id"), primary_key=True),
    db.Column("institution_id", db.ForeignKey("institutions.id"), primary_key=True),
)

member_institution = Table(
    "member_institution",
    Base.metadata,
    db.Column("member_id", db.ForeignKey("members.id"), primary_key=True),
    db.Column("institution_id", db.ForeignKey("institutions.id"), primary_key=True),
)

# Many-to-many table linking cameras to alerts
camera_alert = Table(
    "camera_alert",
    Base.metadata,
    db.Column("camera_id", db.ForeignKey("cameras.id"), primary_key=True),
    db.Column("alert_id", db.ForeignKey("alerts.id"), primary_key=True),
)

# Many-to-many table linking cameras to members
camera_member = Table(
    "camera_member",
    Base.metadata,
    db.Column("camera_id", db.ForeignKey("cameras.id"), primary_key=True),
    db.Column("member_id", db.ForeignKey("members.id"), primary_key=True),
)

class User(Base):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(db.String(150), nullable=False)
    phone: Mapped[str] = mapped_column(db.String(25), nullable=True, unique=True)
    email: Mapped[str] = mapped_column(db.String(150), nullable=False, unique=True)
    password: Mapped[str] = mapped_column(db.String(225), nullable=False)
    image: Mapped[str] = mapped_column(db.String(255), nullable=True)
    role: Mapped[str] = mapped_column(db.String(50), nullable=False)

    # Single institution FK for primary association
    institution_id: Mapped[int] = mapped_column(db.ForeignKey('institutions.id'), nullable=True)
    institution: Mapped["Institution"] = relationship("Institution", back_populates="users")
    cameras: Mapped[List["Camera"]] = relationship("Camera", back_populates="user")

    # Support multiple institutions
    institutions = relationship(
        "Institution",
        secondary=user_institution,
        back_populates="users_multi"
    )

    invitations_sent: Mapped[List["Invitation"]] = relationship(
        "Invitation",
        back_populates="inviter",
        cascade="all, delete-orphan"
    )

class Institution(Base):
    __tablename__ = 'institutions'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(db.String(150), nullable=False, unique=True)
    is_school: Mapped[bool] = mapped_column(db.Boolean, nullable=False)
    address: Mapped[str] = mapped_column(db.String(255), nullable=True)
    phone: Mapped[str] = mapped_column(db.String(25), nullable=True, unique=True)

    logo: Mapped[str] = mapped_column(db.String(255), nullable=True)
    image1: Mapped[str] = mapped_column(db.String(255), nullable=True)
    image2: Mapped[str] = mapped_column(db.String(255), nullable=True)

    # Relationships to users and members
    users: Mapped[List["User"]] = relationship("User", back_populates="institution")
    members: Mapped[List["Member"]] = relationship("Member", back_populates="institution")
    cameras: Mapped[List["Camera"]] = relationship("Camera", back_populates="institution")
    alerts: Mapped[List["Alert"]] = relationship("Alert", back_populates="institution")

    # Many-to-many support
    users_multi = relationship(
        "User",
        secondary=user_institution,
        back_populates="institutions"
    )
    members_multi = relationship(
        "Member",
        secondary=member_institution,
        back_populates="institutions"
    )

    invitations: Mapped[List["Invitation"]] = relationship(
        "Invitation",
        back_populates="institution",
        cascade="all, delete-orphan"
    )

class Invitation(Base):
    __tablename__ = 'invitations'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(db.String(150), nullable=False)
    token: Mapped[str] = mapped_column(db.String(255), nullable=False, unique=True)
    institution_id: Mapped[int] = mapped_column(db.ForeignKey('institutions.id'), nullable=False)
    invited_by: Mapped[int] = mapped_column(db.ForeignKey('users.id'), nullable=False)
    expires_at: Mapped[datetime] = mapped_column(db.DateTime, nullable=False)
    used: Mapped[bool] = mapped_column(db.Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    institution: Mapped["Institution"] = relationship("Institution", back_populates="invitations")
    inviter: Mapped["User"] = relationship("User", foreign_keys=[invited_by])


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
    location: Mapped[str] = mapped_column(db.String(150), nullable=False)
    scheduled_time: Mapped[datetime] = mapped_column(db.DateTime, nullable=True)

    # Link alert to institution
    institution_id: Mapped[int] = mapped_column(db.ForeignKey('institutions.id'), nullable=False)
    institution: Mapped["Institution"] = relationship("Institution", back_populates="alerts")

    # Cameras associated with this alert
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
    institution_id: Mapped[int] = mapped_column(db.ForeignKey('institutions.id'), nullable=False)

    snapshot_url: Mapped[str] = mapped_column(db.String(255), nullable=True)
    stream_url: Mapped[str] = mapped_column(db.String(255), nullable=True)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="cameras")
    institution: Mapped["Institution"] = relationship("Institution", back_populates="cameras")
    alerts: Mapped[List["Alert"]] = relationship(
        "Alert",
        secondary=camera_alert,
        back_populates="cameras"
    )
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
    role: Mapped[str] = mapped_column(db.String(50), nullable=False)
    groups: Mapped[str] = mapped_column(db.String(150), nullable=True)
    image: Mapped[str] = mapped_column(db.String(255), nullable=True)
    # Whether the member is active
    active: Mapped[bool] = mapped_column(db.Boolean, default=True, nullable=False)

    created_by_user_id: Mapped[int] = mapped_column(db.ForeignKey('users.id'), nullable=False)
    created_by_user: Mapped["User"] = relationship("User")

    # Link member to institution
    institution_id: Mapped[int] = mapped_column(db.ForeignKey('institutions.id'), nullable=False)
    institution: Mapped["Institution"] = relationship("Institution", back_populates="members")
    institutions = relationship(
        "Institution",
        secondary=member_institution,
        back_populates="members_multi"
    )

    # Cameras this member can access
    cameras: Mapped[List["Camera"]] = relationship(
        "Camera",
        secondary=camera_member,
        back_populates="members"
    )
