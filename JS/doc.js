import Squire from "squire-rte";

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


document.querySelector(".fontSize-input").onblur = e => editor.setFontSize(`${e.target.value}px`);