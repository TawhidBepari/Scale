// LOAD BONUS SELECTS

async function loadBonusServiceOptions(){

  const { data, error } = await supabaseClient
    .from("services")
    .select("*")
    .eq("active", true)
    .order("title");

  if(error){

    console.error(error);
    return;

  }

  const parentSelect =
    document.getElementById("bonus_service");

  const bonusSelect =
    document.getElementById("bonus_bonus_service");

  parentSelect.innerHTML = `
    <option value="">
      Select Parent Service
    </option>
  `;

  bonusSelect.innerHTML = `
    <option value="">
      Select Bonus Offer
    </option>
  `;

  data.forEach(service => {

    parentSelect.innerHTML += `
      <option value="${service.id}">
        ${service.title}
      </option>
    `;

    bonusSelect.innerHTML += `
      <option value="${service.id}">
        ${service.title}
      </option>
    `;

  });

}

// SAVE BONUS

document.getElementById("saveBonusBtn").onclick = async () => {

  const serviceId =
    document.getElementById("bonus_service").value;

  const bonusServiceId =
    document.getElementById("bonus_bonus_service").value;

  const description =
    document.getElementById("bonus_description").value;

  if(!serviceId || !bonusServiceId){

    alert("Select both services");
    return;

  }

  const { data: bonusService } = await supabaseClient
    .from("services")
    .select("*")
    .eq("id", bonusServiceId)
    .single();

  const { error } = await supabaseClient
    .from("bonuses")
    .insert([{

      service_id: serviceId,

      title:
        bonusService.title,

      description:
        description,

      bonus_service_id:
        bonusService.id

    }]);

  if(error){

    console.error(error);
    alert(error.message);
    return;

  }

  alert("Bonus added");

  document.getElementById("bonus_description").value = "";

  loadBonuses();

};

// LOAD BONUSES

async function loadBonuses(){

  const bonusesList =
    document.getElementById("bonusesList");

  const { data, error } = await supabaseClient
    .from("bonuses")
    .select(`
      *,
      services!bonuses_service_id_fkey (
        title
      )
    `)
    .order("created_at", {
      ascending:false
    });

  if(error){

    console.error(error);

    bonusesList.innerHTML = `
      <div class="empty">
        Failed to load bonuses
      </div>
    `;

    return;

  }

  if(!data.length){

    bonusesList.innerHTML = `
      <div class="empty">
        No bonuses yet
      </div>
    `;

    return;

  }

  bonusesList.innerHTML = "";

  data.forEach(bonus => {

    const div = document.createElement("div");

    div.className = "service-item";

    div.innerHTML = `

      <div>

        <h3>
          ${bonus.title}
        </h3>

        <p>
          Added to:
          ${bonus.services?.title || "Unknown"}
        </p>

        <div class="badge">
          Bonus Offer
        </div>

      </div>

      <button
        class="action-btn"
        style="
          background:#ff5f5f;
          color:white;
        "
        onclick="deleteBonus('${bonus.id}')"
      >
        Delete
      </button>

    `;

    bonusesList.appendChild(div);

  });

}

// DELETE BONUS

async function deleteBonus(id){

  const confirmed = confirm(
    "Delete this bonus?"
  );

  if(!confirmed) return;

  const { error } = await supabaseClient
    .from("bonuses")
    .delete()
    .eq("id", id);

  if(error){

    console.error(error);
    alert(error.message);
    return;

  }

  alert("Bonus deleted");

  loadBonuses();

}
