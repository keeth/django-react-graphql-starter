import graphene

from .mutations import Mutation
from .queries import Query


class RootQuery(Query, graphene.ObjectType):
    pass


schema = graphene.Schema(query=RootQuery, mutation=Mutation)
