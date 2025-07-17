export class StatsCalculator {
    static count(cells) {
        return cells.filter(cell => typeof cell.value === 'number').length;
    }
    static min(cells) {
        const nums = cells.filter(cell => typeof cell.value === 'number').map(cell => cell.value);
        return nums.length ? Math.min(...nums) : undefined;
    }
    static max(cells) {
        const nums = cells.filter(cell => typeof cell.value === 'number').map(cell => cell.value);
        return nums.length ? Math.max(...nums) : undefined;
    }
    static sum(cells) {
        return cells.filter(cell => typeof cell.value === 'number').reduce((acc, cell) => acc + cell.value, 0);
    }
    static average(cells) {
        const nums = cells.filter(cell => typeof cell.value === 'number').map(cell => cell.value);
        return nums.length ? StatsCalculator.sum(cells) / nums.length : undefined;
    }
}
