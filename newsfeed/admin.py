from django.contrib import admin
from .models import Hypothesis, Experiment, Data, Observation


admin.site.register(Observation)
admin.site.register(Hypothesis)
admin.site.register(Experiment)
admin.site.register(Data)