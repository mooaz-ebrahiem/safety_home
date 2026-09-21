document.addEventListener("DOMContentLoaded", () => {
    const PHONE = "201287957733";
    const PRODUCT_NAME = "كاشف تسريبات غاز";
    const STORAGE_KEY = "reviews-gas-detector"; // نفس المفتاح القديم عشان المراجعات القديمة تفضل

    /* ---------- 1) معرض الصور ---------- */
    const mainImage = document.querySelector("#gd-gallery-main");
    const thumbs = document.querySelectorAll(".gd-thumb");

    thumbs.forEach((thumb) => {
        thumb.addEventListener("click", () => {
            mainImage.src = thumb.dataset.full;
            thumbs.forEach((t) => t.classList.remove("is-active"));
            thumb.classList.add("is-active");
        });
    });

    /* ---------- 2) زراير الحجز واتساب ---------- */
    const message = encodeURIComponent(`مرحبًا، أريد حجز هذا المنتج: ${PRODUCT_NAME}`);
    const whatsappUrl = `https://wa.me/${PHONE}?text=${message}`;
    document.querySelector("#gd-book-btn").href = whatsappUrl;
    document.querySelector("#gd-book-btn-bottom").href = whatsappUrl;

    /* ---------- 3) screenshots واتساب ---------- */
    const waBox = document.querySelector("#gd-wa-reviews");
    ["review-1.jpg", "review-2.jpg", "review-3.jpg"].forEach((name) => {
        const img = document.createElement("img");
        img.className = "gd-wa-image";
        img.src = `first_product/${name}`;
        img.alt = "مراجعة عميل على واتساب";
        img.addEventListener("load", () => document.querySelector("#gd-wa-empty")?.remove());
        img.addEventListener("error", () => img.remove());
        waBox.appendChild(img);
    });

    /* ---------- 4) المراجعات المكتوبة ---------- */
    const list = document.querySelector("#gd-review-list");
    const form = document.querySelector("#gd-review-form");

    const readReviews = () => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        } catch {
            return [];
        }
    };

    const renderReviews = () => {
        list.replaceChildren();
        readReviews().forEach((review) => {
            const item = document.createElement("article");
            item.className = "gd-review-item";

            const head = document.createElement("div");
            head.className = "gd-review-head";

            const name = document.createElement("strong");
            name.textContent = review.reviewer;

            const stars = document.createElement("span");
            stars.className = "gd-review-stars";
            stars.textContent = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
            stars.setAttribute("aria-label", `${review.rating} من 5 نجوم`);

            const comment = document.createElement("p");
            comment.className = "gd-review-comment";
            comment.textContent = review.comment; // textContent بدل innerHTML للأمان

            head.append(name, stars);
            item.append(head, comment);
            list.appendChild(item);
        });
    };

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = new FormData(form);
        const reviews = readReviews();
        reviews.unshift({
            reviewer: data.get("reviewer"),
            rating: Number(data.get("rating")),
            comment: data.get("comment")
        });
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
        } catch { /* التخزين غير متاح */ }
        form.reset();
        renderReviews();
    });

    renderReviews();
});
