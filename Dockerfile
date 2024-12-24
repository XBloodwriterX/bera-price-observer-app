FROM oven/bun:latest


RUN apt-get update
RUN apt-get install -y chromium xvfb

COPY package.json package.json

RUN bun install

COPY . .

CMD ["bun", "start"]