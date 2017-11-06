# Front-end DevStudio

This is just a basic setup that can be used to create a proof of concept or test new technologies.
Behind the scene it uses `Webpack`.

### Requirements

- [Docker](http://www.docker.com/products/overview)
- [Docker Compose](https://docs.docker.com/compose/overview/)

### Usage

To start the DevStudio run:
```
$ docker-compose up studio
```
and visit `localhost:8080` on your browser.

To build your assests for production run:
```
$ docker-compose run --rm build
```

And if you need to install new dependencies, enter the container with:
```
$ docker-compose run --rm studio /bin/bash
```

Enjoy :)
