// ===== HARD-CODED INCOME TRANSACTION =====
const incomeTransaction = {
  id: 100811,
  ref: "REF2026023",
  type: "income",
  text: "Profit distribution from interior design & furniture investment",
  amount: 500000.00,
  date: "2026-01-23T10:30:00",
  status: "completed",
  recipient: "Charles Williams",
  account: "21908488433",
  bank: "JP Morgan Chase Bank",
  senderName: "Johnny Adams",
  senderAccount: "15623948807",
  senderBank: "Wells Fargo",
  note: ""
};

// ===== HELPER FUNCTIONS =====
function formatCurrency(amount) {
  return "$" + amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function renderTransaction(tx) {
  const dateObj = new Date(tx.date);
  document.getElementById("r-id").textContent = tx.id;
  document.getElementById("r-ref").textContent = tx.ref;
  document.getElementById("r-date").textContent = dateObj.toLocaleDateString();
  document.getElementById("r-time").textContent = dateObj.toLocaleTimeString('en-US', { hour12: false });
  document.getElementById("r-amount").textContent = formatCurrency(tx.amount);
  document.getElementById("r-recipient").textContent = `${tx.recipient} — ${tx.account} (${tx.bank})`;
  document.getElementById("r-sender").textContent = `${tx.senderName} — ${tx.senderAccount} (${tx.senderBank})`;
  document.getElementById("r-status").textContent = tx.status === "completed" ? "Completed ✔" : tx.status;
}

// ===== RENDER ON LOAD =====
renderTransaction(incomeTransaction);

// ===== PDF DOWNLOAD =====
document.getElementById("download-receipt").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Transaction data
  const tx = incomeTransaction;
  const dateObj = new Date(tx.date);

  doc.setFontSize(18);
  doc.text("Income Transaction Receipt", 105, 20, { align: "center" });

  doc.setFontSize(12);
  let y = 40;
  doc.text(`Transaction ID: ${tx.id}`, 20, y); y += 8;
  doc.text(`Reference Number: ${tx.ref}`, 20, y); y += 8;
  doc.text(`Date: ${dateObj.toLocaleDateString()}`, 20, y); y += 8;
  doc.text(`Time: ${dateObj.toLocaleTimeString('en-US', { hour12: false })}`, 20, y); y += 8;
  doc.text(`Amount: ${formatCurrency(tx.amount)}`, 20, y); y += 8;
  doc.text(`Recipient: ${tx.recipient} — ${tx.account} (${tx.bank})`, 20, y); y += 8;
  doc.text(`Sender: ${tx.senderName} — ${tx.senderAccount} (${tx.senderBank})`, 20, y); y += 8;
  doc.text(`Status: ${tx.status === "completed" ? "Completed ✔" : tx.status}`, 20, y); y += 12;

  doc.save(`Income_Transaction_${tx.id}.pdf`);
});
