const params =
  new URLSearchParams(window.location.search);

const slug = params.get("slug");

let currentService = null;

function showNotFound(){

  document.body.innerHTML = `
    <div style="
      min-height:100vh;
      display:flex;
      align-items:center;
      justify-content:center;
      background:#0b0f14;
      color:white;
      font-family:Inter,sans-serif;
      font-size:2rem;
      text-align:center;
      padding:20px;
    ">
      Service not found
    </div>
  `;

}

async function loadService(){

  if(!slug){

    showNotFound();

    return;
  }

  const { data, error } = await supabaseClient
    .from("services")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if(error || !data){

    console.error(error);

    showNotFound();

    return;
  }

currentService = data;

console.log(data.tags);
  
  document.title =
    (data.title || "Service") + " — SCALE";

  document.getElementById("serviceName").innerText =
    data.title || "Untitled Service";

  document.getElementById("serviceDescription").innerText =
    data.full_description || "No description available.";

  document.getElementById("servicePrice").innerText =
    "$" + (data.price_full || "0");

  document.getElementById("remainingSpots").innerText =
    data.spots_remaining ?? "Unlimited";

  document.getElementById("sessionDate").innerText =
    data.session_start || "TBA";

  document.getElementById("serviceImage").src =
    data.cover_image ||
    "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop";

const tagsContainer =
  document.getElementById(
    "serviceTags"
  );

tagsContainer.innerHTML = "";

if(data.tags){

  data.tags
    .split(",")
    .map(tag => tag.trim())
    .filter(tag => tag)
    .forEach(tag => {

      tagsContainer.innerHTML += `

        <span class="service-tag">

          ${tag}

        </span>

      `;

    });

}

  if(data.installment_enabled){

    document.getElementById("installmentTitle").innerText =
      data.installment_count
        ? data.installment_count + " Installments"
        : "Installments";

  }else{

    document.getElementById("installmentOption")
      .style.display = "none";

  }

  if(
    data.personal_payment_enabled &&
    data.installment_enabled
  ){

    document.getElementById("paymentText").innerText =
      "Full payment and installments available";

  }else if(data.personal_payment_enabled){

    document.getElementById("paymentText").innerText =
      "Full payment available";

  }else if(data.installment_enabled){

    document.getElementById("paymentText").innerText =
      "Installments available";

    document.getElementById("fullPaymentOption")
      .style.display = "none";

  }else{

    document.getElementById("paymentText").innerText =
      "Contact for payment options";

  }

  startCountdown(data.countdown_end);

  loadBonuses(data.id);

  loadReviews(data.id);

}
