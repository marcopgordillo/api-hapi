FROM gitpod/workspace-mongodb

RUN sudo apt-get -q update && sudo apt-get -yq upgrade && \
    sudo apt-get -yq clean && sudo apt-get -yq autoremove && sudo rm -rf /var/lib/apt/lists/*

USER gitpod

#    sudo apt-get install -yq bastet && 
#    sudo rm -rf /var/lib/apt/lists/*

ENV DATABASE_URL=mongodb://localhost:27017 DATABASE_NAME=blog

# Install custom tools, runtime, etc. using apt-get
# For example, the command below would install "bastet" - a command line tetris clone:
#
# RUN sudo apt-get -q update && #     sudo apt-get install -yq bastet && #     sudo rm -rf /var/lib/apt/lists/*
#
# More information: https://www.gitpod.io/docs/42_config_docker/
