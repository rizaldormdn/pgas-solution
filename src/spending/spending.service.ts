import { Injectable } from "@nestjs/common";
import { SpendingRepository } from "./spending.repository";
import * as ExcelJS from "exceljs";
import * as PDFDocument from "pdfkit";
import { Response } from "express";

@Injectable()
export class SpendingService {
  constructor(private readonly spendingRepository: SpendingRepository) {}

  private formatDate(date: string | Date | undefined | null): string {
    if (!date) return "-";
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return "-";

      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");

      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch {
      return "-";
    }
  }

  private formatCurrency(amount: number | string | undefined | null): string {
    if (!amount) return "Rp 0";
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(num)) return "Rp 0";
    return `Rp ${num.toLocaleString("id-ID")}`;
  }

  async getReport(query: {
    minSpending?: number;
    maxSpending?: number;
    startDate?: string;
    endDate?: string;
  }) {
    const [data, total] = await Promise.all([
      this.spendingRepository.getReport(query),
      this.spendingRepository.getTotalSpending(query),
    ]);

    return {
      status: "success",
      message: "Report retrieved successfully",
      data,
      total,
    };
  }

  async exportXlsx(
    res: Response,
    query: {
      minSpending?: number;
      maxSpending?: number;
      startDate?: string;
      endDate?: string;
    },
  ) {
    const [data, total] = await Promise.all([
      this.spendingRepository.getReport(query),
      this.spendingRepository.getTotalSpending(query),
    ]);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Spending Report");

    // Setup columns with better formatting
    worksheet.columns = [
      { header: "No", key: "no", width: 8 },
      { header: "Date & Time", key: "spending_date", width: 20 },
      { header: "Employee", key: "employee_name", width: 25 },
      { header: "Department", key: "department_name", width: 20 },
      { header: "Amount", key: "spending", width: 18 },
    ];

    // Style header
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, size: 11 };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };

    // Add data with formatted date
    data.forEach((item: any, index: number) => {
      const row = worksheet.addRow({
        no: index + 1,
        spending_date: this.formatDate(item.spending_date),
        employee_name: item.employee_name || "-",
        department_name: item.department_name || "-",
        spending: Number(item.spending) || 0,
      });

      // Style each row
      row.alignment = { vertical: "middle" };
      row.getCell(5).numFmt = "#,##0.00";
    });

    // Add total row
    const totalRow = worksheet.addRow({
      no: "",
      spending_date: "",
      employee_name: "",
      department_name: "TOTAL",
      spending: total || 0,
    });

    // Style total row
    totalRow.font = { bold: true, size: 11 };
    totalRow.alignment = { horizontal: "center", vertical: "middle" };
    totalRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD3D3D3" },
    };
    totalRow.getCell(5).numFmt = "#,##0.00";

    // Add borders
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=spending-report-${Date.now()}.xlsx`,
    );

    await workbook.xlsx.write(res);
    res.end();
  }

  async exportPdf(
    res: Response,
    query: {
      minSpending?: number;
      maxSpending?: number;
      startDate?: string;
      endDate?: string;
    },
  ) {
    const [data, total] = await Promise.all([
      this.spendingRepository.getReport(query),
      this.spendingRepository.getTotalSpending(query),
    ]);

    const doc = new PDFDocument({
      margin: 30,
      size: "A4",
      info: {
        Title: "Spending Report",
        Author: "System",
      },
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=spending-report-${Date.now()}.pdf`,
    );

    doc.pipe(res);

    // Header Section
    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .text("SPENDING REPORT", { align: "center" });
    doc.moveDown(0.5);

    doc.moveDown();

    // Filter Information
    doc.fontSize(9).font("Helvetica");
    const filters: string[] = [];
    if (query.minSpending) {
      filters.push(`Min Spending: ${this.formatCurrency(query.minSpending)}`);
    }
    if (query.maxSpending) {
      filters.push(`Max Spending: ${this.formatCurrency(query.maxSpending)}`);
    }

    if (filters.length > 0) {
      filters.forEach((filter, index) => {
        doc.text(filter, { indent: 30 });
        if (index === filters.length - 1) doc.moveDown();
      });
    }

    const tableTop = doc.y + 5;
    const pageWidth = doc.page.width - 60; // 30 margin kiri + 30 margin kanan
    const tableWidth = 420; // Lebar tabel
    const startX = (doc.page.width - tableWidth) / 2; // Hitung posisi center

    const colPositions = {
      no: { x: startX, width: 25 },
      date: { x: startX + 25, width: 85 },
      employee: { x: startX + 110, width: 120 },
      department: { x: startX + 230, width: 100 },
      amount: { x: startX + 330, width: 90 },
    };

    // Draw table header background - gunakan startX
    doc.rect(startX, tableTop - 3, tableWidth, 20).fill("#E8E8E8");

    doc.fontSize(9).font("Helvetica-Bold");
    doc.fillColor("black");
    doc.text("No", colPositions.no.x, tableTop);
    doc.text("Date & Time", colPositions.date.x, tableTop);
    doc.text("Employee", colPositions.employee.x, tableTop);
    doc.text("Department", colPositions.department.x, tableTop);
    doc.text("Amount", colPositions.amount.x, tableTop);

    // Draw header line - gunakan startX
    doc
      .moveTo(startX, tableTop + 17)
      .lineTo(startX + tableWidth, tableTop + 17)
      .stroke();

    // Table Body - update semua posisi x
    doc.font("Helvetica").fontSize(8);
    let y = tableTop + 25;

    data.forEach((item: any, index: number) => {
      if (y > 780) {
        doc.addPage();
        y = 30;
        // Redraw header on new page - gunakan startX
        doc.fontSize(9).font("Helvetica-Bold");
        doc.text("No", colPositions.no.x, y);
        doc.text("Date & Time", colPositions.date.x, y);
        doc.text("Employee", colPositions.employee.x, y);
        doc.text("Department", colPositions.department.x, y);
        doc.text("Amount", colPositions.amount.x, y);
        doc
          .moveTo(startX, y + 17)
          .lineTo(startX + tableWidth, y + 17)
          .stroke();
        y += 25;
        doc.font("Helvetica").fontSize(8);
      }

      // Alternating row colors - gunakan startX
      if (index % 2 === 0) {
        doc.rect(startX, y - 3, tableWidth, 12).fill("#F5F5F5");
        doc.fillColor("black");
      }

      // Text alignment di dalam cell (rata kiri untuk semua kecuali Amount)
      doc.text(String(index + 1), colPositions.no.x, y);
      doc.text(this.formatDate(item.spending_date), colPositions.date.x, y);
      doc.text(item.employee_name || "-", colPositions.employee.x, y);
      doc.text(item.department_name || "-", colPositions.department.x, y);
      doc.text(this.formatCurrency(item.spending), colPositions.amount.x, y);

      y += 14;
    });

    // Total Section - gunakan startX
    const totalY = y + 10;

    doc
      .moveTo(startX, totalY - 5)
      .lineTo(startX + tableWidth, totalY - 5)
      .stroke();

    doc.rect(startX, totalY - 3, tableWidth, 16).fill("#E8E8E8");
    doc.fillColor("black");

    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("TOTAL", colPositions.department.x, totalY);
    doc.text(this.formatCurrency(total), colPositions.amount.x, totalY);

    // Footer - center
    const footerY = doc.page.height - 30;
    doc
      .fontSize(8)
      .font("Helvetica")
      .fillColor("#666666")
      .text(
        `Total Records: ${data.length} | Generated: ${this.formatDate(new Date())}`,
        30,
        footerY,
        { align: "center", width: doc.page.width - 60 },
      );

    doc.end();
  }
}
