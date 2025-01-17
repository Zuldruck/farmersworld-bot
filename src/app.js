import query from "./service/wax-query.js";
import work from "./work.js";
import plant from "./plant.js";
import membership from "./membership.js";
import logs from "./log.js";
import express from "express";
import { createRequire } from "module";
import { WALLET, PORT } from "./environment.js";
const require = createRequire(import.meta.url);
const app = express();
const port = PORT || 3000;

function highlight(r) {
    return r
        // txid
        .replace(/([A-Fa-f0-9]{64,})/g, '<a href="https://wax.bloks.io/transaction/$1" target="_blank"><font color="#4183c4">$1</font></a>')
        // wallet
        .replace(
            /wallet \s([^\.]{12})/g,
            '<a href="https://wax.bloks.io/account/$1" target="_blank"><font color="red">$1</font></a>'
        )
        .replace(
            /\s([0-9a-zA-Z\.]{4,5}\.wam)/g,
            '<a href="https://wax.bloks.io/account/$1" target="_blank"><font color="red">$1</font></a>'
        )
        // datetime
        .replace(/(\d(.+)(A|P)M\sGMT\+\d\d?)/g, '<font color="blue">$1</font>')
        // asset_id
        .replace(
            /(\s|^)([0-9]{13,14})(\s|$)/g,
            '<a href="https://wax.bloks.io/nft/$2" target="_blank"> <font color="red">$2</font> </a>'
        )
        // number
        .replace(/(\s|^)(\-?[0-9\.]+)(\s|$)/g, ' <font color="green">$2</font> ');
}

async function getHeader() {
    let headers = [];
    const data = await query({
        json: true,
        code: "farmersworld",
        scope: "farmersworld",
        table: "accounts",
        lower_bound: WALLET,
        upper_bound: WALLET,
        index_position: 1,
        key_type: "",
        limit: "100",
        reverse: false,
        show_payer: false,
    });

    if (data.rows.length === 0) return;

    headers.push(
        `<font color="blue">${
            WALLET
        }</font> ${data.rows[0].balances.join(" - ")}`
    );

    headers.push(`<p style="margin-top:2px;">energy: ${data.rows[0].energy}/${data.rows[0].max_energy}</p>`);

    headers = headers.map((r) =>
        r.replace(/\s([0-9\.]{1,10})/g, ' <font color="green">$1</font>')
    );

    return headers.join("<br>");
}

app.get("/", async (req, res) => {
    let header = "";
    try {
        header = await getHeader();
    }
    catch {}

    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="refresh" content="300">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Farmers World Bot</title>
    <style>pre{font-size: 14px}a{text-decoration: none}h4{color:#697f22;}</style>
</head>
<body>
    <h4>${header}</h4>
    <pre>${logs.map((r) => highlight(r)).join("\n")}</pre>
</body>
</html>`);
});

app.listen(port, () => {
    console.log(`Application listening on port ${port}`);
});

work();
plant();
membership();
