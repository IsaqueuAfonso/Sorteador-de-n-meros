const inputs = document.querySelectorAll(".input-wrapper input");

inputs.forEach((input) => {
  input.addEventListener("input", () => {
    const wrapper = input.closest(".number");
    if (input.value.trim() !== "") {
      wrapper.classList.add("filled");
    } else {
      wrapper.classList.remove("filled");
    }
  });
});
