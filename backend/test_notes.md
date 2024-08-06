# Desert Island Docker

"which 3 Docker Images would you bring up a desert island?"

Also won't be advanced

## What's Docker?

- LIKE a virtual machine
  - but too many things
  - also can't boot more than 1
- Docker is between PC and VM

## Python Image

- image similar to a mold / cookie cutter
- container similar to cookie
- image from registry (E.g Docker Hub)

### Mechanics

- pull image then run
- pull
  - series of steps
  - corresponds to layers
- run
  - nothing back?
  - not interactive by default
- tags
  - specify which version of the image
  - e.g. have to run python 2
  - can pull python 2 Docker image

### Containers are Sealed

- can punch holes
- mount (-v) files 
- port (-p) to expose

### Tags

- have many
- check OS
- check size requirements
  - alpine: real small

## Jupyter

- eg jupyter/minimal-notebook
- need to mount $(pwd)
- have to expose port 8888
- works, but no modules

### Dockerfile

- build in top of your own 

FROM jupyter/minimal-notebook
RUN pip install numpy

## Tensorflow

- hard to config
- easy for CPU
- more legwork for GPU
 - just check it's there
 - then tell docker how many GPUs it can use

## Q&A

- architecture of computers matter?
  - yes
  - pick right image tag
  - much better than installing Tensorflow yourself
- not run pull before run?
  - does it if image isn't there
