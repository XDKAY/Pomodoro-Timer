from functools import reduce

from fastapi import Cookie

from backend.models.timer_settings import TimerSettingsModel


def get_settings_from_cookie(settings: str | None = Cookie(default=None)):
    if settings:
        data = dict(
            list(
                reduce(
                    lambda x, y: [x, int(y)],
                    s.split("=")
                )
            )
            for s in settings.strip().split()
        )

        return TimerSettingsModel(**data)
    return TimerSettingsModel()