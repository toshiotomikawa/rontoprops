# Ronto Props

One-page portfolio for Ronto Props, a maker of 3D-printed cosplay props. Live at [rontoprops.vercel.app](https://rontoprops.vercel.app).

Plain HTML, CSS and JavaScript. The only build step makes responsive WebP sizes of the gallery photos with `sharp`.

## Photos

The gallery photos and logo belong to Ronto Props and are not in this repository. `npm run build` copies them in from a private repository: locally from `../PrivateHub` (or `PRIVATE_HUB_DIR`), and on Vercel by cloning it with a read-only `HUB_TOKEN`.

## Run locally

```
npm install
npm run build
python3 -m http.server 8788
```

The font is Montserrat, under the SIL Open Font License (`assets/fonts/OFL.txt`).
