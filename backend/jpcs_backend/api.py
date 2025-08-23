from ninja import Schema

from ninja_extra import NinjaExtraAPI
from ninja_jwt.authentication import JWTAuth
from ninja_jwt.controller import NinjaJWTDefaultController

from members.api import router as members_router
from attendance.api import router as attendance_router

api = NinjaExtraAPI()

api.add_router("/members/", members_router)
api.add_router("/attendance/", attendance_router)

api.register_controllers(NinjaJWTDefaultController)


class UserSchema(Schema):
    username: str
    is_authenticated: bool
    email: str


@api.get("/me", response=UserSchema, auth=JWTAuth())
def me(request):
    return request.user
