// ---------------------------
// Transaction History Data
// ---------------------------
const historyData = [
  { date: "2025-01-14", desc: "Amazon Purchase", amount: "-$18,200", status: "Completed", recipientName: "Amazon Inc.", recipientAccount: "****8564", recipientBank: "Amazon Payments" },
  { date: "2025-02-02", desc: "Salary Credit", amount: "+$4,500", status: "Completed", recipientName: "John Doe", recipientAccount: "****7678", recipientBank: "Chase Bank" },
  { date: "2025-03-11", desc: "Electricity Bill", amount: "-$180", status: "Completed", recipientName: "Electric Co.", recipientAccount: "****0847", recipientBank: "Wells Fargo" },
  { date: "2025-04-07", desc: "Wire Transfer", amount: "-$150,000", status: "Completed", recipientName: "Jane Smith", recipientAccount: "****4463", recipientBank: "Bank of America" },
  { date: "2025-05-21", desc: "Investment Dividend", amount: "+$200,300", status: "Completed", recipientName: "Furniture Investments", recipientAccount: "****0867", recipientBank: "Capital One" },
  { date: "2025-06-10", desc: "Netflix Subscription", amount: "-$19.99", status: "Completed", recipientName: "Netflix", recipientAccount: "****7878", recipientBank: "Netflix Payments" },
  { date: "2025-07-03", desc: "ATM Withdrawal", amount: "-$15500", status: "Completed", recipientName: "Self", recipientAccount: "****9088", recipientBank: "Chase Bank" },
  { date: "2025-08-16", desc: "Transfer to Sarah Martinez", amount: "-$35,200", status: "Completed", recipientName: "Sarah Martinez", recipientAccount: "****9876", recipientBank: "Bank of America" },
  { date: "2025-09-09", desc: "Bonus Payment", amount: "+$18000", status: "Completed", recipientName: "Employer Inc.", recipientAccount: "****6564", recipientBank: "Chase Bank" },
  { date: "2025-10-28", desc: "Online Purchase", amount: "-$1750", status: "Completed", recipientName: "Online Shop", recipientAccount: "****2498", recipientBank: "Wells Fargo" },
  // NEW 10 RANDOM TRANSACTIONS
  { date: "2025-11-05", desc: "Spotify Subscription", amount: "-$14.99", status: "Completed", recipientName: "Spotify", recipientAccount: "****7765", recipientBank: "Spotify Payments" },
  { date: "2025-11-12", desc: "Gym Membership", amount: "-$160", status: "Completed", recipientName: "FitGym", recipientAccount: "****7945", recipientBank: "FitBank" },
  { date: "2025-11-15", desc: "Apple Store Purchase", amount: "-$1,250", status: "Completed", recipientName: "Apple Store", recipientAccount: "****0678", recipientBank: "Apple Payments" },
  { date: "2025-11-18", desc: "Dividend Payout", amount: "+$1,200", status: "Completed", recipientName: "Furniture Investments", recipientAccount: "****5644", recipientBank: "Capital One" },
  { date: "2025-11-20", desc: "Uber Ride", amount: "-$25", status: "Completed", recipientName: "Uber", recipientAccount: "****6671", recipientBank: "Uber Payments" },
  { date: "2025-11-23", desc: "Amazon Purchase", amount: "-$30200", status: "Completed", recipientName: "Amazon Inc.", recipientAccount: "****7455", recipientBank: "Amazon Payments" },
  { date: "2025-11-25", desc: "PayPal Transfer", amount: "-$40000", status: "Completed", recipientName: "Freelancer Jane", recipientAccount: "****4573", recipientBank: "PNC Bank" },
  { date: "2025-11-27", desc: "Freelance Payment", amount: "+$1800", status: "Completed", recipientName: "Charles Williams", recipientAccount: "****9675", recipientBank: "Chase Bank" },
  { date: "2025-11-30", desc: "Grocery Store", amount: "-$15000", status: "Completed", recipientName: "Grocery Mart", recipientAccount: "****8799", recipientBank: "Bank Of America" },
  { date: "2025-12-02", desc: "Charity Donation", amount: "-$20000", status: "Completed", recipientName: "Helping Hands", recipientAccount: "****0874", recipientBank: "Citi Bank" }
];

// ---------------------------
// Populate Table with colors
// ---------------------------
const tbody = document.getElementById("history-body");

historyData.forEach(tx => {
  const row = document.createElement("tr");

  // Determine color based on amount
  let amountClass = tx.amount.startsWith("+") ? "income" : "expense";

  row.innerHTML = `
    <td>${tx.date}</td>
    <td>${tx.desc}</td>
    <td class="${amountClass}">${tx.amount}</td>
    <td>${tx.status}</td>
    <td><button class="receipt-btn">View Receipt</button></td>
  `;
  tbody.appendChild(row);
});

      // ---------------------------
// Handle View Receipt Clicks
// ---------------------------
function handleViewReceiptClicks() {
  document.querySelectorAll(".receipt-btn").forEach(btn => {
    btn.addEventListener("click", function() {
      const row = btn.closest("tr");
      const index = Array.from(tbody.children).indexOf(row);
      const tx = historyData[index];

      const modal = document.getElementById("receipt-modal");

      // Fill modal with dashboard-style receipt info
      modal.innerHTML = `
        <div style="background:#fff; padding:20px; width:350px; margin:auto; position:relative;">
          <span id="close-receipt" style="position:absolute; top:10px; right:10px; cursor:pointer;">&times;</span>
          <h2>Transaction Successful ✔</h2>

          <p><strong>Transaction ID:</strong> TX-${Math.floor(Math.random()*1000000)}</p>
          <p><strong>Reference Number:</strong> REF-${Math.floor(Math.random()*1000000)}</p>
          <p><strong>Payment Date:</strong> ${tx.date}</p>
          <p><strong>Time‑Stamp:</strong> ${new Date().toLocaleTimeString()}</p>

          <hr>

          <h3>Transfer Details</h3>
          <p><strong>Payment Amount:</strong> ${tx.amount}</p>
          <p><strong>Transaction Fee:</strong> $0.00</p>

          <hr>

          <h3>Account Information</h3>
          <p><strong>From Account:</strong> JPMorgan Chase Bank, N.A. (****8433)</p>
          <p><strong>To Account:</strong> ${tx.recipientAccount}</p>
          <p><strong>Recipient Name:</strong> ${tx.recipientName}</p>
          <p><strong>Recipient Bank:</strong> ${tx.recipientBank}</p>

          <hr>

          <h3>Authorization Statement</h3>
          <p>
            I hereby confirm that I have authorized an electronic debit from my payment account in the amount stated above.
            This transaction was approved by the account holder and processed in accordance with applicable banking regulations.
          </p>

          <hr>

          <p><strong>Transaction Status:</strong> ${tx.status}</p>

          <hr>

          <small>This receipt was generated electronically.</small>

          <div class="receipt-actions">
            <button id="download-receipt">Download Receipt</button>
          </div>
        </div>
      `;

      modal.style.display = "flex";

      // Close modal
      modal.querySelector("#close-receipt").addEventListener("click", () => {
        modal.style.display = "none";
      });

      // Download PDF for this transaction
      modal.querySelector("#download-receipt").addEventListener("click", () => {
        if (!window.jspdf) return alert("PDF export not available.");
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const details = {
          id: "TX-" + Math.floor(Math.random() * 1000000),
          ref: "REF-" + Math.floor(Math.random() * 1000000),
          date: tx.date,
          time: new Date().toLocaleTimeString("en-US", { hour12: false }),
          amount: tx.amount,
          fee: "0.00",
          recipient: tx.recipientName + " (" + tx.recipientAccount + ")",
          status: tx.status
        };

        let y = 20;

        // Logo
        try {
          const logo = new Image();
          logo.src = "chase-logo.png";
          doc.addImage(logo, "PNG", 20, 12, 35, 12);
        } catch(e){}

        // Watermark
        doc.setTextColor(220);
        doc.setFontSize(40);
        doc.text("CONFIDENTIAL", 105, 150, { align: "center", angle: 30 });
        doc.setTextColor(0);

        // Header
        doc.setFontSize(18);
        doc.text("JPMORGAN CHASE BANK", 105, y, { align: "center" });
        y += 8;
        doc.setFontSize(14);
        doc.text("PAYMENT RECEIPT", 105, y, { align: "center" });
        y += 16;

        // Line
        doc.setLineWidth(0.5);
        doc.line(20, y, 190, y);
        y += 10;

        // Transaction Info
        doc.setFontSize(12);
        doc.text(`Transaction ID: ${details.id}`, 20, y); y+=8;
        doc.text(`Reference Number: ${details.ref}`, 20, y); y+=8;
        doc.text(`Payment Date: ${details.date}`, 20, y); y+=8;
        doc.text(`Time‑Stamp: ${details.time}`, 20, y); y+=12;

        // Transfer Details
        doc.setFontSize(14); doc.text("Transfer Details", 20, y); y+=8;
        doc.setFontSize(12);
        doc.text(`Payment Amount: ${details.amount}`, 20, y); y+=8;
        doc.text(`Transaction Fee: ${details.fee}`, 20, y); y+=8;

        // Account Info
        doc.setFontSize(14); doc.text("Account Information", 20, y); y+=8;
        doc.setFontSize(12);
        doc.text("From Account: JPMorgan Chase Bank, N.A. (****8433)", 20, y); y+=8;
        doc.text("SWIFT / BIC: CHASUS33", 20, y); y+=8;
        doc.text(`To Account: ${details.recipient}`, 20, y); y+=12;

        // Authorization
        doc.setFontSize(14); doc.text("Authorization Statement", 20, y); y+=8;
        doc.setFontSize(12);
        const authText = "I hereby confirm that I have authorized an electronic debit from my payment account in the amount stated above. This transaction was approved by the account holder and processed in accordance with applicable banking regulations.";
        const splitAuth = doc.splitTextToSize(authText, 170);
        doc.text(splitAuth, 20, y);
        y += splitAuth.length * 7 + 4;

        // Status
        doc.setFontSize(12);
        doc.text(`Transaction Status: ${details.status}`, 20, y); y+=12;

        // Footer
        doc.setLineWidth(0.5);
        doc.line(20, y, 190, y); y+=6;
        doc.setFontSize(10);
        doc.text("This receipt was generated electronically.", 105, y, { align: "center" });

        // Save PDF
        doc.save(`${details.id}.pdf`);
      });
    });
  });
}

// Initialize
handleViewReceiptClicks();: "Uber", recipientAccount: "****6677", recipientBank: "Uber Payments" },
  { date: "2025-11-23", desc: "Amazon Purchase", amount: "-$3200", status: "Completed", recipientName: "Amazon Inc.", recipientAccount: "****1234", recipientBank: "Amazon Payments" },
  { date: "2025-11-25", desc: "PayPal Transfer", amount: "-$40000", status: "Completed", recipientName: "Freelancer Jane", recipientAccount: "****4665", recipientBank: "PayPal" },
  { date: "2025-11-27", desc: "Freelance Payment", amount: "+$800", status: "Completed", recipientName: "Sherrif", recipientAccount: "****0689", recipientBank: "Chase Bank" },
  { date: "2025-11-30", desc: "Grocery Store", amount: "-$150", status: "Completed", recipientName: "Grocery Mart", recipientAccount: "****3372", recipientBank: "Local Bank" },
  { date: "2025-12-02", desc: "Charity Donation", amount: "-$22000", status: "Completed", recipientName: "Helping Hands", recipientAccount: "****3774", recipientBank: "Charity Bank" }
];

// ---------------------------
// Populate Table with colors
// ---------------------------
const tbody = document.getElementById("history-body");

historyData.forEach(tx => {
  const row = document.createElement("tr");

  // Determine color based on amount
  let amountClass = tx.amount.startsWith("+") ? "income" : "expense";

  row.innerHTML = `
    <td>${tx.date}</td>
    <td>${tx.desc}</td>
    <td class="${amountClass}">${tx.amount}</td>
    <td>${tx.status}</td>
    <td><button class="receipt-btn">View Receipt</button></td>
  `;
  tbody.appendChild(row);
});

      // ---------------------------
// Handle View Receipt Clicks
// ---------------------------
function handleViewReceiptClicks() {
  document.querySelectorAll(".receipt-btn").forEach(btn => {
    btn.addEventListener("click", function() {
      const row = btn.closest("tr");
      const index = Array.from(tbody.children).indexOf(row);
      const tx = historyData[index];

      const modal = document.getElementById("receipt-modal");

      // Fill modal with dashboard-style receipt info
      modal.innerHTML = `
        <div style="background:#fff; padding:20px; width:350px; margin:auto; position:relative;">
          <span id="close-receipt" style="position:absolute; top:10px; right:10px; cursor:pointer;">&times;</span>
          <h2>Transaction Successful ✔</h2>

          <p><strong>Transaction ID:</strong> TX-${Math.floor(Math.random()*1000000)}</p>
          <p><strong>Reference Number:</strong> REF-${Math.floor(Math.random()*1000000)}</p>
          <p><strong>Payment Date:</strong> ${tx.date}</p>
          <p><strong>Time‑Stamp:</strong> ${new Date().toLocaleTimeString()}</p>

          <hr>

          <h3>Transfer Details</h3>
          <p><strong>Payment Amount:</strong> ${tx.amount}</p>
          <p><strong>Transaction Fee:</strong> $0.00</p>

          <hr>

          <h3>Account Information</h3>
          <p><strong>From Account:</strong> JPMorgan Chase Bank, N.A. (****8433)</p>
          <p><strong>To Account:</strong> ${tx.recipientAccount}</p>
          <p><strong>Recipient Name:</strong> ${tx.recipientName}</p>
          <p><strong>Recipient Bank:</strong> ${tx.recipientBank}</p>

          <hr>

          <h3>Authorization Statement</h3>
          <p>
            I hereby confirm that I have authorized an electronic debit from my payment account in the amount stated above.
            This transaction was approved by the account holder and processed in accordance with applicable banking regulations.
          </p>

          <hr>

          <p><strong>Transaction Status:</strong> ${tx.status}</p>

          <hr>

          <small>This receipt was generated electronically.</small>

          <div class="receipt-actions">
            <button id="download-receipt">Download Receipt</button>
          </div>
        </div>
      `;

      modal.style.display = "flex";

      // Close modal
      modal.querySelector("#close-receipt").addEventListener("click", () => {
        modal.style.display = "none";
      });

      // Download PDF for this transaction
      modal.querySelector("#download-receipt").addEventListener("click", () => {
        if (!window.jspdf) return alert("PDF export not available.");
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const details = {
          id: "TX-" + Math.floor(Math.random() * 1000000),
          ref: "REF-" + Math.floor(Math.random() * 1000000),
          date: tx.date,
          time: new Date().toLocaleTimeString("en-US", { hour12: false }),
          amount: tx.amount,
          fee: "0.00",
          recipient: tx.recipientName + " (" + tx.recipientAccount + ")",
          status: tx.status
        };

        let y = 20;

        // Logo
        try {
          const logo = new Image();
          logo.src = "chase-logo.png";
          doc.addImage(logo, "PNG", 20, 12, 35, 12);
        } catch(e){}

        // Watermark
        doc.setTextColor(220);
        doc.setFontSize(40);
        doc.text("CONFIDENTIAL", 105, 150, { align: "center", angle: 30 });
        doc.setTextColor(0);

        // Header
        doc.setFontSize(18);
        doc.text("JPMORGAN CHASE BANK", 105, y, { align: "center" });
        y += 8;
        doc.setFontSize(14);
        doc.text("PAYMENT RECEIPT", 105, y, { align: "center" });
        y += 16;

        // Line
        doc.setLineWidth(0.5);
        doc.line(20, y, 190, y);
        y += 10;

        // Transaction Info
        doc.setFontSize(12);
        doc.text(`Transaction ID: ${details.id}`, 20, y); y+=8;
        doc.text(`Reference Number: ${details.ref}`, 20, y); y+=8;
        doc.text(`Payment Date: ${details.date}`, 20, y); y+=8;
        doc.text(`Time‑Stamp: ${details.time}`, 20, y); y+=12;

        // Transfer Details
        doc.setFontSize(14); doc.text("Transfer Details", 20, y); y+=8;
        doc.setFontSize(12);
        doc.text(`Payment Amount: ${details.amount}`, 20, y); y+=8;
        doc.text(`Transaction Fee: ${details.fee}`, 20, y); y+=8;

        // Account Info
        doc.setFontSize(14); doc.text("Account Information", 20, y); y+=8;
        doc.setFontSize(12);
        doc.text("From Account: JPMorgan Chase Bank, N.A. (****8433)", 20, y); y+=8;
        doc.text("SWIFT / BIC: CHASUS33", 20, y); y+=8;
        doc.text(`To Account: ${details.recipient}`, 20, y); y+=12;

        // Authorization
        doc.setFontSize(14); doc.text("Authorization Statement", 20, y); y+=8;
        doc.setFontSize(12);
        const authText = "I hereby confirm that I have authorized an electronic debit from my payment account in the amount stated above. This transaction was approved by the account holder and processed in accordance with applicable banking regulations.";
        const splitAuth = doc.splitTextToSize(authText, 170);
        doc.text(splitAuth, 20, y);
        y += splitAuth.length * 7 + 4;

        // Status
        doc.setFontSize(12);
        doc.text(`Transaction Status: ${details.status}`, 20, y); y+=12;

        // Footer
        doc.setLineWidth(0.5);
        doc.line(20, y, 190, y); y+=6;
        doc.setFontSize(10);
        doc.text("This receipt was generated electronically.", 105, y, { align: "center" });

        // Save PDF
        doc.save(`${details.id}.pdf`);
      });
    });
  });
}

// Initialize
handleViewReceiptClicks();
