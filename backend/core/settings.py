from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    allow_origins: list[str] = ["*"]

    frontend_dir: str = "./frontend"


settings = Settings()