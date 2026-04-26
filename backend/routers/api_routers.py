from typing import Annotated
from fastapi import APIRouter, Depends, Response, status

from backend.core.settings import settings

from backend.models.timer_settings import TimerSettingsModel

from .dependencies import get_settings_from_cookie


router = APIRouter(prefix="/api")


@router.put("/change-settings")
async def change_settings(response: Response, timer_settings: TimerSettingsModel):
    response.set_cookie(
        key="settings",
        value=timer_settings,
        httponly=True,
        samesite="strict"
    )

    return {"message": "Settings saved successfully"}


@router.get("/get-settings", response_model=TimerSettingsModel)
async def get_settings(settings: Annotated[TimerSettingsModel, Depends(get_settings_from_cookie)]):
    return settings


    
