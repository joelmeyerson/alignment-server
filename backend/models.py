from django.db import models

class Alignment(models.Model):
    '''
    Database model for sequence alignment.
    '''

    user = models.TextField()
    input = models.TextField()
    input_translation = models.TextField(blank=True)
    protein_sequence = models.TextField(blank=True)
    protein_product = models.TextField(blank=True)
    protein_id = models.TextField(blank=True)
    position = models.IntegerField(default=-1) # position where query was found in protein
    job_complete = models.BooleanField(default=False)
