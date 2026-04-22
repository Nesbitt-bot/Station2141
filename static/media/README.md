## Media

Static media files (audio, video, PDFs, downloads) served verbatim from the
site root. A file at `static/media/foo.mp3` is reachable at `/media/foo.mp3`.

For images that should go through Hugo's asset pipeline (resizing,
fingerprinting), prefer `../assets/images/` instead.

For post-specific images, put them in the post's page bundle
(`content/posts/<slug>/`) and reference by filename from front matter.
