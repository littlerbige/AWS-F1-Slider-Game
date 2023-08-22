const usd_format = {
  style: "currency",
  currency: "USD",
  currencyDisplay: "symbol",
  minimumFractionDigits: 0
}

const range_sliders = document.querySelectorAll(".input-inner-wrapper");
range_sliders.forEach(container => {
  const range = container.querySelector(".rev-slider");
  const bubble = container.querySelector(".bubble");

  range.addEventListener("input", () => {
    setBubble(range, bubble);
  });
  setBubble(range, bubble);
})

function setBubble(range, bubble) {
  const val = range.value;
  console.log(typeof val)
  const min = range.min ? range.min : 0;
  const max = range.max ? range.max : 100;
  const newVal = Number(((val - min) * 100) / (max - min));
  bubble.innerHTML = Number(val).toLocaleString("en-US", usd_format);

  // Sorta magic numbers based on size of the native UI thumb
  bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
}

let budget = 150000000;
let spend = 0

$(document).on('input', '.rev-slider', function() {
    let temp_spend = 0
    let remaining_budget = 150000000;
    $('.rev-slider').each(function(){
        temp_spend += parseFloat(this.value);
    });
    remaining_budget = budget - temp_spend;
    let remaining_budget_percentage = Math.round(( remaining_budget / budget )*100);
    $('.progress-bar').css("width",(remaining_budget_percentage.toString() + "%"));
    $('#remaining-budget').html(remaining_budget.toLocaleString("en-US", usd_format));
});
