from newsfeed.models import Observation, Data, Experiment, Hypothesis, Conclusion, Group, Reaction
from user.serializers import UserSerializer
from rest_framework import serializers 


class ReactionSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    class Meta:
        model = Reaction 
        fields = "__all__"

class BaseArtifactSerializer(serializers.Serializer):
    author = UserSerializer()
    modified = serializers.DateTimeField(format="%c", required=False)
    created = serializers.DateTimeField(format="%c", required=False) # "%a %b %d, %Y"
    type = serializers.SerializerMethodField()
    reactions = ReactionSerializer(many=True)
    group = serializers.StringRelatedField()

    def get_type(self, obj):
        return obj.__class__.__name__.lower()

class DataSerializer(BaseArtifactSerializer,serializers.ModelSerializer):
    borrowers = serializers.StringRelatedField(many=True)
    class Meta:
        model = Data
        fields = "__all__"



class ExperimentSerializer(BaseArtifactSerializer, serializers.ModelSerializer):
    borrowers = serializers.StringRelatedField(many=True)
    class Meta:
        model = Experiment
        fields = "__all__"


class HypothesisSerializer(BaseArtifactSerializer, serializers.ModelSerializer):
    borrowers = serializers.StringRelatedField(many=True)
    

    class Meta:
        model = Hypothesis
        fields = "__all__"



class ConclusionSerializer(BaseArtifactSerializer, serializers.ModelSerializer):
    author = UserSerializer()
    data = DataSerializer(many=True)
    hypothesis  = serializers.SerializerMethodField()
    experiment = ExperimentSerializer(many=True)
    conclusionId = serializers.IntegerField(source="id")


    class Meta:
        model = Conclusion
        exclude = ('id',)

    def get_hypothesis(self, obj):
        """
        Retun a list if contains a single Hyopthesis

        If not hypothesis is found return empty list
        """
        # An Observation can have  a list of Hyothesis's
        # a Conclusion will only have 1 Hypothesis, causing a NULL
        # value to be returned, thus breaking the frontend
        # If any changes are made here to remove a return list on a Conclusion
        # make sure to update frontend code as well
        
        if not obj.hypothesis:
            return []
        else:
            return [HypothesisSerializer(obj.hypothesis).data] 
            

class ObservationSerializer(BaseArtifactSerializer, serializers.ModelSerializer):
    data = DataSerializer(source="data_set", many=True)
    hypothesis  = HypothesisSerializer(source="hypothesis_set", many=True)
    experiment = ExperimentSerializer(source="experiment_set", many=True)
    conclusion = ConclusionSerializer(source="conclusion_set", many=True)

    class Meta:
        model = Observation
        fields = "__all__"
        
    

class GroupSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, required=False)
    admin = UserSerializer(required=False)

    class Meta:
        model = Group
        fields = '__all__'