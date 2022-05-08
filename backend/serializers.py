from rest_framework import serializers
from .models import Alignment


class AlignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alignment
        fields = (
            'id',
            'user',
            'input',
            'input_translation',
            'protein_sequence',
            'protein_product',
            'protein_id',
            'position',
            'job_complete',
        )
