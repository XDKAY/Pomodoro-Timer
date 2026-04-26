from typing import Annotated
from pydantic import BaseModel, Field


class TimerSettingsModel(BaseModel):
    focusTime: Annotated[int, Field(default=30, ge=1, le=90)]
    breakTime: Annotated[int, Field(default=10, ge=1, le=90)]
    restTime: Annotated[int, Field(default=15, ge=1, le=90)]
    sessions: Annotated[int, Field(default=5, ge=1, le=30)]
    volume: Annotated[int, Field(default=50, ge=0, le=100)]