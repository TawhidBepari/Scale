function timeAgo(dateString) {

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (minutes < 1) return "just now";

  if (minutes < 60)
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

  if (hours < 24)
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  if (days < 7)
    return `${days} day${days === 1 ? "" : "s"} ago`;

  if (weeks < 4)
    return `${weeks} week${weeks === 1 ? "" : "s"} ago`;

  if (months < 12)
    return `${months} month${months === 1 ? "" : "s"} ago`;

  return `${years} year${years === 1 ? "" : "s"} ago`;

}


function createReviewCard(
  review,
  showServiceBadge = false
) {

  return `

<div class="review-stars">

${"★".repeat(review.rating || 5)}

</div>

<p class="review-text">

"${review.review}"

</p>

<div class="review-author">

  <div class="review-author-main">

    <strong>
      ${review.client_name}
    </strong>

    ${
      review.company
      ? `<span class="review-company">${review.company}</span>`
      : ""
    }

    ${
      review.country
      ? `<span class="review-country">${review.country}</span>`
      : ""
    }

  </div>

  ${
    review.featured
    ? `
      <div class="featured-review-badge">
        ⭐ Featured Review
      </div>
    `
    : ""
  }

  ${
    review.verified
    ? `
      <span class="verified-badge">
        ✓ Verified Client
      </span>
    `
    : ""
  }

</div>

<div class="review-date">

${timeAgo(review.created_at)}

</div>

${
  showServiceBadge && review.services
  ? `
    <a
      class="review-service-badge"
      href="service.html?slug=${review.services.slug}"
    >
      ${review.services.title}
    </a>
  `
  : ""
}

${
  review.review_replies?.length
  ? `
    <div class="review-reply">

      <div class="reply-title">
        Reply from SCALE
      </div>

      <p>
        ${review.review_replies[0].reply}
      </p>

    </div>
  `
  : ""
}

`;

}


async function loadReviews(serviceId) {

  const { data, error } =
    await supabaseClient

      .from("reviews")

      .select(`
        *,
        review_replies (
          reply
        )
      `)

      .eq("service_id", serviceId)

      .eq("active", true)

      .order("featured", {
        ascending: false
      })

      .order("created_at", {
        ascending: false
      });


  if (error) {

    console.error(error);

    return;

  }


  console.log(data);


  const container =
    document.getElementById(
      "reviewsContainer"
    );


  if (!container) {

    return;

  }


  container.innerHTML = "";


  const reviewsSection =
    document.getElementById(
      "reviewsSection"
    );


  if (!data || !data.length) {

    if (reviewsSection) {

      reviewsSection.style.display =
        "none";

    }

    return;

  }


  if (reviewsSection) {

    reviewsSection.style.display =
      "block";

  }


  const average = (

    data.reduce(

      (sum, review) =>

        sum + (review.rating || 5),

      0

    ) / data.length

  ).toFixed(1);


  const ratings = {

    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0

  };


  data.forEach(review => {

    if (ratings[review.rating] !== undefined) {

      ratings[review.rating]++;

    }

  });


  const reviewSummary =
    document.getElementById(
      "reviewSummary"
    );


  if (reviewSummary) {

    reviewSummary.innerHTML = `

      <div class="summary-stars">

        ${"★".repeat(
          Math.round(average)
        )}

      </div>

      <div class="summary-score">

        ${average}

      </div>

      <div class="summary-count">

        Based on ${data.length}
        verified review${data.length > 1 ? "s" : ""}

        <span class="summary-service-name">

          for ${currentService?.title || "this service"}

        </span>

      </div>

    `;

  }


  const breakdown =
    document.getElementById(
      "ratingBreakdown"
    );


  if (breakdown) {

    breakdown.innerHTML = "";


    [5, 4, 3, 2, 1].forEach(star => {

      const count =
        ratings[star];


      const percent =
        data.length
        ? (count / data.length) * 100
        : 0;


      breakdown.innerHTML += `

        <div class="rating-row">

          <div class="rating-label">

            ${"★".repeat(star)}

          </div>

          <div class="rating-bar">

            <div
              class="rating-fill"
              style="width:${percent}%"
            ></div>

          </div>

          <div class="rating-count">

            ${count}

          </div>

        </div>

      `;

    });

  }


  data.forEach(review => {

    const div =
      document.createElement("div");


    div.className =
      review.featured
      ? "review featured-review"
      : "review";


    div.innerHTML =
      createReviewCard(review);


    container.appendChild(div);

  });

}


async function loadAllReviews() {

  const { data, error } =
    await supabaseClient

      .from("reviews")

      .select(`
        *,
        services (
          title,
          slug
        ),
        review_replies (
          reply
        )
      `)

      .eq("active", true)

      .order("featured", {
        ascending: false
      })

      .order("created_at", {
        ascending: false
      });


  if (error) {

    console.error(error);

    return;

  }


  console.log(data);


  const container =
    document.getElementById(
      "reviewsContainer"
    );


  if (!container) {

    return;

  }


  container.innerHTML = "";


  if (!data || !data.length) {

    container.innerHTML = `

      <div class="review">

        <p>
          No reviews yet.
        </p>

      </div>

    `;

    return;

  }


  data.forEach(review => {

    const card =
      document.createElement("div");


    card.className =
      "review";


    card.innerHTML =
      createReviewCard(
        review,
        true
      );


    container.appendChild(card);

  });

}


document.addEventListener(
  "DOMContentLoaded",
  () => {

    const reviewModal =
      document.getElementById(
        "reviewModal"
      );


    /*
      The review modal only exists
      on the service page.

      The homepage still uses
      reviews.js for loading reviews,
      so we stop here when the
      modal does not exist.
    */

    if (!reviewModal) {

      return;

    }


    const openReviewBtn =
      document.getElementById(
        "openReviewModal"
      );


    const closeReviewBtn =
      document.getElementById(
        "closeReviewModal"
      );


    const reviewEmail =
      document.getElementById(
        "reviewEmail"
      );


    const submitReviewBtn =
      document.getElementById(
        "submitReviewBtn"
      );


    const reviewStatus =
      document.getElementById(
        "reviewStatus"
      );


    const verifiedFields =
      document.getElementById(
        "verifiedReviewFields"
      );


    let selectedRating = 5;


    let existingReviewId = null;


    const stars =
      document.querySelectorAll(
        ".rating-picker span"
      );


    function paintStars(value) {

      stars.forEach(star => {

        star.classList.toggle(

          "active",

          Number(
            star.dataset.rating
          ) <= value

        );

      });

    }


    function openReviewModal() {

      reviewModal.style.display =
        "flex";

      document.body.style.overflow =
        "hidden";

    }


    function closeReviewModal() {

      reviewModal.style.display =
        "none";

      document.body.style.overflow =
        "";

    }


    async function verifyPurchaseEmail() {

      const email =
        reviewEmail.value
          .trim()
          .toLowerCase();


      if (!email) {

        reviewStatus.className =
          "review-status";

        reviewStatus.innerText =
          "";

        verifiedFields.style.display =
          "none";

        return;

      }


      reviewStatus.className =
        "review-status loading";

      reviewStatus.innerText =
        "Checking purchase...";


      const { data, error } =
        await supabaseClient

          .from("payment_requests")

          .select(`
            full_name,
            company_name,
            country
          `)

          .eq(
            "customer_email",
            email
          )

          .eq(
            "service_id",
            currentService.id
          )

          .eq(
            "status",
            "paid"
          )

          .order(
            "created_at",
            {
              ascending: false
            }
          )

          .limit(1)

          .maybeSingle();


      if (error) {

        console.error(error);

        reviewStatus.className =
          "review-status error";

        reviewStatus.innerText =
          "Unable to verify purchase.";

        verifiedFields.style.display =
          "none";

        return;

      }


      if (!data) {

        reviewStatus.className =
          "review-status error";

        reviewStatus.innerText =
          "We couldn't find a completed purchase for this service using this email.";

        verifiedFields.style.display =
          "none";

        return;

      }


      reviewStatus.className =
        "review-status success";

      reviewStatus.innerText =
        "✓ Verified Client";


      verifiedFields.style.display =
        "block";


      document.getElementById(
        "reviewName"
      ).value =
        data.full_name || "";


      document.getElementById(
        "reviewCompany"
      ).value =
        data.company_name || "";


      document.getElementById(
        "reviewCountry"
      ).value =
        data.country || "";


      const reviewResult =
        await supabaseClient

          .from("reviews")

          .select("*")

          .eq(
            "customer_email",
            email
          )

          .eq(
            "service_id",
            currentService.id
          )

          .limit(1)

          .maybeSingle();


      if (reviewResult.error) {

        console.error(
          reviewResult.error
        );

      }

      else if (reviewResult.data) {

        existingReviewId =
          reviewResult.data.id;


        document.getElementById(
          "reviewName"
        ).value =
          reviewResult.data.client_name || "";


        document.getElementById(
          "reviewCompany"
        ).value =
          reviewResult.data.company || "";


        document.getElementById(
          "reviewCountry"
        ).value =
          reviewResult.data.country || "";


        document.getElementById(
          "reviewText"
        ).value =
          reviewResult.data.review || "";


        selectedRating =
          reviewResult.data.rating || 5;


        paintStars(
          selectedRating
        );


        submitReviewBtn.innerText =
          "Update Review";

      }

      else {

        existingReviewId =
          null;


        document.getElementById(
          "reviewText"
        ).value =
          "";


        selectedRating = 5;


        paintStars(5);


        submitReviewBtn.innerText =
          "Submit Review";

      }

    }


    async function submitReview() {

      reviewStatus.className =
        "review-status loading";

      reviewStatus.innerText =
        "Verifying purchase...";


      submitReviewBtn.disabled =
        true;


      const email =
        reviewEmail.value
          .trim()
          .toLowerCase();


      const name =
        document.getElementById(
          "reviewName"
        ).value
          .trim();


      const company =
        document.getElementById(
          "reviewCompany"
        ).value
          .trim();


      const country =
        document.getElementById(
          "reviewCountry"
        ).value
          .trim();


      const review =
        document.getElementById(
          "reviewText"
        ).value
          .trim();


      if (
        !email ||
        !name ||
        !review
      ) {

        reviewStatus.className =
          "review-status error";

        reviewStatus.innerText =
          "Please complete all required fields.";

        submitReviewBtn.disabled =
          false;

        return;

      }


      let result;


      if (existingReviewId) {

        result =
          await supabaseClient

            .from("reviews")

            .update({

              client_name: name,

              company: company,

              country: country,

              rating: selectedRating,

              review: review,

              verified: true,

              active: true

            })

            .eq(
              "id",
              existingReviewId
            );

      }

      else {

        result =
          await supabaseClient

            .from("reviews")

            .insert({

              service_id:
                currentService.id,

              customer_email:
                email,

              client_name:
                name,

              company:
                company,

              country:
                country,

              rating:
                selectedRating,

              review:
                review,

              verified:
                true,

              active:
                true

            });

      }


      if (result.error) {

        console.error(
          result.error
        );

        reviewStatus.className =
          "review-status error";

        reviewStatus.innerText =
          result.error.message;

        submitReviewBtn.disabled =
          false;

        return;

      }


      reviewStatus.className =
        "review-status success";


      reviewStatus.innerText =
        existingReviewId
        ? "Review updated successfully!"
        : "Review submitted successfully!";


      submitReviewBtn.disabled =
        false;


      await loadReviews(
        currentService.id
      );


      closeReviewModal();

    }


    if (reviewEmail) {

      reviewEmail.addEventListener(
        "blur",
        verifyPurchaseEmail
      );

    }


    if (submitReviewBtn) {

      submitReviewBtn.onclick =
        submitReview;

    }


    if (openReviewBtn) {

      openReviewBtn.addEventListener(
        "click",
        openReviewModal
      );

    }


    if (closeReviewBtn) {

      closeReviewBtn.addEventListener(
        "click",
        closeReviewModal
      );

    }


    reviewModal.addEventListener(
      "click",
      event => {

        if (
          event.target ===
          reviewModal
        ) {

          closeReviewModal();

        }

      }
    );


    document.addEventListener(
      "keydown",
      event => {

        if (
          event.key ===
          "Escape"
        ) {

          closeReviewModal();

        }

      }
    );


    stars.forEach(star => {

      star.addEventListener(
        "click",
        () => {

          selectedRating =
            Number(
              star.dataset.rating
            );

          paintStars(
            selectedRating
          );

        }
      );

    });


    paintStars(5);

  }
);
