document.querySelectorAll("[icon]").forEach(e => {
    const disabled = e.getAttributeNames().includes("disabled");
    
    const s = e.getBoundingClientRect().height; // Assuming square
    const ps = 32, bw = 232, bh = 199;

    const scalar = s / ps;
    const box = scalar * ps;

    const val = parseInt(e.getAttribute("icon"));

    const x = val % 7;
    const y = Math.floor(val / 7) + (disabled ? 3 : 0);

    const xs = `-${x * box + x * scalar + scalar}px`;
    const ys = `-${y * box + y * scalar + scalar}px`;

    e.style.setProperty("background-size", `${bw * scalar}px ${bh * scalar}px`);
    e.style.setProperty("background-position", `${xs} ${ys}`);
})

window.onscroll = e => {
    const page = document.querySelector("page"), header = document.querySelector("header");

    const my = page.getBoundingClientRect().y - header.getBoundingClientRect().bottom + window.scrollY;
    
    if (window.scrollY > my) header.classList.add("shadow");
    else header.classList.remove("shadow");
}