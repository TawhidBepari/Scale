async function loadBonuses(serviceId){

  const { data, error } = await supabaseClient
    .from("bonuses")
    .select(`
      *,
      bonus_service:services!bonuses_bonus_service_id_fkey (
        id,
        title,
        slug,
        short_description,
        cover_image,
        price_full
      )
    `)
    .eq("service_id", serviceId)
    .order("created_at", {
      ascending:true
    });

  if(error){

    console.error(error);

    return;
  }

  const container =
    document.getElementById("bonusList");

  container.innerHTML = "";

  if(!data || !data.length){

    container.innerHTML = `
      <div class="card">
        No bonuses available.
      </div>
    `;

    return;
  }

  data.forEach(bonus => {

    const service = bonus.bonus_service;

    const div = document.createElement("div");

div.className = "bonus-item";

if(service?.slug){
  div.onclick = () => {
    window.location.href =
      "service.html?slug=" + service.slug;
  };
}

div.innerHTML = `

  <img
    class="bonus-image"
    src="${service?.cover_image || ""}"
    alt="${service?.title || ""}"
  >

  <div class="bonus-content">

    <div class="bonus-badge">
      🎁 Included Free
    </div>

    <h4>
      ${service?.title || bonus.title}
    </h4>

    <div class="bonus-old-price">
      Regular Value: $${service?.price_full || "0"}
    </div>

    <div class="bonus-free">
      FREE with your enrollment
    </div>

    <div class="bonus-description">
      ${bonus.description || service?.short_description || ""}
    </div>

  </div>

`;

    container.appendChild(div);

  });

}
