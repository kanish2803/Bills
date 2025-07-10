function addProduct() {
  const type = document.getElementById('productType').value;
  const name = document.getElementById('productName').value;
  const id = document.getElementById('productId').value;
  const qty = +document.getElementById('qty').value;
  const price = +document.getElementById('price').value;

  if (!name || !qty || !price) return alert("Fill all product fields");

  const table = document.querySelector("#productTable tbody");
  const row = table.insertRow();
  row.insertCell(0).innerText = type;
  row.insertCell(1).innerText = name;
  row.insertCell(2).innerText = id;
  row.insertCell(3).innerText = qty;
  row.insertCell(4).innerText = price.toFixed(2);
  row.insertCell(5).innerText = (qty * price).toFixed(2);

  updateTotal();
}

function updateTotal() {
  let total = 0;
  document.querySelectorAll("#productTable tbody tr").forEach(row => {
    total += parseFloat(row.cells[5].innerText);
  });
  document.getElementById("totalCell").innerText = "Rs " + total.toFixed(2);
}

function generateBill() {
  document.querySelectorAll('.no-print').forEach(el => el.style.display = 'none');
  window.print();
  document.querySelectorAll('.no-print').forEach(el => el.style.display = '');
}

function downloadPDF() {
  html2pdf().from(document.getElementById("bill")).save("MS-Mobile-Bill.pdf");
}

function startScanner() {
  document.getElementById("scannerContainer").style.display = "block";

  Quagga.init({
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector("#scanner"),
      constraints: {
        facingMode: "environment"
      }
    },
    decoder: {
      readers: ["code_128_reader", "ean_reader", "ean_8_reader"]
    }
  }, err => {
    if (err) {
      console.error(err);
      alert("Scanner failed to start");
      return;
    }
    Quagga.start();
  });

  Quagga.onDetected(data => {
    const code = data.codeResult.code;
    if (/^\\d{15}$/.test(code)) {
      document.getElementById("productId").value = code;
      stopScanner();
    } else {
      alert("Invalid IMEI. Must be 15-digit number.");
    }
  });
}

function stopScanner() {
  Quagga.stop();
  document.getElementById("scannerContainer").style.display = "none";
}
