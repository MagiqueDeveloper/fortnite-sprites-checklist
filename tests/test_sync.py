import importlib.util
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('sync', ROOT / 'scripts/sync_sprites.py')
sync = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sync)

class SyncTests(unittest.TestCase):
    def setUp(self):
        self.html = (ROOT / 'tests/fixtures/treasure-hunters.html').read_text()
    def test_launch_roster_has_31_forms_and_single_sweet_dreams(self):
        rows = sync.parse_roster(self.html)
        self.assertEqual(len(rows), 11)
        self.assertEqual(sum(len(f['variants']) for f in rows), 31)
        self.assertEqual(next(f for f in rows if f['id']=='sweet-dreams')['variants'], ['base'])
    def test_unknown_variants_and_truncated_upstream_fail(self):
        for html in [self.html.replace('Base, Cursed, Fortune', 'Base, Unknown'), '<table></table>']:
            with self.assertRaises(ValueError): sync.parse_roster(html)
    def test_missing_art_fails_instead_of_creating_broken_paths(self):
        with self.assertRaises(ValueError):
            sync.image_urls('', {'id':'chester','variants':['base','fortune','cursed']})
    def test_every_committed_roster_image_exists_and_is_valid(self):
        from PIL import Image
        rows = json.loads((ROOT / 'src/data/treasure-hunters.json').read_text())
        ids = []
        for family in rows:
            self.assertEqual(len(family['variants']),len(family['imgs']))
            for variant, path in zip(family['variants'],family['imgs']):
                ids.append(f'{family["id"]}__{variant}')
                self.assertTrue(path.startswith(f'sprites/{family["id"]}/'))
                with Image.open(ROOT / 'public' / path) as image:
                    self.assertEqual(image.size,(150,150)); image.verify()
        self.assertEqual(len(ids),len(set(ids)))
