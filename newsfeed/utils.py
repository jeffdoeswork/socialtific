"""Helper module for views."""
import datetime
import itertools
from django.contrib.auth import get_user_model
from newsfeed.models import Data, Hypothesis, Experiment, Conclusion

User = get_user_model()

from django.forms import model_to_dict

def artifact_modifier(request, observation):
    """Return dict of instances related to Social Method
    
    A returned dictionary's key will contist of the type of method and the value
    will be an instance or list of instances of that method ie. 'data': Data Instance(1)
    """
    serial_dict = {}
    serial_dict['user'] = request.user.id
    artifact_model_dict = {'data':Data, 'hypothesis':Hypothesis, 'experiment':Experiment}
    
    update_replace = request.data.get('updateReplace')
    if update_replace:
        conclusion = Conclusion.objects.get(id=request.data.get('conclusionId'))
        for artifact_name, artifact_model in artifact_model_dict.items():
            if artifact_name != 'hypothesis':
                db_list = map(lambda x: x.id, getattr(conclusion, artifact_name).all()) # contains only list of ID's
                post_list = map(lambda x: x['id'], request.data[artifact_name]) # JSON dictionary
                delete_list = filter(lambda x: x not in post_list, db_list) # Remove items that dont exist in POST data
                getattr(conclusion, artifact_name).remove(*delete_list)
                conclusion.save()
            else:
                hypothesis = request.data.get('hypothesis')
                if not hypothesis:
                    conclusion.hypothesis = None

        conclusion.save()


    # create a dictionary of artifact types as keys and 
    # artifact list values
    for artifact_name, artifact_model in artifact_model_dict.items():
        data_artifact_inst= None
        temp_value = []
        for obj_artifact in request.data[artifact_name]:
            if obj_artifact:
                data_artifact_inst, _ = artifact_model.objects.get_or_create(description=obj_artifact["description"], 
                    author=User.objects.get(username=obj_artifact['author']['username']), observation=observation)

                if obj_artifact['author']['username'] != request.user:
                    data_artifact_inst.borrowers.add(request.user)
                data_artifact_inst.save()

                if artifact_name == 'hypothesis': # hypthoesis is the only artifact that will not be a list
                    temp_value = data_artifact_inst 
                else:
                    temp_value.append(data_artifact_inst)
            else:
                print('NOne', obj_artifact)
        serial_dict.update({artifact_name:temp_value})

    return serial_dict        

def flatten_conclusion(conclusions):
    """
    Return a list of a conclusions and 
    it's nested objects as one sorted flattened array
    """
    list_of_flats = []
    artifact_types = ['data', 'experiment', 'hypothesis']
    for conclusion in conclusions:        
        flat_conclusion = []
        for artifact in artifact_types:
            if conclusion[artifact]:
                flat_conclusion.extend(conclusion.pop(artifact))

        list_of_flats.append(flat_conclusion)
        # print(conclusion['conclusion'])
        # if conclusion['conclusion'] !=" ":
        #     print('appending')
        #     list_of_flats.append(conclusion)
    return sorted(list(itertools.chain(*list_of_flats)), key=lambda x: datetime.datetime.strptime(x['modified'], "%c"))