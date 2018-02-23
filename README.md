# Cloud Optimized GeoTIFF Map (cog map)
This project enables users to view any [Cloud Optimized GeoTIFF](http://cogeo.org) (COG) posted online. Works out of the box with 3-band RGB data, more advanced data is hopefully coming soon.

Available for use at https://cholmes.github.io/cog-map/

## Using the online map

![cog__map](https://user-images.githubusercontent.com/407017/36583019-a9dad530-1828-11e8-9dc5-b4e4734473a6.png)
[view online](https://cholmes.github.io/cog-map/#/url/http%3A%2F%2Foin-hotosm.s3.amazonaws.com%2F59c66c5223c8440011d7b1e4%2F0%2F7ad397c0-bba2-4f98-a08a-931ec3a6e943.tif/center/-63.04669,18.02599/zoom/18.9)

The URL hash is updated with the COG URL and map location, so you can 'share' the URL with anyone. Though there's a bug right 
now where it will double encode the URL when you share it, preventing repeated sharing.

## Installation and Running

If you want to clone the project and start developing against it, or just run your own, installation is pretty simple. You 
need to have [Node and NPM](https://www.npmjs.com/get-npm) installed, and then you just clone this repo, go to the root and type:

```npm install```

This _should_ install all the dependencies (unless of course I forgot some global dependencies - please file an issue if you have errors, or even just let me know that it works). A key one is [parcel](https://parceljs.org/) which builds the application and updates it on the fly as you edit files. It's quite cool. 

To run the project locally, using parcel, just type:

```npm start```

This will compile it and start a server that makes it available at http://localhost:1234. And if you edit the html or javascript files it will update things automatically.

### Distributing

If you would like to put your own copy of cog map on your website then there are two routes. If you would like it exactly as 
it is online at http://cholmes.github.io/cog-map you can just switch to the 'gh-pages' branch of this repo can copy it. 

If you'd like to customize the code or html at all then you can use the build script:

```npm run-script build```

This will create a ```dist/``` directory, and you can then copy that to a server. If it's not quite right you then check the 
parcel [production](https://parceljs.org/production.html) page, and just modify the package.json file in the 'build' section 
to have the parameters you want.

## Contributing

The goal of this project is to help demonstrate the potential of Cloud Optimized GeoTIFF's, and to eventually make it so the 
[cogeo.org](http://cogeo.org) has this tool available right on the homepage. This is my first coding project in over a decade, 
and my first javascript coding project ever, so this is mostly going to be me flailing around for awhile. But I love the 
collaboration of open source and building things with other people, so if you want to help out I'd love contributions. If 
you're an expert coder that's awesome, and would even just love suggestions of how to tackle issues. If you've wanted to learn 
javascript you're also welcome to flail around with. Check the [issues](https://github.com/cholmes/cog-map/issues) for ways to help out.

## Credits

The tiling server is [Lambda Tiler](https://github.com/vincentsarago/lambda-tiler) an easy to use AWS Lambda distribution of 
[Rio Tiler](https://github.com/mapbox/rio-tiler). Thanks to [Vincent Sarago](https://github.com/vincentsarago) for packaging it up and helping me out lots.

Thanks to my Javascript guru's - [Tim Schaub](http://github.com/tschaub) for getting me started and particularly for supplying the [parcel + openlayers start script](https://gist.github.com/tschaub/8ace58718ab14df8a9b08be68f6b832c), plus leading [OpenLayers](http://openlayers.org) and writing the [hashed](http://github.com/tschaub) library. And thanks to [Jared Easterday](https://github.com/Jiert) and [Orestis Herodotou](https://github.com/digitaltopo) for your patience in spending time with me to help me understand more of the javascripts basics.

Thanks also to Amazon for [Earth on AWS Research Credits](https://aws.amazon.com/earth/research-credits/). Anyone is welcome to use the tiling service, as they want to help promote Cloud Optimized GeoTIFF usage. Once I figure out how to get it on a nicer DNS I'll document it for easier use.
