function createReviewCard(review, showServiceBadge = false) {

  return `
   div.innerHTML = `

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

  
  
  `;

}

async function loadReviews(){

const { data, error } = await supabaseClient
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
  
  if(error){

    console.error(error);

    return;
  }

console.log(data);
  
  const container =
    document.getElementById("reviewsContainer");

  container.innerHTML = "";

  if(!data.length){

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

    const card = document.createElement("div");

    card.className = "review";

    console.log(review);
    
    card.innerHTML = `

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

  <div>

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

</div>

${
review.services
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
    container.appendChild(card);

  });

}
