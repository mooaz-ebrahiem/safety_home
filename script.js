document.addEventListener("DOMContentLoaded", () => {
	const phoneNumber = "201287957733";
	document.querySelectorAll(".product-details-trigger").forEach((detailsCard) => {
		const openDetails = () => {
			if (detailsCard.dataset.pageUrl) {
				window.location.href = detailsCard.dataset.pageUrl;
				return;
			}

			const detailsUrl = new URL(detailsCard.dataset.detailsPage, window.location.href);
			const productId = detailsUrl.searchParams.get("product");
			const modal = document.querySelector(`#${productId}-details`);

			if (!modal) {
				return;
			}

			modal.hidden = false;
			document.body.style.overflow = "hidden";
			modal.querySelector(".modal-close")?.focus();
		};

		detailsCard.addEventListener("click", (event) => {
			if (!event.target.closest(".booking-button")) {
				openDetails();
			}
		});

		detailsCard.addEventListener("keydown", (event) => {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				openDetails();
			}
		});

	});

	document.querySelectorAll(".product-modal").forEach((modal) => {
		const closeDetails = () => {
			modal.hidden = true;
			document.body.style.overflow = "";
		};

		modal.querySelector(".modal-close")?.addEventListener("click", closeDetails);
		modal.addEventListener("click", (event) => {
			if (event.target === modal) {
				closeDetails();
			}
		});
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			document.querySelectorAll(".product-modal:not([hidden])").forEach((modal) => {
				modal.hidden = true;
			});
			document.body.style.overflow = "";
		}
	});

	document.querySelectorAll(".booking-button").forEach((button) => {
		button.addEventListener("click", () => {
			const productName = button.dataset.product;
			const message = `مرحبًا، أريد حجز هذا المنتج: ${productName}`;
			const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

			window.open(whatsappUrl, "_blank", "noopener,noreferrer");
		});
	});

	document.querySelectorAll(".whatsapp-review-image").forEach((image) => {
		image.addEventListener("error", () => image.remove());
	});

	document.querySelectorAll(".reviews-section").forEach((reviewsSection) => {
		const storageKey = `reviews-${reviewsSection.dataset.reviewProduct}`;
		const reviewsList = reviewsSection.querySelector(".reviews-list");
		const reviewForm = reviewsSection.querySelector(".review-form");

		const renderReviews = () => {
			const reviews = JSON.parse(localStorage.getItem(storageKey) || "[]");
			reviewsList.replaceChildren();

			if (reviews.length === 0) {
				const emptyMessage = document.createElement("p");
				emptyMessage.className = "no-reviews";
				emptyMessage.textContent = "لا توجد مراجعات حتى الآن. كن أول من يشارك رأيه.";
				reviewsList.appendChild(emptyMessage);
				return;
			}

			reviews.forEach((review) => {
				const reviewItem = document.createElement("article");
				reviewItem.className = "review-item";
				const reviewHeader = document.createElement("div");
				reviewHeader.className = "review-header";

				const reviewer = document.createElement("strong");
				reviewer.textContent = review.reviewer;

				const rating = Math.min(5, Math.max(1, Number(review.rating) || 1));
				const reviewRating = document.createElement("span");
				reviewRating.className = "review-rating";
				reviewRating.setAttribute("aria-label", `${rating} من 5 نجوم`);
				reviewRating.textContent = `${"★".repeat(rating)}${"☆".repeat(5 - rating)}`;

				const comment = document.createElement("p");
				comment.textContent = review.comment;

				reviewHeader.append(reviewer, reviewRating);
				reviewItem.append(reviewHeader, comment);
				reviewsList.appendChild(reviewItem);
			});
		};

		reviewForm.addEventListener("submit", (event) => {
			event.preventDefault();
			const formData = new FormData(reviewForm);
			const reviews = JSON.parse(localStorage.getItem(storageKey) || "[]");
			reviews.unshift({
				reviewer: formData.get("reviewer"),
				rating: Number(formData.get("rating")),
				comment: formData.get("comment")
			});
			localStorage.setItem(storageKey, JSON.stringify(reviews));
			reviewForm.reset();
			renderReviews();
		});

		renderReviews();
	});
});
