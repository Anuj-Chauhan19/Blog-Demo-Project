// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

  document.addEventListener("DOMContentLoaded", function () {
  // Initialize Quill
  const quill = new Quill("#quill-editor", {
    theme: "snow",
    placeholder: "Write your blog description here...",
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
      ],
    },
  });

    console.log("Quill initialized:", quill);

  const form = document.querySelector("#blog-form");
  const hiddenInput = document.querySelector("#description");

    console.log("Form found:", form);
  console.log("Hidden input found:", hiddenInput);

  if (form && hiddenInput && quill) {
    form.addEventListener("submit", function (e) {
          console.log("Form submit event triggered");
      const content = quill.root.innerHTML.trim();
      console.log(content);

      if (content === "" || content === "<p><br></p>") {
        e.preventDefault();
        alert("Description is required!");
        return;
      }

      hiddenInput.value = content;
    });
  }
});

//