export interface GridOptions {
    totalRows: number;
    totalCols: number;
    defaultRowHeight: number;
    defaultColWidth: number;
    headerHeight: number;
    headerWidth: number;
}

export interface Viewport {
    scrollX: number;
    scrollY: number;
    width: number;
    height: number;
}


export interface VisibleRange {
    startRow: number;
    endRow: number;
    startCol: number;
    endCol: number;
}


export interface HitTestContext {
    headerWidth: number;
    headerHeight: number;
    scrollX: number;
    scrollY: number;
    rowHeights: readonly number[];
    columnWidths: readonly number[];
}

export interface CellSelectionConfig {
    type: "cell";
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
    originRow: number;
    originCol: number;
}