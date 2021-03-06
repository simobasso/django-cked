from django import forms
from django.conf import settings
from django.core.urlresolvers import reverse
from django.template.loader import render_to_string
from django.utils.encoding import force_unicode
from django.utils.html import conditional_escape
from django.utils.safestring import mark_safe
from django.core.urlresolvers import reverse

from django.core.exceptions import ImproperlyConfigured
from django.forms.util import flatatt

try:
    import json
except ImportError:
    from django.utils import simplejson as json

from cked import default_settings


json_encode = json.JSONEncoder().encode


class CKEditorWidget(forms.Textarea):
    """
Widget providing CKEditor for Rich Text Editing.
"""
    class Media:
        js = (settings.STATIC_URL + 'cked/ckeditor/ckeditor.js',)

    def __init__(self, *args, **kwargs):
        config_name = kwargs.pop('config_name', 'default')
        super(CKEditorWidget, self).__init__(*args, **kwargs)
        # Use default config
        self.options = default_settings.CKEDITOR_DEFAULT_OPTIONS.copy()

        # If CKEDITOR_OPTIONS presented in settings, use it!
        general_options = getattr(settings, 'CKEDITOR_OPTIONS', None)

        if general_options and config_name in general_options:
            options = general_options[config_name]
        else:
            options = None

        if options is not None:
            if isinstance(options, dict):
                # Override defaults with CKEDITOR_OPTIONS.
                self.options.update(options)
            else:
                raise ImproperlyConfigured('CKEDITOR_OPTIONS setting must be'
                                           ' a dictionary type.')

    def render(self, name, value, attrs={}):
        if value is None:
            value = ''

        final_attrs = self.build_attrs(attrs, name=name)

        self.options['filebrowserBrowseUrl'] = reverse('cked_elfinder')

        return mark_safe(render_to_string('cked/ckeditor.html', {
            'final_attrs': flatatt(final_attrs),
            'value': conditional_escape(force_unicode(value)),
            'id': final_attrs['id'],
            'options': json_encode(self.options)})
        )

class MiniCKEditorWidget(CKEditorWidget):
    """
    Widget providing CKEditor for mini Text Editing.
    """
    def __init__(self, *args, **kwargs):
        config_name = kwargs.pop('config_name', 'mini')
        super(MiniCKEditorWidget, self).__init__(*args, **kwargs)
        # Use default config
        self.options = default_settings.CKEDITOR_MINI_OPTIONS.copy()

        # If CKEDITOR_OPTIONS presented in settings, use it!
        general_options = getattr(settings, 'CKEDITOR_OPTIONS', None)

        if general_options and config_name in general_options:
            options = general_options[config_name]
        else:
            options = None

        if options is not None:
            if isinstance(options, dict):
                # Override defaults with CKEDITOR_OPTIONS.
                self.options.update(options)
            else:
                raise ImproperlyConfigured('CKEDITOR_OPTIONS setting must be'
                                           ' a dictionary type.')

    def render(self, name, value, attrs={}):
        if value is None:
            value = ''

        final_attrs = self.build_attrs(attrs, name=name)

        self.options['filebrowserBrowseUrl'] = reverse('cked_elfinder')

        return mark_safe(render_to_string('cked/ckeditor_mini.html', {
            'final_attrs': flatatt(final_attrs),
            'value': conditional_escape(force_unicode(value)),
            'id': final_attrs['id'],
            'options': json_encode(self.options)})
        )
