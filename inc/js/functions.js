const usd_format = {
  style: "currency",
  currency: "USD",
  currencyDisplay: "symbol",
  minimumFractionDigits: 0
}

const budget = 7500000;
const range_sliders = document.querySelectorAll(".input-inner-wrapper");
const progress_bar = document.querySelector(".progress-bar");

range_sliders.forEach(container => {
  const range = container.querySelector(".rev-slider");
  const bubble = container.querySelector(".bubble");

  range.addEventListener("input", (e) => {
    setRangeOutput(range, bubble);
    const spend = getSpend();
    if( spend > budget ) {
      
      const overspend  = ( spend - budget );
      const range_dollar_amount = bubble.dataset.numberValue;
      const corrected_dollar_amount = range_dollar_amount - overspend;

      if( corrected_dollar_amount >= 0 ) {
        const reversed_dollar = getRangeValue(range.id, corrected_dollar_amount);
        range.value = reversed_dollar;
      } else {
        range.value = 0;
      }
      setRangeOutput(range, bubble);
      e.preventDefault();
      return false;
    }

    let remaining_budget = Math.floor(budget - spend);
    let remaining_budget_percentage = ( ( remaining_budget / budget ) * 100 ).toFixed(2);
    if( remaining_budget_percentage < 0 ) {
      remaining_budget_percentage = 0;
    }
    let total_reduction_time = 0;
    let all_reduction_times = document.querySelectorAll(".lap-time-reduction");
    all_reduction_times.forEach(item => {
      total_reduction_time += parseFloat(item.innerHTML);
    });

    progress_bar.style.width = (remaining_budget_percentage.toString() + "%");
    document.getElementById("remaining-budget").innerHTML = remaining_budget.toLocaleString("en-US", usd_format);
    return true;
  });
  setBubble(range, bubble); //sets initial position of the bubble to the beginning of the range
});

document.getElementById("run-simulation-btn").onclick = function(){
  if(!this.classList.contains('reset-game')){
    this.classList.toggle('reset-game');
    this.innerHTML="Reset Game";
    range_sliders.forEach(slider => {
      slider.querySelector(".rev-slider").disabled = true;
    });
    const lap_time_reductions = document.querySelectorAll(".lap-time-reduction");
    let total_reduction = 0;
    let total_reduction_rounded = 0;
     
    lap_time_reductions.forEach((reduction, i) => {
      setTimeout(function(){
        total_reduction_rounded += Number(reduction.innerHTML);
        total_reduction += Number(reduction.innerHTML);
        document.getElementById('total-reduction').innerHTML = total_reduction_rounded.toFixed(3) + "s";
      }, i * 100);
    });
    document.getElementById('total-reduction').innerHTML = total_reduction;
  } else {
    this.classList.toggle('reset-game');
    this.innerHTML="Run Simulation";
    range_sliders.forEach(slider => {
      const range = slider.querySelector(".rev-slider");
      const bubble = slider.querySelector(".bubble");
      range.disabled = false;
      range.value = 0;
      setRangeOutput(range, bubble);
      progress_bar.style.width = "100%";
      document.getElementById("remaining-budget").innerHTML = budget.toLocaleString("en-US", usd_format);
      document.getElementById('total-reduction').innerHTML = "0.000s";
    });
  }
  
};

//Set's Range Output
function setRangeOutput(range, bubble) {
  bubble.dataset.numberValue = getDollarValue(range.id, range.value);
  range.parentNode.nextElementSibling.innerHTML = ("+" + getBubbleLapTimeValue(range.id, range.value));
  setBubble(range, bubble);
}

function getSpend() {
  let spend = 0;
  let all_bubbles = document.querySelectorAll(".bubble");
  all_bubbles.forEach(item => {
    spend += parseFloat(item.dataset.numberValue);
  });
  return spend;
}

//Source: https://css-tricks.com/value-bubbles-for-range-inputs/
function setBubble(range, bubble) {
  const val = range.value;
  const min = range.min ? range.min : 0; //If range min set, use set min, if not, use 0 as min
  const max = range.max ? range.max : 100; //If range max set, use set max, if not, use 100 as max
  const position_val = Number(((val - min) * 100) / (max - min)); //Calculates thumb's percentage from start of range
  
  bubble.innerHTML = Number(bubble.dataset.numberValue).toLocaleString("en-US", usd_format);

  // Sorta magic numbers based on size of the native UI thumb
  bubble.style.left = `calc(${position_val}% + (${8 - position_val * 0.15}px))`;
}

// Dollars spent calculations
function getDollarValue(range_name, val) {
  switch(range_name) {
    case "drag-reduction-slider":
      return Math.floor((val**3.1));
    case "airflow-optimization-slider":
      return Math.floor((val**3.3));
    case "front-downforce-slider":
      return Math.floor((val**3));
    case "rear-downforce-slider":
      return Math.floor((val**3));
    case "floor-slider":
      return Math.floor((val**2.95));
    case "suspension-slider":
      return Math.floor((val**3.3));
    case "engine-reliability-slider":
      return Math.floor((val**2.98));
    case "turbo-reliability-slider":
      return Math.floor((val**2.87));
    case "energy-recovery-slider":
      return Math.floor((val**3.1));
    case "gearbox-slider":
      return Math.floor((val**3));
    case "weight-redistribution-slider":
      return Math.floor((val**3.1));
    case "weight-reduction-slider":
      return Math.floor((val**3.1));
    case "software-upgrade-slider":
      return Math.floor((val**2.95));
    case "hardware-slider":
      return Math.floor((val**2.85));
  }
}

//Reverses the getDollarValue function
function getRangeValue(range_name, val) {
  switch(range_name) {
    case "drag-reduction-slider":
      return Math.floor((val**(1/3.1)));
    case "airflow-optimization-slider":
      return Math.floor((val**(1/3.3)));
    case "front-downforce-slider":
      return Math.floor((val**(1/3)));
    case "rear-downforce-slider":
      return Math.floor((val**(1/3)));
    case "floor-slider":
      return Math.floor((val**(1/2.95)));
    case "suspension-slider":
      return Math.floor((val**(1/3.3)));
    case "engine-reliability-slider":
      return Math.floor((val**(1/2.98)));
    case "turbo-reliability-slider":
      return Math.floor((val**(1/2.87)));
    case "energy-recovery-slider":
      return Math.floor((val**(1/3.1)));
    case "gearbox-slider":
      return Math.floor((val**(1/3)));
    case "weight-redistribution-slider":
      return Math.floor((val**(1/3.1)));
    case "weight-reduction-slider":
      return Math.floor((val**(1/3.1)));
    case "software-upgrade-slider":
      return Math.floor((val**(1/2.95)));
    case "hardware-slider":
      return Math.floor((val**(1/2.85)));
  }
}

// Lap Time Reduction Calculations.
function getBubbleLapTimeValue(range_name, val) {
  switch(range_name) {
    case "drag-reduction-slider":
      return ((val/100)*0.5).toFixed(2);
    case "airflow-optimization-slider":
      return ((val/100)*0.8).toFixed(2);
    case "front-downforce-slider":
      return ((val/100)*0.5).toFixed(2);
    case "rear-downforce-slider":
      return ((val/100)*0.8).toFixed(2);
    case "floor-slider":
      return ((val/100)*0.8).toFixed(2);
    case "suspension-slider":
      return ((val/100)*0.5).toFixed(2);
    case "engine-reliability-slider":
      return ((val/100)*0.2).toFixed(2);
    case "turbo-reliability-slider":
      return ((val/100)*0.5).toFixed(2);
    case "energy-recovery-slider":
      return ((val/100)*0.8).toFixed(2);
    case "gearbox-slider":
      return ((val/100)*0.2).toFixed(2);
    case "weight-redistribution-slider":
      return ((val/100)*0.2).toFixed(2);
    case "weight-reduction-slider":
      return ((val/100)*0.5).toFixed(2);
    case "software-upgrade-slider":
      return ((val/100)*0.5).toFixed(2);
    case "hardware-slider":
      return ((val/100)*0.2).toFixed(2);
  }
}

document.getElementById("color-switcher").onchange = function(){
  document.documentElement.className = this.value;
}