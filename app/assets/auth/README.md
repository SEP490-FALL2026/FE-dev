# Login illustration

`sentry-mascot.png` is an original 1254 × 1254 transparent illustration generated with the built-in image-generation tool for the login reference redesign on 2026-10-30.

The showcase imports this local file. `login.css` references the same file for the blurred background echo. Vite resolves both references to a fingerprinted asset in `build/client/assets`, so the illustration is copied with the client build in Docker and static deployments. No runtime image CDN, local filesystem URL, or untracked generated-images path is required. Keep this directory in source control.

The artwork is decorative (`alt=''`, hidden from assistive technology); the form conveys all required information. The same warm artwork is composed over the project's cream/orange light theme and navy/blue dark theme. Reduced-motion preferences disable the floating animation.

## Generation prompt

Use case: stylized-concept. Asset type: transparent hero illustration for the right side of a SaaS-Sentry sign-in screen. Create one polished playful 3D clay-rendered bird guardian mascot inspired by the attached reference's friendly autumn bird, but an original character. A plump cream-peach little sparrow, large glossy friendly eyes, small orange beak, tiny pink feet, softly outstretched wings, wearing a sculptural vivid burnt-orange pumpkin-shaped cloak with generous rounded fabric folds and a necklace-like collar of large dark chestnut brown wooden beads. A few small floating golden and soft sage leaf shapes around it. Character fills the central 80% of a square composition, three-quarter frontal view, full body entirely in frame, soft premium studio lighting, tactile matte clay and gentle subsurface scattering, beautiful dimensional contact shadows restricted to the character. Background must be genuinely transparent including between floating leaves, suitable over both cream-peach and dark navy UI backgrounds. No panel, no UI, no text, no logos, no watermark. Do not reproduce the reference login screenshot; generate only the isolated mascot illustration.
