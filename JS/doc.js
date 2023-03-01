import "./app";

import fonts from "./Util/fonts";
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

    const fs = parseInt(editor.getFontInfo().size);
    const tfs = parseInt(document.querySelector(".fontSize-input").value);
    if (fs !== tfs) setFontSize(fs);

    const family = editor.getFontInfo().family?.split(",")[0].replaceAll('"', "") || "Roboto";
    const tfamily = document.querySelector(".font .dropdown-item[active]").innerText;
    if (family !== tfamily) {
        editor.setFontFace(family);

        document.querySelector(".font .dropdown-item[active]").removeAttribute("active");
        document.querySelector(`.font .dropdown-item[value="${family}"]`).setAttribute("active", "");
    }
})


const selectAll = _ => {
    const range = new Range();
    const page = document.querySelector("page");

    const start = page.querySelector("div");
    const end = page.querySelector("div:last-of-type");

    range.setStartBefore(start);
    range.setEndAfter(end);

    editor.setSelection(range);
}


const bind = (elm, func1, func2) => {
    const elms = document.querySelectorAll(elm);

    elms.forEach(e => {
        e.addEventListener("click", _ => {
            if (!e.classList.contains("active")) {
                e.classList.add("active");
                func1(e);
            } else {
                if (!func2) return;
    
                e.classList.remove("active");
                func2(e);
            }
        })
    })
}

bind(".bold", _ => editor.bold(), _ => editor.removeBold());
bind(".italic", _ => editor.italic(), _ => editor.removeItalic());
bind(".underline", _ => editor.underline(), _ => editor.removeUnderline());

bind(".algn", _ => document.querySelectorAll(".algn").forEach(e => e.classList.remove("active")));
bind(".algn.left", _ => editor.setTextAlignment("left"));
bind(".algn.center", _ => editor.setTextAlignment("center"));
bind(".algn.right", _ => editor.setTextAlignment("right"));
bind(".algn.justify", _ => editor.setTextAlignment("justify"));

bind(".textColor .cs-col", e => editor.setTextColour(e.getAttribute("value")));
bind(".highlight .cs-col", e => editor.setHighlightColour(e.getAttribute("value")));


const setFontSize = newVal => {
    editor.setFontSize(`${newVal}px`);
    document.querySelector(".fontSize-input").value = newVal;
}, getFontSize = _ => {
    return parseInt(editor.getFontInfo().size);
}

document.querySelector(".arrow.up").onclick = _ => setFontSize(getFontSize() + 1);
document.querySelector(".arrow.down").onclick = _ => setFontSize(getFontSize() - 1);
document.querySelector(".fontSize-input").onblur = e => setFontSize(e.target.value);
document.querySelector(".fontSize-input").onkeyup = e => {
    if (e.key == "Enter" || e.keyCode == 13) setFontSize(e.target.value);
}


window.onload = _ => {
    const fontsList = document.querySelector(".font .dropdown-body");
    
    fonts.forEach(f => {
        const fVar = f.toLowerCase().replaceAll(" ", "-");

        fontsList.innerHTML += `<li ${f == "Roboto" ? "active" : ""} value='${f}' class='dropdown-item' role='button' style='font-family:var(--${fVar})'>${f}</li>`;
    })

    const fontsListItems = fontsList.querySelectorAll(".dropdown-item");

    fontsListItems.forEach(e => {
        e.onclick = _ => {
            fontsListItems.forEach(e => e.removeAttribute("active"));

            e.setAttribute("active", "");
            editor.setFontFace(e.innerText);
        }
    })
}


// const setLineHeight = newVal => {
//     selectAll();

//     editor.forEachBlock(e => {
//         e.style.setProperty("margin-bottom", `${newVal || 0}px`);
//     }, true);
// }

// document.querySelector(".lineHeight").onclick = _ => setLineHeight();