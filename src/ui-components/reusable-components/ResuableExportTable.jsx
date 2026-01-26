import React from "react";
import { removeLoaderIfExists, exportSQL, exportHTML, exportPDF, exportCSV, exportTXT } from "../../utils/table-export";
import {
    EXPORT_TABLE_EXPORT_CSV, EXPORT_TABLE_EXPORT_EXCEL, EXPORT_TABLE_EXPORT_PDF, EXPORT_TABLE_EXPORT_SQL, EXPORT_TABLE_EXPORT_TXT
} from "../../lang-dump/lang";

export function ReusableExportTable({ tableRef, dataTableRef }) {

    return (
        <div className="datatable-top d-flex gap-2 pb-4">
            <button className="btn btn-sm btn-outline-primary" onClick={() => { removeLoaderIfExists(tableRef); exportCSV(dataTableRef); }}>{EXPORT_TABLE_EXPORT_CSV}</button>
            <button className="btn btn-sm btn-outline-success" onClick={() => exportHTML(tableRef, "xls")}>{EXPORT_TABLE_EXPORT_EXCEL}</button>
            <button className="btn btn-sm btn-outline-danger" onClick={() => exportPDF(tableRef)}>{EXPORT_TABLE_EXPORT_PDF}</button>
            <button className="btn btn-sm btn-outline-info" onClick={() => exportHTML(tableRef, "doc", "application/msword")}>Export DOC</button>
            <button className="btn btn-sm btn-outline-warning" onClick={() => { removeLoaderIfExists(tableRef); exportTXT(dataTableRef); }}>{EXPORT_TABLE_EXPORT_TXT}</button>
            <button className="btn btn-sm btn-outline-dark" onClick={() => exportSQL(tableRef)}>{EXPORT_TABLE_EXPORT_SQL}</button>
        </div>
    );
};