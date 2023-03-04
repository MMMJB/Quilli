import colors from "./Config/colors";


const main = document.getElementById("main"), header = document.getElementById("header");

const setMainHeight = _ => {
    const hh = header.getBoundingClientRect().height;
    main.style.setProperty("max-height", `${window.innerHeight - hh - 3}px`);
}

let h = window.innerHeight;

window.onresize = _ => {
    if (window.innerHeight == h) return;
    
    setMainHeight();
    h = window.innerHeight;
}

setMainHeight();


const SW = 7, SH = 4;

document.querySelectorAll("[icon]").forEach(e => {
    const s = parseInt(e.getAttribute("icon-size"));  // Assuming square
    const ps = 32, bw = 232, bh = 133;

    const scalar = s / ps;

    const val = parseInt(e.getAttribute("icon"));

    const x = val % SW;
    const y = Math.floor(val / SW);

    const mx = x * s + (x + 1) * scalar;
    const my = y * s + (y + 1) * scalar;

    e.style.setProperty("background-size", `${bw * scalar}px ${bh * scalar + scalar * 1.999}px`);
    e.style.setProperty("background-position", `-${mx}px -${my * 1.003}px`);

    if (getComputedStyle(e).height !== s) e.style.setProperty("height", `${s}px`);
})

document.querySelectorAll("color-select").forEach(e => {
    colors.forEach((r, i) => {
        e.innerHTML += `<ul class='cs-row r${i}'></ul>`;
        const container = e.querySelector(`.cs-row.r${i}`);

        r.forEach(c => {
            container.innerHTML += `<li class='cs-col' value="${c}" role="button" style="background-color:${c}"></li>`;
        })

        if (i == colors.length - 1) {
            container.innerHTML += `
                <li class="cs-col" role="button"></li>
                <li class="cs-col" value="new"><input type="color"></li>
            `;
        }
    })
})

document.querySelectorAll(".ti-cover").forEach(e => e.onclick = _ => e.classList.toggle("active"));

main.onscroll = _ => {
    const page = document.querySelector("page"), header = document.querySelector("header");

    const my = page.getBoundingClientRect().y - header.getBoundingClientRect().bottom + window.scrollY;

    if (window.scrollY > my) header.classList.add("shadow");
    else header.classList.remove("shadow");
}

window.addEventListener("load", _ => document.querySelector("loader").removeAttribute("active"));