// Seleção dos elementos do formulário
const form = document.querySelector("form");
const form1 = document.querySelector("form .form");
const formResult = document.querySelector("form .form-result");
const button = document.querySelector("button");
const inputs = document.querySelectorAll(".input-wrapper input");
const checkbox = document.getElementById("toggle-no-repeat");

// Bloqueia tudo que não for número
inputs.forEach((input) => {
  input.addEventListener("keydown", (event) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
    ];

    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  });

  input.addEventListener("paste", (event) => {
    const pasted = event.clipboardData.getData("text");
    if (/\D/.test(pasted)) {
      event.preventDefault();
    }
  });

  input.addEventListener("input", () => {
    input.value = input.value.replace(/\D+/g, "");
  });
});

// Validação ao enviar
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const [quantityOfInputs, minInput, maxInput] = inputs;

  const rawQuantity = quantityOfInputs.value;
  const quantityOfInput = Number(quantityOfInputs.value);
  const min = Number(minInput.value);
  const max = Number(maxInput.value);
  let availableNumbers = max - min + 1;

  function validarCampos() {
    if (rawQuantity === "0") return "'NÚMEROS' deve ser diferente de 0";
    if (
      !quantityOfInputs.value.trim() ||
      !minInput.value.trim() ||
      !maxInput.value.trim()
    )
      return "Preencha todos os campos.";
    if (min >= max) return 'O valor "DE" precisa ser menor que o de "ATÈ".';
    if (checkbox.checked && quantityOfInput > availableNumbers)
      return "NÚMEROS deve ser menor ou igual ao intervalo entre 'DE' e 'ATÈ' quando não repetir estiver ativo.";

    return null;
  }

  const erro = validarCampos();
  if (erro) {
    alert(erro);
    return;
  }

  console.log(quantityOfInput, min, max);
});
