document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const messageBox = document.getElementById("formMessage");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      // clear previous messages
      messageBox.innerHTML = "";

      const formData = {
        name: form.name.value,
        email: form.email.value,
        subject: form.subject.value,
        message: form.message.value
      };

      try {
        const response = await fetch("/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });

        const result = await response.text();

        if (response.ok) {
          messageBox.innerHTML = `<span style="color:lightgreen;">✅ ${result}</span>`;
          form.reset();
        } else {
          messageBox.innerHTML = `<span style="color:red;">❌ ${result}</span>`;
        }
      } catch (err) {
        messageBox.innerHTML = `<span style="color:red;">⚠️ Something went wrong. Please try again later.</span>`;
      }
    });
  }
});
