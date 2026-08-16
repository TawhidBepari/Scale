function startCountdown(deadline){

  const countdown =
    document.getElementById("countdown");

  if(!deadline){

    countdown.innerText = "No deadline";

    return;
  }

  function update(){

    const now = new Date();

    const target = new Date(deadline);

    const diff = target - now;

    if(diff <= 0){

      countdown.innerText = "Expired";

      return;
    }

    const days =
      Math.floor(diff / 1000 / 60 / 60 / 24);

    const hours =
      Math.floor(diff / 1000 / 60 / 60) % 24;

    const minutes =
      Math.floor(diff / 1000 / 60) % 60;

    const seconds =
      Math.floor(diff / 1000) % 60;

    countdown.innerText =
      days + "d " +
      hours + "h " +
      minutes + "m " +
      seconds + "s";

  }

  update();

  setInterval(update,1000);

}

