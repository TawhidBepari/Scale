async function loadReviews(){

  const container =
    document.getElementById(
      "reviewsContainer"
    );

const { data, error } =
  await supabaseClient
    .from("reviews")
    .select(`
      *,
      services (
        title
      ),
      review_replies (
        id,
        reply
      )
    `)
    .order("created_at", {
      ascending:false
    });

  if(error){

    console.error(error);

    container.innerHTML =
      "Failed to load reviews.";

    return;

  }

  if(!data || !data.length){

    container.innerHTML =
      "No reviews yet.";

    return;

  }

  container.innerHTML = "";

  data.forEach(review => {

    const card =
      document.createElement("div");

    card.className =
      "review-card";

    card.innerHTML = `

      <div class="review-stars">

        ${"★".repeat(review.rating || 5)}

      </div>

      <h3>

        ${review.client_name}

      </h3>

      <div class="review-meta">

        ${
          review.services?.title || "-"
        }

        •

        ${
          review.country || "-"
        }

      </div>

      <p>

        ${review.review}

      </p>

      <div style="
        margin-top:12px;
      ">

        ${
          review.verified

          ? "✓ Verified Client"

          : ""
        }

      </div>

      <div class="review-admin-actions">

<button
class="toggle-review-btn"
data-id="${review.id}"
data-active="${review.active}"
>

${
review.active

? "Hide Review"

: "Publish Review"
}

</button>

</div> 
      
      <div class="reply-box">

<textarea
  class="reply-text"
  data-id="${review.id}"
  placeholder="Write a reply..."
>${review.review_replies?.[0]?.reply || ""}</textarea>

<button
  class="save-reply-btn"
  data-id="${review.id}"
>
  ${
    review.review_replies?.length
      ? "Update Reply"
      : "Save Reply"
  }
</button>

</div>

    `;

    container.appendChild(card);

    const toggleBtn =
  card.querySelector(
    ".toggle-review-btn"
  );

if(toggleBtn){

  toggleBtn.onclick = async () => {

  const active =
    toggleBtn.dataset.active === "true";

  console.log("Review ID:", review.id);
  console.log("Current active:", active);

  const result =
    await supabaseClient
      .from("reviews")
      .update({
        active: !active
      })
      .eq("id", review.id)
      .select();

  console.log("Update result:", result);

  if(result.error){

    console.error(result.error);

    alert(result.error.message);

    return;

  }

  loadReviews();

};

}

    const saveReplyBtn =
  card.querySelector(".save-reply-btn");

if(saveReplyBtn){

  saveReplyBtn.onclick = async () => {

    const replyText =
      card.querySelector(".reply-text")
      .value
      .trim();

    if(!replyText){

      alert(
        "Reply cannot be empty."
      );

      return;

    }

    const existingReply =
      review.review_replies?.[0];

    let result;

    if(existingReply){

      result =
        await supabaseClient
          .from("review_replies")
          .update({
            reply: replyText
          })
          .eq(
            "id",
            existingReply.id
          );

    }

    else{

      result =
        await supabaseClient
          .from("review_replies")
          .insert({
            review_id: review.id,
            reply: replyText
          });

    }

    if(result.error){

      alert(
        result.error.message
      );

      return;

    }

    loadReviews();

  };

}
    
  });

}  
