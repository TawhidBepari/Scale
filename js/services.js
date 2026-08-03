async function loadServices(){

  const { data, error } = await supabaseClient
    .from("services")
    .select("*")
    .eq("active", true)
    .order("created_at", {
      ascending:false
    });

  if(error){

    console.error(error);

    return;
  }

  const container =
    document.getElementById("servicesContainer");

  container.innerHTML = "";

  if(!data.length){

    container.innerHTML = `
      <div style="
        color:#9fb0c0;
      ">
        No services available yet.
      </div>
    `;

    return;
  }

  data.forEach(service => {

    const card = document.createElement("div");

    card.className = "service-card";

    card.innerHTML = `

  <img
    class="service-image"
    src="${
      service.cover_image ||
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop"
    }"
    alt="${service.title || ""}"
  >

  <div class="service-tags">

${
(service.tags || service.tag || "")

  .split(",")

  .filter(tag => tag.trim() !== "")

  .map(tag => `

    <div class="service-tag">

      ${tag.trim()}

    </div>

  `)

  .join("")
}

</div>

  <h3>
    ${service.title || ""}
  </h3>

  <p>
    ${service.short_description || ""}
  </p>

  <div class="service-price">
    Starting at $${service.price_full || 0}
  </div>

  <a
    href="service.html?slug=${service.slug}"
    class="card-btn"
  >
    View Service
  </a>

`;

    container.appendChild(card);

  });

}
