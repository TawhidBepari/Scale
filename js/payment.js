async function createRequest(type){

  const email =
    document.getElementById("customerEmail").value.trim();

  const fullName =
    document.getElementById("customerName").value.trim();

  const country =
    document.getElementById("customerCountry").value.trim();

  if(!fullName){

    alert("Please enter your full name");

    return;
  }

  if(!email){

    alert("Please enter your email");

    return;
  }

  if(!country){

    alert("Please enter your country");

    return;
  }

const {
  data: existingRequest,
  error: checkError
} = await supabaseClient
  .from("payment_requests")
  .select("*")
  .eq("service_id", currentService.id)
  .eq("customer_email", email)
  .eq("payment_type", type)
  .eq("status", "pending");

if(existingRequest && existingRequest.length > 0){

  alert(
    "You already submitted this payment request."
  );

  return;
}

  const { error } = await supabaseClient
    .from("payment_requests")
   .insert([{

  service_id: currentService.id,
  customer_email: email,
  full_name: fullName,
  country: country,
  payment_type: type,
  status: "pending"

}]);

  if(error){

    console.error(error);

    alert(error.message);

    return;
  }

  alert(
    "Your request was received successfully."
  );

 document.getElementById(
  "customerName"
).value = "";

document.getElementById(
  "customerEmail"
).value = "";

document.getElementById(
  "customerCountry"
).value = "";

}
