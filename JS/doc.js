import "./app";

import fonts from "./Config/fonts";
import quillConf from "./Config/quill-conf";
import Quill from "quill";

const Font = Quill.import("formats/font");
Font.whitelist = Array.from(fonts, f => f.toLowerCase().replaceAll(" ", "-"));
Quill.register(Font, true);

const Size = Quill.import("formats/size");
Size.whitelist = Array.from({length: 91}, (_, i) => `${i + 8}px`);
Quill.register(Size, true);

const Parchment = Quill.import("parchment");
const conf = {
    scope: Parchment.Scope.BLOCK,
    whitelist: [1, 1.25, 1.5, 1.75, 2]
}
const lineHeightClass = new Parchment.Attributor.Class("lineheight", "ql-line-height", conf);
const lineHeightStyle = new Parchment.Attributor.Style("lineheight", "line-height", conf);
Parchment.register(lineHeightClass);
Parchment.register(lineHeightStyle);

const editor = new Quill("page", quillConf);

editor.on("editor-change", (delta, oldDelta) => {
    const format = editor.getFormat();

    const activate = elm => document.querySelector(`.${elm}`).classList.add("active");
    const deactivate = elm => document.querySelector(`.${elm}`).classList.remove("active");
    
    if (format.bold) activate("bold");
    else deactivate("bold");

    if (format.italic) activate("italic");
    else deactivate("italic");

    if (format.underline) activate("underline");
    else deactivate("underline");

    const fs = parseInt(editor.getFormat().size) || 13;
    const tfs = parseInt(document.querySelector(".fontSize-input").value);
    if (fs !== tfs) setFontSize(fs);

    const family = format.font || "helvetica";
    const tfamily = document.querySelector(".font .dropdown-item[active]").getAttribute("value");
    if (family !== tfamily) {
        editor.format(family);

        document.querySelector(".font .dropdown-item[active]").removeAttribute("active");
        document.querySelector(`.font .dropdown-item[value="${family}"]`).setAttribute("active", "");
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

bind(".bold", _ => editor.format("bold", true), _ => editor.format("bold", false));
bind(".italic", _ => editor.format("italic", true), _ => editor.format("italic", false));
bind(".underline", _ => editor.format("underline", true), _ => editor.format("underline", false));

bind(".algn", e => {
    const val = e.getAttribute("value");
    editor.format("align", val == "left" ? false : val);
});

bind(".textColor .cs-col", e => editor.format("color", e.getAttribute("value") || false));
document.querySelector(".textColor .cs-col > input[type='color']").oninput = e => editor.format("color", e.target.value);
bind(".highlight .cs-col", e => editor.format("background", e.getAttribute("value") || false));
document.querySelector(".highlight .cs-col > input[type='color']").oninput = e => editor.format("background", e.target.value);

const setFontSize = newVal => {
    const size = `${newVal}px`;

    if (!Size.whitelist.includes(size)) return;

    editor.format("size", size);
    document.querySelector(".fontSize-input").value = newVal;
}, getFontSize = _ => {
    return parseInt(editor.getFormat().size) || 13;
}

document.querySelector(".arrow.up").onclick = _ => setFontSize(getFontSize() + 1);
document.querySelector(".arrow.down").onclick = _ => setFontSize(getFontSize() - 1);
document.querySelector(".fontSize-input").onblur = e => setFontSize(e.target.value);
document.querySelector(".fontSize-input").onkeyup = e => {
    if (e.key == "Enter" || e.keyCode == 13) {
        setFontSize(e.target.value);
        e.target.blur();
    }
}

// document.querySelectorAll(".lineHeight.custom .dropdown-item").forEach(e => {
//     e.onclick = _ => {
//         const mult = parseFloat(e.getAttribute("value"));

//         editEditorStyle("margin-bottom", `${getFontSize() * mult}px`);

//         document.querySelector(".lineHeight.custom .dropdown-item[active]").removeAttribute("active");
//         e.setAttribute("active", "");
//     }
// })


window.addEventListener("load", _ => {
    const fontsList = document.querySelector(".font .dropdown-body");
    
    fonts.forEach(f => {
        const fVar = f.toLowerCase().replaceAll(" ", "-");
        
        fontsList.innerHTML += `<li ${f == "Helvetica" ? "active" : ""} value='${fVar}' class='dropdown-item' style='font-family:var(--${fVar})'>${f}</li>`;
    })

    const fontsListItems = fontsList.querySelectorAll(".dropdown-item");

    fontsListItems.forEach(e => {
        e.onclick = _ => {
            fontsListItems.forEach(e => e.removeAttribute("active"));

            e.setAttribute("active", "");
            editor.format("font", e.getAttribute("value"));
        }
    })


    const customStyles = document.createElement("style");
    document.head.appendChild(customStyles);
    
    const sheet = customStyles.sheet;

    Font.whitelist.forEach(f => {
        sheet.insertRule(
            `.ql-font-${f} {font-family:var(--${f})}`
        , 0);
    })

    Size.whitelist.forEach(s => {
        sheet.insertRule(
            `.ql-size-${s} {font-size:${s}}`
        )
    })
});