set shell := ["bash", "-cu"]

default:
    just --list

install:
    cd app && npm install
    cd server && npm install

dev-frontend:
    cd app && npm run dev

dev-backend:
    cd server && npm run dev

check:
    cd app && npx tsc -b --noEmit

test:
    cd app && npm run test

build:
    cd app && npm run build

preview:
    cd app && npm run preview

release: build
    rm -rf release/dist
    cp -r app/dist release/dist
