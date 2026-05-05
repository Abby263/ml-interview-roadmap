# /video-editor

This is a reserved workflow for future Remotion-based video automation. It is
documented here because the project operating model supports specialized slash
commands, but the current repo does not include Remotion or media-processing
dependencies.

## Current Status

- Disabled by default.
- Do not claim this workflow works until Remotion, captioning, audio, and export
  dependencies are intentionally added.
- Do not install media tooling as part of normal web-app changes.

## Future Workflow

1. Accept a rough camera file and editing brief.
2. Generate a Remotion composition.
3. Add captions, jump cuts, overlays, and sound effects.
4. Render a draft.
5. Verify output visually before exporting final media.

## Stop Conditions

- Missing source media.
- No explicit user approval to add video dependencies.
- Output was not rendered and visually verified.
