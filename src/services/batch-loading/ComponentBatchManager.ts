/**
 * Enhanced Component Batch Manager with Tier System
 *
 * Manages progressive loading/unloading of 3D scene components in tiered batches
 * based on performance metrics and user preferences.
 *
 * Tier System:
 * - Tier 0 (Essential): Always on - Court mesh, camera, basic lighting
 * - Tier 1 (Core): Building structures, basic materials
 * - Tier 2 (Visual): Shadows, grass, trees
 * - Tier 3 (Enhanced): Weather, particles, post-processing
 */

export enum ComponentTier {
    ESSENTIAL = 0,
    CORE = 1,
    VISUAL = 2,
    ENHANCED = 3
}

export interface ComponentDefinition {
    id: string;
    tier: ComponentTier;
    displayName: string;
    description: string;
    estimatedCost: number; // Expected FPS impact
    dependencies?: string[]; // Component IDs this depends on
    category: 'court' | 'building' | 'nature' | 'effect' | 'system' | 'mechanical';
}

export interface TierConfig {
    tier: ComponentTier;
    name: string;
    description: string;
    targetFPS: number; // Minimum FPS to enable this tier
    components: ComponentDefinition[];
}

export interface ComponentState {
    id: string;
    enabled: boolean;
    tier: ComponentTier;
    loadedAt?: number;
    disabledAt?: number;
    manualOverride: boolean;
    fpsImpact?: number[]; // Historical FPS impact measurements
}

export interface TierChangeEvent {
    tier: ComponentTier;
    enabled: boolean;
    reason: 'auto' | 'manual' | 'fps_threshold' | 'emergency';
    timestamp: number;
    currentFPS: number;
    components: string[]; // Component IDs affected
}

export type TierChangeCallback = (event: TierChangeEvent) => void;
export type ComponentChangeCallback = (componentId: string, enabled: boolean) => void;

// Define all components in the scene
export const COMPONENT_DEFINITIONS: ComponentDefinition[] = [
    // Tier 0 - Essential (Always on)
    { id: 'court-mesh', tier: ComponentTier.ESSENTIAL, displayName: 'Court Geometry', description: 'Basic court surfaces', estimatedCost: 0, category: 'court' },
    { id: 'court-lines', tier: ComponentTier.ESSENTIAL, displayName: 'Court Lines', description: 'Court markings and boundaries', estimatedCost: 0, category: 'court' },
    { id: 'basic-lighting', tier: ComponentTier.ESSENTIAL, displayName: 'Basic Lighting', description: 'Ambient and directional lights', estimatedCost: 0, category: 'system' },
    { id: 'camera-controls', tier: ComponentTier.ESSENTIAL, displayName: 'Camera Controls', description: 'Orbit controls and camera rig', estimatedCost: 0, category: 'system' },

    // Tier 1 - Core
    { id: 'building-shell', tier: ComponentTier.CORE, displayName: 'Building Shell', description: 'Main facility structure', estimatedCost: 3, category: 'building' },
    { id: 'floor-plates', tier: ComponentTier.CORE, displayName: 'Floor Plates', description: 'Level floors and ceilings', estimatedCost: 2, category: 'building' },
    { id: 'bleachers', tier: ComponentTier.CORE, displayName: 'Bleacher Sections', description: 'Spectator seating areas', estimatedCost: 3, category: 'building' },
    { id: 'court-nets', tier: ComponentTier.CORE, displayName: 'Court Nets', description: 'Tennis and badminton nets', estimatedCost: 1, category: 'court' },
    { id: 'court-textures', tier: ComponentTier.CORE, displayName: 'Court Textures', description: 'Clay, wood, hard court materials', estimatedCost: 4, category: 'court' },
    { id: 'basic-materials', tier: ComponentTier.CORE, displayName: 'Basic Materials', description: 'Standard material shaders', estimatedCost: 2, category: 'system' },

    // Tier 2 - Visual
    { id: 'shadows', tier: ComponentTier.VISUAL, displayName: 'Dynamic Shadows', description: 'Shadow mapping', estimatedCost: 8, category: 'effect' },
    { id: 'grass-system', tier: ComponentTier.VISUAL, displayName: 'Grass System', description: 'Animated grass blades', estimatedCost: 10, dependencies: ['court-mesh'], category: 'nature' },
    { id: 'trees', tier: ComponentTier.VISUAL, displayName: 'Trees & Foliage', description: 'Outdoor landscaping', estimatedCost: 6, category: 'nature' },
    { id: 'reception-area', tier: ComponentTier.VISUAL, displayName: 'Reception Area', description: 'Entrance and lobby details', estimatedCost: 4, dependencies: ['building-shell'], category: 'building' },
    { id: 'locker-rooms', tier: ComponentTier.VISUAL, displayName: 'Locker Rooms', description: 'Detailed locker room interiors', estimatedCost: 5, dependencies: ['floor-plates'], category: 'building' },
    { id: 'parking-lot', tier: ComponentTier.VISUAL, displayName: 'Parking Lot', description: 'Vehicle parking area', estimatedCost: 3, category: 'building' },
    { id: 'organic-structure', tier: ComponentTier.VISUAL, displayName: 'Organic Structure', description: 'Architectural curves', estimatedCost: 5, dependencies: ['building-shell'], category: 'building' },
    { id: 'glass-barriers', tier: ComponentTier.VISUAL, displayName: 'Glass Barriers', description: 'Transparent safety barriers', estimatedCost: 4, category: 'building' },
    { id: 'solar-panels', tier: ComponentTier.VISUAL, displayName: 'Solar Panels', description: 'Rooftop solar array', estimatedCost: 3, dependencies: ['building-shell'], category: 'building' },

    // Tier 3 - Enhanced
    { id: 'weather-system', tier: ComponentTier.ENHANCED, displayName: 'Weather System', description: 'Rain, snow, fog effects', estimatedCost: 12, category: 'effect' },
    { id: 'clay-court-effect', tier: ComponentTier.ENHANCED, displayName: 'Clay Court Effect', description: 'Particle dust on clay courts', estimatedCost: 8, dependencies: ['court-textures'], category: 'effect' },
    { id: 'transport-pods', tier: ComponentTier.ENHANCED, displayName: 'Transport Pods', description: 'Animated transport system', estimatedCost: 6, category: 'mechanical' },
    { id: 'robotic-grass', tier: ComponentTier.ENHANCED, displayName: 'Robotic Grass System', description: 'Automated maintenance robots', estimatedCost: 7, dependencies: ['grass-system'], category: 'mechanical' },
    { id: 'hydroponics', tier: ComponentTier.ENHANCED, displayName: 'Hydroponics System', description: 'Vertical farming equipment', estimatedCost: 5, dependencies: ['floor-plates'], category: 'mechanical' },
    { id: 'bms-control-room', tier: ComponentTier.ENHANCED, displayName: 'BMS Control Room', description: 'Building management system', estimatedCost: 4, dependencies: ['floor-plates'], category: 'mechanical' },
    { id: 'mechanical-rooms', tier: ComponentTier.ENHANCED, displayName: 'Mechanical Rooms', description: 'HVAC and utilities', estimatedCost: 4, dependencies: ['floor-plates'], category: 'mechanical' },
    { id: 'vip-suites', tier: ComponentTier.ENHANCED, displayName: 'VIP Viewing Suites', description: 'Premium viewing areas', estimatedCost: 5, dependencies: ['floor-plates'], category: 'building' },
    { id: 'glass-walkways', tier: ComponentTier.ENHANCED, displayName: 'Glass Walkways', description: 'Transparent walkway system', estimatedCost: 6, dependencies: ['floor-plates'], category: 'building' },
    { id: 'green-walls', tier: ComponentTier.ENHANCED, displayName: 'Green Walls', description: 'Living wall facades', estimatedCost: 4, dependencies: ['building-shell'], category: 'nature' },
    { id: 'post-processing', tier: ComponentTier.ENHANCED, displayName: 'Post Processing', description: 'Bloom, SSAO, tone mapping', estimatedCost: 10, category: 'effect' },
    { id: 'reflections', tier: ComponentTier.ENHANCED, displayName: 'Reflections', description: 'Screen space reflections', estimatedCost: 15, category: 'effect' }
];

export class ComponentBatchManager {
    private componentStates = new Map<string, ComponentState>();
    private tierConfigs = new Map<ComponentTier, TierConfig>();
    private tierChangeCallbacks: TierChangeCallback[] = [];
    private componentChangeCallbacks: ComponentChangeCallback[] = [];
    private loadOrderHistory: string[] = [];
    private performanceHistory = new Map<string, number[]>();

    // FPS thresholds for tier activation
    private readonly TIER_FPS_THRESHOLDS = {
        [ComponentTier.ESSENTIAL]: 0,    // Always enabled
        [ComponentTier.CORE]: 45,        // Enable if FPS >= 45
        [ComponentTier.VISUAL]: 50,      // Enable if FPS >= 50
        [ComponentTier.ENHANCED]: 55     // Enable if FPS >= 55
    };

    constructor() {
        this.initializeTiers();
        this.initializeComponentStates();
    }

    /**
     * Initialize tier configurations
     */
    private initializeTiers(): void {
        const tierGroups = new Map<ComponentTier, ComponentDefinition[]>();

        // Group components by tier
        COMPONENT_DEFINITIONS.forEach(comp => {
            if (!tierGroups.has(comp.tier)) {
                tierGroups.set(comp.tier, []);
            }
            tierGroups.get(comp.tier)!.push(comp);
        });

        // Create tier configs
        const tierNames = ['Essential', 'Core', 'Visual', 'Enhanced'];
        const tierDescriptions = [
            'Basic rendering - always enabled',
            'Core facility structures and materials',
            'Visual enhancements and detailed geometry',
            'Advanced effects and animated systems'
        ];

        for (let tier = 0; tier <= 3; tier++) {
            this.tierConfigs.set(tier as ComponentTier, {
                tier: tier as ComponentTier,
                name: tierNames[tier],
                description: tierDescriptions[tier],
                targetFPS: this.TIER_FPS_THRESHOLDS[tier as ComponentTier],
                components: tierGroups.get(tier as ComponentTier) || []
            });
        }
    }

    /**
     * Initialize all component states
     */
    private initializeComponentStates(): void {
        COMPONENT_DEFINITIONS.forEach(comp => {
            this.componentStates.set(comp.id, {
                id: comp.id,
                tier: comp.tier,
                enabled: comp.tier === ComponentTier.ESSENTIAL, // Only essential tier starts enabled
                manualOverride: false,
                fpsImpact: []
            });
        });
    }

    /**
     * Enable an entire tier
     */
    async enableTier(
        tier: ComponentTier,
        reason: TierChangeEvent['reason'] = 'manual',
        currentFPS = 60
    ): Promise<boolean> {
        if (tier === ComponentTier.ESSENTIAL) {
            return true; // Essential tier is always enabled
        }

        const config = this.tierConfigs.get(tier);
        if (!config) return false;

        // Check if lower tiers are enabled
        for (let lowerTier = 1; lowerTier < tier; lowerTier++) {
            if (!this.isTierEnabled(lowerTier as ComponentTier)) {
                console.warn(`Cannot enable Tier ${tier}: Tier ${lowerTier} not enabled`);
                return false;
            }
        }

        const enabledComponents: string[] = [];

        // Enable all components in this tier
        for (const comp of config.components) {
            const success = await this.enableComponent(comp.id, false); // Don't notify individually
            if (success) {
                enabledComponents.push(comp.id);
            }
        }

        if (enabledComponents.length > 0) {
            this.notifyTierChange({
                tier,
                enabled: true,
                reason,
                timestamp: Date.now(),
                currentFPS,
                components: enabledComponents
            });

            console.log(`✅ Enabled Tier ${tier} (${config.name}): ${enabledComponents.length} components`);
        }

        return enabledComponents.length > 0;
    }

    /**
     * Disable an entire tier
     */
    async disableTier(
        tier: ComponentTier,
        reason: TierChangeEvent['reason'] = 'manual',
        currentFPS = 60
    ): Promise<boolean> {
        if (tier === ComponentTier.ESSENTIAL) {
            console.warn('Cannot disable Essential tier');
            return false;
        }

        const config = this.tierConfigs.get(tier);
        if (!config) return false;

        // Disable higher tiers first
        for (let higherTier = 3; higherTier > tier; higherTier--) {
            if (this.isTierEnabled(higherTier as ComponentTier)) {
                await this.disableTier(higherTier as ComponentTier, reason, currentFPS);
            }
        }

        const disabledComponents: string[] = [];

        // Disable all components in this tier
        for (const comp of config.components) {
            const success = await this.disableComponent(comp.id, false); // Don't notify individually
            if (success) {
                disabledComponents.push(comp.id);
            }
        }

        if (disabledComponents.length > 0) {
            this.notifyTierChange({
                tier,
                enabled: false,
                reason,
                timestamp: Date.now(),
                currentFPS,
                components: disabledComponents
            });

            console.log(`❌ Disabled Tier ${tier} (${config.name}): ${disabledComponents.length} components`);
        }

        return disabledComponents.length > 0;
    }

    /**
     * Enable a specific component
     */
    async enableComponent(componentId: string, notify = true): Promise<boolean> {
        const state = this.componentStates.get(componentId);
        if (!state || state.enabled) return false;

        const definition = this.getComponentDefinition(componentId);
        if (!definition) return false;

        // Check dependencies
        if (definition.dependencies) {
            for (const depId of definition.dependencies) {
                const depState = this.componentStates.get(depId);
                if (!depState?.enabled) {
                    console.warn(`Cannot enable ${componentId}: dependency ${depId} not enabled`);
                    return false;
                }
            }
        }

        state.enabled = true;
        state.loadedAt = Date.now();
        this.loadOrderHistory.push(componentId);

        if (notify) {
            this.notifyComponentChange(componentId, true);
        }

        return true;
    }

    /**
     * Disable a specific component
     */
    async disableComponent(componentId: string, notify = true): Promise<boolean> {
        const state = this.componentStates.get(componentId);
        if (!state || !state.enabled) return false;

        const definition = this.getComponentDefinition(componentId);
        if (!definition) return false;

        // Cannot disable essential components
        if (definition.tier === ComponentTier.ESSENTIAL) {
            console.warn(`Cannot disable essential component: ${componentId}`);
            return false;
        }

        // Disable dependent components first
        const dependents = this.getDependentComponents(componentId);
        for (const depId of dependents) {
            await this.disableComponent(depId, notify);
        }

        state.enabled = false;
        state.disabledAt = Date.now();

        if (notify) {
            this.notifyComponentChange(componentId, false);
        }

        return true;
    }

    /**
     * Check if a tier is fully enabled
     */
    isTierEnabled(tier: ComponentTier): boolean {
        const config = this.tierConfigs.get(tier);
        if (!config) return false;

        return config.components.every(comp =>
            this.componentStates.get(comp.id)?.enabled === true
        );
    }

    /**
     * Check if a tier is partially enabled
     */
    isTierPartiallyEnabled(tier: ComponentTier): boolean {
        const config = this.tierConfigs.get(tier);
        if (!config) return false;

        return config.components.some(comp =>
            this.componentStates.get(comp.id)?.enabled === true
        );
    }

    /**
     * Get component state
     */
    isComponentEnabled(componentId: string): boolean {
        return this.componentStates.get(componentId)?.enabled || false;
    }

    /**
     * Get component definition
     */
    getComponentDefinition(componentId: string): ComponentDefinition | undefined {
        return COMPONENT_DEFINITIONS.find(c => c.id === componentId);
    }

    /**
     * Get components that depend on a given component
     */
    private getDependentComponents(componentId: string): string[] {
        return COMPONENT_DEFINITIONS
            .filter(comp => comp.dependencies?.includes(componentId))
            .map(comp => comp.id);
    }

    /**
     * Auto-adjust tiers based on current FPS
     */
    async autoAdjustForFPS(currentFPS: number): Promise<void> {
        // Check each tier from highest to lowest
        for (let tier = 3; tier >= 1; tier--) {
            const tierEnum = tier as ComponentTier;
            const threshold = this.TIER_FPS_THRESHOLDS[tierEnum];

            if (currentFPS < threshold && this.isTierEnabled(tierEnum)) {
                // FPS too low, disable this tier
                await this.disableTier(tierEnum, 'fps_threshold', currentFPS);
                break; // Only disable one tier at a time
            } else if (currentFPS >= threshold + 5 && !this.isTierEnabled(tierEnum)) {
                // FPS high enough with headroom, enable this tier
                // But check that lower tiers are enabled first
                let canEnable = true;
                for (let lowerTier = 1; lowerTier < tier; lowerTier++) {
                    if (!this.isTierEnabled(lowerTier as ComponentTier)) {
                        canEnable = false;
                        break;
                    }
                }
                if (canEnable) {
                    await this.enableTier(tierEnum, 'fps_threshold', currentFPS);
                }
            }
        }
    }

    /**
     * Emergency mode - disable all non-essential tiers
     */
    async emergencyMode(currentFPS: number): Promise<void> {
        console.warn('🚨 EMERGENCY MODE - Disabling all non-essential tiers');

        for (let tier = 3; tier >= 1; tier--) {
            await this.disableTier(tier as ComponentTier, 'emergency', currentFPS);
        }
    }

    /**
     * Get enabled components
     */
    getEnabledComponents(): string[] {
        return Array.from(this.componentStates.entries())
            .filter(([_, state]) => state.enabled)
            .map(([id]) => id);
    }

    /**
     * Get tier statistics
     */
    getTierStats(tier: ComponentTier): {
        enabled: number;
        total: number;
        percentage: number;
        estimatedCost: number;
    } {
        const config = this.tierConfigs.get(tier);
        if (!config) return { enabled: 0, total: 0, percentage: 0, estimatedCost: 0 };

        const enabled = config.components.filter(c =>
            this.componentStates.get(c.id)?.enabled === true
        ).length;

        const estimatedCost = config.components
            .filter(c => this.componentStates.get(c.id)?.enabled === true)
            .reduce((sum, c) => sum + c.estimatedCost, 0);

        return {
            enabled,
            total: config.components.length,
            percentage: config.components.length > 0 ? (enabled / config.components.length) * 100 : 0,
            estimatedCost
        };
    }

    /**
     * Record FPS impact for a component
     */
    recordComponentFPS(componentId: string, fps: number): void {
        if (!this.performanceHistory.has(componentId)) {
            this.performanceHistory.set(componentId, []);
        }

        const history = this.performanceHistory.get(componentId)!;
        history.push(fps);

        // Keep last 50 samples
        if (history.length > 50) {
            history.shift();
        }

        // Update component state with average impact
        const state = this.componentStates.get(componentId);
        if (state) {
            state.fpsImpact = history;
        }
    }

    /**
     * Get average FPS impact of a component
     */
    getComponentFPSImpact(componentId: string): number {
        const history = this.performanceHistory.get(componentId);
        if (!history || history.length === 0) {
            const definition = this.getComponentDefinition(componentId);
            return definition?.estimatedCost || 0;
        }

        const sum = history.reduce((acc, fps) => acc + fps, 0);
        return sum / history.length;
    }

    /**
     * Register tier change callback
     */
    onTierChange(callback: TierChangeCallback): () => void {
        this.tierChangeCallbacks.push(callback);
        return () => {
            const index = this.tierChangeCallbacks.indexOf(callback);
            if (index > -1) {
                this.tierChangeCallbacks.splice(index, 1);
            }
        };
    }

    /**
     * Register component change callback
     */
    onComponentChange(callback: ComponentChangeCallback): () => void {
        this.componentChangeCallbacks.push(callback);
        return () => {
            const index = this.componentChangeCallbacks.indexOf(callback);
            if (index > -1) {
                this.componentChangeCallbacks.splice(index, 1);
            }
        };
    }

    /**
     * Notify tier change callbacks
     */
    private notifyTierChange(event: TierChangeEvent): void {
        this.tierChangeCallbacks.forEach(callback => {
            try {
                callback(event);
            } catch (error) {
                console.error('Error in tier change callback:', error);
            }
        });
    }

    /**
     * Notify component change callbacks
     */
    private notifyComponentChange(componentId: string, enabled: boolean): void {
        this.componentChangeCallbacks.forEach(callback => {
            try {
                callback(componentId, enabled);
            } catch (error) {
                console.error('Error in component change callback:', error);
            }
        });
    }

    /**
     * Get diagnostic information
     */
    getDiagnostics(): {
        tiers: {
            tier: ComponentTier;
            name: string;
            enabled: boolean;
            partial: boolean;
            stats: ReturnType<typeof this.getTierStats>;
        }[];
        totalComponents: number;
        enabledComponents: number;
        loadOrder: string[];
    } {
        const tiers = Array.from(this.tierConfigs.values()).map(config => ({
            tier: config.tier,
            name: config.name,
            enabled: this.isTierEnabled(config.tier),
            partial: this.isTierPartiallyEnabled(config.tier),
            stats: this.getTierStats(config.tier)
        }));

        return {
            tiers,
            totalComponents: COMPONENT_DEFINITIONS.length,
            enabledComponents: this.getEnabledComponents().length,
            loadOrder: [...this.loadOrderHistory]
        };
    }

    /**
     * Reset to default state
     */
    reset(): void {
        this.initializeComponentStates();
        this.loadOrderHistory = [];
        this.performanceHistory.clear();
    }
}

// Export singleton instance
export const componentBatchManager = new ComponentBatchManager();
