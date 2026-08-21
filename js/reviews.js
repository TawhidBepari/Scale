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
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  if (weeks < 4) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

function createReviewCard(review, showServiceBadge = false) {

  return `

<div class="review-stars">

${"★".repeat(review.rating || 5)}

</div>

<p class="review-text">

"${review.review}"

</p>

<div class="review-author">

  <div class="review-author-main">
    <strong>${review.client_name}</strong>

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

  ${review.featured ? `
    <div class="featured-review-badge">
      ⭐ Featured Review
    </div>
  ` : ""}

  ${
    review.verified
    ? `<span class="verified-badge">✓ Verified Client</span>`
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

async function loadReviews(serviceId = null){

  let query = supabaseClient
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

  if(serviceId){

    query = query.eq("service_id", serviceId);

  }

  const { data, error } = await query;

  if(error){

    console.error(error);

    return;
  }

  console.log(data);

  const container =
    document.getElementById("reviewsContainer");

  if(!container){

    return;
  }

  container.innerHTML = "";

  /*
    SERVICE PAGE
  */

  if(serviceId){

    const reviewsSection =
      document.getElementById("reviewsSection");

    if(!data || !data.length){

      if(reviewsSection){

        reviewsSection.style.display = "none";

      }

      return;

    }

    if(reviewsSection){

      reviewsSection.style.display = "block";

    }

    const average = (
      data.reduce(
        (sum, review) =>
          sum + (review.rating || 5),
        0
      ) / data.length
    ).toFixed(1);

    const ratings = {

      5:0,
      4:0,
      3:0,
      2:0,
      1:0

    };

    data.forEach(review => {

      if(ratings[review.rating] !== undefined){

        ratings[review.rating]++;

      }

    });

    const reviewSummary =
      document.getElementById("reviewSummary");

    if(reviewSummary){

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

    if(breakdown){

      breakdown.innerHTML = "";

      [5,4,3,2,1].forEach(star => {

        const count = ratings[star];

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

  }

  /*
    REVIEW CARDS
  */

  data.forEach(review => {

    const card =
      document.createElement("div");

    card.className =
      review.featured
      ? "review featured-review"
      : "review";

    card.innerHTML =
      createReviewCard(
        review,
        !serviceId
      );

    container.appendChild(card);

  });

}
