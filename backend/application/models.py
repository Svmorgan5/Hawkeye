from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from flask_sqlalchemy import SQLAlchemy
from datetime import date
from typing import List


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

    #Maybe We dont need but ---> dob: Mapped[date] = mapped_column(db.Date, nullable=False)
