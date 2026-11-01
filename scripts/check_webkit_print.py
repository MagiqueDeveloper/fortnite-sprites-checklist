#!/usr/bin/env python3
"""Print the served checklist through native WebKitGTK and verify the PDF.

Requires libwebkitgtk-6.0-4, an X display (or xvfb-run), and poppler-utils.
Start `npm run preview` first. No Playwright/browser-emulation dependency is used.
"""
import argparse
import ctypes as C
import json
from pathlib import Path
import re
import subprocess
import sys
import tempfile


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url', default='http://127.0.0.1:4173/')
    parser.add_argument('--output', type=Path)
    args = parser.parse_args()
    with tempfile.TemporaryDirectory() as directory:
        output = args.output or Path(directory) / 'webkit-checklist.pdf'
        output = output.resolve()
        output.parent.mkdir(parents=True, exist_ok=True)
        # An old successful result must never hide a failed print.
        output.unlink(missing_ok=True)
        print_pdf(args.url, output)
        info = subprocess.check_output(['pdfinfo', str(output)], text=True)
        if not re.search(r'^Pages:\s+1$', info, re.M):
            raise RuntimeError('Expected exactly one printed page:\n' + info)
        if not re.search(r'^Page size:.*\(A4\)', info, re.M):
            raise RuntimeError('Expected A4 paper:\n' + info)
        text = subprocess.check_output(['pdftotext', '-layout', str(output), '-'], text=True)
        compact = lambda value: re.sub(r'[^A-Z0-9]', '', value.upper())
        roster = json.loads((Path(__file__).resolve().parents[1] / 'src/data/treasure-hunters.json').read_text())
        for family in roster:
            if compact(family['name']) not in compact(text):
                raise RuntimeError(f'Missing printed family: {family["name"]}')
        if 'Chapter 7' not in text or 'Treasure Hunters' not in text:
            raise RuntimeError('Printed footer is missing')
        print('PASS: native WebKit print is one A4 page, with every family and the footer.')


def print_pdf(url, output):
    pointer, integer, string = C.c_void_p, C.c_int, C.c_char_p
    webkit = C.CDLL('libwebkitgtk-6.0.so.4')
    gtk = C.CDLL('libgtk-4.so.1')
    glib = C.CDLL('libglib-2.0.so.0')
    gobject = C.CDLL('libgobject-2.0.so.0')

    def bind(library, name, result, *arguments):
        function = getattr(library, name)
        function.restype, function.argtypes = result, list(arguments)
        return function

    connect = bind(gobject, 'g_signal_connect_data', C.c_ulong,
                   pointer, string, pointer, pointer, pointer, integer)
    timeout = bind(glib, 'g_timeout_add', C.c_uint, C.c_uint, pointer, pointer)
    quit_loop = bind(glib, 'g_main_loop_quit', None, pointer)
    bind(gtk, 'gtk_init', None)()
    window = bind(gtk, 'gtk_window_new', pointer)()
    view = bind(webkit, 'webkit_web_view_new', pointer)()
    bind(gtk, 'gtk_window_set_child', None, pointer, pointer)(window, view)
    bind(gtk, 'gtk_window_set_default_size', None, pointer, integer, integer)(window, 1200, 1400)
    bind(gtk, 'gtk_window_present', None, pointer)(window)
    loop = bind(glib, 'g_main_loop_new', pointer, pointer, integer)(None, 0)
    errors = []
    operations = []  # Keep native operations alive until their completion signal.
    scheduled = False

    @C.CFUNCTYPE(None, pointer, pointer)
    def finished(_operation, _data):
        quit_loop(loop)

    @C.CFUNCTYPE(None, pointer, pointer, pointer)
    def failed(_operation, error, _data):
        class GError(C.Structure):
            _fields_ = [('domain', C.c_uint), ('code', integer), ('message', string)]
        errors.append(C.cast(error, C.POINTER(GError)).contents.message.decode())
        quit_loop(loop)

    @C.CFUNCTYPE(integer, pointer)
    def expired(_data):
        errors.append('WebKit printing timed out')
        quit_loop(loop)
        return 0

    @C.CFUNCTYPE(integer, pointer)
    def print_document(_data):
        operation = bind(webkit, 'webkit_print_operation_new', pointer, pointer)(view)
        operations.append(operation)
        settings = bind(gtk, 'gtk_print_settings_new', pointer)()
        set_setting = bind(gtk, 'gtk_print_settings_set', None, pointer, string, string)
        for key, value in [('printer', 'Print to File'), ('output-file-format', 'pdf'),
                           ('output-uri', output.as_uri())]:
            set_setting(settings, key.encode(), value.encode())
        bind(webkit, 'webkit_print_operation_set_print_settings', None, pointer, pointer)(operation, settings)
        setup = bind(gtk, 'gtk_page_setup_new', pointer)()
        paper = bind(gtk, 'gtk_paper_size_new', pointer, string)(b'iso_a4')
        bind(gtk, 'gtk_page_setup_set_paper_size', None, pointer, pointer)(setup, paper)
        for edge in ['top', 'bottom', 'left', 'right']:
            # GTK_UNIT_MM = 3; match the application's A4 page margins.
            bind(gtk, f'gtk_page_setup_set_{edge}_margin', None, pointer, C.c_double, integer)(setup, 8, 3)
        bind(webkit, 'webkit_print_operation_set_page_setup', None, pointer, pointer)(operation, setup)
        connect(operation, b'finished', C.cast(finished, pointer), None, None, 0)
        connect(operation, b'failed', C.cast(failed, pointer), None, None, 0)
        bind(webkit, 'webkit_print_operation_print', None, pointer)(operation)
        return 0

    @C.CFUNCTYPE(None, pointer, integer, pointer)
    def loaded(_view, event, _data):
        nonlocal scheduled
        if event == 3 and not scheduled:  # WEBKIT_LOAD_FINISHED
            scheduled = True
            # Allow React, local images, and the sheet-fitting effect to settle.
            timeout(2500, C.cast(print_document, pointer), None)

    connect(view, b'load-changed', C.cast(loaded, pointer), None, None, 0)
    timeout(45000, C.cast(expired, pointer), None)
    bind(webkit, 'webkit_web_view_load_uri', None, pointer, string)(view, url.encode())
    bind(glib, 'g_main_loop_run', None, pointer)(loop)
    if errors:
        raise RuntimeError('; '.join(errors))
    if not output.exists():
        raise RuntimeError('WebKit did not create a PDF')


if __name__ == '__main__':
    try:
        main()
    except (OSError, RuntimeError, subprocess.CalledProcessError) as error:
        print(f'FAIL: {error}', file=sys.stderr)
        sys.exit(1)
