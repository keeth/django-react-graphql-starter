import graphene
from graphene import relay
from rest_framework_jwt.serializers import JSONWebTokenSerializer

from main.queries import CurrentUserNode


class Login(relay.ClientIDMutation):
    class Input:
        username = graphene.String(required=True)
        password = graphene.String(required=True)

    success = graphene.Boolean()
    error = graphene.String()
    token = graphene.String()
    user = graphene.Field(CurrentUserNode)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        serializer = JSONWebTokenSerializer(data=input)
        if serializer.is_valid():
            token = serializer.object['token']
            user = serializer.object['user']
            return Login(success=True, user=user, token=token, error=None)
        else:
            return Login(
                success=False,
                token=None,
                error='Unable to login with provided credentials.'
            )


class Mutation(graphene.ObjectType):
    login = Login.Field()
