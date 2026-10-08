from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON, Index
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), default="Aviral Jain")
    handle = Column(String(100), default="@AVIRALJAIN51695")
    avatar = Column(String(255), default="🧑")
    xp = Column(Integer, default=265)
    streak = Column(Integer, default=3)
    hearts = Column(Integer, default=5)
    gems = Column(Integer, default=126)
    daily_goal_xp = Column(Integer, default=10)
    is_super = Column(Boolean, default=False)
    last_active_date = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    progress = relationship("UserProgress", back_populates="user", cascade="all, delete-orphan")
    mistakes = relationship("UserMistake", back_populates="user", cascade="all, delete-orphan")
    settings = relationship("UserSetting", back_populates="user", uselist=False, cascade="all, delete-orphan")


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(10), unique=True, index=True)  # e.g., 'hi'
    title = Column(String(100))                         # e.g., 'Hindi'
    flag = Column(String(10), default="🇮🇳")

    units = relationship("Unit", back_populates="course", cascade="all, delete-orphan")


class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    order_index = Column(Integer, default=1)
    section_title = Column(String(100), default="Section 1, Unit 1")
    title = Column(String(200), default="Form basic sentences")
    description = Column(String(255), default="Identify basic objects, people, and simple sentence structures in Hindi")

    course = relationship("Course", back_populates="units")
    lessons = relationship("Lesson", back_populates="unit", cascade="all, delete-orphan")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id", ondelete="CASCADE"), nullable=False)
    order_index = Column(Integer, default=1)
    title = Column(String(100), default="Basics 1")
    icon = Column(String(50), default="star")  # 'star', 'headphones', 'camera', 'chest'
    xp_reward = Column(Integer, default=10)

    unit = relationship("Unit", back_populates="lessons")
    exercises = relationship("Exercise", back_populates="lesson", cascade="all, delete-orphan")
    progress_entries = relationship("UserProgress", back_populates="lesson", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_lessons_unit_order", "unit_id", "order_index"),
    )


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    order_index = Column(Integer, default=1)
    # Types: MULTIPLE_CHOICE | WORD_BANK | MATCH_PAIRS | FILL_BLANK | TYPE_ANSWER
    type = Column(String(50), nullable=False)
    category_tag = Column(String(50), default="NEW WORD")
    prompt = Column(String(255), nullable=False)
    audio_text = Column(String(100), nullable=True)
    # Content JSON: stores options, word pools, pairs, or missing blank configuration
    content = Column(JSON, nullable=False)
    correct_answer = Column(Text, nullable=False)

    lesson = relationship("Lesson", back_populates="exercises")
    mistakes = relationship("UserMistake", back_populates="exercise", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_exercises_lesson_order", "lesson_id", "order_index"),
    )


class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    is_completed = Column(Boolean, default=False)
    crowns = Column(Integer, default=0)
    completed_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="progress")
    lesson = relationship("Lesson", back_populates="progress_entries")

    __table_args__ = (
        Index("idx_user_progress_user_lesson", "user_id", "lesson_id", unique=True),
    )


class UserMistake(Base):
    __tablename__ = "user_mistakes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    exercise_id = Column(Integer, ForeignKey("exercises.id", ondelete="CASCADE"), nullable=False)
    mistake_count = Column(Integer, default=1)
    last_mistake_at = Column(DateTime, default=datetime.utcnow)
    resolved = Column(Boolean, default=False)

    user = relationship("User", back_populates="mistakes")
    exercise = relationship("Exercise", back_populates="mistakes")

    __table_args__ = (
        Index("idx_user_mistakes_user_exercise", "user_id", "exercise_id"),
    )


class UserSetting(Base):
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    sound_effects = Column(Boolean, default=True)
    animations = Column(Boolean, default=True)
    motivational_messages = Column(Boolean, default=True)
    listening_exercises = Column(Boolean, default=True)
    speaking_exercises = Column(Boolean, default=True)
    dark_mode = Column(String(20), default="system")  # 'system' | 'on' | 'off'
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="settings")
