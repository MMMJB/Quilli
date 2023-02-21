import Squire from "squire-rte";
import Coloris from "@melloware/coloris";


Coloris.setInstance(".color-picker", {
    
})


const editor = new Squire(document.querySelector("page"), {
    blockAttributes: {
        style: "font-size: 14px;"
    }
}).focus();

editor.addEventListener("pathChange", _ => {
    const bold = editor.hasFormat("B"),
          italic = editor.hasFormat("I"),
          underline = editor.hasFormat("U");

    const activate = elm => document.querySelector(`.${elm}`).classList.add("active");
    const deactivate = elm => document.querySelector(`.${elm}`).classList.remove("active");
    
    if (bold) activate("bold");
    else deactivate("bold");

    if (italic) activate("italic");
    else deactivate("italic");

    if (underline) activate("underline");
    else deactivate("underline");

    const fs = parseInt(editor.getFontInfo().size);
    if (fs !== fontSize) changeFontSize(fs);

    console.log(editor.hasFormat("align-right"));
})


const bind = (elm, func1, func2) => {
    const elms = document.querySelectorAll(`.${elm}`);

    elms.forEach(e => {
        e.addEventListener("click", _ => {
            if (!e.classList.contains("active")) {
                e.classList.add("active");
                func1();
            } else {
                if (!func2) return;
    
                e.classList.remove("active");
                func2();
            }
        })
    })
}

bind("bold", _ => editor.bold(), _ => editor.removeBold());
bind("italic", _ => editor.italic(), _ => editor.removeItalic());
bind("underline", _ => editor.underline(), _ => editor.removeUnderline());

bind("algn", _ => document.querySelectorAll(".algn").forEach(e => e.classList.remove("active")));
bind("algn.left", _ => editor.setTextAlignment("left"));
bind("algn.center", _ => editor.setTextAlignment("center"));
bind("algn.right", _ => editor.setTextAlignment("right"));
bind("algn.justify", _ => editor.setTextAlignment("justify"));


var fontSize = 14;

const changeFontSize = newVal => {
    fontSize = parseInt(newVal);
    editor.setFontSize(`${newVal}px`);

    document.querySelector(".fontSize-input").value = newVal;
}

document.querySelector(".arrow.up").onclick = _ => changeFontSize(fontSize + 1);
document.querySelector(".arrow.down").onclick = _ => changeFontSize(fontSize - 1);
document.querySelector(".fontSize-input").onblur = e => changeFontSize(e.target.value);
document.querySelector(".fontSize-input").onkeyup = e => {
    if (e.key == "Enter" || e.keyCode == 13) changeFontSize(e.target.value);
}