document.querySelectorAll("[icon]").forEach(e => {
    const s = e.getBoundingClientRect().height; // Assuming square
    const ps = 32, bw = 232, bh = 199;

    const scalar = s / ps;
    const box = scalar * ps;

    const val = parseInt(e.getAttribute("icon"));

    const x = val % 7 * scalar;
    const y = Math.floor(val / 7) * scalar;

    const xs = `-${x * box + x + scalar}px`;
    const ys = `-${y * box + y + scalar}px`;

    e.style.setProperty("background-size", `${bw * scalar}px ${bh * scalar}px`);
    e.style.setProperty("background-position", `${xs} ${ys}`);
})