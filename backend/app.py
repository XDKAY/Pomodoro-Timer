from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.core.settings import settings
from backend.routers import routers


app = FastAPI()

app.mount("/static", StaticFiles(directory=settings.frontend_dir), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins = settings.allow_origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

app.include_router(routers)



