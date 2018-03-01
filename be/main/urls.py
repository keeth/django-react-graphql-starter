from django.conf.urls import url
from django.contrib import admin
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import RedirectView
from graphene_django.views import GraphQLView

from .schema import schema

admin.autodiscover()

urlpatterns = [
    url(r'^graphql/$', csrf_exempt(GraphQLView.as_view(graphiql=True, schema=schema))),
    url(r'^graphql/batch/$', csrf_exempt(GraphQLView.as_view(schema=schema, batch=True))),
    url(r'^.*$', RedirectView.as_view(url='graphql/', permanent=False), name='index')
]
