# Cat sitting book

Small website hosted on github pages that teaches peopled what they need to know to be able to look after my cats :)

# Development
## Compressing images

```shell
mogrify -resize 700 src/assets/*
mogrify -quality 40 src/assets/*
du -h src/assets
```