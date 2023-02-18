import Squire from "squire-rte";

const editor = new Squire(document.querySelector("page"), {
    blockAttributes: {
        style: "font-size: 14px;"
    }
}).focus();

editor.addEventListener("pathChange", _ => {
    const bold = editor.hasFormat("B"),
          italic = editor.hasFormat("I"),
          underlined = editor.hasFormat("U");
    
    if (bold) console.log("bold");
    if (italic) console.log("italic");
    if (underlined) console.log("underlined");
    
    if (!bold && !italic && !underlined) console.log("clear")
})