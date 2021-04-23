from django.shortcuts import render, redirect, get_object_or_404
from comment.models import Comment
from physics.models import Project
from comment.forms import CommentForm
from django.contrib.auth.decorators import login_required


def project_summary(request, id):
    '''the project summary page'''
    project = get_object_or_404(Project, id=id)
    comments = Comment.objects.filter(project_id=id)

    comment_form = CommentForm()

    context={
        'project': project,
        'comments': comments,
        'comment_form': comment_form
    }

    return render(request, "summary.html", context)