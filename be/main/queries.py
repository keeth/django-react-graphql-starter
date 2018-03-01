import graphene
from django.contrib.auth import get_user_model
from graphene_django import DjangoObjectType


class CurrentUserNode(DjangoObjectType):

    class Meta:
        model = get_user_model()
        interfaces = (graphene.relay.Node,)
        only_fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'email',
        ]


class Query(graphene.ObjectType):
    current_user = graphene.Field(CurrentUserNode)

    def resolve_current_user(self, info):
        if not info.context.user.is_authenticated:
            return None
        return info.context.user

