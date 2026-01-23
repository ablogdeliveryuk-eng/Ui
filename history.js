// ---------------------------
// Transaction History Data
// ---------------------------
const historyData = [
  { date: "2025-01-14", desc: "Amazon Purchase", amount: "-$1,200", status: "Completed", recipientName: "Amazon Inc.", recipientAccount: "****1234", recipientBank: "Amazon Payments" },
  { date: "2025-02-02", desc: "Salary Credit", amount: "+$4,500", status: "Completed", recipientName: "John Doe", recipientAccount: "****5678", recipientBank: "Chase Bank" },
  { date: "2025-03-11", desc: "Electricity Bill", amount: "-$180", status: "Completed", recipientName: "Electric Co.", recipientAccount: "****1122", recipientBank: "Utility Bank" },
  { date: "2025-04-07", desc: "Wire Transfer", amount: "-$15,000", status: "Completed", recipientName: "Jane Smith", recipientAccount: "****3344", recipientBank: "Bank of America" },
  { date: "2025-05-21", desc: "Investment Dividend", amount: "+$2,300", status: "Completed", recipientName: "XYZ Investments", recipientAccount: "****5566", recipientBank: "Capital One" },
  { date: "2025-06-10", desc: "Netflix Subscription", amount: "-$19.99", status: "Completed", recipientName: "Netflix", recipientAccount: "****7788", recipientBank: "Netflix Payments" },
  { date: "2025-07-03", desc: "ATM Withdrawal", amount: "-$500", status: "Completed", recipientName: "Self", recipientAccount: "****0001", recipientBank: "Chase Bank" },
  { date: "2025-08-16", desc: "Transfer to John Doe", amount: "-$3,200", status: "Completed", recipientName: "John Doe", recipientAccount: "****9876", recipientBank: "Bank of America" },
  { date: "2025-09-09", desc: "Bonus Payment", amount: "+$1,800", status: "Completed", recipientName: "Employer Inc.", recipientAccount: "****1122", recipientBank: "Chase Bank" },
  { date: "2025-10-28", desc: "Online Purchase", amount: "-$750", status: "Completed", recipientName: "Online Shop", recipientAccount: "****3344", recipientBank: "PayPal" },
  // NEW 10 RANDOM TRANSACTIONS
  { date: "2025-11-05", desc: "Spotify Subscription", amount: "-$14.99", status: "Completed", recipientName: "Spotify", recipientAccount: "****5566", recipientBank: "Spotify Payments" },
  { date: "2025-11-12", desc: "Gym Membership", amount: "-$60", status: "Completed", recipientName: "FitGym", recipientAccount: "****7788", recipientBank: "FitBank" },
  { date: "2025-11-15", desc: "Apple Store Purchase", amount: "-$1,250", status: "Completed", recipientName: "Apple Store", recipientAccount: "****9900", recipientBank: "Apple Payments" },
  { date: "2025-11-18", desc: "Dividend Payout", amount: "+$1,200", status: "Completed", recipientName: "XYZ Investments", recipientAccount: "****3344", recipientBank: "Capital One" },
  { date: "2025-11-20", desc: "Uber Ride", amount: "-$25", status: "Completed", recipientName: "Uber", recipientAccount: "****6677", recipientBank: "Uber Payments" },
  { date: "2025-11-23", desc: "Amazon Purchase", amount: "-$320", status: "Completed", recipientName: "Amazon Inc.", recipientAccount: "****1234", recipientBank: "Amazon Payments" },
  { date: "2025-11-25", desc: "PayPal Transfer", amount: "-$400", status: "Completed", recipientName: "Freelancer Jane", recipientAccount: "****5566", recipientBank: "PayPal" },
  { date: "2025-11-27", desc: "Freelance Payment", amount: "+$800", status: "Completed", recipientName: "Self", recipientAccount: "****0001", recipientBank: "Chase Bank" },
  { date: "2025-11-30", desc: "Grocery Store", amount: "-$150", status: "Completed", recipientName: "Grocery Mart", recipientAccount: "****1122", recipientBank: "Local Bank" },
  { date: "2025-12-02", desc: "Charity Donation", amount: "-$200", status: "Completed", recipientName: "Helping Hands", recipientAccount: "****3344", recipientBank: "Charity Bank" }
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

      // Download PDF
      modal.querySelector("#download-receipt").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Header
  doc.setFontSize(18);
  doc.text("Transaction Receipt", 105, 20, null, null, "center");

  doc.setFontSize(11);
  doc.text(`Transaction ID: TX-${Math.floor(Math.random()*1000000)}`, 20, 35);
  doc.text(`Reference Number: REF-${Math.floor(Math.random()*1000000)}`, 20, 42);
  doc.text(`Payment Date: ${tx.date}`, 20, 49);
  doc.text(`Time-Stamp: ${new Date().toLocaleTimeString()}`, 20, 56);

  doc.line(20, 60, 190, 60); // horizontal line

  doc.setFontSize(12);
  doc.text("Transfer Details", 20, 68);
  doc.setFontSize(11);
  doc.text(`Payment Amount: ${tx.amount}`, 20, 75);
  doc.text("Transaction Fee: $0.00", 20, 82);

  doc.line(20, 86, 190, 86); // horizontal line

  doc.setFontSize(12);
  doc.text("Account Information", 20, 94);
  doc.setFontSize(11);
  doc.text("From Account: JPMorgan Chase Bank, N.A. (****8433)", 20, 101);
  doc.text(`To Account: ${tx.recipientAccount}`, 20, 108);
  doc.text(`Recipient Name: ${tx.recipientName}`, 20, 115);
  doc.text(`Recipient Bank: ${tx.recipientBank}`, 20, 122);

  doc.line(20, 126, 190, 126); // horizontal line

  doc.setFontSize(12);
  doc.text("Authorization Statement", 20, 134);
  doc.setFontSize(11);
  doc.text(
    "I hereby confirm that I have authorized an electronic debit from my payment account in the amount stated above. This transaction was approved by the account holder and processed in accordance with applicable banking regulations.",
    20,
    141,
    { maxWidth: 170 }
  );

  doc.line(20, 160, 190, 160); // horizontal line

  doc.text(`Transaction Status: ${tx.status}`, 20, 168);

  doc.line(20, 172, 190, 172); // horizontal line

  doc.setFontSize(9);
  doc.text("This receipt was generated electronically.", 20, 180);

  doc.save(`receipt-${tx.date}.pdf`);
});
      
// Initialize
handleViewReceiptClicks();
