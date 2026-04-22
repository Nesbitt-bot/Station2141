## Images

Shared image assets for Station 2141. Files placed here flow through Hugo's
asset pipeline (fingerprinting, resizing, image processing).

### Layout

- `covers/` — shared cover images reusable across posts (reference by path from
  front matter, e.g. `image: "/images/covers/skyline.jpg"` if exposed via
  `static/`, or use resources-based references from templates).
- `posts/` — site-wide post illustrations that are not post-bundle-specific.
- `avatar.*` — sidebar avatar (referenced by `params.sidebar.avatar.src` in
  `hugo.toml`).

### Per-post cover images (preferred)

Stack's `featuredImageField` is set to `image`. For a post-specific cover,
put the file **inside the post bundle** and reference it by filename:

```
content/posts/my-slug/
├── index.en.md          # front matter: image = "cover.jpg"
├── index.zh.md
├── index.ja.md
└── cover.jpg
```

Hugo's page-resource lookup resolves `cover.jpg` relative to the bundle, so
the same filename works for every language variant.

### Other media

For non-image media (audio, video, PDFs), use `../static/media/` so files are
copied verbatim to the site root and can be linked as `/media/<file>`.
