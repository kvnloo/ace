/**
 * Type definitions for the Debug Panel system
 */

export type AssetPerformanceCost = 'low' | 'medium' | 'high';
export type AssetStatus = 'enabled' | 'disabled';

export interface Asset3D {
    id: string;
    name: string;
    enabled: boolean;
    performanceCost: AssetPerformanceCost;
    dependencies: string[];
    renderTime?: number; // ms per frame
    memoryUsage?: number; // MB
}

export interface PerformanceMetrics {
    fps: number;
    memory: number;
    renderTime: number;
    frameHistory: number[]; // Last 60 frames
    timestamp: number;
}

export interface PerAssetMetrics {
    [assetId: string]: {
        renderTime: number;
        memoryUsage: number;
        triangleCount?: number;
        textureMemory?: number;
    };
}

export interface DebugPreset {
    id: string;
    name: string;
    description: string;
    assetStates: Record<string, boolean>;
}

export interface PerformanceReport {
    timestamp: string;
    duration: number;
    metrics: {
        avgFps: number;
        minFps: number;
        maxFps: number;
        avgMemory: number;
        peakMemory: number;
    };
    assets: PerAssetMetrics;
    presetUsed?: string;
}

export const DEFAULT_PRESETS: DebugPreset[] = [
    {
        id: 'baseline',
        name: 'Baseline',
        description: 'Minimal scene with basic lighting only',
        assetStates: {}
    },
    {
        id: 'one-by-one',
        name: 'One-by-One',
        description: 'Enable assets sequentially for testing',
        assetStates: {}
    },
    {
        id: 'production',
        name: 'Production',
        description: 'Full scene configuration',
        assetStates: {}
    },
    {
        id: 'performance-test',
        name: 'Performance Test',
        description: 'Maximum load test configuration',
        assetStates: {}
    }
];
