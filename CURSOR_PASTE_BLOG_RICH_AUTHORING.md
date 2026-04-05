# Cursor paste: replicate rich blog authoring (TipTap + htmlBody)

**How to use in the other project**

1. Open this file in your editor, select **all** (Ctrl+A), copy.
2. In Cursor for the **target** repository, paste into **Composer / Agent** (or a new chat) as the **first message**, and add one line of context, for example:  
   `Implement the following in this codebase. Adapt paths, locale keys, and upload API to match this project.`
3. Let Cursor map files to your folder structure; point it at your existing blog model and admin page if needed.

---

## Objective

Implement **multi-locale WYSIWYG blog bodies** as **HTML strings** (`htmlBody` per locale), **preferred over** any legacy block/array format when non-empty. Stack: **TipTap v3**, **resizable images** with **blob preview during upload**, **public HTML sanitization** with **image dimensions preserved**, **Tailwind v4** + **`@tailwindcss/typography`**, and **explicit heading CSS** so titles never look like body text.

---

## 1. Data model and persistence

- Extend the blog/post type with:

  `htmlBody?: Record<YourLocale, string>` (e.g. `nl`, `no`, `de` or your own keys).

- On **read/write** of stored JSON, **normalize** `htmlBody` so every locale key exists (default `""`).

- **Public rule:** Resolve active locale, then:

  - If `trim(htmlBody[resolvedLocale] ?? fallbackChain) !== ""` → render **sanitized HTML** inside a typography wrapper.

  - Else → keep existing **block/legacy** renderer.

- **Admin rule:** Bind the rich editor to `htmlBody[activeLocale]` (optional: “mirror all locales” checkbox that writes the same HTML to every key).

---

## 2. Dependencies to install

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-text-align @tiptap/extension-underline @tiptap/extension-placeholder @tiptap/pm isomorphic-dompurify
npm install -D @tailwindcss/typography
```

Use **compatible major versions** of all `@tiptap/*` packages (same as `@tiptap/react`). TipTap **v3** uses `BubbleMenu` from **`@tiptap/react/menus`**, not the main `@tiptap/react` export.

---

## 3. Sanitizer (critical: keep img width/height)

Create something like `lib/utils/sanitize-blog-html.ts`. DOMPurify **strips** `width`/`height` on `<img>` unless they are listed in **`ADD_URI_SAFE_ATTR`**.

```typescript
import DOMPurify from "isomorphic-dompurify";

export function sanitizeBlogHtml(html: string): string {
  if (!html?.trim()) return "";
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ["target", "rel", "class", "style", "src", "alt", "href", "width", "height"],
    ADD_URI_SAFE_ATTR: ["width", "height"],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|\/)/i,
  });
}
```

Use this output **only** in `dangerouslySetInnerHTML` on the **public** post page (and anywhere else untrusted admin HTML is shown).

---

## 4. Tailwind v4 + typography + headings

In **global** CSS (e.g. `app/globals.css`):

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
```

Without `@plugin "@tailwindcss/typography"`, **`prose` does almost nothing** in Tailwind v4.

**Do not rely only on** `prose-h1:text-3xl` etc.: they can **tie** with `.prose :where(h1)` in source order. Add **unlayered** rules **after** the Tailwind import (outside `@layer`) for:

- `.blog-html-content h1` … `h6` (font family, `clamp()` sizes, weight, color, margins, `:first-child` margin reset)

- Mirror the same selectors for **`.blog-rich-editor-root .ProseMirror h1`…`h6`** so the admin preview matches the site.

Public wrapper example:

```tsx
<div className="blog-html-content prose prose-slate max-w-none prose-p:text-[15px] prose-p:leading-7 prose-a:text-violet-700 prose-img:rounded-lg">
  {safeHtml ? <div dangerouslySetInnerHTML={{ __html: safeHtml }} /> : /* legacy blocks */ null}
</div>
```

Adjust utility classes to your design tokens.

---

## 5. Custom TipTap image extension

Extend `@tiptap/extension-image`:

- `resize: { enabled: true, minWidth: 100, minHeight: 72, alwaysPreserveAspectRatio: true }`

- `HTMLAttributes` on `<img>`: prefer only e.g. `rounded-lg` — avoid `h-auto max-w-full` on the node if it fights resize.

- **Attributes** for uploads (must have `parseHTML` + `renderHTML` so they survive `setContent(getHTML())`):

  - `uploadMarker` ↔ `data-upload-marker`

  - `dataUploading` ↔ `data-uploading`

- **`addNodeView`:** call the **parent** `addNodeView` factory, then wrap `nodeView.update`: after a successful update, `querySelector("img")` and set `style.width` / `style.height` from `node.attrs` (remove properties when attrs are null). Apply once after initial create too. This fixes resize handles and bubble preset sizes not sticking in the DOM.

---

## 6. Rich text editor component (React)

- `useEditor({ immediatelyRender: false, content: html, extensions: [...], editorProps: { attributes: { class: "prose ... blog-rich-editor-root ..." } }, onUpdate: ({ editor }) => { ... } }, **[]**)` — dependency array **must be empty**.

- **`editorRef`** = `useRef<Editor | null>(null)`; set in `onCreate` / clear in `onDestroy`.

- **`onHtmlChangeRef`**, **`insertImageWithLocalPreviewRef`**: assign `.current` each render; `onUpdate` calls `onHtmlChangeRef.current(editor.getHTML())`.

- **`lastEmittedHtmlRef`:** in `useEffect`, when parent `html` prop changes: if `html === lastEmittedHtmlRef.current` skip; if `html === editor.getHTML()` sync ref and skip; else `setContent(html, { emitUpdate: false })` and update ref. Prevents loops and focus loss.

- **Extensions:** StarterKit with `heading: { levels: [1, 2, 3] }`, Underline, Link (`openOnClick: false`, `autolink: true`, `HTMLAttributes` for class/rel/target), TextAlign on `["heading","paragraph"]`, Placeholder, your custom Image extension.

- **BubbleMenu** from `@tiptap/react/menus`: `shouldShow` when selection is `NodeSelection` and `node.type.name === "image"`. Buttons: `updateAttributes("image", { width: 280|480|720, height: null })`, clear both for “full”, delete selection for remove.

- **Insert image:** hidden file input; on file, `URL.createObjectURL`, insert image node with `src: blobUrl`, `uploadMarker`, `dataUploading: "true"`, then `async` upload. After `await`, use **`editorRef.current`**, find position by **`node.attrs.src === blobUrl`** (fallback: marker), `updateAttributes` with final `src`, clear marker/`dataUploading`, `revokeObjectURL`.

- **Paste:** `editorProps.handlePaste` — if clipboard contains an image file, prevent default, insert via same pipeline, return true.

- **Toolbar:** sticky wrapper (`sticky top-* z-40`, backdrop blur as desired). **If a parent uses Framer Motion with `y` transform**, sticky breaks — use **opacity-only** animation on that parent.

---

## 7. Editor CSS (separate file)

Scope under `.blog-rich-editor-root`:

- `.ProseMirror` min-height, focus ring, basic link styles.

- For **resizable** images: target `[data-resize-container][data-node="image"]` and inner `img` — `max-width: 100%`, wrapper `min-width: 0`, **do not** use a global `.ProseMirror img { height: auto }` that overrides inline resize.

- `img[data-uploading="true"]` visible outline/state.

---

## 8. Optional: import legacy blocks → HTML

If you have legacy blocks, add a one-way converter to HTML for the active locale (headings → `<hN>`, paragraphs with optional `text-align` style, lists, blockquotes, images with `src`/`alt`). Call it before switching the user to “simple” mode.

---

## 9. Security checklist

- [ ] All public rendering of admin HTML goes through the sanitizer.

- [ ] `ALLOWED_URI_REGEXP` blocks `javascript:` and unexpected schemes.

- [ ] Upload API validates type/size; stored URLs are https or your allowed CDN path.

- [ ] Admin routes stay behind auth.

---

## 10. Smoke tests after implementation

1. Type continuously in the editor — **no** focus loss after one character.

2. Insert image — **blob** shows immediately; after upload, image **stays** with final URL.

3. Resize image (handles + bubble S/M/L); save; open **public** post — **size matches** (inspect `<img width height>` or inline styles in saved HTML).

4. Apply H1/H2/H3 — public page shows **large** headings, not body-sized text.

5. Sticky toolbar stays sticky while scrolling the admin section.

---

## 11. Deliverables Cursor should produce

- Types + persistence changes for `htmlBody`.

- `sanitizeBlogHtml` module and its use on the public post page.

- Global CSS: `@plugin "@tailwindcss/typography"` + `.blog-html-content` / editor heading rules.

- Custom image extension file.

- `BlogRichTextEditor` (or equivalent) + integration in your blog admin form.

- Editor CSS file + wrapper class on the editor root.

Brief summary comment in PR or commit message listing the above.

---

*This file is self-contained: you do not need the original repository open to use it. For deeper background, see `BLOG_RICH_AUTHORING.md` in the reference implementation repo.*
