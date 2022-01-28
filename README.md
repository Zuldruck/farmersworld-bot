# farmersworld-bot
A tool for [farmersworld](https://play.farmersworld.io/)

#### Note:
- It doesn't work with accounts that managed by [WAX Cloud Wallet](https://wallet.wax.io/). So, You should be use [anchor wallet](https://greymass.com/anchor/) to create your account.

## Setup
1. Install nodejs latest version download
[here](https://nodejs.org/en/download/current/)

2. Clone this repo and install requirements
```js
git clone https://github.com/Zuldruck/farmersworld-bot.git
cd farmersworld-bot
npm install
```

3. Configure your farmersworld account by creating a `.env`. If you need it, a `.env.example` is available.

#### Note:
- `WITHDRAWABLE` is a comma-separated list of the assets you want to withdraw as soon as `MINIMUM_FEE` is reached

## Run
- run command then open http://localhost:3000 and enjoy it
```js
npm start
```
