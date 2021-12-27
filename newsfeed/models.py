"""Models defining social method.

A social method has the 7 steps in a scientific method."""

from django.db import models
from django_extensions.db.models import TimeStampedModel, ActivatorModel
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
User = get_user_model()


class Artifact(TimeStampedModel, ActivatorModel):
    """Return social method artifact entry."""

    description = models.CharField(_("Description"), max_length=250, null=True)
    author = models.ForeignKey(
    "user.User", verbose_name=_("User"), # When defined an FK inside of an Abstract Base Class this is required Django syntax as Django 4.0
    related_name="%(app_label)s_%(class)s_related",
    related_query_name="%(app_label)s_%(class)ss",
    on_delete=models.SET_NULL,
    blank=True, null=True
    )
    observation = models.ForeignKey("newsfeed.Observation", verbose_name=_("Observation"), on_delete=models.CASCADE, default='1')
    borrowers = models.ManyToManyField(User) # User relates to django.contrib.user ie swappable model (implicitly our version)
    reactions = models.ManyToManyField("newsfeed.Reaction")
    group = models.ForeignKey("newsfeed.Group", on_delete=models.SET_NULL, null=True)

    class Meta:
        """Options for abstract Artifact class."""
        abstract = True


class Observation(TimeStampedModel, ActivatorModel):
    """Return observation for social method."""

    author = models.ForeignKey(
        "user.User", verbose_name=_("User"),
        on_delete=models.SET_NULL,
        blank=True, null=True
    )
    description = models.CharField(_("Description"), max_length=250)
    reactions = models.ManyToManyField("newsfeed.Reaction")
    group = models.ForeignKey("newsfeed.Group", on_delete=models.SET_NULL, null=True)
    class Meta:
        """Meta options for observation."""
        ordering = ["-created"]


class Data(Artifact):
    """Return data related to social method."""
    class Meta:
        ordering = ["created"]



class Experiment(Artifact):
    """Return experiment related to social method."""
    class Meta:
        ordering = ["created"]


class Hypothesis(Artifact):
    """Return hypothesis related to social method expirment."""
    class Meta:
        ordering = ["created"]


class Conclusion(TimeStampedModel, ActivatorModel):
    """Return a social method conclusion/comment."""

    draft = models.BooleanField(default=True)
    title = models.CharField(max_length=255, null=True)
    author = models.ForeignKey(
        "user.User", verbose_name=_("User"),
        related_name="conclusions",
        on_delete=models.CASCADE, null=True
    )
    observation = models.ForeignKey(
        "newsfeed.Observation", verbose_name=_("Observation"),
        on_delete=models.CASCADE, null=True
    )
    data = models.ManyToManyField(
        "newsfeed.Data", verbose_name=_("Data"))
    experiment = models.ManyToManyField(
        "newsfeed.Experiment", verbose_name=_("Experiment"))
    hypothesis =  models.ForeignKey(
        "newsfeed.Hypothesis", verbose_name=_("Hypothesis"), on_delete=models.CASCADE, null=True)
    conclusion = models.CharField(_("Conclusion"), max_length=250, 
        null=True, blank=True)
    reactions = models.ManyToManyField("newsfeed.Reaction")
    group = models.ForeignKey("newsfeed.Group", on_delete=models.SET_NULL, null=True)

    class Meta:
        ordering = ["-modified"]


class Group(TimeStampedModel):
    """Return a group instance."""
    flag_link = models.CharField(max_length=255, null=True)
    banner_link = models.CharField(max_length=255, null=True)
    name = models.CharField(max_length=255, unique=True, null=True)
    admin = models.ForeignKey(User, related_name="admin_of_group",on_delete=models.SET_NULL, null=True)
    members = models.ManyToManyField(User, through="Membership")
    bio = models.TextField(null=True)


class Membership(TimeStampedModel):
    """Return a relation between a group and user."""
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    last_interaction = models.DateTimeField(auto_now=True)

    

class Reaction(models.Model):
    """Return a reaction."""

    REACTION_CHOICES=(('L', 'Like'),) # Like, Love, Funny, etc..


    type = models.CharField(max_length=1, choices=REACTION_CHOICES)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
