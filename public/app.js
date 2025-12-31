document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('proposalForm');
    const generateBtn = document.getElementById('generateBtn');
    const btnIcon = document.getElementById('btnIcon');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const proposalOutput = document.getElementById('proposalOutput');
    const emptyState = document.getElementById('emptyState');
    const copyBtn = document.getElementById('copyBtn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // UI: Set Loading State
        setLoading(true);
        emptyState.classList.add('hidden');
        proposalOutput.textContent = ''; // Clear previous content (or keep while loading?) -> Clear is better to show fresh start
        proposalOutput.appendChild(createLoadingPlaceholder()); // Optional: Add a skeleton loader or just keep the spinner on button

        // Get Data
        const formData = {
            clientName: document.getElementById('clientName').value,
            projectNeeds: document.getElementById('projectNeeds').value,
            timeline: document.getElementById('timeline').value,
            budget: document.getElementById('budget').value
        };

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate proposal');
            }

            // Render Result
            proposalOutput.innerHTML = ''; // Remove skeleton
            // formats the text with simple line breaks converted if needed, but whitespace-pre-wrap handles \n
            proposalOutput.innerHTML = data.proposal;

            // Enable Copy and Download
            copyBtn.disabled = false;
            document.getElementById('downloadBtn').disabled = false;

        } catch (error) {
            console.error(error);
            proposalOutput.innerHTML = `<div class="text-red-500 p-4 bg-red-50 rounded-lg">Error: ${error.message}</div>`;
            copyBtn.disabled = true;
            document.getElementById('downloadBtn').disabled = true;
        } finally {
            setLoading(false);
        }
    });

    // Copy to Clipboard Logic
    copyBtn.addEventListener('click', () => {
        if (!proposalOutput.textContent) return;

        navigator.clipboard.writeText(proposalOutput.textContent).then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = `<svg class="w-3.5 h-3.5 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Copied!`;
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy caught', err);
        });
    });

    // Download PDF Logic
    const downloadBtn = document.getElementById('downloadBtn');

    downloadBtn.addEventListener('click', () => {
        if (!proposalOutput.textContent) return;

        // Show loading state on button
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = `<svg class="animate-spin w-3.5 h-3.5 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Saving...`;
        downloadBtn.disabled = true;

        // Clone the content to style it for print if needed, or just print active content
        // For better PDF, we might want to wrap it in a container with a header
        const element = proposalOutput;

        const opt = {
            margin: 1,
            filename: 'FutureDesk_Proposal.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // New Promise-based usage:
        html2pdf().set(opt).from(element).save().then(() => {
            downloadBtn.innerHTML = originalText;
            downloadBtn.disabled = false;
        }).catch(err => {
            console.error('PDF Generation Error:', err);
            downloadBtn.innerHTML = 'Error';
            setTimeout(() => {
                downloadBtn.innerHTML = originalText;
                downloadBtn.disabled = false;
            }, 3000);
        });
    });

    function setLoading(isLoading) {
        if (isLoading) {
            generateBtn.disabled = true;
            generateBtn.classList.add('opacity-75', 'cursor-not-allowed');
            btnIcon.classList.add('hidden');
            loadingSpinner.classList.remove('hidden');
        } else {
            generateBtn.disabled = false;
            generateBtn.classList.remove('opacity-75', 'cursor-not-allowed');
            btnIcon.classList.remove('hidden');
            loadingSpinner.classList.add('hidden');
        }
    }

    function createLoadingPlaceholder() {
        const div = document.createElement('div');
        div.className = 'animate-pulse space-y-4';
        div.innerHTML = `
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 rounded"></div>
            <div class="h-4 bg-gray-200 rounded"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
            <div class="space-y-2 pt-4">
                <div class="h-4 bg-gray-200 rounded"></div>
                <div class="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
        `;
        return div;
    }
});
