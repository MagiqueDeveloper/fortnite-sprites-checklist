import { Sheet } from './components/Sheet';
import { Toolbar } from './components/Toolbar';
import { useTicks } from './hooks/useTicks';

/** The checklist is the page: progress and print controls, then the A4 sheet. */
export default function App() {
  const { ticks, toggle, reset, saved } = useTicks();

  return (
    <>
      <Toolbar
        ticks={ticks}
        onPrint={() => window.print()}
        onReset={() => {
          if (window.confirm('Clear your Treasure Hunters ticks? Override progress will be kept.')) reset();
        }}
      />
      {!saved && (
        <p className="storage-warning no-print" role="alert">
          Browser storage is unavailable. Your ticks may be lost when you close this page.
        </p>
      )}
      <Sheet ticks={ticks} onToggle={toggle} />
      <footer className="app-note no-print">
        <p>
          Rarities are provisional. Roster and artwork: <a href="https://spritecatch.com/news/treasure-hunters-new-sprites/">Sprite Catch</a>.
        </p>
        <p>
          AI tools assisted with this application’s creation. <a href="https://github.com/MagiqueDeveloper/fortnite-sprites-checklist/blob/main/AI_DISCLOSURE.md">AI use disclosure</a>
          {' · '}<a href="https://github.com/MagiqueDeveloper/fortnite-sprites-checklist">Source code</a>
        </p>
      </footer>
    </>
  );
}
