export const getExportFileName = (ext) => {
    const d = new Date();
    const pad = (n) => n.toString().padStart(2, "0");
    const day = pad(d.getDate());
    const month = pad(d.getMonth() + 1);
    const year = d.getFullYear().toString().slice(-2);
    let hours = d.getHours();
    const minutes = pad(d.getMinutes());
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `export-data-${day}-${month}-${year}-${hours}-${minutes}${ampm}.${ext}`;
};

export const downloadFile = (content, filename, mime) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], { type: mime }));
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

/** Remove loader row if it exists */
export const removeLoaderIfExists = (tableRef) => {
    if (!tableRef?.current) return;
    const loader = tableRef.current.querySelector("#loader-row");
    if (loader) loader.remove();
};

/** Export SQL from a table */
export const exportSQL = (tableRef) => {
    if (!tableRef?.current) return;
    const table = tableRef.current;
    const rows = table.querySelectorAll("tbody tr");
    const headers = [...table.querySelectorAll("thead th")]
        .map((th) => th.innerText.trim())
        .map((h) => h.replace(/[^a-zA-Z0-9_]/g, "_"));

    let sql = `INSERT INTO activity_log (${headers.join(", ")}) VALUES\n`;
    const values = [];
    rows.forEach((row) => {
        const cols = [...row.querySelectorAll("td")];
        if (!cols.length) return;
        const rowValues = cols.map((td) => `'${td.innerText.replace(/'/g, "''").trim()}'`);
        values.push(`(${rowValues.join(", ")})`);
    });
    sql += values.join(",\n") + ";";
    downloadFile(sql, getExportFileName("sql"), "text/sql");
};

/** Export HTML-based files (Excel, DOC) */
export const exportHTML = (tableRef, ext = "xls", mime = "application/vnd.ms-excel") => {
    if (!tableRef?.current) return;
    const html = `<html><head><meta charset="UTF-8"></head><body>${tableRef.current.outerHTML}</body></html>`;
    downloadFile(html, getExportFileName(ext), mime);
};

/** Export PDF */
export const exportPDF = (tableRef) => {
    if (!tableRef?.current) return;
    const filename = getExportFileName("pdf");
    const win = window.open("");
    win.document.write(`
      <html>
        <head>
          <title>${filename}</title>
          <style>
            table { width:100%; border-collapse:collapse }
            th, td { border:1px solid #000; padding:5px }
          </style>
        </head>
        <body>${tableRef.current.outerHTML}</body>
      </html>
    `);
    win.document.close();
    win.print();
};

/** Export CSV/TXT using simple-datatables instance */
export const exportCSV = (dataTableRef) => {
    if (!dataTableRef?.current) return;
    simpleDatatables.exportCSV(dataTableRef.current, {
        download: true,
        filename: getExportFileName("csv"),
    });
};

export const exportTXT = (dataTableRef) => {
    if (!dataTableRef?.current) return;
    simpleDatatables.exportTXT(dataTableRef.current, {
        download: true,
        filename: getExportFileName("txt"),
    });
};
