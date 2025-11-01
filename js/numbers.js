// Seleciona elementos usados no fluxo
const form = document.querySelector("form");
const formPanel = document.querySelector("form .form");
const resultPanel = document.querySelector("form .form-result");
const container_result = document.querySelector("#content-number");
const button = document.querySelector("#button");
const inputs = document.querySelectorAll(".input-wrapper input");
const checkbox = document.getElementById("toggle-no-repeat");

// Manter degradê enquanto o campo estiver preenchido
inputs.forEach((input) => {
  const wrapper = input.closest(".number");

  input.addEventListener("input", () => {
    const hasValue = input.value.trim() !== "";
    wrapper.classList.toggle("filled", hasValue);
  });

  input.dispatchEvent(new Event("input"));
});

// Controle de ícone do botão principal
function setButtonIcon(icon) {
  const img = button.querySelector("img");
  // Impedi o error caso o img não exista
  if (!img) return;

  const iconMap = {
    arrow: "./assets/arrow.svg",
    reloading: "./assets/reloading.svg",
  };

  img.src = iconMap[icon] ?? iconMap.arrow;
}
function showFormPanel() {
  formPanel.classList.remove("none");
  resultPanel.classList.add("none");
  setButtonIcon("arrow");
}
function showResultPanel() {
  formPanel.classList.add("none");
  resultPanel.classList.remove("none");
  setButtonIcon("reloading");
}

// Restringe inputs para aceitar apenas números
function enforceNumericInput(input) {
  const safeKeys = new Set([
    "Backspace",
    "Delete",
    "ArrowLeft",
    "ArrowRight",
    "Tab",
  ]);

  input.addEventListener("keydown", (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (safeKeys.has(event.key)) return;
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  });

  input.addEventListener("paste", (event) => {
    const pasted = event.clipboardData?.getData("text") ?? "";
    if (/\D/.test(pasted)) {
      event.preventDefault();
    }
  });

  input.addEventListener("input", () => {
    input.value = input.value.replace(/\D+/g, "");
  });
}
inputs.forEach(enforceNumericInput);

// Utilidades de sorteio
function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildRange(min, max) {
  return Array.from({ length: max - min + 1 }, (_, index) => min + index);
}

function shuffle(numbers) {
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  return numbers;
}

function drawNumbersWithoutRepetition({ quantity, min, max }) {
  const pool = buildRange(min, max);
  shuffle(pool);
  return pool.slice(0, quantity);
}

function drawNumbersWithRepetition({ quantity, min, max }) {
  const results = [];
  for (let i = 0; i < quantity; i++) {
    results.push(randomInRange(min, max));
  }
  return results;
}

function renderResults(numbers) {
  container_result.innerHTML = "";

  numbers.forEach((value) => {
    const span = document.createElement("span");
    span.classList.add("animationresult");
    span.textContent = value;

    container_result.appendChild(span);
  });
}

// Fluxo de envio do formulário
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formIsVisible = !formPanel.classList.contains("none");

  if (!formIsVisible) {
    showFormPanel();
    return;
  }

  const [quantityInput, minInput, maxInput] = inputs;
  const quantityRaw = quantityInput.value.trim();
  const minRaw = minInput.value.trim();
  const maxRaw = maxInput.value.trim();

  if (!quantityRaw || !minRaw || !maxRaw) {
    alert("Preencha todos os campos.");
    return;
  }

  if (quantityRaw === "0") {
    alert("'NÚMEROS' deve ser diferente de 0.");
    return;
  }

  const quantity = Number(quantityRaw);
  const min = Number(minRaw);
  const max = Number(maxRaw);

  if (
    !Number.isInteger(quantity) ||
    !Number.isInteger(min) ||
    !Number.isInteger(max)
  ) {
    alert("Use apenas números inteiros.");
    return;
  }

  if (min >= max) {
    alert('O valor "DE" precisa ser menor que "ATÈ".');
    return;
  }

  const availableNumbers = max - min + 1;
  if (checkbox.checked && quantity > availableNumbers) {
    alert(
      "NÚMEROS deve ser menor ou igual ao intervalo entre 'DE' e 'ATÈ' quando não repetir estiver ativo."
    );
    return;
  }

  const params = { quantity, min, max };
  const numbers = checkbox.checked
    ? drawNumbersWithoutRepetition(params)
    : drawNumbersWithRepetition(params);

  renderResults(numbers);
  showResultPanel();
});

// Estado inicial
showFormPanel();
