import { asset } from '../lib/asset';

/** Official season artwork, cropped to its visible bounds without altering it. */
export function SeasonLogo() {
  return (
    <svg
      className="season-logo"
      viewBox="243 161 2640 733"
      role="img"
      aria-label="Treasure Hunters"
      focusable="false"
    >
      <image href={asset('branding/treasure-hunters.png')} width="3111" height="1080" />
    </svg>
  );
}
