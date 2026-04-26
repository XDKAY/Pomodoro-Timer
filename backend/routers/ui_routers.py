from fastapi import APIRouter
from fastapi.responses import FileResponse

from backend.core.settings import settings

router = APIRouter()


@router.get("/", response_class=FileResponse)
async def index():
    return settings.frontend_dir + "/html/index.html"