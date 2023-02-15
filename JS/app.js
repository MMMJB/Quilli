import "./doc";

const SW = 7, SH = 4;

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

window.onscroll = _ => {
    const page = document.querySelector("page"), header = document.querySelector("header");

    const my = page.getBoundingClientRect().y - header.getBoundingClientRect().bottom + window.scrollY;
    
    if (window.scrollY > my) header.classList.add("shadow");
    else header.classList.remove("shadow");
}