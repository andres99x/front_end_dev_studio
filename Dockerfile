FROM ubuntu:16.04

ENV HOME /root

RUN apt-get update && \
    apt-get install -y \
      build-essential \
      libssl-dev \
      libpq-dev \
      libreadline6-dev \
      curl \
      git-core \
      libffi-dev \
      apt-transport-https && \
    apt-get clean

# Install nvm && Node
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 6.9.1
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.6/install.sh | bash && \
    . $NVM_DIR/nvm.sh && \
    nvm install $NODE_VERSION
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Install Yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && apt-get install -y yarn

# Setup App dir
ENV APP_HOME /var/www
WORKDIR $APP_HOME

ENV PATH $APP_HOME/node_modules/.bin:$PATH

EXPOSE 3000 3001
ENTRYPOINT ["./entrypoint.sh"]
