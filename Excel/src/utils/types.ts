/**
 * Configuration for the Grid Layout and Dimensions.
 */
export interface GridOptions {
    /** The total number of rows in the grid */
    totalRows: number;
    /** The total number of columns in the grid */
    totalCols: number;
    /** The default height for each row */
    defaultRowHeight: number;
    /** The default width for each column */
    defaultColWidth: number;
    /** The height of the header row */
    headerHeight: number;
    /** The width of the header column */
    headerWidth: number;
}

/**
 * Represents a viewport in the grid, containing scroll positions and dimensions.
 */
export interface Viewport {
    /** The x-coordinate of the viewport */
    scrollX: number;
    /** The y-coordinate of the viewport */
    scrollY: number;
    /** The width of the viewport */
    width: number;
    /** The height of the viewport */
    height: number;
}

/**
 * Represents a visible range in the grid, defined by start and end rows and columns.
 */
export interface VisibleRange {
    /** The starting row index of the visible range */
    startRow: number;
    /** The ending row index of the visible range */
    endRow: number;
    /** The starting column index of the visible range */
    startCol: number;
    /** The ending column index of the visible range */
    endCol: number;
}

/**
 * Context Information required for hit testing in the grid.
 * It includes header dimensions, scroll positions, and row/column sizes.
 */
export interface HitTestContext {
    /** The width of the header area */
    headerWidth: number;
    /** The height of the header area */
    headerHeight: number;
    /** The x-coordinate of the viewport */
    scrollX: number;
    /** The y-coordinate of the viewport */
    scrollY: number;
    /** The heights of the rows in the grid */
    rowHeights: readonly number[];
    /** The widths of the columns in the grid */
    columnWidths: readonly number[];
}


/**
 * Represents a cell selection configuration in the grid.
 * It includes the type of selection and the start and end rows and columns.
 */
export interface CellSelectionConfig {
    /** The type of selection (cell, row, or column) */
    type: "cell" | "row" | "col";
    /** The starting row index of the selection */
    startRow: number;
    /** The starting column index of the selection */
    startCol: number;
    /** The ending row index of the selection */
    endRow: number;
    /** The ending column index of the selection */
    endCol: number;
    /** The origin row index of the selection */
    originRow: number;
    /** The origin column index of the selection */
    originCol: number;
}