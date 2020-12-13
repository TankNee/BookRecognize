<h2 align="center">Book Recognize System</h2>

## How To Use

First of all, you are supposed to clone this repository

```bash
git clone https://github.com/TankNee/BookRecognize.git
cd ./BookRecognize
```

Then, you should configure this project:

```bash
mkdir -p ./resources/upload/image
vim .env
```

There is a simple configuration:

```plain

# Note we depend on NODE_ENV being set to dictate which of the env variables below get loaded at runtime.
# See README for more details.

# Put lots of randomness in these
SESSION_SECRET=

# Application Port - express server listens on this port (default 3000).
PORT=1847

# Application Programing Interface Version Number
API_VERSION=v1

# AliYun Application Key and Secret
ACCESS_KEY=
ACCESS_KEY_SECRET=

# OSS Bucket Name
BUCKET_NAME=

# Dou Ban Configuration
COOKIE=
USER_AGENT=
```

Morever, install the dependencies:

```bash
npm install
```

Run scripts

```bash 
npm run build # generate js folder
npm run debug
```


