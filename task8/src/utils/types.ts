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