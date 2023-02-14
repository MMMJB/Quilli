import Squire from "squire-rte";

const editor = new Squire(document.querySelector("page"), {
    blockAttributes: {
        style: "font-size: 14px;"
    }
}).focus();

editor.addEventListener("pathChange", _ => {
    if (editor.hasFormat("B")) console.log("Bold");
    else if (editor.hasFormat("I")) console.log("italic");
    else if (editor.hasFormat("U")) console.log("underlined");
})