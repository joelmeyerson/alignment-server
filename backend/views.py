import threading
import json
from django.http import HttpResponseRedirect, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from rest_framework import generics
from .models import Alignment
from utils.utils import align
from .serializers import AlignmentSerializer

class AlignmentView(generics.ListAPIView):
    queryset = Alignment.objects.all()
    serializer_class = AlignmentSerializer

# React frontend build
def index(request):
    return render(request, "build/index.html")

# not used
def backendView(request):

    all_alignments = Alignment.objects.all()

    return render(request, 'backend.html',
                  {'all_ali': all_alignments}
                  )

# handle POST request from server, process DNA input for alignment
@csrf_exempt
def addAlignmentView(request):

    if request.method == 'POST':

        # dna_seq = request.POST['dna_sequence'] # receive post from vanilla html page in /templates
        dna_seq = request.body.decode('utf-8') # receive POST from React
        dna_seq = dna_seq.strip().rstrip()

        # create database entry
        a = Alignment(
            user="jane_smith", # same user for all entries
            input=dna_seq,
        )
        a.save()

        # start background process to handle alignment
        t = threading.Thread(target=doAlignment, args=[a.id], daemon=True)
        t.start()

        # return HttpResponseRedirect('/backend/')
        return HttpResponse(status=204)


def doAlignment(id):
    a = Alignment.objects.get(pk=id)

    # run alignment
    result = align(a.input)

    # update database entry with results
    a.input_translation = result[0]
    a.protein_sequence = result[1]
    a.protein_product = result[2]
    a.protein_id = result[3]
    a.position = result[4] - 1
    a.job_complete = True

    a.save(update_fields=[
        'input_translation',
        'protein_sequence',
        'protein_product',
        'protein_id',
        'position',
        'job_complete',
    ])
