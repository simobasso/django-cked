from django.db import models
from django import forms

from cked.widgets import CKEditorWidget, MiniCKEditorWidget


class RichTextField(models.TextField):
    def __init__(self, *args, **kwargs):
        super(RichTextField, self).__init__(*args, **kwargs)

    def formfield(self, **kwargs):
        defaults = {
            'form_class': RichTextFormField,
        }
        defaults.update(kwargs)
        return super(RichTextField, self).formfield(**defaults)

class RichTextFormField(forms.fields.Field):
    def __init__(self, *args, **kwargs):
        kwargs.update({'widget': CKEditorWidget()})
        super(RichTextFormField, self).__init__(*args, **kwargs)

class MiniTextField(models.TextField):
    def __init__(self, *args, **kwargs):
        super(MiniTextField, self).__init__(*args, **kwargs)

    def formfield(self, **kwargs):
        defaults = {
            'form_class': MiniTextFormField,
        }
        defaults.update(kwargs)
        return super(MiniTextField, self).formfield(**defaults)

class MiniTextFormField(forms.fields.Field):
    def __init__(self, *args, **kwargs):
        kwargs.update({'widget': MiniCKEditorWidget()})
        super(MiniTextFormField, self).__init__(*args, **kwargs)

# Fix field for South
try:
    from south.modelsinspector import add_introspection_rules
    add_introspection_rules([], ["^cked\.fields\.RichTextField"])
    add_introspection_rules([], ["^cked\.fields\.MiniTextField"])
except:
    pass
