from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from flask_sqlalchemy import SQLAlchemy
from datetime import date
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
    phone: Mapped[str] = mapped_column(db.String(25), nullable=False, unique=True)
    email: Mapped[str] = mapped_column(db.String(150), nullable=False, unique=True)
    password: Mapped[str] = mapped_column(db.String(150), nullable=False)

    cameras: Mapped[List["Camera"]] = relationship("Camera", back_populates="user", cascade="all, delete-orphan")


# Association table for many-to-many relationship between Camera and Alert
camera_alert = Table(
    "camera_alert",
    Base.metadata,
    db.Column("camera_id", db.ForeignKey("cameras.id"), primary_key=True),
    db.Column("alert_id", db.ForeignKey("alerts.id"), primary_key=True),
)
## 
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
    alerts: Mapped[List["Alert"]] = relationship(
        "Alert",
        secondary=camera_alert,
        back_populates="cameras"
    )

    user: Mapped["User"] = relationship("User", back_populates="cameras")


