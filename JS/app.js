import "./doc";

const SW = 7, SH = 4;
const toolbar = document.getElementById("toolbar");

const updateTBPos = _ => toolbar.style.setProperty("top", `${toolbar.getBoundingClientRect().top}px`);

updateTBPos();
window.onresize = updateTBPos;

document.querySelectorAll("[icon]").forEach(e => {
    const disabled = e.getAttributeNames().includes("disabled");
    
    const s = parseInt(e.getAttribute("icon-size"));  // Assuming square
    const ps = 32, bw = 232, bh = 133;

    const scalar = s / ps;

    const val = parseInt(e.getAttribute("icon"));

    const x = val % SW;
    const y = Math.floor(val / SW)// + (disabled ? 3 : 0);

    const mx = x * s + (x + 1) * scalar;
    const my = y * s + (y + 1) * scalar;

    e.style.setProperty("background-size", `${bw * scalar}px ${bh * scalar + scalar * 1.999}px`);
    e.style.setProperty("background-position", `-${mx}px -${my * 1.003}px`);

    if (getComputedStyle(e).height !== s) e.style.setProperty("height", `${s}px`);
})

document.querySelectorAll("color-select").forEach(e => {
    const colors = [
        [
            "#FF0000",
            "#FFA500",
            "#FFFF00",
            "#00FF00",
            "#00FFFF",
            "#0000FF",
            "#7000B5",
            "#FF00FF"
        ],
        [
            "#FFFFFF",
            "#EAEAEA",
            "#C0C0C0",
            "#808080",
            "#3B3B3B",
            "#000000"
        ]
    ]

    colors.forEach((r, i) => {
        e.innerHTML += `<ul class='cs-row r${i}'></ul>`;
        const container = e.querySelector(`.cs-row.r${i}`);

        r.forEach(c => {
            container.innerHTML += `<li class='cs-col' value="${c}" role="button" style="background-color:${c}"></li>`;
        })

        if (i == colors.length - 1) container.innerHTML += `<li class="cs-col" value="new"><input type="color"></li>`
    })
})

document.querySelectorAll(".ti-cover").forEach(e => e.onclick = _ => e.classList.toggle("active"));

window.onscroll = _ => {
    const page = document.querySelector("page"), header = document.querySelector("header");

    const my = page.getBoundingClientRect().y - header.getBoundingClientRect().bottom + window.scrollY;
    
    if (window.scrollY > my) header.classList.add("shadow");
    else header.classList.remove("shadow");
}