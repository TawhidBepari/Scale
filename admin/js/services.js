let editingServiceId = null;

document.getElementById("title").addEventListener("input", e => {

  if(editingServiceId) return;

  const slug = e.target.value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g,"-")
    .replace(/^-+|-+$/g,"");

  document.getElementById("slug").value = slug;

});

document.getElementById("image").addEventListener("input", e => {

  document.getElementById("imagePreview").src =
    e.target.value;

});

async function loadServices(){

  const servicesList =
    document.getElementById("servicesList");

  const { data, error } = await supabaseClient
    .from("services")
    .select("*")
    .order("created_at", {
      ascending:false
    });

  if(error){

    console.error(error);

    servicesList.innerHTML = `
      <div class="empty">
        Failed to load services
      </div>
    `;

    return;

  }

  if(!data.length){

    servicesList.innerHTML = `
      <div class="empty">
        No services yet
      </div>
    `;

    return;

  }

  servicesList.innerHTML = "";

  data.forEach(service => {

    const div = document.createElement("div");

    div.className = "service-item";

    div.innerHTML = `

      <div class="service-left">

        <img
          class="service-thumb"
          src="${service.cover_image || ""}"
        >

        <div>

          <h3>
            ${service.title || ""}
          </h3>

          <p>
            ${service.short_description || ""}
          </p>

          <div style="
  display:flex;
  gap:8px;
  flex-wrap:wrap;
  margin-top:10px;
">

${
service.tags

? service.tags

    .split(",")

    .map(tag => `

      <div class="badge">

        ${tag.trim()}

      </div>

    `)

    .join("")

: `
<div class="badge">

${service.active ? "Active" : "Inactive"}

</div>
`
}

</div>

        </div>

      </div>

      <div style="
        display:flex;
        gap:10px;
        flex-wrap:wrap;
      ">

        <button
          class="action-btn"
          onclick="editService('${service.id}')"
        >
          Edit
        </button>

        <button
          class="action-btn"
          onclick="toggleService('${service.id}', ${service.active})"
        >
          ${service.active ? "Disable" : "Enable"}
        </button>

        <button
          class="action-btn"
          style="
            background:#ff5f5f;
            color:white;
          "
          onclick="deleteService('${service.id}')"
        >
          Delete
        </button>

      </div>

    `;

    servicesList.appendChild(div);

  });

}

document.getElementById("saveServiceBtn").onclick = async () => {

  const installmentEnabled =
    document.getElementById("installments").value === "true";

  const payload = {

    title:
      document.getElementById("title").value,

    slug:
      document.getElementById("slug").value,

    tags:
      document.getElementById("tag").value || "Featured",

    short_description:
      document.getElementById("short_description").value,

    full_description:
      document.getElementById("full_description").value,

    price_full:
      document.getElementById("price").value,

    spots_remaining:
      parseInt(
        document.getElementById("spots").value || 0
      ),

    countdown_end:
      document.getElementById("countdown").value || null,

    cover_image:
      document.getElementById("image").value,

    session_start:
      document.getElementById("session_start").value,

    installment_enabled:
      installmentEnabled,

    installment_count:
      installmentEnabled
        ? parseInt(
            document.getElementById("installment_count").value || 3
          )
        : null,

    personal_payment_enabled:true,

    business_payment_enabled:true,

    active:true

  };

 console.log(payload);
  
  let response;

  if(editingServiceId){

    response = await supabaseClient
      .from("services")
      .update(payload)
      .eq("id", editingServiceId);

  }else{

    response = await supabaseClient
      .from("services")
      .insert([payload]);

  }

  if(response.error){

    console.error(response.error);

    alert(response.error.message);

    return;

  }

  alert(
    editingServiceId
      ? "Service updated"
      : "Service created"
  );

  resetForm();

  loadServices();

};

async function editService(id){

  const { data, error } = await supabaseClient
    .from("services")
    .select("*")
    .eq("id", id)
    .single();

  if(error){

    console.error(error);

    return;

  }

  editingServiceId = id;

  document.getElementById("title").value =
    data.title || "";

  document.getElementById("slug").value =
    data.slug || "";

  document.getElementById("tag").value =
    data.tags || "";

  document.getElementById("short_description").value =
    data.short_description || "";

  document.getElementById("full_description").value =
    data.full_description || "";

  document.getElementById("price").value =
    data.price_full || "";

  document.getElementById("spots").value =
    data.spots_remaining || "";

  document.getElementById("session_start").value =
    data.session_start || "";

  document.getElementById("countdown").value =
    data.countdown_end
      ? data.countdown_end.slice(0,16)
      : "";

  document.getElementById("image").value =
    data.cover_image || "";

  document.getElementById("imagePreview").src =
    data.cover_image || "";

  document.getElementById("installments").value =
    data.installment_enabled
      ? "true"
      : "false";

  document.getElementById("installment_count").value =
    data.installment_count || "";

  document.getElementById("saveServiceBtn").innerText =
    "Update Service";

  window.scrollTo({
    top:0,
    behavior:"smooth"
  });

}

async function deleteService(id){

  const confirmed = confirm(
    "Delete this service?"
  );

  if(!confirmed) return;

  const { error } = await supabaseClient
    .from("services")
    .delete()
    .eq("id", id);

  if(error){

    console.error(error);

    alert(error.message);

    return;

  }

  alert("Service deleted");

  loadServices();

}

async function toggleService(id,currentState){

  const { error } = await supabaseClient
    .from("services")
    .update({
      active: !currentState
    })
    .eq("id", id);

  if(error){

    console.error(error);

    alert(error.message);

    return;

  }

  loadServices();

}

function resetForm(){

  editingServiceId = null;

  document.getElementById("title").value = "";

  document.getElementById("slug").value = "";

  document.getElementById("tag").value = "";

  document.getElementById("short_description").value = "";

  document.getElementById("full_description").value = "";

  document.getElementById("price").value = "";

  document.getElementById("spots").value = "";

  document.getElementById("session_start").value = "";

  document.getElementById("countdown").value = "";

  document.getElementById("image").value = "";

  document.getElementById("imagePreview").src = "";

  document.getElementById("installments").value = "true";

  document.getElementById("installment_count").value = "";

  document.getElementById("saveServiceBtn").innerText =
    "Save Service";

}
