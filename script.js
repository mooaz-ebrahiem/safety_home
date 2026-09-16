document.addEventListener("DOMContentLoaded", () => {
	const phoneNumber = "201229904614";
	document.querySelectorAll(".product-details-trigger").forEach((detailsCard) => {
		const detailsModal = document.querySelector(`#${detailsCard.dataset.detailsModal}`);
		const closeDetails = () => {
			if (detailsModal) {
				detailsModal.hidden = true;
			}
		};
		const openDetails = () => {
			if (detailsModal) {
				detailsModal.hidden = false;
			}
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

		detailsModal?.querySelector(".modal-close")?.addEventListener("click", closeDetails);
		detailsModal?.addEventListener("click", (event) => {
			if (event.target === detailsModal) {
				closeDetails();
			}
		});
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			document.querySelectorAll(".product-modal").forEach((modal) => {
				modal.hidden = true;
			});
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
});
