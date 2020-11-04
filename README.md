# Cabin client script

This is the client script for [withcabin.com](https://withcabin.com) - Privacy-first, carbon-aware web analytics.

The script is accessible via CDN at https://scripts.withcabin.com/hello.js

`yart dev` - run a dev server and visit localhost:8000 to test the script locally

`yarn min` - minify the script to `/dist` with [terser](https://github.com/terser/terser)

`yarn deploy` - upload to s3

`yarn invalidate` - invalidate all CDN caches
