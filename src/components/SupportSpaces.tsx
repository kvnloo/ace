import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

// Staff Offices Component
const StaffOffices: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      {/* Office Building Structure */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[8, 4, 6]} />
        <meshStandardMaterial color="#d4d4d8" />
      </mesh>

      {/* Windows */}
      {[-2, 0, 2].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 2.5, 3.01]}>
            <planeGeometry args={[1.2, 1.5]} />
            <meshStandardMaterial color="#87ceeb" transparent opacity={0.3} />
          </mesh>
          <mesh position={[x, 2.5, -3.01]}>
            <planeGeometry args={[1.2, 1.5]} />
            <meshStandardMaterial color="#87ceeb" transparent opacity={0.3} />
          </mesh>
        </group>
      ))}

      {/* Interior Desks */}
      {[-2, 0, 2].map((x, i) => (
        <group key={`desk-${i}`} position={[x, 0.4, 0]}>
          {/* Desk */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.5, 0.05, 0.8]} />
            <meshStandardMaterial color="#8b7355" />
          </mesh>
          {/* Desk Legs */}
          {[-0.6, 0.6].map((legX, j) => (
            <React.Fragment key={j}>
              <mesh position={[legX, -0.3, 0.3]}>
                <cylinderGeometry args={[0.03, 0.03, 0.6]} />
                <meshStandardMaterial color="#5a4a3a" />
              </mesh>
              <mesh position={[legX, -0.3, -0.3]}>
                <cylinderGeometry args={[0.03, 0.03, 0.6]} />
                <meshStandardMaterial color="#5a4a3a" />
              </mesh>
            </React.Fragment>
          ))}
          {/* Computer Monitor */}
          <mesh position={[0, 0.3, -0.2]}>
            <boxGeometry args={[0.4, 0.3, 0.02]} />
            <meshStandardMaterial color="#1a1a1a" emissive="#0066cc" emissiveIntensity={0.2} />
          </mesh>
          {/* Chair */}
          <mesh position={[0, 0.2, 0.6]}>
            <cylinderGeometry args={[0.25, 0.25, 0.4]} />
            <meshStandardMaterial color="#2a2a2a" />
          </mesh>
        </group>
      ))}

      {/* Door */}
      <mesh position={[0, 1, 3.01]}>
        <boxGeometry args={[1, 2.2, 0.1]} />
        <meshStandardMaterial color="#654321" />
      </mesh>

      {/* Sign */}
      <Text position={[0, 3.5, 3.1]} fontSize={0.3} color="#1a1a1a" anchorX="center">
        STAFF OFFICES
      </Text>
    </group>
  );
};

// Conference Room Component
const ConferenceRoom: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      {/* Room Structure */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[10, 4, 8]} />
        <meshStandardMaterial color="#e5e5e5" />
      </mesh>

      {/* Glass Wall */}
      <mesh position={[5.01, 2, 0]}>
        <planeGeometry args={[8, 4]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.2} />
      </mesh>

      {/* Conference Table */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[6, 0.1, 3]} />
        <meshStandardMaterial color="#4a3728" />
      </mesh>

      {/* Table Legs */}
      {[-2.5, 2.5].map((x, i) =>
        [-1, 1].map((z, j) => (
          <mesh key={`leg-${i}-${j}`} position={[x, 0.2, z]}>
            <cylinderGeometry args={[0.08, 0.08, 0.4]} />
            <meshStandardMaterial color="#3a2718" />
          </mesh>
        ))
      )}

      {/* Chairs around table */}
      {[-2.5, -1, 0.5, 2].map((x, i) =>
        [-2, 2].map((z, j) => (
          <group key={`chair-${i}-${j}`} position={[x, 0.3, z]}>
            {/* Seat */}
            <mesh>
              <boxGeometry args={[0.4, 0.05, 0.4]} />
              <meshStandardMaterial color="#2c3e50" />
            </mesh>
            {/* Backrest */}
            <mesh position={[0, 0.3, -0.15]}>
              <boxGeometry args={[0.4, 0.5, 0.05]} />
              <meshStandardMaterial color="#2c3e50" />
            </mesh>
          </group>
        ))
      )}

      {/* Projector Screen */}
      <mesh position={[0, 2.5, -3.9]}>
        <planeGeometry args={[4, 2.5]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {/* TV/Monitor on wall */}
      <mesh position={[-4, 2, -3.95]}>
        <boxGeometry args={[1.5, 1, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" emissive="#003366" emissiveIntensity={0.1} />
      </mesh>

      {/* Sign */}
      <Text position={[5.5, 3.5, 0]} fontSize={0.3} color="#1a1a1a" anchorX="center" rotation={[0, -Math.PI / 2, 0]}>
        CONFERENCE ROOM
      </Text>
    </group>
  );
};

// Media Center Component
const MediaCenter: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const lightsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (lightsRef.current) {
      const time = state.clock.elapsedTime;
      lightsRef.current.children.forEach((light, i) => {
        if (light instanceof THREE.PointLight) {
          light.intensity = 0.5 + Math.sin(time * 2 + i) * 0.2;
        }
      });
    }
  });

  return (
    <group position={position}>
      {/* Building Structure */}
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[12, 6, 10]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Control Room Glass */}
      <mesh position={[0, 4, 5.01]}>
        <planeGeometry args={[8, 3]} />
        <meshStandardMaterial color="#4a90e2" transparent opacity={0.3} />
      </mesh>

      {/* Equipment Racks */}
      {[-4, -2, 0, 2, 4].map((x, i) => (
        <group key={`rack-${i}`} position={[x, 1.5, -4]}>
          {/* Rack Frame */}
          <mesh>
            <boxGeometry args={[0.6, 3, 1]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
          {/* Equipment Units */}
          {[0, 0.3, 0.6, 0.9, 1.2].map((y, j) => (
            <mesh key={j} position={[0, y - 1.5, 0.45]}>
              <boxGeometry args={[0.55, 0.15, 0.05]} />
              <meshStandardMaterial color="#3a3a3a" emissive="#00ff00" emissiveIntensity={0.2} />
            </mesh>
          ))}
          {/* Indicator Lights */}
          {[0, 0.3, 0.6].map((y, j) => (
            <mesh key={`light-${j}`} position={[0.2, y - 1.5, 0.51]}>
              <circleGeometry args={[0.02]} />
              <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={1} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Control Desk */}
      <group position={[0, 1, 2]}>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[8, 0.1, 2]} />
          <meshStandardMaterial color="#4a4a4a" />
        </mesh>
        {/* Monitors */}
        {[-3, -1.5, 0, 1.5, 3].map((x, i) => (
          <mesh key={i} position={[x, 0.8, -0.5]}>
            <boxGeometry args={[1.2, 0.8, 0.05]} />
            <meshStandardMaterial color="#1a1a1a" emissive="#0066cc" emissiveIntensity={0.3} />
          </mesh>
        ))}
        {/* Mixing Console */}
        <mesh position={[0, 0.5, 0.5]}>
          <boxGeometry args={[7, 0.2, 1.5]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
      </group>

      {/* Studio Lights */}
      <group ref={lightsRef}>
        {[-4, 0, 4].map((x, i) => (
          <React.Fragment key={i}>
            <mesh position={[x, 5.5, 0]}>
              <cylinderGeometry args={[0.3, 0.4, 0.5]} />
              <meshStandardMaterial color="#1a1a1a" />
            </mesh>
            <pointLight position={[x, 5, 0]} intensity={0.5} color="#fff8dc" distance={8} />
          </React.Fragment>
        ))}
      </group>

      {/* Sign */}
      <Text position={[0, 6.5, 5.2]} fontSize={0.4} color="#ffffff" anchorX="center">
        MEDIA CENTER
      </Text>
    </group>
  );
};

// Broadcast Booth Component
const BroadcastBooth: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      {/* Booth Structure */}
      <mesh position={[0, 8, 0]}>
        <boxGeometry args={[6, 3, 4]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>

      {/* Front Glass Window */}
      <mesh position={[0, 8, 2.01]}>
        <planeGeometry args={[5, 2]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.2} />
      </mesh>

      {/* Broadcast Desk */}
      <mesh position={[0, 7.2, 0]}>
        <boxGeometry args={[4, 0.1, 1.5]} />
        <meshStandardMaterial color="#654321" />
      </mesh>

      {/* Microphones */}
      {[-1, 1].map((x, i) => (
        <group key={i} position={[x, 7.5, 0]}>
          {/* Mic Stand */}
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.6]} />
            <meshStandardMaterial color="#2a2a2a" />
          </mesh>
          {/* Mic Head */}
          <mesh position={[0, 0.6, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        </group>
      ))}

      {/* Monitors */}
      {[-1.5, 0, 1.5].map((x, i) => (
        <mesh key={i} position={[x, 7.8, -1.2]}>
          <boxGeometry args={[0.8, 0.5, 0.05]} />
          <meshStandardMaterial color="#1a1a1a" emissive="#0066cc" emissiveIntensity={0.3} />
        </mesh>
      ))}

      {/* Broadcast Chairs */}
      {[-1, 1].map((x, i) => (
        <group key={i} position={[x, 7, 0.8]}>
          <mesh>
            <cylinderGeometry args={[0.3, 0.3, 0.5]} />
            <meshStandardMaterial color="#8b0000" />
          </mesh>
          <mesh position={[0, 0.4, -0.2]}>
            <boxGeometry args={[0.5, 0.6, 0.1]} />
            <meshStandardMaterial color="#8b0000" />
          </mesh>
        </group>
      ))}

      {/* Soundproofing Panels */}
      {[-2.9, 2.9].map((x, i) =>
        [-1.5, 1.5].map((z, j) => (
          <mesh key={`panel-${i}-${j}`} position={[x, 8, z]} rotation={[0, i === 0 ? Math.PI / 2 : -Math.PI / 2, 0]}>
            <boxGeometry args={[0.8, 0.8, 0.1]} />
            <meshStandardMaterial color="#4a4a4a" />
          </mesh>
        ))
      )}

      {/* Sign */}
      <Text position={[0, 9.8, 2.2]} fontSize={0.3} color="#ffffff" anchorX="center">
        BROADCAST BOOTH
      </Text>
    </group>
  );
};

// VIP Lounge Component
const VIPLounge: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      {/* Lounge Structure */}
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[15, 5, 10]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>

      {/* Floor */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[15, 10]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>

      {/* Leather Sofas */}
      {[[-4, 0, -3], [4, 0, -3], [0, 0, 3]].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          {/* Sofa Base */}
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[3, 0.6, 1.2]} />
            <meshStandardMaterial color="#8b4513" roughness={0.3} />
          </mesh>
          {/* Backrest */}
          <mesh position={[0, 0.8, -0.5]}>
            <boxGeometry args={[3, 1, 0.2]} />
            <meshStandardMaterial color="#8b4513" roughness={0.3} />
          </mesh>
          {/* Armrests */}
          {[-1.4, 1.4].map((x, j) => (
            <mesh key={j} position={[x, 0.5, 0]}>
              <boxGeometry args={[0.2, 0.8, 1.2]} />
              <meshStandardMaterial color="#8b4513" roughness={0.3} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Coffee Tables */}
      {[[-4, 0, 0], [4, 0, 0]].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.8, 0.8, 0.05]} />
            <meshStandardMaterial color="#34495e" metalness={0.5} />
          </mesh>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.3]} />
            <meshStandardMaterial color="#2c3e50" />
          </mesh>
        </group>
      ))}

      {/* Bar Counter */}
      <group position={[0, 0, -4.5]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[8, 1, 1.5]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        {/* Bar Stools */}
        {[-3, -1, 1, 3].map((x, i) => (
          <group key={i} position={[x, 0.6, 1.2]}>
            <mesh>
              <cylinderGeometry args={[0.25, 0.25, 0.05]} />
              <meshStandardMaterial color="#2a2a2a" />
            </mesh>
            <mesh position={[0, -0.3, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.6]} />
              <meshStandardMaterial color="#1a1a1a" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Ambient Lighting */}
      {[-5, 0, 5].map((x, i) => (
        <pointLight key={i} position={[x, 4.5, 0]} intensity={0.3} color="#ffd700" distance={8} />
      ))}

      {/* Wall Art */}
      {[-6, 6].map((x, i) => (
        <mesh key={i} position={[x, 3, -4.9]}>
          <planeGeometry args={[2, 1.5]} />
          <meshStandardMaterial color="#34495e" />
        </mesh>
      ))}

      {/* Sign */}
      <Text position={[0, 5.5, 5.1]} fontSize={0.4} color="#ffd700" anchorX="center">
        VIP LOUNGE
      </Text>
    </group>
  );
};

// Athlete Lounge Component
const AthleteLounge: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      {/* Lounge Structure */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[12, 4, 8]} />
        <meshStandardMaterial color="#34495e" />
      </mesh>

      {/* Floor - Carpeted */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial color="#16a085" />
      </mesh>

      {/* Lockers */}
      {[-5, -3, -1, 1, 3, 5].map((x, i) => (
        <group key={i} position={[x, 1, -3.8]}>
          <mesh>
            <boxGeometry args={[0.8, 2, 0.6]} />
            <meshStandardMaterial color="#7f8c8d" metalness={0.6} />
          </mesh>
          <mesh position={[0.3, 0, 0.31]}>
            <cylinderGeometry args={[0.05, 0.05, 0.02]} />
            <meshStandardMaterial color="#f39c12" metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Benches */}
      {[-2, 2].map((x, i) => (
        <group key={i} position={[x, 0.2, 0]}>
          <mesh>
            <boxGeometry args={[1.5, 0.1, 0.4]} />
            <meshStandardMaterial color="#8b7355" />
          </mesh>
          {[-0.6, 0, 0.6].map((legX, j) => (
            <mesh key={j} position={[legX, -0.15, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.3]} />
              <meshStandardMaterial color="#654321" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Massage Table */}
      <group position={[4, 0.4, 2]}>
        <mesh>
          <boxGeometry args={[2, 0.2, 0.8]} />
          <meshStandardMaterial color="#2c3e50" />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.3]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>

      {/* Refreshment Station */}
      <group position={[-4, 0.4, 2]}>
        <mesh>
          <boxGeometry args={[2, 0.8, 1]} />
          <meshStandardMaterial color="#27ae60" />
        </mesh>
        {/* Water Cooler */}
        <group position={[0.5, 0.8, 0]}>
          <mesh>
            <cylinderGeometry args={[0.2, 0.2, 0.6]} />
            <meshStandardMaterial color="#3498db" transparent opacity={0.4} />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.1]} />
            <meshStandardMaterial color="#2c3e50" />
          </mesh>
        </group>
        {/* Fruit Bowl */}
        <mesh position={[-0.5, 0.45, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#e74c3c" />
        </mesh>
      </group>

      {/* TV on Wall */}
      <mesh position={[0, 3, 3.95]}>
        <boxGeometry args={[3, 2, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" emissive="#003366" emissiveIntensity={0.2} />
      </mesh>

      {/* Comfortable Chairs */}
      {[[-3, 0, -1], [3, 0, -1]].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[0.8, 0.6, 0.8]} />
            <meshStandardMaterial color="#e67e22" />
          </mesh>
          <mesh position={[0, 0.7, -0.3]}>
            <boxGeometry args={[0.8, 0.8, 0.2]} />
            <meshStandardMaterial color="#e67e22" />
          </mesh>
        </group>
      ))}

      {/* Ceiling Fans */}
      {[-4, 4].map((x, i) => (
        <group key={i} position={[x, 3.8, 0]}>
          <mesh>
            <cylinderGeometry args={[0.1, 0.1, 0.3]} />
            <meshStandardMaterial color="#2c3e50" />
          </mesh>
        </group>
      ))}

      {/* Sign */}
      <Text position={[0, 4.5, 4.1]} fontSize={0.3} color="#ffffff" anchorX="center">
        ATHLETE LOUNGE
      </Text>
    </group>
  );
};

// Main SupportSpaces Component
const SupportSpaces: React.FC = () => {
  return (
    <group>
      {/* Staff Offices - North side */}
      <StaffOffices position={[0, 0, -60]} />

      {/* Conference Room - East side */}
      <ConferenceRoom position={[70, 0, -20]} />

      {/* Media Center - South side */}
      <MediaCenter position={[0, 0, 65]} />

      {/* Broadcast Booth - Elevated, East side */}
      <BroadcastBooth position={[65, 0, 0]} />

      {/* VIP Lounge - West side, upper level */}
      <VIPLounge position={[-75, 5, -10]} />

      {/* Athlete Lounge - West side, ground level */}
      <AthleteLounge position={[-70, 0, 20]} />
    </group>
  );
};

export default SupportSpaces;
