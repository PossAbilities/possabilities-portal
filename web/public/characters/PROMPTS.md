# PossAbilities portal — character pose pack

Generate each image, remove the background (transparent PNG), and save it into `web/public/characters/` with the exact filename shown. The app falls back to the base picture if a file is missing, so you can add them one at a time.

Use the existing base image of each character as the reference image in every prompt (attach it), and paste the STYLE block after each prompt.

## STYLE (paste after every prompt)

> Flat 2D cartoon in exactly the same style as the reference image: bold black outlines, simple rounded shapes, clean flat colours, no shading, no gradients, no shadows, no texture. Keep the character's face, hair, skin tone, clothes, colours and proportions identical to the reference. Full body, feet visible, standing on nothing. Isolated on a plain white background, nothing else in the image, no text, no props other than those described.

Then remove the white background in Gemini/OpenAI ("make the background transparent") or in Magnific.

## Sizes
- Single characters: portrait, 3:4 (e.g. 768×1024).
- Group pictures: landscape, 2:1 (e.g. 1536×768).

---

## Luca (Learn)

**`luca-reading-aloud.png`** — Luca holding the open blue book in one hand, other hand raised with index finger up as if reading a point out loud, mouth open mid-word, eyebrows up, cheerful. Wearing his yellow headphones.

**`luca-done.png`** — Luca with the blue book closed and tucked under one arm, other arm raised in a big thumbs up, eyes closed with a proud happy grin. Wearing his yellow headphones.

## Orla (News)

**`orla-reading.png`** — Orla holding a folded newspaper open in both hands and reading it, slight smile, head tilted down a little toward the paper. Hair loose (no ponytail, no hair tie). Rainbow t-shirt and blue dungarees as in the reference.

## Eliza (Videos)

**`eliza-listening.png`** — Eliza with her big headphones on, eyes closed, relaxed happy smile, one hand resting on the headphone cup, tablet held loosely at her side. Her prosthetic leg must be clearly visible exactly as in the reference. Add three small curved "music" lines coming from one headphone cup, same bold black outline style.

## Nadia (Groups)

**`nadia-waving-both.png`** — Nadia waving with both hands above her head, mouth open in a joyful laugh. Purple hijab and dress exactly as in the reference.

## Group pictures (2:1)

**`hero-celebrating.png`** — Billy, Luca, Orla, Eliza and Nadia together as close friends, all cheering: arms up, jumping slightly, some with eyes closed laughing, confetti pieces around them (simple flat shapes in the three brand colours: purple #48065A, teal #66CCCC, pink #EC008C). Orla's hair loose. Eliza's prosthetic leg clearly visible. Feet on the same ground line, slight overlap between figures.

**`hero-leaning-in.png`** — The same five friends in a tight huddle, all leaning in toward the camera with heads close together as if crowding round a phone for a selfie, big smiles, one holding the phone at arm's length toward the viewer (phone back facing the viewer, plain). Orla's hair loose. Eliza's prosthetic leg clearly visible. Slight overlap between figures.

---

## Where each one appears
| File | Where |
|---|---|
| luca-reading-aloud | Easy Read reader, while "Read to me" is playing |
| luca-done | Easy Read reader, for 4 seconds after the last step is read |
| orla-reading | Opening a news story |
| eliza-listening | Videos page, while a video is up |
| nadia-waving-both | Groups page (optional extra; not wired yet) |
| hero-celebrating | Home, when there is something new since last visit |
| hero-leaning-in | Groups page featured group card |

---

## Home greeter poses (calendar moments)

One character greets people on Home and rotates each visit. On special days a specific pose takes over. Same STYLE block, 3:4 portrait, transparent.

**`nadia-care.png`** — World Mental Health Day (10 Oct). Nadia holding a warm mug in both hands close to her chest, eyes gently closed, soft contented smile, relaxed shoulders. Purple hijab and dress exactly as reference.

**`luca-proud.png`** — Learning Disability Week (June). Luca standing tall with one fist raised in a confident "yes" pose, big proud smile, blue book under the other arm. Yellow headphones on.

**`orla-pride.png`** — Pride month (June). Orla holding a small rainbow flag on a short stick, waving it above her head, laughing. Hair loose, rainbow t-shirt and blue dungarees as reference.

**`billy-festive.png`** — Christmas week. Billy wearing a simple red bobble hat, holding a wrapped present (plain box, one ribbon), happy grin. Grey t-shirt and dark purple trousers as reference.

**`eliza-party.png`** — New Year. Eliza with a party blower in her mouth, one arm up, three small confetti shapes around her in the three brand colours. Prosthetic leg clearly visible.

Staff can add more days in the `moments` table (date range, character, pose, line) with no code change.
