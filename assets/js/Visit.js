
const VISIT_API = "https://api.dak.edu.vn/game_store/visit.php";

// Lấy thông tin thiết bị (basic thôi, đừng phức tạp)
function getDeviceInfo() {
    return {
        user_agent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform
    };
}

// Gửi lượt truy cập
async function sendVisit() {
    try {
        await fetch(`${VISIT_API}?action=hit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(getDeviceInfo())
        });
        console.log('đã gửi vsist thành công:',getDeviceInfo())
    } catch (err) {
        console.log("Không gửi được visit");
    }
}

// Lấy stats
async function loadVisitStats() {
    const el = document.getElementById("visitorCount");

    try {
        const res = await fetch(`${VISIT_API}?action=stats`);
        const data = await res.json();
        console.log(data.total_views)
        el.textContent = `Lượt truy cập: ${data.total_views.toLocaleString('vi-VN')} `;
    } catch (err) {
        el.textContent = "Lượt truy cập: 5,232+";
    }
}

// LOAD
window.addEventListener("load", async () => {
    await sendVisit();      // tăng view trước
    await loadVisitStats(); // rồi render
});
