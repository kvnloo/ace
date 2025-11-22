import React from 'react';
import { Text } from '@react-three/drei';

// Parking Space Component
export const ParkingSpace: React.FC<{
    position: [number, number, number],
    type: 'standard' | 'ev' | 'accessible',
    number: number
}> = ({ position, type, number }) => {
    const colors = {
        standard: '#334155',
        ev: '#10b981',
        accessible: '#3b82f6'
    };

    return (
        <group position={position}>
            {/* Parking space surface */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[2.5, 5]} />
                <meshStandardMaterial color="#1e293b" roughness={0.9} />
            </mesh>

            {/* White marking lines */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
                <boxGeometry args={[0.1, 5, 0.02]} />
                <meshBasicMaterial color="white" />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.5, 0.01, 0]}>
                <boxGeometry args={[0.1, 5, 0.02]} />
                <meshBasicMaterial color="white" />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.25, 0.01, 2.5]}>
                <boxGeometry args={[2.5, 0.1, 0.02]} />
                <meshBasicMaterial color="white" />
            </mesh>

            {/* Type indicator */}
            {type === 'ev' && (
                <>
                    {/* EV Charging Station */}
                    <mesh position={[2, 0.8, -2]}>
                        <boxGeometry args={[0.3, 1.6, 0.3]} />
                        <meshStandardMaterial color="#10b981" metalness={0.6} roughness={0.3} />
                    </mesh>
                    <mesh position={[2, 1.6, -2]}>
                        <boxGeometry args={[0.4, 0.3, 0.15]} />
                        <meshStandardMaterial color="#1e293b" />
                    </mesh>
                    <pointLight position={[2, 1.6, -2]} color="#10b981" intensity={0.5} distance={3} />
                    {/* EV Symbol on ground */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.25, 0.02, 0]}>
                        <circleGeometry args={[0.6, 32]} />
                        <meshBasicMaterial color="#10b981" />
                    </mesh>
                </>
            )}

            {type === 'accessible' && (
                <>
                    {/* Wheelchair symbol */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.25, 0.02, 0]}>
                        <circleGeometry args={[0.8, 32]} />
                        <meshBasicMaterial color="#3b82f6" />
                    </mesh>
                    <Text
                        position={[1.25, 0.05, 0]}
                        rotation={[-Math.PI / 2, 0, 0]}
                        fontSize={1}
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                    >
                        ♿
                    </Text>
                </>
            )}

            {/* Parking number */}
            <Text
                position={[1.25, 0.05, -2]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={0.4}
                color={colors[type]}
                anchorX="center"
                anchorY="middle"
            >
                {number}
            </Text>
        </group>
    );
};

// Bike Rack Component
export const BikeRack: React.FC<{ position: [number, number, number], spaces: number }> = ({ position, spaces }) => {
    return (
        <group position={position}>
            {/* Rack frame */}
            <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[0.1, 1, spaces * 0.6]} />
                <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
            </mesh>

            {/* Individual bike slots */}
            {Array.from({ length: spaces }).map((_, i) => (
                <group key={i} position={[0, 0.5, -spaces * 0.3 + i * 0.6]}>
                    <mesh rotation={[0, 0, Math.PI / 6]}>
                        <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
                        <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.4} />
                    </mesh>
                </group>
            ))}
        </group>
    );
};

// Parking Lot Lane
export const ParkingLane: React.FC<{
    position: [number, number, number],
    length: number,
    type?: 'solid' | 'dashed'
}> = ({ position, length, type = 'solid' }) => {
    if (type === 'dashed') {
        const segments = Math.floor(length / 3);
        return (
            <group position={position}>
                {Array.from({ length: segments }).map((_, i) => (
                    <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, i * 3]}>
                        <boxGeometry args={[0.15, 2, 0.02]} />
                        <meshBasicMaterial color="#fbbf24" />
                    </mesh>
                ))}
            </group>
        );
    }

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={position}>
            <boxGeometry args={[0.15, length, 0.02]} />
            <meshBasicMaterial color="#fbbf24" />
        </mesh>
    );
};

// Drop-off Zone
export const DropOffZone: React.FC<{ position: [number, number, number] }> = ({ position }) => {
    return (
        <group position={position}>
            {/* Drop-off surface */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[15, 30]} />
                <meshStandardMaterial color="#0f172a" roughness={0.8} />
            </mesh>

            {/* Yellow striped markings */}
            {Array.from({ length: 10 }).map((_, i) => (
                <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-6 + i * 1.5, 0.01, 0]}>
                    <boxGeometry args={[0.8, 30, 0.02]} />
                    <meshBasicMaterial color="#fbbf24" />
                </mesh>
            ))}

            {/* "DROP-OFF ONLY" text */}
            <Text
                position={[0, 0.05, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={2}
                color="#fbbf24"
                anchorX="center"
                anchorY="middle"
                letterSpacing={0.1}
            >
                DROP-OFF ONLY
            </Text>

            {/* Border curbs */}
            <mesh position={[0, 0.15, 15]}>
                <boxGeometry args={[15, 0.3, 0.3]} />
                <meshStandardMaterial color="#94a3b8" />
            </mesh>
            <mesh position={[0, 0.15, -15]}>
                <boxGeometry args={[15, 0.3, 0.3]} />
                <meshStandardMaterial color="#94a3b8" />
            </mesh>
        </group>
    );
};

// Main Parking Lot Component
export const ParkingLot: React.FC<{ position: [number, number, number] }> = ({ position }) => {
    const parkingSpaces = [];
    let spaceNumber = 1;

    // Section 1: Main parking (80 standard spaces) - 4 rows of 20
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 20; col++) {
            parkingSpaces.push(
                <ParkingSpace
                    key={`std-${spaceNumber}`}
                    position={[col * 3, 0, row * 6]}
                    type="standard"
                    number={spaceNumber++}
                />
            );
        }
    }

    // Section 2: EV Charging (20 spaces) - 2 rows of 10
    for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 10; col++) {
            parkingSpaces.push(
                <ParkingSpace
                    key={`ev-${spaceNumber}`}
                    position={[col * 3, 0, 26 + row * 6]}
                    type="ev"
                    number={spaceNumber++}
                />
            );
        }
    }

    // Section 3: Accessible parking (15 spaces) - wider spaces
    for (let col = 0; col < 15; col++) {
        parkingSpaces.push(
            <ParkingSpace
                key={`acc-${spaceNumber}`}
                position={[col * 3.5, 0, 40]}
                type="accessible"
                number={spaceNumber++}
            />
        );
    }

    // Section 4: Additional standard (35 spaces)
    for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 18; col++) {
            if (spaceNumber <= 150) {
                parkingSpaces.push(
                    <ParkingSpace
                        key={`std2-${spaceNumber}`}
                        position={[col * 3, 0, 48 + row * 6]}
                        type="standard"
                        number={spaceNumber++}
                    />
                );
            }
        }
    }

    return (
        <group position={position}>
            {/* Main asphalt surface */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[120, 75]} />
                <meshStandardMaterial color="#1e293b" roughness={0.9} />
            </mesh>

            {/* All parking spaces */}
            {parkingSpaces}

            {/* Main traffic lanes */}
            <ParkingLane position={[30, 0, 12]} length={60} type="dashed" />
            <ParkingLane position={[45, 0, 12]} length={60} type="dashed" />

            {/* Bike parking area (50 spaces in 5 racks) */}
            <group position={[55, 0, 50]}>
                {/* Bike parking surface */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                    <planeGeometry args={[8, 12]} />
                    <meshStandardMaterial color="#15803d" roughness={0.8} />
                </mesh>

                {Array.from({ length: 5 }).map((_, i) => (
                    <BikeRack key={i} position={[0, 0, -5 + i * 2.5]} spaces={10} />
                ))}

                {/* Bike parking sign */}
                <Text
                    position={[0, 2, -7]}
                    fontSize={0.8}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                >
                    🚲 BIKE PARKING
                </Text>
            </group>

            {/* Drop-off zone */}
            <DropOffZone position={[55, 0, 10]} />

            {/* Entrance/Exit markings */}
            <Text
                position={[-55, 0.05, -35]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={2}
                color="#10b981"
                anchorX="center"
                anchorY="middle"
            >
                → ENTRANCE
            </Text>

            <Text
                position={[-55, 0.05, 35]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={2}
                color="#ef4444"
                anchorX="center"
                anchorY="middle"
            >
                EXIT →
            </Text>

            {/* Parking lot border/curbs */}
            <mesh position={[0, 0.15, -37.5]}>
                <boxGeometry args={[120, 0.3, 0.3]} />
                <meshStandardMaterial color="#94a3b8" />
            </mesh>
            <mesh position={[0, 0.15, 37.5]}>
                <boxGeometry args={[120, 0.3, 0.3]} />
                <meshStandardMaterial color="#94a3b8" />
            </mesh>
            <mesh position={[-60, 0.15, 0]}>
                <boxGeometry args={[0.3, 0.3, 75]} />
                <meshStandardMaterial color="#94a3b8" />
            </mesh>
            <mesh position={[60, 0.15, 0]}>
                <boxGeometry args={[0.3, 0.3, 75]} />
                <meshStandardMaterial color="#94a3b8" />
            </mesh>

            {/* Lighting poles */}
            {Array.from({ length: 8 }).map((_, i) => (
                <group key={i} position={[-50 + i * 15, 0, -30]}>
                    <mesh>
                        <cylinderGeometry args={[0.2, 0.2, 8, 8]} />
                        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
                    </mesh>
                    <mesh position={[0, 8, 0]}>
                        <boxGeometry args={[0.5, 0.3, 0.5]} />
                        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.5} />
                    </mesh>
                    <pointLight position={[0, 8, 0]} color="#f59e0b" intensity={2} distance={20} />
                </group>
            ))}

            {Array.from({ length: 8 }).map((_, i) => (
                <group key={`s2-${i}`} position={[-50 + i * 15, 0, 30]}>
                    <mesh>
                        <cylinderGeometry args={[0.2, 0.2, 8, 8]} />
                        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
                    </mesh>
                    <mesh position={[0, 8, 0]}>
                        <boxGeometry args={[0.5, 0.3, 0.5]} />
                        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.5} />
                    </mesh>
                    <pointLight position={[0, 8, 0]} color="#f59e0b" intensity={2} distance={20} />
                </group>
            ))}
        </group>
    );
};
