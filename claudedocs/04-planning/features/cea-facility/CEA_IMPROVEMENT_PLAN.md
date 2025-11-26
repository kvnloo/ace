# CEA Facility Improvement Plan - L3 Vertical Farming

## Executive Summary

Transform the L3 "Vertical Grass Lab" from a minimal turf nursery into a **state-of-the-art Controlled Environment Agriculture (CEA) facility** serving dual purposes:
1. **Turf Production**: Growing grass for the 24 grass tennis courts (perennial ryegrass, bentgrass, bermudagrass)
2. **Health Optimization**: Growing fruits and vegetables based on Blue Zones diet and Blueprint Protocol research

**Target Audience**: Athletes using the sports facility, demonstrating health optimization benefits for performance.

---

## Current State Analysis

### Floor Specifications
- **Dimensions**: 120m x 100m (12,000 m²)
- **Current Usage**: 4 turf nursery racks (~252 m² productive area)
- **Utilization**: **2.1%** - 97.9% of floor space unused

### Critical Issues Identified

| Issue | Current Value | Required Value | Impact |
|-------|---------------|----------------|--------|
| LED Height | 12cm above grass | 50-80cm above | Lights inside canopy |
| Grass Density | 79 blades/m² | 8,000-10,000/m² | Unrealistic turf appearance |
| Space Usage | 4 racks (252 m²) | Full floor utilization | 97.9% waste |
| Irrigation | None visible | Full hydroponic system | No water delivery |
| Climate Control | None | Zone-based HVAC | No microclimate management |

### Code References

**LED Positioning Bug** (`InstancedFarmRacks.tsx:346`):
```typescript
// CURRENT - LEDs at 1.38m, grass tops at 1.26m = 12cm gap
const ledY = y + 1.38 + (level * 2);

// FIX - LEDs at 1.88m = 62cm above grass (optimal)
const ledY = y + 1.88 + (level * 2);
```

**Grass Density Issue** (`InstancedFarmRacks.tsx:383`):
```typescript
// CURRENT - 5,000 blades per 63m² tray = 79/m²
const bladesPerTray = 5000;

// FIX - 500,000 blades per tray = 7,936/m² (realistic turf)
const bladesPerTray = 500000;
```

---

## L3 Floor Layout - ASCII Map

```
═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
║                                            L3 CEA FACILITY FLOOR PLAN (120m x 100m)                                  ║
═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

     0m        10m       20m       30m       40m       50m       60m       70m       80m       90m      100m      110m      120m
     │          │         │         │         │         │         │         │         │         │         │         │         │
100m ┌──────────┬─────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┐
     │          │                                                                                                      │          │
     │  ENTRY   │                              ZONE A: TURF NURSERY (1,500 m²)                                        │  ENTRY   │
     │  ELEV    │     ┌─────────────────────────────────────────────────────────────────────────────────────────┐     │  ELEV    │
     │   ▓▓     │     │  RACK 1     RACK 2     RACK 3     RACK 4     RACK 5     RACK 6     RACK 7     RACK 8   │     │   ▓▓     │
 90m │          │     │  ░░░░░░    ░░░░░░    ░░░░░░    ░░░░░░    ░░░░░░    ░░░░░░    ░░░░░░    ░░░░░░   │     │          │
     │          │     │  5-tier    5-tier    5-tier    5-tier    5-tier    5-tier    5-tier    5-tier   │     │          │
     │          │     │  Perennial Ryegrass  │  Bentgrass (cool)  │  Bermudagrass (warm)  │  Reserve   │     │          │
     │          │     └─────────────────────────────────────────────────────────────────────────────────────────┘     │          │
     │          │                                                                                                      │          │
 80m ├──────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┤
     │          │                                                                                                      │          │
     │  MAINT   │                         ZONE B: LEAFY GREENS NFT CHANNELS (2,500 m²)                                │  MAINT   │
     │  CLOSET  │     ┌─────────────────────────────────────────────────────────────────────────────────────────┐     │  CLOSET  │
     │   ◊      │     │ ════════════════════════════════════════════════════════════════════════════════════   │     │   ◊      │
 70m │          │     │ ════════════════════════════════════════════════════════════════════════════════════   │     │          │
     │          │     │ ════════════════════════════════════════════════════════════════════════════════════   │     │          │
     │          │     │   Spinach   │   Kale    │  Arugula  │  Chard   │  Lettuce  │ Bok Choy │  Collards     │     │          │
     │          │     │ ════════════════════════════════════════════════════════════════════════════════════   │     │          │
 60m │          │     │ ════════════════════════════════════════════════════════════════════════════════════   │     │          │
     │          │     │ ════════════════════════════════════════════════════════════════════════════════════   │     │          │
     │          │     │              100m NFT runs × 25 channels × 10cm spacing                                │     │          │
     │          │     └─────────────────────────────────────────────────────────────────────────────────────────┘     │          │
     │          │                                                                                                      │          │
 50m ├──────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┤
     │          │                                                                                                      │          │
     │          │         ZONE C: GROW TOWERS (2,000 m²)           │      ZONE D: ROOT VEGETABLES (1,000 m²)          │          │
     │          │     ┌─────────────────────────────────────┐      │  ┌─────────────────────────────────────────┐     │          │
     │          │     │   ⬡    ⬡    ⬡    ⬡    ⬡    ⬡    ⬡  │      │  │  ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤  │     │          │
 40m │          │     │   ⬡    ⬡    ⬡    ⬡    ⬡    ⬡    ⬡  │      │  │  ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤  │     │          │
     │          │     │   ⬡    ⬡    ⬡    ⬡    ⬡    ⬡    ⬡  │      │  │  ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤  │     │          │
     │          │     │   Cherry │ Roma  │ Strawberry │ Peppers │      │  │    Carrots   │   Beets    │  Radishes   │     │          │
     │          │     │  Tomatoes│Tomatoes│  (tower)  │ (tower) │      │  │   (DWC)     │   (DWC)    │   (DWC)     │     │          │
 30m │          │     │   ⬡    ⬡    ⬡    ⬡    ⬡    ⬡    ⬡  │      │  │  ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤  │     │          │
     │          │     │   2m rotating aeroponic towers (×49)│      │  │  Deep Water Culture beds               │     │          │
     │          │     └─────────────────────────────────────┘      │  └─────────────────────────────────────────┘     │          │
     │          │                                                                                                      │          │
 20m ├──────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┤
     │          │                                                                                                      │          │
     │  ZONE F  │         ZONE E: HERBS & MICROGREENS (800 m²)     │     ZONE G: HYDROPONIC CORE (1,200 m²)           │  CONTROL │
     │ MUSHROOM │     ┌─────────────────────────────────────┐      │  ┌─────────────────────────────────────────┐     │  ROOM    │
     │  ROOM    │     │  ▪▪▪▪▪▪  ▪▪▪▪▪▪  ▪▪▪▪▪▪  ▪▪▪▪▪▪   │      │  │   ╔═══════╗   ╔═══════╗   ╔═══════╗    │     │   ▣      │
 10m │  (400m²) │     │  Basil   Cilantro  Mint   Parsley  │      │  │   ║ 5000L ║   ║ 5000L ║   ║ 2000L ║    │     │          │
     │   ▓▓▓    │     │  ▪▪▪▪▪▪  ▪▪▪▪▪▪  ▪▪▪▪▪▪  ▪▪▪▪▪▪   │      │  │   ║ MAIN  ║   ║ BACKUP║   ║ FLUSH ║    │     │          │
     │ 85-95%RH │     │  Microgreens │ Sprouts │ Wheatgrass │      │  │   ╚═══════╝   ╚═══════╝   ╚═══════╝    │     │          │
     │ Lion's   │     │  ▪▪▪▪▪▪  ▪▪▪▪▪▪  ▪▪▪▪▪▪  ▪▪▪▪▪▪   │      │  │                                         │     │          │
     │ Mane     │     │  Broccoli sprouts (Blueprint Protocol)│      │  │   [UV]  [Pumps]  [EC/pH]  [Filters]    │     │          │
  0m │ Shiitake │     └─────────────────────────────────────┘      │  └─────────────────────────────────────────┘     │          │
     └──────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┘

     ════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
                                              ZONE H: WALKWAYS & MAINTENANCE ACCESS (2,600 m²)
                                              3m wide corridors throughout facility
     ════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
```

---

## Zone Specifications

### Zone A: Turf Nursery (1,500 m²)
**Purpose**: Grow replacement turf for 24 grass tennis courts

| Specification | Value |
|---------------|-------|
| Racks | 8 × 5-tier racks |
| Grass Types | Perennial ryegrass, bentgrass, bermudagrass |
| LED Height | 62cm above canopy (FIXED from 12cm) |
| Blade Density | 8,000/m² (FIXED from 79/m²) |
| Irrigation | Drip system with timer |
| Climate | 18-22°C, 60-70% RH |

### Zone B: Leafy Greens NFT (2,500 m²)
**Purpose**: Primary vegetable production - Blue Zones & Blueprint Protocol staples

| Specification | Value |
|---------------|-------|
| System | Nutrient Film Technique (NFT) |
| Channels | 25 × 100m runs |
| Channel Width | 10cm aluminum |
| Slope | 1% grade |
| Crops | Spinach, kale, arugula, chard, lettuce, bok choy, collards |
| LED | Full-spectrum panels, 18hr photoperiod |
| Climate | 15-20°C, 50-60% RH |
| Harvest Cycle | 21-35 days |

### Zone C: Grow Towers (2,000 m²)
**Purpose**: Vine crops and berries

| Specification | Value |
|---------------|-------|
| System | Rotating aeroponic towers |
| Tower Height | 2m |
| Tower Count | 49 towers (7×7 grid) |
| Crops | Cherry tomatoes, roma tomatoes, strawberries, bell peppers |
| LED | 360° ring lighting |
| Climate | 20-25°C, 55-65% RH |
| Harvest Cycle | 60-90 days |

### Zone D: Root Vegetables (1,000 m²)
**Purpose**: Deep Water Culture root crops

| Specification | Value |
|---------------|-------|
| System | DWC with air stones |
| Bed Depth | 30cm |
| Crops | Carrots, beets, radishes |
| LED | Full-spectrum overhead |
| Climate | 15-18°C, 50-60% RH |
| Harvest Cycle | 45-70 days |

### Zone E: Herbs & Microgreens (800 m²)
**Purpose**: Fresh herbs and high-nutrient sprouts

| Specification | Value |
|---------------|-------|
| System | Shallow tray NFT |
| Tray Levels | 4 tiers |
| Crops | Basil, cilantro, mint, parsley, broccoli sprouts, microgreens |
| LED | Blue-heavy spectrum for compact growth |
| Climate | 18-24°C, 50-60% RH |
| Harvest Cycle | 7-21 days |

### Zone F: Mushroom Room (400 m²)
**Purpose**: Controlled humidity zone for medicinal mushrooms

| Specification | Value |
|---------------|-------|
| System | Vertical grow bags |
| Varieties | Lion's mane, shiitake, oyster |
| Humidity | 85-95% RH |
| Temperature | 16-21°C |
| Lighting | Low-light, 12hr cycle |
| Harvest Cycle | 14-21 days (flushes) |
| **Isolation** | Sealed room with HEPA filtration |

### Zone G: Hydroponic Core (1,200 m²)
**Purpose**: Central water and nutrient management

| Component | Specification |
|-----------|---------------|
| Main Reservoir | 5,000L with EC/pH automation |
| Backup Reservoir | 5,000L for failover |
| Flush Tank | 2,000L clean water |
| Pumps | 4× 2HP circulation pumps |
| UV Sterilization | 3× 100W UV-C units |
| Filtration | 5μm → 1μm → 0.5μm cascade |
| Dosing | Automated NPK + micronutrient injection |

### Zone H: Walkways (2,600 m²)
**Purpose**: Maintenance access and emergency egress

- 3m wide primary corridors
- 2m secondary access paths
- Floor drains every 5m
- Waterproof epoxy coating
- Emergency lighting strips

---

## Crop Selection Matrix

### Blue Zones Diet Alignment
| Crop | Blue Zones Relevance | Growing System |
|------|---------------------|----------------|
| Leafy greens | Core daily intake | NFT Zone B |
| Legumes | Protein source | Future expansion |
| Berries | Antioxidants | Towers Zone C |
| Cruciferous | Cancer prevention | NFT Zone B |
| Herbs | Flavor without salt | Zone E |

### Blueprint Protocol Alignment
| Crop | Bryan Johnson Protocol | Growing System |
|------|------------------------|----------------|
| Broccoli sprouts | Sulforaphane source | Zone E |
| Berries | Daily super veggies | Towers Zone C |
| Leafy greens | Base nutrition | NFT Zone B |
| Cauliflower | Cruciferous intake | NFT Zone B |
| Mushrooms | Lion's mane cognitive | Zone F |

---

## Implementation Phases

### Phase 1: Immediate Fixes (Week 1-2)
**Files Modified**: `InstancedFarmRacks.tsx`

- [ ] Fix LED mounting height (line 346): `1.38` → `1.88`
- [ ] Increase grass density (line 383): `5000` → `500000`
- [ ] Add visible mounting rails between tray levels
- [ ] Add cable management visualization

### Phase 2: Infrastructure Core (Week 3-6)
**New Components Required**

- [ ] Create `HydroponicCore.tsx` - reservoir visualization
- [ ] Create `PumpSystem.tsx` - pump and pipe network
- [ ] Update floor layout in `ThreeScene.tsx`
- [ ] Add environmental zone dividers

### Phase 3: NFT Leafy Greens (Week 7-10)
**New Components Required**

- [ ] Create `NFTChannel.tsx` - aluminum channel with flowing water
- [ ] Create `LeafyGreenPlant.tsx` - instanced leafy vegetables
- [ ] Integrate with `HydroponicCore.tsx`

### Phase 4: Grow Towers (Week 11-14)
**New Components Required**

- [ ] Create `AeroponicTower.tsx` - rotating tower structure
- [ ] Create `VineCrop.tsx` - tomato, pepper, berry models
- [ ] Add tower lighting system

### Phase 5: Specialty Zones (Week 15-18)
**New Components Required**

- [ ] Create `MushroomRoom.tsx` - sealed high-humidity zone
- [ ] Create `MicrogreensStation.tsx` - shallow tray system
- [ ] Create `HerbGarden.tsx` - compact herb production

---

## Technical Specifications

### Lighting Requirements by Zone

| Zone | PPFD (μmol/m²/s) | Photoperiod | Spectrum |
|------|------------------|-------------|----------|
| A: Turf | 400-600 | 16hr | Full spectrum |
| B: Leafy | 200-400 | 18hr | Blue-heavy |
| C: Towers | 400-600 | 14hr | Red-heavy for fruiting |
| D: Roots | 200-300 | 14hr | Full spectrum |
| E: Herbs | 200-400 | 16hr | Blue-heavy |
| F: Mushroom | 50-100 | 12hr | Minimal, diffuse |

### Climate Control Requirements

| Zone | Temperature | Humidity | CO2 |
|------|-------------|----------|-----|
| A: Turf | 18-22°C | 60-70% | 800 ppm |
| B: Leafy | 15-20°C | 50-60% | 1200 ppm |
| C: Towers | 20-25°C | 55-65% | 1000 ppm |
| D: Roots | 15-18°C | 50-60% | 800 ppm |
| E: Herbs | 18-24°C | 50-60% | 1000 ppm |
| F: Mushroom | 16-21°C | 85-95% | 2000 ppm |

### Water & Nutrient Requirements

| Parameter | Target Range |
|-----------|--------------|
| pH | 5.5-6.5 |
| EC | 1.2-2.4 mS/cm |
| Dissolved Oxygen | >6 mg/L |
| Water Temperature | 18-22°C |
| Daily Water Usage | ~5,000L |
| Nutrient Solution | Modified Hoagland |

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Space Utilization | >80% | m² in production / total m² |
| Turf Quality | Championship grade | Visual inspection, root depth |
| Leafy Yield | 40 kg/m²/year | Weight harvested |
| Tower Yield | 50 kg/tower/year | Weight harvested |
| Energy Efficiency | <50 kWh/kg produce | Energy audit |
| Water Efficiency | <5 L/kg produce | Flow meters |

---

## Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| Cross-contamination | High | Zone isolation, HEPA, air locks |
| Power failure | High | Backup generators, UPS |
| Pump failure | Medium | Redundant pumps, alarms |
| Pest outbreak | High | IPM, sealed zones, quarantine |
| Nutrient imbalance | Medium | Automated monitoring, alerts |

---

## References

- **Blue Zones Diet**: Dan Buettner's research on longevity hotspots
- **Blueprint Protocol**: Bryan Johnson's age-reversal nutrition protocol
- **CEA Best Practices**: Cornell CEA Program, University of Arizona CEAC
- **Hydroponic Standards**: FAO Technical Paper 2023

---

## Document History

| Date | Version | Changes |
|------|---------|---------|
| 2025-11-26 | 1.0 | Initial plan created |

---

*This document is part of the ACE Tennis Facility CEA Feature implementation.*
*Location: `claudedocs/features/cea-facility/CEA_IMPROVEMENT_PLAN.md`*
