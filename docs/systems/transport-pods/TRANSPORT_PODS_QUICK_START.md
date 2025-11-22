# Transport Pods - Quick Start Guide

## 🚀 What You'll See

8 autonomous pods moving between 7 stations throughout the ACE facility:
- Sleek capsule vehicles with glass canopies
- Glowing status indicators (gray/yellow/green/blue)
- Smooth curved paths with hover effects
- Interactive station platforms with LED lighting

## 🎮 How to Use

### Book a Pod
1. **Click any circular station platform** (they glow yellow when you hover)
2. **Booking kiosk appears** showing available destinations
3. **Click a destination** to dispatch a pod
4. **Watch it board** (yellow light, 2 seconds)
5. **See it travel** (green light, smooth movement along path)

### Track a Pod
1. **Click any pod vehicle** (the capsule-shaped objects)
2. **Tracking panel opens** showing:
   - Pod ID and status
   - Passenger count (e.g., "2/4")
   - Current location
   - Journey progress bar
3. **Click "Close Tracking"** to dismiss

### View Routes
- Routes automatically show/hide with the **Labels overlay mode**
- Active routes (pods traveling): **Bright yellow, solid**
- Inactive routes: **Gray, dashed**

## 📍 Station Locations

### Ground Level
- **Main Entrance**: Center-south, primary arrival
- **Parking Lot**: Far northwest, vehicle access
- **Ground Courts**: East side, tennis arena
- **Outdoor Plaza**: Far southeast, recreation

### Upper Levels
- **L1 Hub**: Racquet sports (Badminton, Squash, Table Tennis)
- **L2 Hub**: Social zone (Pickleball, Real Tennis)
- **L3 Hub**: Vertical farm access

## 🎨 Visual Guide

### Pod Status Colors
| Color | Status | Meaning |
|-------|--------|---------|
| Gray | IDLE | Waiting at station |
| Yellow | BOARDING | Loading passengers |
| Green | TRAVELING | In transit |
| Blue | ARRIVING | Approaching destination |

### Station Features
- **Circular Platform**: 6-meter diameter landing pad
- **Edge Lighting**: Yellow LED ring
- **Station Name**: Floating text above platform
- **Direction Cones**: Point to connected routes
- **Active Indicator**: Green sphere when pods present

## 🔧 Technical Quick Facts

- **Pod Capacity**: 4 passengers each
- **Total Pods**: 8 vehicles
- **Total Stations**: 7 locations
- **Speed**: ~8% progress per second
- **Boarding Time**: 2 seconds
- **Path Type**: Smooth Catmull-Rom curves
- **Waypoints**: 50 per route

## 💡 Pro Tips

1. **Multi-pod Dispatch**: You can send multiple pods at once
2. **Real-time Updates**: Pod positions update 60 times per second
3. **Smart Routing**: Pods automatically calculate optimal paths
4. **Passenger Simulation**: Watch passenger counts change at stations
5. **Energy Effects**: Look for the blue wireframe sphere when pods are moving

## 🐛 Troubleshooting

**Kiosk won't open?**
- Make sure you're clicking the circular platform, not the support columns

**Pod not dispatching?**
- Check if pods are available (green sphere at station)
- Try a different destination

**Routes not visible?**
- Switch to **Labels mode** in the overlay control panel (left side)

**Can't track pod?**
- Click directly on the capsule body, not the label above it

## 🎯 Best Experience

1. Start at **Main Entrance** station
2. Book pod to **L3 Vertical Farm Hub** for dramatic vertical transit
3. Watch the pod arc upward through the building
4. Track its progress in real-time
5. Explore different routes to see the network

## 📱 Integration Points

Works seamlessly with:
- **Floor View Controls**: Focus on specific levels
- **Annotation Modes**: Route visibility toggles
- **Camera System**: Pods visible from all angles
- **Building Shell**: Transparent when viewing levels

## 🚧 Limitations

- **No Collision Detection**: Pods may visually overlap (purely visual system)
- **Simplified Physics**: Hover effect is visual, not simulated
- **Station Capacity**: Unlimited (no queue system)
- **Manual Dispatch**: Pods don't auto-return or rebalance

## 🎓 Learning Resources

- **Full Documentation**: `/docs/TRANSPORT_PODS.md`
- **Component Code**: `/components/TransportPods.tsx`
- **Integration**: `/components/ThreeScene.tsx` (line ~1456)

## 🎉 Fun Things to Try

1. Send all 8 pods to the same destination simultaneously
2. Track multiple pods by rapidly clicking them
3. Watch the route network light up in Labels mode
4. Book round trips: Main → L3 → L2 → L1 → Main
5. Observe passenger loading/unloading animations

---

**Enjoy your autonomous transport experience! 🚀**
