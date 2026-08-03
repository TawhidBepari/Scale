async function loadReviews(){

  const { data, error } = await supabaseClient
    .from("reviews")
  .select(`
    *,
    review_replies (
      reply
    )
  `)
  .eq("active", true);
  
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

    card.innerHTML = `

<div class="review-stars">

${"★".repeat(review.rating || 5)}

</div>

<p class="review-text">

"${review.review || ""}"

</p>

<strong>

${review.client_name || "Anonymous"}

</strong>

`;

    container.appendChild(card);

  });

}
