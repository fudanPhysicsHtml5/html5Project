from django.shortcuts import render, redirect, get_object_or_404, reverse
from physics.models import Project
from .models import Comment
from .forms import CommentForm
from django.http import HttpResponse, JsonResponse
from django.views.decorators.clickjacking import xframe_options_exempt

# Create your views here.
@xframe_options_exempt
def post_comment(request, project_id, parent_comment_id=None):
    '''add comment into database'''
    project = get_object_or_404(Project, id=project_id)

    if request.method == 'POST':
        comment_form = CommentForm(request.POST)

        if comment_form.is_valid():
            new_comment = comment_form.save(commit=False)
            new_comment.project = project
            new_comment.user = request.user

            if parent_comment_id:
                parent_comment = Comment.objects.get(id=parent_comment_id)
                # parent root the comment should attach to
                new_comment.parent_id = parent_comment.get_root().id
                # one the comment reply to
                new_comment.reply_to = parent_comment.user
                new_comment.save()
                return HttpResponse("200 OK")
            
            new_comment.save()
            return redirect(reverse('summary:project_summary', args=[project_id]))
        else:
            return HttpResponse("there is someting with the form, please rewrite it")
    
    elif request.method == "GET":
        # commentform for reply
        comment_form = CommentForm()
        context = {
            'comment_form': comment_form,
            'project_id': project_id,
            'parent_comment_id': parent_comment_id
        }

        return render(request, 'reply.html', context)

    else:
        return HttpResponse("only accept GET/POST request")



