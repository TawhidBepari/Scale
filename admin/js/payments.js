async function loadPaymentRequests(){

  const { data, error } = await supabaseClient
    .from("payment_requests")
    .select(`
      *,
      services (
        title
      )
    `)
    .order("created_at", {
      ascending:false
    });

const pendingContainer =
  document.getElementById(
    "pendingRequestsContainer"
  );

const paidContainer =
  document.getElementById(
    "paidRequestsContainer"
  );

const declinedContainer =
  document.getElementById(
    "declinedRequestsContainer"
  );

pendingContainer.innerHTML = "";
paidContainer.innerHTML = "";
declinedContainer.innerHTML = "";

  let pendingCount = 0;
let paidCount = 0;
let declinedCount = 0;
  
 if(error){

  console.error(error);

  pendingContainer.innerHTML =
    "Failed to load requests.";

  paidContainer.innerHTML =
    "Failed to load requests.";

  declinedContainer.innerHTML =
    "Failed to load requests.";

  return;
}

 if(!data || !data.length){

  pendingContainer.innerHTML =
    "No pending requests.";

  paidContainer.innerHTML =
    "No completed payments.";

  declinedContainer.innerHTML =
    "No declined requests.";

  return;
}

  data.forEach(request => {

    const card =
      document.createElement("div");

    card.style.background =
      "#0e141c";

    card.style.padding =
      "20px";

    card.style.borderRadius =
      "16px";

    card.style.marginBottom =
      "16px";

    card.style.border =
      "1px solid rgba(255,255,255,.06)";

    card.innerHTML = `

      <h3 style="margin-bottom:10px;">
        ${request.full_name || "No Name"}
      </h3>

      <p>
        <strong>Service:</strong>
        ${request.services?.title || "-"}
      </p>

      <p>
        <strong>Email:</strong>
        ${request.customer_email}
      </p>

      <p>
        <strong>Country:</strong>
        ${request.country || "-"}
      </p>

      <p>
        <strong>Payment:</strong>
        ${
          request.payment_type ===
          "full_payment"
            ? "Full Payment"
            : "Installment"
        }
      </p>

      <div class="request-status">

${
request.status === "pending"

? `
<span class="status-badge pending">

⏳ Pending

</span>
`

: request.status === "contacted"

? `
<span class="status-badge contacted">

✉ Contacted

</span>
`

: request.status === "paid"

? `
<span class="status-badge paid">

✓ Paid

</span>
`

: `
<span class="status-badge declined">

✕ Declined

</span>
`

}

</div>

      <p>
        <strong>Requested:</strong>
        ${new Date(
          request.created_at
        ).toLocaleString()}
      </p>

    ${
request.status === "pending"

? `

<div class="request-actions">

  <button
    class="request-btn contacted-btn"
    data-id="${request.id}"
  >
    Mark as Contacted
  </button>

  <button
    class="request-btn declined-btn"
    data-id="${request.id}"
  >
    Decline
  </button>

</div>

`

: request.status === "contacted"

? `

<div class="request-actions">

  <button
    class="request-btn paid-btn"
    data-id="${request.id}"
  >
    Mark as Paid
  </button>

  <button
    class="request-btn declined-btn"
    data-id="${request.id}"
  >
    Decline
  </button>

</div>

`

: request.status === "paid"

? `

<div class="status-finished status-paid">

✓ Payment Completed

</div>

`

: `

<div class="status-finished status-declined">

✕ Request Declined

</div>

`
}

    `;

if(request.status === "pending"){

  pendingCount++;

  pendingContainer.appendChild(card);

}

else if(request.status === "contacted"){

  pendingCount++;

  pendingContainer.appendChild(card);

}

else if(request.status === "paid"){

  paidCount++;

  paidContainer.appendChild(card);

}

else if(request.status === "declined"){

  declinedCount++;

  declinedContainer.appendChild(card);

}
    
const contactedBtn =
  card.querySelector(".contacted-btn");

if(contactedBtn){

  contactedBtn.onclick = () =>

    updateRequestStatus(
      request.id,
      "contacted"
    );

}


const paidBtn =
  card.querySelector(".paid-btn");

if(paidBtn){

  paidBtn.onclick = () =>

    updateRequestStatus(
      request.id,
      "paid"
    );

}


const declinedBtn =
  card.querySelector(".declined-btn");

if(declinedBtn){

  declinedBtn.onclick = () =>

    updateRequestStatus(
      request.id,
      "declined"
    );

}
    
  });

  document.getElementById(
  "pendingCount"
).textContent =
  `(${pendingCount})`;

document.getElementById(
  "paidCount"
).textContent =
  `(${paidCount})`;

document.getElementById(
  "declinedCount"
).textContent =
  `(${declinedCount})`;
  
}

async function updateRequestStatus(
  requestId,
  status
){

  console.log(
    "BUTTON CLICKED",
    requestId,
    status
  );
  
  const { data, error } = await supabaseClient
    .from("payment_requests")
    .update({
      status
    })
    .eq("id", requestId)
    .select();

  console.log(
    "updated rows:",
    data
  );

  console.log(
    "error:",
    error
  );

  if(error){

    console.error(
      "UPDATE ERROR:",
      error
    );

    alert(error.message);

    return;
  }

  loadPaymentRequests();

}

document

.querySelectorAll(".payment-tab")

.forEach(tab => {

  tab.onclick = () => {

    document

      .querySelectorAll(".payment-tab")

      .forEach(

        t =>

          t.classList.remove(
            "active"
          )
      );


    document

      .querySelectorAll(
        ".payment-content"
      )

      .forEach(

        c =>

          c.classList.remove(
            "active"
          )
      );


    tab.classList.add(
      "active"
    );


    const target =

      tab.dataset.tab;


    document

      .getElementById(

        `${target}RequestsContainer`

      )

      .classList.add(
        "active"
      );

  };

});  
