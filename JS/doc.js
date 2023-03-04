import "./app";

import fonts from "./Util/fonts";
import Squire from "squire-rte";

const page = document.querySelector("page");

const editor = new Squire(document.querySelector("page"), {
    blockAttributes: {
        style: "font-size: 14px;",
        class: "squire-block"
    }
}).focus();

page.addEventListener("DOMNodeInserted", e => {
    if (e.relatedNode !== page) return;

    const pStyle = e.target.previousSibling.getAttribute("style");
    e.target.setAttribute("style", pStyle);
})

page.addEventListener("keydown", e => {
    if (e.key == "Tab") {
        e.preventDefault();

        const block = getCurrentBlock();
        const align = block.style.getPropertyValue("text-align") || "left";
    
        if (align !== "right") {
            const indent = parseInt(block.style.getPropertyValue("padding-left")) || 0;
            block.style.setProperty("padding-left", `${indent + 45}px`);
        } else {
            const indent = parseInt(block.style.getPropertyValue("padding-right")) || 0;
            block.style.setProperty("padding-right", `${indent + 45}px`);
        }
    } else if (e.key == "Backspace") {
        
    }
})

const cssEditable = document.styleSheets[0];
const editorStyle = cssEditable.cssRules[0] || cssEditable.rules[0];
const editEditorStyle = (rule, value) => editorStyle.style.setProperty(rule, value, "important");

const getCurrentBlock = _ => {
    let block = window.getSelection().focusNode;
    
    while (block.nodeType !== 1 || !block.classList.contains("squire-block")) 
        block = block.parentNode;

    return block;
}

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

    const block = getCurrentBlock();
    
    const align = block.style.getPropertyValue("text-align") || "left";
    const talign = document.querySelector(".algn.active").getAttribute("value");
    if (align !== talign) {
        document.querySelector(".algn.active").classList.remove("active");
        document.querySelector(`.algn[value="${align}"]`).classList.add("active");
    }
})


const bind = (elm, func1, func2) => {
    const elms = document.querySelectorAll(elm);

    elms.forEach(e => {
        e.addEventListener("click", _ => {
            if (!e.classList.contains("active")) {
                elms.forEach(e => e.classList.remove("active"));
                e.classList.add("active");

                func1(e);
            } else if (func2) {
                e.classList.remove("active");
                
                func2(e);
            }
        })
    })
}

bind(".bold", _ => editor.bold(), _ => editor.removeBold());
bind(".italic", _ => editor.italic(), _ => editor.removeItalic());
bind(".underline", _ => editor.underline(), _ => editor.removeUnderline());

bind(".algn", e => {
    const val = e.getAttribute("value");
    editor.setTextAlignment(val);
});

bind(".textColor .cs-col", e => editor.setTextColour(e.getAttribute("value")));
document.querySelector(".textColor .cs-col > input[type='color']").oninput = e => editor.setTextColour(e.target.value);
bind(".highlight .cs-col", e => editor.setHighlightColour(e.getAttribute("value")));
document.querySelector(".highlight .cs-col > input[type='color']").oninput = e => editor.setHighlightColour(e.target.value);

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

document.querySelectorAll(".lineHeight.custom .dropdown-item").forEach(e => {
    switch (e.innerText) {
        case "Single":
            editEditorStyle("margin-bottom", "0px");
            break;
        case "Double":
            break;
        case "1.5":
            break;
    }
})


window.addEventListener("load", _ => {
    const fontsList = document.querySelector(".font .dropdown-body");
    
    fonts.forEach(f => {
        const fVar = f.toLowerCase().replaceAll(" ", "-");

        fontsList.innerHTML += `<li ${f == "Roboto" ? "active" : ""} value='${f}' class='dropdown-item' style='font-family:var(--${fVar})'>${f}</li>`;
    })

    const fontsListItems = fontsList.querySelectorAll(".dropdown-item");

    fontsListItems.forEach(e => {
        e.onclick = _ => {
            fontsListItems.forEach(e => e.removeAttribute("active"));

            e.setAttribute("active", "");
            editor.setFontFace(e.innerText);
        }
    })
});