document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("proposalForm");
  const generateBtn = document.getElementById("generateBtn");
  const btnIcon = document.getElementById("btnIcon");
  const loadingSpinner = document.getElementById("loadingSpinner");
  const proposalOutput = document.getElementById("proposalOutput");
  const emptyState = document.getElementById("emptyState");
  const copyBtn = document.getElementById("copyBtn");
  const downloadBtn = document.getElementById("downloadBtn");

  // =========================
  // FORM SUBMIT
  // =========================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setLoading(true);

    emptyState.classList.add("hidden");
    proposalOutput.innerHTML = "";

    const formData = {
      clientName: document.getElementById("clientName").value,
      projectNeeds: document.getElementById("projectNeeds").value,
      timeline: document.getElementById("timeline").value,
      budget: document.getElementById("budget").value,
    };

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      proposalOutput.innerHTML = data.proposal;

      copyBtn.disabled = false;
      downloadBtn.disabled = false;
    } catch (err) {
      proposalOutput.innerHTML =
        `<p class="text-red-600">Failed to generate proposal</p>`;
    } finally {
      setLoading(false);
    }
  });

  // =========================
  // COPY
  // =========================
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(proposalOutput.innerText);
    copyBtn.innerText = "Copied ✓";
    setTimeout(() => (copyBtn.innerText = "Copy"), 2000);
  });

  // =========================
  // DOWNLOAD PDF (FIXED)
  // =========================
  downloadBtn.addEventListener("click", async () => {
    downloadBtn.disabled = true;
    downloadBtn.innerText = "Preparing...";

    // 🔥 CREATE CLEAN PDF ROOT (NO SCROLL / NO STICKY)
    const pdfRoot = document.createElement("div");
    pdfRoot.style.width = "800px";
    pdfRoot.style.padding = "40px";
    pdfRoot.style.background = "#ffffff";
    pdfRoot.style.color = "#1f2937";
    pdfRoot.style.fontFamily = "Inter, sans-serif";

    // LOGO
    const logo = document.createElement("img");
    logo.src = document.getElementById("pdfLogo").src;
    logo.style.width = "150px";
    logo.style.display = "block";
    logo.style.margin = "0 auto 30px";
    pdfRoot.appendChild(logo);

    // CONTENT (PURE HTML, NO SCROLL)
    const content = document.createElement("div");
    content.innerHTML = proposalOutput.innerHTML;

    // REMOVE EMPTY STATE IF EXISTS
    const empty = content.querySelector("#emptyState");
    if (empty) empty.remove();

    // FORCE VISIBILITY (CRITICAL FIX)
    content.querySelectorAll("*").forEach((el) => {
      el.style.overflow = "visible";
      el.style.maxHeight = "none";
    });

    pdfRoot.appendChild(content);

    // ATTACH TO DOM (MANDATORY)
    document.body.appendChild(pdfRoot);

    // WAIT FOR LOGO LOAD
    await new Promise((resolve) => {
      if (logo.complete) resolve();
      else logo.onload = resolve;
    });

    // GENERATE PDF
    html2pdf()
      .set({
        margin: 10,
        filename: "FutureDesk_Proposal.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          scrollY: 0,
          windowWidth: 1200,
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(pdfRoot)
      .save()
      .then(() => {
        document.body.removeChild(pdfRoot);
        downloadBtn.disabled = false;
        downloadBtn.innerText = "Download PDF";
      });
  });

  // =========================
  // HELPERS
  // =========================
  function setLoading(state) {
    generateBtn.disabled = state;
    btnIcon.classList.toggle("hidden", state);
    loadingSpinner.classList.toggle("hidden", !state);
  }
});
