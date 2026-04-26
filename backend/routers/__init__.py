from fastapi import APIRouter

from .api_routers import router as api_router
from .ui_routers import router as ui_router

routers = APIRouter()

routers.include_router(api_router)
routers.include_router(ui_router)
