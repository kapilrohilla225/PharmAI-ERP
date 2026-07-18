const PDFDocument = require("pdfkit");

const generateInvoice = (sale, company, res) => {
    const companyData = company || {};
    const productName = sale?.product?.productName || "Deleted Product";

    const doc = new PDFDocument({
        size: "A4",
        margin: 50,
        info: {
            Title: `Invoice-${sale.invoiceNumber}`,
            Author: companyData.companyName || "Gloss Pharmaceuticals",
            Subject: "Tax Invoice",
            Keywords: "invoice, pharmacy, medical"
        }
    });

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        `attachment; filename=INV-${sale.invoiceNumber}.pdf`
    );

    doc.pipe(res);

    // ===========================
    // Helper Functions
    // ===========================
    const drawHorizontalLine = (y) => {
        doc.moveTo(50, y)
           .lineTo(550, y)
           .strokeColor("#cccccc")
           .lineWidth(0.5)
           .stroke();
        return doc;
    };

    const drawSectionTitle = (title, y) => {
        doc.fontSize(14)
           .font("Helvetica-Bold")
           .fillColor("#2c3e50")
           .text(title, 50, y, { continued: false });
        return doc;
    };

    // ===========================
    // HEADER SECTION
    // ===========================
    let currentY = 50;

    // Company Logo Area (Left)
    doc.fontSize(24)
       .font("Helvetica-Bold")
       .fillColor("#1a5276")
       .text(companyData.companyName || "Gloss Pharmaceuticals", 50, currentY, {
           align: "left",
           width: 350
       });

    // Company Details (Right aligned)
    doc.fontSize(9)
       .font("Helvetica")
       .fillColor("#555555")
       .text(
           [
               companyData.address || "",
               `Phone: ${companyData.phone || ""}`,
               `GST: ${companyData.gstNumber || ""}`,
               `Email: ${companyData.email || ""}`
           ].filter(Boolean).join("\n"),
           380, currentY, {
               align: "right",
               width: 170
           }
       );

    currentY += 80;

    // Decorative Line
    drawHorizontalLine(currentY);
    currentY += 15;

    // ===========================
    // INVOICE TITLE
    // ===========================
    doc.fontSize(22)
       .font("Helvetica-Bold")
       .fillColor("#2c3e50")
       .text("TAX INVOICE", 50, currentY, {
           align: "center",
           width: 500
       });
    currentY += 40;

    // ===========================
    // INVOICE INFORMATION BOX
    // ===========================
    // Invoice Details - Left Column
    doc.fontSize(10)
       .font("Helvetica")
       .fillColor("#333333");

    // Left Column
    const leftColX = 50;
    const rightColX = 300;
    const rowHeight = 22;

    const invoiceDetails = [
        { label: "Invoice No:", value: sale.invoiceNumber },
        { label: "Invoice Date:", value: new Date(sale.createdAt).toLocaleDateString('en-IN', { 
            day: '2-digit', month: 'short', year: 'numeric' 
        })},
        { label: "Payment Method:", value: sale.paymentMethod.toUpperCase() }
    ];

    invoiceDetails.forEach((item, index) => {
        const y = currentY + (index * rowHeight);
        
        // Label
        doc.font("Helvetica-Bold")
           .fillColor("#2c3e50")
           .text(item.label, leftColX, y, { continued: false });
        
        // Value
        doc.font("Helvetica")
           .fillColor("#333333")
           .text(item.value, leftColX + 100, y);
    });

    // Right Column - Customer Details
    const customerDetails = [
        { label: "Customer:", value: sale.customerName },
        { label: "Phone:", value: sale.customerPhone },
        { label: "Address:", value: sale.customerAddress || "" }
    ];

    customerDetails.forEach((item, index) => {
        const y = currentY + (index * rowHeight);
        
        // Label
        doc.font("Helvetica-Bold")
           .fillColor("#2c3e50")
           .text(item.label, rightColX, y, { continued: false });
        
        // Value
        doc.font("Helvetica")
           .fillColor("#333333")
           .text(item.value, rightColX + 80, y);
    });

    currentY += (invoiceDetails.length * rowHeight) + 10;

    // ===========================
    // TABLE HEADER
    // ===========================
    currentY += 10;
    
    // Table Header Background
    doc.rect(50, currentY, 500, 25)
       .fillColor("#2c3e50")
       .fill();
    
    // Table Header Text
    doc.fillColor("#ffffff")
       .font("Helvetica-Bold")
       .fontSize(10);
    
    const colPositions = {
        item: 60,
        qty: 280,
        price: 360,
        total: 460
    };

    doc.text("Item Description", colPositions.item, currentY + 7);
    doc.text("Qty", colPositions.qty, currentY + 7);
    doc.text("Price", colPositions.price, currentY + 7);
    doc.text("Total", colPositions.total, currentY + 7);

    currentY += 25;

    // ===========================
    // TABLE BODY
    // ===========================
    doc.fillColor("#333333")
       .font("Helvetica")
       .fontSize(10);

    // Product Row
    const rowY = currentY;
    
    // Row with light background for better readability
    doc.rect(50, rowY, 500, 20)
       .fillColor("#f8f9fa")
       .fill();

    doc.fillColor("#333333");
    doc.text(productName, colPositions.item, rowY + 5);
    doc.text(sale.quantity, colPositions.qty, rowY + 5);
    doc.text(`₹${sale.sellingPrice.toFixed(2)}`, colPositions.price, rowY + 5);
    doc.text(`₹${sale.totalAmount.toFixed(2)}`, colPositions.total, rowY + 5);

    currentY += 25;

    // ===========================
    // BOTTOM BORDER LINE
    // ===========================
    drawHorizontalLine(currentY);
    currentY += 20;

    // ===========================
    // TOTALS SECTION
    // ===========================
    // Calculate totals
    const subtotal = sale.totalAmount;
    const tax = 0; // Add tax calculation if needed
    const grandTotal = subtotal + tax;

    // Right-aligned totals box
    const totalsX = 350;
    const totalsStartY = currentY;

    // Subtotal
    doc.font("Helvetica")
       .fontSize(10)
       .fillColor("#555555")
       .text("Subtotal:", totalsX, totalsStartY);
    doc.fillColor("#333333")
       .text(`₹${subtotal.toFixed(2)}`, totalsX + 100, totalsStartY, { align: "right", width: 100 });

    // Tax
    doc.fillColor("#555555")
       .text("Tax (0%):", totalsX, totalsStartY + 20);
    doc.fillColor("#333333")
       .text(`₹${tax.toFixed(2)}`, totalsX + 100, totalsStartY + 20, { align: "right", width: 100 });

    // Grand Total
    const grandTotalY = totalsStartY + 50;
    doc.rect(totalsX - 10, grandTotalY - 5, 160, 30)
       .fillColor("#1a5276")
       .fill();

    doc.fillColor("#ffffff")
       .font("Helvetica-Bold")
       .fontSize(12)
       .text("Grand Total:", totalsX, grandTotalY + 5);
    doc.text(`₹${grandTotal.toFixed(2)}`, totalsX + 100, grandTotalY + 5, { 
        align: "right", 
        width: 100 
    });

    currentY += 100;

    // ===========================
    // TERMS & CONDITIONS
    // ===========================
    currentY += 20;
    
    doc.fontSize(9)
       .font("Helvetica-Bold")
       .fillColor("#2c3e50")
       .text("Terms & Conditions:", 50, currentY);
    
    currentY += 15;
    doc.fontSize(8)
       .font("Helvetica")
       .fillColor("#666666")
       .text(
           [
               "1. Goods once sold will not be taken back.",
               "2. Subject to local jurisdiction.",
               "3. Please check the products at the time of delivery.",
               "4. This is a computer-generated invoice."
           ].join("\n"),
           50, currentY, {
               width: 500
           }
       );

    currentY += 60;

    // ===========================
    // FOOTER / SIGNATURE
    // ===========================
    // Signature Line
    const signatureY = currentY + 40;
    doc.moveTo(400, signatureY)
       .lineTo(550, signatureY)
       .strokeColor("#333333")
       .lineWidth(0.5)
       .stroke();

    doc.fontSize(9)
       .font("Helvetica")
       .fillColor("#555555")
       .text("Authorized Signature", 400, signatureY + 5, {
           align: "right",
           width: 150
       });

    // Footer
    const footerY = doc.page.height - 50;
    drawHorizontalLine(footerY - 20);

    doc.fontSize(8)
       .font("Helvetica")
       .fillColor("#999999")
       .text(
           `Generated by ${companyData.companyName || "Gloss Pharma ERP"} | Invoice: ${sale.invoiceNumber} | ${new Date().toLocaleString()}`,
           50, footerY, {
               align: "center",
               width: 500
           }
       );

    // ===========================
    // WATERMARK / BACKGROUND (Optional)
    // ===========================
    // Add a subtle watermark if desired
    // doc.opacity(0.05)
    //    .fontSize(80)
    //    .font("Helvetica-Bold")
    //    .fillColor("#000000")
    //    .text("INVOICE", 100, 300, {
    //        align: "center",
    //        width: 400,
    //        angle: 45
    //    });
    // doc.opacity(1.0);

    // Finalize PDF
    doc.end();
};

module.exports = { generateInvoice };