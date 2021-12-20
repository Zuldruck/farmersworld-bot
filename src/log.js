const orgLog = console.log;
const logs = [];
const MAX_LINES = 200;
import { createRequire } from "module";
const require = createRequire(import.meta.url);

function nowAsString() {
    return new Date()
        .toLocaleString("en-US", {
            timeZoneName: "short",
            timeZone: "Europe/Paris",
            hour12: false,
        })
        .replace(
            /(\d?\d\/\d?\d\/\d{4})\,\s(\d{1,2}\:\d{1,2}\:\d{1,2})\sGMT\+\d/,
            "$2"
        );
}

console.log = function (...oths) {
    oths.unshift(`[${nowAsString()}]`);
    orgLog(...oths);
    logs.unshift(oths.join(" "));

    if (logs.length > MAX_LINES) logs.pop();
};

export default logs;
