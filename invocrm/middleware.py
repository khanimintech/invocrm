from django.conf import settings
from django.http import HttpResponseRedirect


def force_login_middleware(get_response):
    # One-time configuration and initialization.

    def middleware(request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.
        # assert hasattr(request, 'user'), f'force_login_middleware middleware requires request.user'
        # if not request.user.is_authenticated and not settings.LOGIN_URL in request.path:
        #     return HttpResponseRedirect(f"{settings.LOGIN_URL}?next={request.path_info}")
        response = get_response(request)

        # Code to be executed for each request/response after
        # the view is called.

        return response

    return middleware