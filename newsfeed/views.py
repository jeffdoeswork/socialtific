
from .utils import artifact_modifier, flatten_conclusion
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db.models import Q
from newsfeed.models import Observation, Data, Conclusion, Hypothesis, Experiment, Group, Reaction
from newsfeed.serializers import (DataSerializer, ReactionSerializer,
                    ExperimentSerializer, ConclusionSerializer, HypothesisSerializer, ObservationSerializer, GroupSerializer)
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from tools.aws import uploader

User = get_user_model()

ARTIFACT_DICT = {'hypothesis':Hypothesis,
                    'data':Data,
                    'conclusion':Conclusion,
                    'observation':Observation,
                    'experiment':Experiment}

ARTIFACT_SERIALZIER_DICT = {'hypothesis':HypothesisSerializer,
                    'data':DataSerializer,
                    'conclusion':ConclusionSerializer,
                    'observation':ObservationSerializer,
                    'experiment':ExperimentSerializer}



class ObservationViewSet(viewsets.ModelViewSet):
    serializer_class = ObservationSerializer

    def get_queryset(self):
        return Observation.objects.all()

    def get_permissions(self):
        permission_classes = []
        if self.action not in ['list', 'retrieve']:
            permission_classes=[IsAuthenticated]
        
        return [permission() for permission in permission_classes]

    def create(self, request):
        """
        Return a new Observation artifact
        """
        observation = Observation.objects.create(author=request.user, description=request.data.get('description'))
        serializer = self.serializer_class(observation)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        draft = self.request.query_params.get('draft')
        if not draft:
            draft = False
        qs = self.get_queryset().get(id=pk, conclusion__draft=draft) # returns only Observation and drafts attached as indicated  
        serializer = self.serializer_class(qs)
        data = serializer.data
        if not draft and not qs:
            # re-retrive object again but only for meta data since a qs wont exist
            # copy serialized dictionary and pop all attributes
            obj =  Observation.objects.get(id=pk)
            data = self.serializer_class(obj).data.copy()
            for field in ['data', 'hypothesis', 'experiment', 'conclusion']:
                data.pop(field)
        return Response(data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_social_method(request, pk):
    """
    Create a Conclusion
    """
    # conclucion objects must contain at least one
    # type of Artifact
    
    if not request.data: # 1st click, will create a new method
        conclusion = Conclusion.objects.create(author=request.user)
        return Response({"conclusion_id":conclusion.id}) 
    serial_dict = {}
    serial_dict['user'] = request.user.id
    group = request.data.get('group')
    observation = Observation.objects.get(id=pk)
    serial_dict = artifact_modifier(request, observation)  # Obersvation inst will be saved to each artifact (Data, Exp, Hypo)
    conclusion = Conclusion.objects.get(id=request.data.get('conclusionId'))
    conclusion.draft = request.data.get('draft', False)
    conclusion.title = request.data.get('title')
    conclusion.observation = observation
    conclusion.user = request.user
    for artifact in ['experiment','data']:
        if serial_dict.get(artifact):
            getattr(conclusion, artifact).add(*serial_dict.get(artifact)) # add to ManyToMAny Field
    if serial_dict.get('hypothesis'):
        conclusion.hypothesis = serial_dict.get('hypothesis')
    conclusion.conclusion = request.data.get('conclusion')


    if group: # Attach group to all instances
        group = Group.objects.get(name__iexact=group)
        for inst in serial_dict.values():
            if not inst.group:
                inst.group = group
                group.save()
        conclusion.group = group
        observation.group = group
    observation.save()
    conclusion.save()
    return Response('ok')


class ConclusionViewSet(viewsets.ModelViewSet):
    serializer_class = ConclusionSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.query_params.get('user')
        observation_id = self.request.query_params.get('observation')
        draft = self.request.query_params.get('draft', 'all')
        query = {"author__username":user, "observation_id":observation_id}
        if draft != 'all':
            if draft: # draft is not 'all', draft is simply True (possibly confusing)
                query ['draft'] = True # This retrives only drafts, not published
            elif not draft:
                query['draft'] = False # only display non-drafts
        return Conclusion.objects.all().filter(**query)

    def retrieve(self, *args, **kwargs):
        try:
            qs  = Conclusion.objects.get(id=kwargs.get('pk'))
            serializer = self.serializer_class(qs)
        except Conclusion.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        Conclusion.objects.get(id=int(pk)).delete()
        return Response('ok')


class DataViewset(viewsets.ModelViewSet):
    queryset = Data.objects.all()
    serializer_class = DataSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(observation_id=self.request.query_params['observation'])

    def create(self, request):
        print(request.data)
        return Response('ok')


class ExperimentViewSet(viewsets.ModelViewSet):
    queryset = Experiment.objects.all()
    serializer_class = ExperimentSerializer 
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(observation_id=self.request.query_params['observation'])


class HypothesisViewSet(viewsets.ModelViewSet):
    queryset = Hypothesis.objects.all()
    serializer_class = HypothesisSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(observation_id=self.request.query_params['observation'])


class GroupViewSet(viewsets.ModelViewSet):
    serializer_class = GroupSerializer
    
    def get_permissions(self):
        permission_classes = []
        if self.action not in ['list', 'retrieve']:
            permission_classes=[IsAuthenticated]
        
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """
        Returns queryset to be used
        access this method rather self.queryset(caches 1st initial request)
        """
        return Group.objects.all()

    def list(self, request, **kwargs):
        """
        Return list of serialized group instances
        based upon search params
        """
        user = request.query_params.get('user')
        group = request.query_params.get('group')
        if not user and group:
            qs = self.get_queryset().filter(name__istartswith=group.replace("-", " "))
        elif user:
            qs = self.get_queryset().filter(Q(members__username=user) | Q(admin__username=user))
        else:
            qs = self.get_queryset()
        serializer = self.serializer_class(qs, many=True)
        return Response(serializer.data)

    def create(self, request, **kwargs):
        post_data = request.data.copy()
        admin= User.objects.get(username=request.user)
        serializer = self.serializer_class(data=post_data)
        flag = post_data.get('flag')
        if serializer.is_valid():
            group = serializer.save()
            if flag:
                uploader(flag)
                group.flag_link = settings.AWS_BUCKET_URL + flag.name
            group.admin = admin

            group.save()
            return Response(serializer.data)
        else:
            print('Unable to save serializer ',serializer.errors)
        return Response(' not ok')

       
    def retrieve(self, request, *args, **kwargs):
        """
        Return group instace
        pk == slugified name
        """
        name = kwargs.get('pk')
        try:
            qs = self.get_queryset().get(name__istartswith=name.replace("-", " "))

        except Exception as e:
            print('Error retrieving Group Instance', e)
            return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            serializer = self.serializer_class(qs)
            return Response(serializer.data)


    def update(self, request, *args, **kwargs):
        """
        Update a group instance by adding/removing a member
        """
        name = kwargs.get('pk')
        group = self.get_queryset().get(name__iexact=name.replace("-", " "))
        prospect = request.data.get('member')
        bio = request.data.get('bio')
        banner = request.data.get('banner')
        if banner:
            uploader(banner)
            group.banner_link = settings.AWS_BUCKET_URL + banner.name

        remove_member = request.data.get('remove')
        if prospect and not remove_member: 
            member = User.objects.get(username= prospect)     
            group.members.add(member)
        elif prospect and remove_member:
            member = User.objects.get(username= prospect)     
            group.members.remove(member)

        if bio:
            group.bio = bio
            
        group.save()
        serializer = self.serializer_class(group)
        return Response(serializer.data)



class ReactionViewSet(viewsets.ModelViewSet):
    queryset = Reaction.objects.all() 
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ReactionSerializer



    def list(self, request):
        """
        Query params create a reaction instance. 

        Any type of Artifact instance can be created
        """
        reaction = Reaction.objects.create(
            user = User.objects.get(username=request.user),
            type='L'
        )
        query_artifact = request.query_params.get('artifact')
        query_artifact_id = request.query_params.get('id')
        artifact = ARTIFACT_DICT[query_artifact].objects.get(id=query_artifact_id)
        artifact.reactions.add(reaction)
        artifact.save()
        serializer = ARTIFACT_SERIALZIER_DICT[query_artifact](artifact)
        return Response(serializer.data)



    def post(self, request):
        """
        Delete an object retrieved by query_params
        """
        return Response

    def delete(self, request, **kwargs):
        query_artifact = request.query_params.get('artifact').lower()
        try:
            query_artifact_id = request.query_params.get('id').strip("/")
        except:
            return Response("Resource not Found", status=status.HTTP_404_NOT_FOUND)
        query_args = {}
        artifact = ARTIFACT_DICT[query_artifact].objects.get(id=query_artifact_id)
        query_args[query_artifact] = artifact
        query_args['user__username'] = request.user
        Reaction.objects.filter(**query_args).delete()
        artifact.refresh_from_db()
        serializer = ARTIFACT_SERIALZIER_DICT[query_artifact](artifact)
        return Response(serializer.data)



@api_view(["GET"])
def artifact_feed(request):
    """
    Return artifacts based on filters

    type = user/group
    list = most liked/least liked/most recent/oldest
    """

    # fetch conclusion objects by recently modified
    qs = Conclusion.objects.filter(author__username=request.query_params.get('user'), draft=False) # adjust as per user
    serializer = ConclusionSerializer(qs, many=True)

    response = flatten_conclusion(serializer.data)
    return Response(response)