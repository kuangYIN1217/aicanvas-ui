export class CpuInfo {
    // Number of cpu cours
    cores: number;
    // Actual cpu frequency.  e.g."1.7330 GHz"
    hz: string;
    // Brand of the cpu.
    brand: string;
    // Current usage of cpu.
    cpu_pct: number;
}