# cog-map
This project enables users to view any [Cloud Optimized GeoTIFF](http://cogeo.org) (COG) posted online. Works out of the box with 3-band RGB data.

Available for use at https://cholmes.github.io/cog-map/

The URL hash is updated with the COG URL and map location, so you can 'share' the URL with anyone. Though there's a bug right now where it will double encode the URL when you share it, preventing repeated sharing.

I'm not a javascript coder, so this is mostly going to be my flailing around for awhile. But my goal is to make an openlayers map that lets you add any online cloud optimized geotiff (COG), and then share the results with others.

The tiling server is [Lambda Tiler](https://github.com/vincentsarago/lambda-tiler) an easy to use AWS Lambda distribution of [Rio Tiler](https://github.com/mapbox/rio-tiler). Big thanks to [Vincent Sarago](https://twitter.com/_VincentS_) for packaging it up and helping me out lots.

Thanks also to Amazon for Earth on AWS Research Credits. Anyone is welcome to use the tiling service. Once I figure out how to get it on a nicer DNS I'll document it for easier use.
