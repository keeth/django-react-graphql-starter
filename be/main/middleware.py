import logging

from django.contrib.auth.models import AnonymousUser
from django.utils.functional import SimpleLazyObject

from rest_framework.request import Request
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

logger = logging.getLogger(__name__)


def get_user_jwt(request):
    user = None
    try:
        user_jwt = JSONWebTokenAuthentication().authenticate(Request(request))
        if user_jwt is not None:
            # store the first part from the tuple (user, obj)
            user = user_jwt[0]
    except Exception as e:
        logger.exception('jwt exception')

    return user or AnonymousUser()


class JWTAuthenticationMiddleware(object):

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path == '/graphql/' or request.path == '/graphql/batch/':
            request.user = SimpleLazyObject(lambda: get_user_jwt(request))
        response = self.get_response(request)
        return response
