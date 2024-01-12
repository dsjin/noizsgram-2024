# Docker Command

## Docker Build & Create 

```bash
# Dev Compose File
$ docker compose -f ./docker_compose.dev.yml --env-file ../.env create
```

## Docker Start 

```bash
# Dev Compose File
$ docker compose -f ./docker_compose.dev.yml --env-file ../.env start
```
## Docker Stop 

```bash
# Dev Compose File
$ docker compose -f ./docker_compose.dev.yml --env-file ../.env stop
```

## Docker Tear Down 

```bash
# Dev Compose File
$ docker compose -f ./docker_compose.dev.yml -e ../.env down
```
