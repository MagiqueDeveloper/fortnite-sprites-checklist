import test from "node:test";
import assert from "node:assert/strict";
import { sanitizeTicks, toggleTick } from "../src/lib/progress.ts";

test("rejects malformed storage, foreign ids, and truthy non-booleans", () => {
  for (const bad of [null, [], "bad", 3])
    assert.deepEqual(sanitizeTicks(bad, ["chester__base"]), {});
  assert.deepEqual(
    sanitizeTicks(
      { old__base: { f: true }, chester__base: { f: "true", m: 1 } },
      ["chester__base"],
    ),
    {},
  );
});
test("restored mastery implies found and preserves valid season ids only", () => {
  assert.deepEqual(
    sanitizeTicks({ chester__base: { m: true }, old__base: { f: true } }, [
      "chester__base",
    ]),
    { chester__base: { f: true, m: true } },
  );
});
test("mastering finds a Sprite, clearing found clears mastery", () => {
  const mastered = toggleTick({}, "chester__base", "m");
  assert.deepEqual(mastered.chester__base, { m: true, f: true });
  assert.deepEqual(toggleTick(mastered, "chester__base", "f").chester__base, {
    m: false,
    f: false,
  });
});
test("clearing mastery preserves found and leaves other Sprites alone", () => {
  const ticks = { a: { f: true, m: true }, b: { f: true } };
  assert.deepEqual(toggleTick(ticks, "a", "m"), {
    a: { f: true, m: false },
    b: { f: true },
  });
  assert.equal(ticks.a.m, true);
});
