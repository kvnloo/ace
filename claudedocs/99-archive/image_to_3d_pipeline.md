# Image to 3D Pipeline: Research & Implementation Guide

**Date**: November 22, 2025
**Status**: Research Complete
**Target**: Converting AI-generated images into interactive 3D scenes
**Project Context**: ACE 3D Facility Visualization System

## Executive Summary

This document provides a comprehensive workflow for converting AI-generated architectural images into production-ready 3D scenes using modern AI vision models, metadata schemas, and Three.js. The pipeline addresses the complete journey from image analysis through 3D implementation, with specific focus on tennis facility visualization.

**Key Findings**:
- Claude 3.5 Sonnet offers the best balance of vision accuracy, cost, and architectural reasoning
- A structured metadata schema enables reliable feature tracking and implementation verification
- Gap analysis methodology provides systematic feature completion tracking
- Multi-stage pipeline separates concerns for maintainability and scalability

---

## Section 1: Vision AI for Architecture

### 1.1 Comparative Analysis: GPT-4V vs Claude Vision vs Gemini

Three primary models excel at architectural analysis. The choice depends on your priorities:

| Criteria | Claude 3.5 Sonnet | GPT-4V | Gemini 2.5 Pro |
|----------|-------------------|---------|----------------|
| **Vision Accuracy** | 95%+ (architectural) | 96% | 97% |
| **Architectural Reasoning** | Excellent | Very Good | Excellent |
| **Cost per 1M tokens** | $3-15 (vision efficient) | $10-30 | $1.25-5 |
| **Context Window** | 200,000 | 128,000 | 2,000,000 |
| **Multimodal Native** | Yes (retrofitted well) | Text+Image separately | Yes (native MoE) |
| **Latency** | Fast | Fast | Moderate |
| **Structured Output** | Excellent (JSON) | Good | Good |

**Recommendation for Tennis Facility**: **Claude 3.5 Sonnet**

**Rationale**:
- Best at extracting hierarchical architectural relationships (courts → surfaces → markings)
- Superior JSON schema generation for metadata
- Most cost-effective for high-volume image analysis
- Extended context supports complex facility descriptions
- Excellent at identifying feature dependencies (e.g., "court requires service lines")

**Key References**:
- [Claude vs GPT-4.5 vs Gemini Comprehensive Comparison](https://www.evolution.ai/post/claude-vs-gpt-4o-vs-gemini)
- [Multimodal AI Model Comparison](https://encord.com/blog/gpt-4o-vs-gemini-vs-claude-3-opus/)
- [Claude 3 Prompt Engineering Guide](https://www.promptingguide.ai/models/claude-3)

### 1.2 Architectural Feature Extraction Capabilities

Vision models can reliably extract:

**Structural Elements**
- Walls, columns, beams (with dimensions)
- Roof structure and materials
- Floor plans and room layouts
- Door/window placements and dimensions

**Facility-Specific Features**
- Court boundaries and surface types
- Net posts and equipment placement
- Lighting fixtures and positions
- Seating arrangements and capacity
- Access points and egress routes

**Technical Specifications**
- Material identification (concrete, synthetic, wood)
- Color and finish details
- Dimensional relationships and proportions
- Spatial hierarchy and adjacencies

**Accuracy Metrics from Research**:
- ArchNetv2 CNN architecture: 93.5% mAP for object detection
- Vision Transformers: >90% for semantic segmentation
- Large vision models: 95%+ for high-level architectural feature identification

**Source References**:
- [Multiscale object detection on complex architectural floor plans](https://www.sciencedirect.com/science/article/pii/S092658052400222X)
- [Vision AI in the Built Environment](https://medium.com/@kedar.prachi.16it1068/from-pixels-to-plans-the-rise-of-vision-ai-in-the-built-environment-59dc619d4311)

---

## Section 2: Metadata Schema Design

### 2.1 Architectural Elements JSON Schema

A well-designed schema enables reliable feature tracking and Three.js generation. Here's a comprehensive schema for tennis facilities:

```json
{
  "$schema": "http://json-schema.org/draft-2020-12/schema",
  "$id": "https://ace.project/schemas/tennis-facility-v1.json",
  "title": "Tennis Facility Architecture Schema",
  "description": "Complete metadata schema for tennis court facilities with feature tracking",
  "type": "object",

  "properties": {
    "facility": {
      "type": "object",
      "description": "Top-level facility metadata",
      "required": ["id", "name", "type"],
      "properties": {
        "id": {
          "type": "string",
          "pattern": "^[a-z0-9-]+$",
          "description": "Unique facility identifier"
        },
        "name": { "type": "string" },
        "type": {
          "enum": ["tennis_court", "tennis_complex", "hybrid"]
        },
        "location": {
          "type": "object",
          "properties": {
            "address": { "type": "string" },
            "coordinates": {
              "type": "object",
              "properties": {
                "latitude": { "type": "number" },
                "longitude": { "type": "number" }
              }
            }
          }
        }
      }
    },

    "courts": {
      "type": "array",
      "description": "Array of tennis courts",
      "items": {
        "type": "object",
        "required": ["id", "name", "surface_type", "dimensions"],
        "properties": {
          "id": { "type": "string" },
          "name": { "type": "string" },
          "surface_type": {
            "enum": ["hard", "clay", "grass", "synthetic"]
          },
          "dimensions": {
            "type": "object",
            "required": ["length", "width", "unit"],
            "properties": {
              "length": { "type": "number" },
              "width": { "type": "number" },
              "unit": { "enum": ["meters", "feet"] }
            }
          },
          "markings": {
            "type": "array",
            "description": "Court line markings and zones",
            "items": {
              "type": "object",
              "properties": {
                "type": {
                  "enum": ["baseline", "service_line", "sideline", "net_line"]
                },
                "coordinates": {
                  "type": "array",
                  "items": { "type": "number" }
                }
              }
            }
          },
          "features": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "type": { "type": "string" },
                "position": { "type": "object" },
                "specifications": { "type": "object" }
              }
            }
          }
        }
      }
    },

    "equipment": {
      "type": "object",
      "description": "Equipment and fixtures",
      "properties": {
        "nets": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "court_id": { "type": "string" },
              "height": { "type": "number" },
              "material": { "type": "string" },
              "color": { "type": "string" }
            }
          }
        },
        "posts": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "position": { "type": "object" },
              "height": { "type": "number" },
              "material": { "type": "string" },
              "diameter": { "type": "number" }
            }
          }
        }
      }
    },

    "materials": {
      "type": "object",
      "description": "Material palette",
      "properties": {
        "colors": {
          "type": "object",
          "additionalProperties": { "type": "string" },
          "examples": {
            "court_surface": "#4CAF50",
            "lines": "#FFFFFF",
            "net": "#1A1A1A"
          }
        },
        "textures": {
          "type": "object",
          "additionalProperties": {
            "type": "object",
            "properties": {
              "url": { "type": "string" },
              "type": { "enum": ["bitmap", "procedural"] }
            }
          }
        }
      }
    },

    "features": {
      "type": "object",
      "description": "Feature completion tracking",
      "properties": {
        "lighting": {
          "type": "object",
          "properties": {
            "status": { "enum": ["planned", "in_progress", "implemented", "verified"] },
            "priority": { "enum": ["critical", "high", "medium", "low"] },
            "elements": { "type": "integer" },
            "notes": { "type": "string" }
          }
        },
        "seating": { "type": "object" },
        "scoreboard": { "type": "object" },
        "accessibility": { "type": "object" }
      }
    },

    "metadata": {
      "type": "object",
      "properties": {
        "source_image": { "type": "string" },
        "analysis_date": { "type": "string", "format": "date-time" },
        "analyzed_by": { "type": "string" },
        "confidence_scores": {
          "type": "object",
          "additionalProperties": { "type": "number", "minimum": 0, "maximum": 1 }
        },
        "version": { "type": "string" }
      }
    }
  },

  "required": ["facility", "courts", "metadata"]
}
```

### 2.2 Example Instance: Single Tennis Court

```json
{
  "facility": {
    "id": "ace-demo-facility",
    "name": "ACE Demo Tennis Center",
    "type": "tennis_complex"
  },

  "courts": [
    {
      "id": "court-01",
      "name": "Court 1 - Hard Surface",
      "surface_type": "hard",
      "dimensions": {
        "length": 23.77,
        "width": 10.97,
        "unit": "meters"
      },
      "markings": [
        {
          "type": "baseline",
          "coordinates": [[0, 0], [10.97, 0]]
        },
        {
          "type": "service_line",
          "coordinates": [[0, 6.4], [10.97, 6.4]]
        }
      ],
      "features": [
        {
          "type": "net_post",
          "position": { "x": 5.485, "y": 0, "z": 0 },
          "specifications": { "height": 1.07, "material": "aluminum" }
        }
      ]
    }
  ],

  "equipment": {
    "nets": [
      {
        "court_id": "court-01",
        "height": 0.914,
        "material": "mesh",
        "color": "#1A1A1A"
      }
    ]
  },

  "materials": {
    "colors": {
      "court_surface": "#2E8B57",
      "lines": "#FFFFFF",
      "net": "#000000"
    }
  },

  "features": {
    "lighting": {
      "status": "implemented",
      "priority": "high",
      "elements": 8,
      "notes": "LED array, 500 lux minimum"
    },
    "seating": {
      "status": "planned",
      "priority": "medium",
      "capacity": 100
    }
  },

  "metadata": {
    "source_image": "tennis_facility_photo_001.jpg",
    "analysis_date": "2025-11-22T10:30:00Z",
    "analyzed_by": "Claude 3.5 Sonnet",
    "confidence_scores": {
      "surface_type": 0.98,
      "dimensions": 0.92,
      "markings": 0.95
    },
    "version": "1.0.0"
  }
}
```

**JSON Schema Design Best Practices**:
- Use `enum` for constrained values (surface_type, status, priority)
- Include `required` arrays for mandatory fields
- Add `description` for clarity on each property
- Use `additionalProperties` for extensibility (colors, textures)
- Track confidence scores per element
- Support status tracking: planned → in_progress → implemented → verified

**References**:
- [JSON Schema Specification](https://json-schema.org/specification)
- [Creating Effective Schemas](https://json-schema.org/learn/getting-started-step-by-step)

---

## Section 3: Feature Tracking System

### 3.1 Implementation Strategy

A robust feature tracking system bridges analysis and implementation:

```
Analysis Phase        Tracking Phase        Implementation Phase
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ Image Input  │─────→│ Feature List │─────→│ 3D Objects   │
│ (Nano Banana)│      │ (JSON Schema)│      │ (Three.js)   │
└──────────────┘      └──────────────┘      └──────────────┘
                             │
                             ├─ Track Progress
                             ├─ Measure Gaps
                             └─ Validate Completion
```

### 3.2 Gap Analysis Methodology

**Five-Step Process**:

1. **Feature Inventory** (Current State)
   - Extract all features from image analysis
   - Document in JSON schema
   - Assign confidence scores

   ```json
   {
     "feature": "lighting",
     "identified": true,
     "confidence": 0.87,
     "parameters": ["count", "position", "brightness"],
     "extracted_values": {
       "count": 8,
       "type": "LED"
     }
   }
   ```

2. **Implementation Requirements** (Desired State)
   - Define what "implemented" means for each feature
   - Set acceptance criteria
   - Determine priority level

   ```json
   {
     "feature": "lighting",
     "acceptance_criteria": [
       "Geometry: 8 light sources positioned correctly",
       "Materials: Light color #FFE4B5",
       "Physics: Illuminates 500 lux on court surface",
       "Animation: Supports on/off toggle"
     ],
     "priority": "high"
   }
   ```

3. **Gap Identification**
   - Compare identified vs required
   - Calculate completeness percentage
   - Document gaps and blockers

   ```json
   {
     "feature": "lighting",
     "identified_elements": 8,
     "required_elements": 8,
     "implemented_elements": 3,
     "completeness_percent": 37.5,
     "gaps": [
       "Position offsets not measured",
       "Brightness values need calibration",
       "Animation state management missing"
     ]
   }
   ```

4. **Implementation & Tracking**
   - Create implementation tasks
   - Track progress in real-time
   - Update feature status continuously

   Status progression:
   ```
   planned → in_progress → implemented → tested → verified
   ```

5. **Validation & Closure**
   - Verify against acceptance criteria
   - Document with visual evidence
   - Archive completion data

### 3.3 File-Based Feature Tracking System

Simple YAML-based system for teams without database infrastructure:

**File Structure**:
```
project/
├── features/
│   ├── lighting.yaml
│   ├── courts.yaml
│   ├── equipment.yaml
│   └── seating.yaml
├── analysis/
│   └── tennis_facility_001.json
└── progress.yaml
```

**Example Feature File** (`features/lighting.yaml`):

```yaml
feature:
  id: "lighting-001"
  name: "Court Lighting System"
  category: "infrastructure"
  priority: "high"

analysis:
  image_id: "tennis_facility_001.jpg"
  detected_by: "Claude 3.5 Sonnet"
  detection_confidence: 0.87
  elements_identified:
    - type: "LED fixture"
      count: 8
      estimated_spacing: "3.5m"

requirements:
  acceptance_criteria:
    - "8 light fixtures positioned at 4 corners and 4 mid-court"
    - "Light color temperature: warm white (#FFE4B5)"
    - "Illumination level: 500 lux minimum on court surface"
    - "Supports animation: on/off toggle, brightness control"

  implementation_checklist:
    - id: "geometry"
      description: "Create light fixture geometry"
      status: "completed"
      completed_date: "2025-11-20"
      assignee: "developer-1"

    - id: "positioning"
      description: "Position lights based on court layout"
      status: "in_progress"
      started_date: "2025-11-21"
      assignee: "developer-1"
      estimated_completion: "2025-11-23"

    - id: "materials"
      description: "Apply light materials and colors"
      status: "pending"
      priority: "high"

    - id: "animation"
      description: "Create light toggle animation"
      status: "pending"
      dependency: "geometry, positioning"

    - id: "verification"
      description: "Visual verification against original image"
      status: "pending"

gaps:
  - severity: "medium"
    description: "Exact horizontal spacing needs refinement"
    mitigation: "Compare with reference images"

  - severity: "low"
    description: "Animation timing not specified"
    mitigation: "Use standard 300ms toggle time"

metrics:
  overall_completion: 25
  last_updated: "2025-11-21T14:30:00Z"
  time_spent_hours: 3.5
  remaining_effort_hours: 4.0
```

**Progress Tracking File** (`progress.yaml`):

```yaml
project: "ACE Tennis Facility"
generated_date: "2025-11-22T10:00:00Z"

summary:
  total_features: 8
  completed: 2
  in_progress: 1
  pending: 5
  completion_percentage: 25

feature_status:
  - name: "Courts (surface, markings)"
    status: "completed"
    completion_percent: 100
    priority: "critical"

  - name: "Net Posts & Nets"
    status: "completed"
    completion_percent: 100
    priority: "critical"

  - name: "Lighting System"
    status: "in_progress"
    completion_percent: 25
    priority: "high"

  - name: "Seating Area"
    status: "pending"
    completion_percent: 0
    priority: "medium"

  - name: "Scoreboard Display"
    status: "pending"
    completion_percent: 0
    priority: "low"

timeline:
  start_date: "2025-11-15"
  current_date: "2025-11-22"
  planned_completion: "2025-12-06"
  days_elapsed: 7
  days_remaining: 14

risks:
  - description: "Lighting positioning measurements uncertain"
    impact: "medium"
    mitigation: "Cross-reference with architect drawings"

  - description: "Animation library integration needed"
    impact: "low"
    mitigation: "Use standard Three.js animation API"
```

**Gap Analysis Report Generation**:

```python
# Simple Python script to generate gap analysis
import json
import yaml

def analyze_gaps(feature_file, acceptance_criteria):
    """Calculate gaps between identified and implemented features"""

    with open(feature_file) as f:
        feature = yaml.safe_load(f)

    identified = len(feature['analysis']['elements_identified'])
    required = len(acceptance_criteria)
    implemented = sum(
        1 for task in feature['requirements']['implementation_checklist']
        if task['status'] in ['completed', 'verified']
    )

    gap_report = {
        'feature': feature['feature']['name'],
        'identified_elements': identified,
        'required_elements': required,
        'implemented_elements': implemented,
        'gap_percentage': ((required - implemented) / required) * 100,
        'blockers': feature['gaps'],
        'next_steps': [
            task['description']
            for task in feature['requirements']['implementation_checklist']
            if task['status'] == 'pending'
        ][:3]  # Top 3 next steps
    }

    return gap_report
```

**References**:
- [Gap Analysis: Step-by-Step Guide](https://balancedscorecard.ltslean.com/software-blog/how-to-perform-gap-analysis)
- [Feature-Gap Analysis Transforms Product](https://medium.com/@philipplohmar/from-good-to-great-how-feature-gap-analysis-transforms-your-product-3543b1515c56)
- [Fit Gap Analysis Best Practices](https://fibery.io/blog/product-management/fit-gap-analysis-guide/)

---

## Section 4: SuperClaude Workflow Integration

### 4.1 Best Practices for Image Analysis

**Prompt Structure for Claude Vision**:

```
Role and Context:
You are an expert architectural analyst specializing in sports facilities.
Analyze the provided image of a tennis facility and extract comprehensive
architectural metadata that will be used to generate a 3D Three.js model.

Focus Areas:
1. Court dimensions and surface type
2. Equipment placement and specifications
3. Lighting configuration
4. Seating areas
5. Accessibility features

Output Format:
Return a JSON object matching the TennisFacilitySchema with these requirements:
- Include confidence scores for all measurements
- Identify any ambiguous or uncertain elements
- Flag dependencies between features
- Suggest priority order for 3D implementation

Priority Features (focus here first):
1. Court geometry and markings (critical)
2. Net posts and nets (critical)
3. Lighting positions (high)
4. Seating arrangement (medium)
5. Signage and scoreboard (low)
```

**Prompt Engineering Techniques**:

1. **Image Placement** - Place image at the very start of the prompt
2. **Role Definition** - Specify "expert architectural analyst"
3. **Structured Output** - Request JSON matching schema
4. **Confidence Scoring** - Ask for measurement confidence (0-1)
5. **Dependency Mapping** - Request feature relationships
6. **Priority Ordering** - Ask for implementation sequence

### 4.2 Workflow: Image → Analysis → Implementation

**Stage 1: Image Preparation**

```bash
# Resize for optimal Claude processing
convert input.jpg -resize 2048x2048\> optimized.jpg

# Verify file size (optimal: 500KB-3MB)
ls -lh optimized.jpg
```

**Stage 2: Claude Vision Analysis**

```python
import anthropic
import json

def analyze_facility_image(image_path: str) -> dict:
    """
    Analyze tennis facility image with Claude Vision
    Returns: Facility metadata matching JSON schema
    """

    client = anthropic.Anthropic()

    # Read and encode image
    with open(image_path, "rb") as img_file:
        image_data = base64.standard_b64encode(img_file.read()).decode("utf-8")

    prompt = """You are an expert architectural analyst for tennis facilities.

Analyze this image and extract complete architectural metadata in JSON format
matching this structure:

{
  "facility": { "id": "string", "name": "string", "type": "tennis_court|tennis_complex" },
  "courts": [{
    "id": "string",
    "surface_type": "hard|clay|grass|synthetic",
    "dimensions": { "length": number, "width": number },
    "markings": [{ "type": "baseline|service_line|sideline", "coordinates": [] }],
    "features": []
  }],
  "equipment": { "nets": [], "posts": [] },
  "features": { "lighting": {}, "seating": {}, "scoreboard": {} },
  "metadata": {
    "source_image": "string",
    "confidence_scores": { "surface_type": 0.95, "dimensions": 0.88 }
  }
}

CRITICAL REQUIREMENTS:
1. Include confidence score (0-1) for ALL measurements
2. For dimensions, state your measurement method and any assumptions
3. Identify ambiguous elements and mark with lower confidence
4. Flag dependencies (e.g., "net requires posts")
5. Suggest 3D implementation priority order
6. All numeric values must include units

Return ONLY the JSON object, no markdown formatting."""

    message = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=4096,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/jpeg",
                            "data": image_data,
                        },
                    },
                    {
                        "type": "text",
                        "text": prompt
                    }
                ],
            }
        ],
    )

    # Parse response
    response_text = message.content[0].text
    facility_metadata = json.loads(response_text)

    return facility_metadata
```

**Stage 3: Metadata Validation**

```python
from jsonschema import validate, ValidationError

def validate_facility_metadata(metadata: dict, schema: dict) -> bool:
    """Validate extracted metadata against schema"""

    try:
        validate(instance=metadata, schema=schema)
        return True, "Validation passed"
    except ValidationError as e:
        return False, f"Validation error: {e.message}"

# Usage
metadata = analyze_facility_image("tennis_court.jpg")
is_valid, message = validate_facility_metadata(metadata, TENNIS_FACILITY_SCHEMA)
print(message)
```

**Stage 4: Three.js Implementation**

```javascript
// Convert metadata to Three.js scene
class TennisFacilityBuilder {
  constructor(metadata, scene) {
    this.metadata = metadata;
    this.scene = scene;
  }

  build() {
    // Priority 1: Courts
    this.buildCourts();

    // Priority 2: Equipment
    this.buildNetPosts();
    this.buildNets();

    // Priority 3: Lighting
    this.buildLighting();

    // Priority 4+: Additional features
    this.buildSeating();
    this.buildSignage();
  }

  buildCourts() {
    this.metadata.courts.forEach(court => {
      const geometry = new THREE.PlaneGeometry(
        court.dimensions.width,
        court.dimensions.length
      );

      const material = new THREE.MeshStandardMaterial({
        color: this.getSurfaceColor(court.surface_type),
        roughness: 0.4,
        metalness: 0.0
      });

      const courtMesh = new THREE.Mesh(geometry, material);
      courtMesh.rotation.x = -Math.PI / 2;
      courtMesh.userData = { courtId: court.id };

      this.scene.add(courtMesh);

      // Add court markings
      this.addCourtMarkings(court, courtMesh);
    });
  }

  buildNetPosts() {
    const posts = this.metadata.equipment.posts || [];
    posts.forEach(post => {
      const geometry = new THREE.CylinderGeometry(
        post.diameter / 2,
        post.diameter / 2,
        post.height,
        16
      );

      const material = new THREE.MeshStandardMaterial({
        color: 0xA9A9A9,
        metalness: 0.8
      });

      const postMesh = new THREE.Mesh(geometry, material);
      postMesh.position.set(post.position.x, post.height / 2, post.position.z);
      postMesh.userData = { type: 'net_post' };

      this.scene.add(postMesh);
    });
  }

  buildLighting() {
    const lighting = this.metadata.features.lighting;
    if (!lighting || lighting.status !== 'implemented') return;

    const lights = [];
    const positions = this.calculateLightPositions(lighting);

    positions.forEach((pos, index) => {
      const light = new THREE.PointLight(0xFFE4B5, 1, 100);
      light.position.set(pos.x, pos.y, pos.z);
      light.userData = { index, intensity: 1.0 };

      this.scene.add(light);
      lights.push(light);
    });

    // Add light geometry for visualization
    const lightGeometry = new THREE.IcosahedronGeometry(0.3, 2);
    const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xFFE4B5 });

    positions.forEach(pos => {
      const lightMesh = new THREE.Mesh(lightGeometry, lightMaterial);
      lightMesh.position.set(pos.x, pos.y, pos.z);
      this.scene.add(lightMesh);
    });
  }

  getSurfaceColor(surfaceType) {
    const colors = {
      'hard': 0x1F8F3E,      // Green
      'clay': 0xD4744B,      // Orange-brown
      'grass': 0x4CAF50,     // Light green
      'synthetic': 0x2E8B57  // Sea green
    };
    return colors[surfaceType] || 0x4CAF50;
  }

  calculateLightPositions(lighting) {
    // Spread 8 lights around the court area
    if (lighting.elements !== 8) return [];

    const court = this.metadata.courts[0];
    const length = court.dimensions.length;
    const width = court.dimensions.width;
    const height = 6; // Typical court lighting height

    return [
      // 4 corners
      { x: -width/2 - 2, y: height, z: -length/2 - 2 },
      { x: width/2 + 2, y: height, z: -length/2 - 2 },
      { x: -width/2 - 2, y: height, z: length/2 + 2 },
      { x: width/2 + 2, y: height, z: length/2 + 2 },
      // 4 mid-points
      { x: 0, y: height, z: -length/2 - 2 },
      { x: 0, y: height, z: length/2 + 2 },
      { x: -width/2 - 2, y: height, z: 0 },
      { x: width/2 + 2, y: height, z: 0 }
    ];
  }

  addCourtMarkings(court, courtMesh) {
    const markingMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF });

    court.markings.forEach(marking => {
      const points = marking.coordinates.map(coord =>
        new THREE.Vector3(coord[0] - court.dimensions.width/2, 0.01, coord[1] - court.dimensions.length/2)
      );

      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeometry, markingMaterial);
      line.position.y = 0.01;

      this.scene.add(line);
    });
  }
}
```

### 4.3 SuperClaude Command Integration

```bash
# Using SuperClaude for complete workflow
/sc:analyze tennis_court_image.jpg --business-panel --think

# Generates:
# 1. Technical analysis of image elements
# 2. Business perspective on facility features
# 3. Architectural insights
# 4. 3D implementation priorities
```

**References**:
- [Claude API Documentation](https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview)
- [Prompt Engineering Best Practices](https://www.walturn.com/insights/mastering-prompt-engineering-for-claude)
- [AWS Claude Implementation Guide](https://aws.amazon.com/blogs/machine-learning/prompt-engineering-techniques-and-best-practices-learn-by-doing-with-anthropics-claude-3-on-amazon-bedrock/)

---

## Section 5: Complete Pipeline Example

### 5.1 End-to-End Tennis Facility Workflow

**Timeline: 2-3 weeks to production**

```
Week 1: Setup & Analysis
├─ Day 1-2: Environment setup
│  ├─ Install Claude SDK
│  ├─ Create JSON schema files
│  └─ Set up Three.js project
├─ Day 3-5: Image analysis
│  ├─ Prepare facility images
│  ├─ Run Claude vision analysis
│  └─ Validate extracted metadata
└─ Day 5-7: Gap analysis
   ├─ Document feature inventory
   ├─ Create implementation plan
   └─ Prioritize features

Week 2: Implementation
├─ Days 1-2: Core geometry (courts, nets)
├─ Days 3-4: Equipment & details
├─ Days 5-7: Lighting & effects

Week 3: Verification & Polish
├─ Days 1-2: Visual verification against images
├─ Days 3-4: Animation & interactivity
├─ Days 5: Performance optimization & deployment
```

### 5.2 Concrete Example: Single Tennis Court

**Input Image**: Drone shot of regulation tennis court

**Step 1: Image Analysis**

```python
import anthropic
import json

image_path = "tennis_court_aerial.jpg"
client = anthropic.Anthropic()

# Analyze with Claude
metadata = analyze_facility_image(image_path)

# Output (truncated):
{
  "facility": {
    "id": "demo-court-1",
    "name": "Regulation Tennis Court",
    "type": "tennis_court"
  },
  "courts": [{
    "id": "court-primary",
    "surface_type": "hard",
    "dimensions": {
      "length": 23.77,
      "width": 10.97,
      "unit": "meters"
    },
    "confidence_dimensions": 0.92,
    "markings": [
      {
        "type": "baseline",
        "confidence": 0.95,
        "coordinates": [[0, 0], [10.97, 0], [10.97, 23.77], [0, 23.77]]
      },
      {
        "type": "service_line",
        "confidence": 0.90,
        "coordinates": [[0, 6.4], [10.97, 6.4], [0, 17.37], [10.97, 17.37]]
      },
      {
        "type": "net_line",
        "confidence": 0.93,
        "coordinates": [[0, 11.885], [10.97, 11.885]]
      }
    ]
  }],
  "equipment": {
    "nets": [{
      "court_id": "court-primary",
      "height": 0.914,
      "confidence_height": 0.88,
      "material": "synthetic_mesh",
      "color_estimate": "#1A1A1A"
    }],
    "posts": [
      {
        "position": {"x": -0.914, "y": 0, "z": 11.885},
        "height": 1.07,
        "diameter": 0.065,
        "confidence": 0.85
      },
      {
        "position": {"x": 11.884, "y": 0, "z": 11.885},
        "height": 1.07,
        "diameter": 0.065,
        "confidence": 0.85
      }
    ]
  },
  "features": {
    "lighting": {
      "status": "pending",
      "estimated_count": 0,
      "note": "Not visible in aerial view"
    },
    "seating": {
      "status": "pending",
      "note": "Minimal seating visible"
    }
  },
  "metadata": {
    "confidence_scores": {
      "overall": 0.90,
      "surface_type": 0.98,
      "dimensions": 0.92,
      "markings": 0.93,
      "equipment": 0.85
    }
  }
}
```

**Step 2: Gap Analysis**

```yaml
feature_assessment:
  courts:
    status: "HIGH_CONFIDENCE"
    completion: 95
    items:
      - surface: identified (hard court, #2E8B57)
      - dimensions: identified with 92% confidence
      - markings: baseline, service, net lines complete
      - gaps: court_number not visible in image

  net_posts:
    status: "MEDIUM_CONFIDENCE"
    completion: 70
    items:
      - post_1: position identified, height estimated
      - post_2: position identified, height estimated
      - gaps: exact material/finish uncertain, tension lines not visible

  nets:
    status: "IDENTIFIED_NOT_IMPLEMENTED"
    completion: 0
    items:
      - dimensions: calculated from posts (0.914m height)
      - position: derived from posts
      - gaps: mesh texture pattern unknown, color estimate only

  lighting:
    status: "NOT_VISIBLE"
    completion: 0
    note: "Aerial photo doesn't show lighting. Recommend ground-level photo"

overall_completion: 45
priority_implementation_order:
  1: "courts (surface + markings)" # 95% confidence, critical
  2: "net_posts (geometry + position)" # 85% confidence, critical
  3: "nets (geometry + basic material)" # 70% confidence, critical
  4: "lighting (pending additional imagery)" # 0% data
  5: "seating/accessories" # Not visible
```

**Step 3: Three.js Implementation**

```javascript
// Load metadata from analysis
const facilityData = {
  courts: [{
    id: 'court-1',
    length: 23.77,
    width: 10.97,
    surface: 0x2E8B57,
    markings: [/* baseline, service, net lines */]
  }],
  equipment: {
    posts: [
      { x: -0.914, z: 11.885, height: 1.07 },
      { x: 11.884, z: 11.885, height: 1.07 }
    ],
    net: { height: 0.914 }
  }
};

// Create scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Build facility
const builder = new TennisFacilityBuilder(facilityData, scene);
builder.build();

// Render
renderer.render(scene, camera);

// Result: Interactive 3D tennis court with:
// ✓ Accurate surface dimensions
// ✓ Court markings
// ✓ Net posts and nets
// ✗ Lighting (pending additional imagery)
// ✗ Seating (not in image)
```

**Step 4: Feature Verification**

Compare rendered output with original image:

```javascript
// Verification checklist
const verificationResults = {
  court_surface: {
    dimension_accuracy: 0.95, // 23.77m vs rendered
    color_match: 0.88,         // #2E8B57 vs photo
    marking_placement: 0.92,   // baseline, service lines
    status: "VERIFIED"
  },
  net_posts: {
    position_accuracy: 0.85,   // 0.914m offset from edge
    height_accuracy: 0.83,     // 1.07m measured
    spacing: 0.87,             // 11.884m net width
    status: "VERIFIED_WITH_NOTES"
  },
  nets: {
    height_accuracy: 0.80,     // Estimated at 0.914m
    material_representation: 0.70, // Generic mesh, not photo-accurate
    status: "ACCEPTABLE"
  }
};

// Overall: 87% match to original imagery
// Confidence: High for critical features, medium for details
```

---

## Section 6: Production Checklist

### 6.1 Implementation Quality Gates

Before considering features "done":

```
Courts
□ Surface geometry matches analyzed dimensions (±5%)
□ Markings placed with line-correct accuracy
□ Color matches material analysis
□ Supports texture mapping for detail
□ Performance: <1ms render time

Equipment (Posts/Nets)
□ Posts positioned at analyzed coordinates
□ Post height matches analysis (±2cm)
□ Net height at 0.914m (±1%)
□ Net mesh geometry complete
□ Material properties configured

Lighting (if analyzed)
□ Light count matches analysis
□ Positions match court layout
□ Intensity calibrated to lux levels
□ Color temperature matches specification
□ Toggle animation functional

Seating/Accessories
□ Geometry created from specifications
□ Positioned logically relative to court
□ Performance acceptable with court geometry
□ Accessibility features noted
```

### 6.2 Performance Targets

```
Geometry:
├─ Court surface: <500 vertices
├─ Equipment: <5000 vertices total
├─ Lighting: <100 light objects
└─ Target: <10K vertices total

Rendering:
├─ Frame rate: 60 FPS minimum
├─ Load time: <2 seconds
├─ Memory: <50MB
└─ Mobile: 30 FPS minimum

Quality:
├─ Visual fidelity: 85%+ match to imagery
├─ Measurement accuracy: ±5% max error
├─ Accessibility: WCAG 2.1 AA
└─ Documentation: 100% feature coverage
```

### 6.3 File Organization

```
project/
├── src/
│   ├── analysis/
│   │   └── image_analyzer.py (Claude vision analysis)
│   ├── schemas/
│   │   └── tennis_facility_schema.json
│   ├── builder/
│   │   └── three_js_builder.js
│   └── tracking/
│       └── feature_tracker.yaml
├── data/
│   ├── images/
│   │   └── tennis_court_aerial.jpg
│   └── metadata/
│       ├── facility_001.json (analyzed metadata)
│       └── progress.yaml (gap analysis)
├── output/
│   └── tennis_facility.html (Three.js scene)
└── docs/
    └── IMPLEMENTATION_LOG.md
```

---

## Section 7: Recommended Tech Stack

### For Image Analysis:
- **Model**: Claude 3.5 Sonnet (best balance of accuracy, cost, reasoning)
- **SDK**: `anthropic-sdk-python`
- **Processing**: Python with Pillow for image optimization

### For Metadata Management:
- **Schema**: JSON Schema (section 2)
- **Storage**: Git-friendly YAML for feature tracking
- **Validation**: `jsonschema` Python library

### For 3D Implementation:
- **Framework**: Three.js r128+ (latest stable)
- **Build**: Vite (fast HMR during development)
- **Hosting**: GitHub Pages or Vercel (static Three.js scenes)

### For Workflow Automation:
- **Analysis Pipeline**: Python scripts + Claude API
- **Tracking**: YAML files in git (version control features)
- **Documentation**: Markdown in `claudedocs/`

---

## Section 8: Cost Analysis

### Per-Facility Analysis:

| Component | Cost | Notes |
|-----------|------|-------|
| Image analysis (3-5 images) | $0.15-0.30 | ~500K tokens at Claude 3.5 pricing |
| Schema validation | ~$0.02 | Minimal computation |
| Three.js development | Labor | ~20-30 hours developer time |
| **Total per facility** | **$0.20-0.35** | Plus development labor |

### Scaling Benefits:
- Fixed schema development: amortized across projects
- Reusable Three.js builder components
- Feature tracking system scales linearly
- Per-facility marginal cost: <$0.50 in API calls

---

## Section 9: Conclusion & Next Steps

### Key Takeaways:

1. **Claude 3.5 Sonnet** is optimal for architectural image analysis
2. **JSON Schema + YAML tracking** provides maintainable feature management
3. **Gap analysis methodology** bridges analysis and implementation
4. **Structured pipeline** ensures consistent, high-quality 3D outputs

### Immediate Next Steps:

1. **Finalize schema** based on specific ACE requirements
2. **Collect reference images** (minimum 3-4 angles per facility)
3. **Run pilot analysis** with single tennis court facility
4. **Build Three.js builder** incrementally (courts → equipment → details)
5. **Establish verification process** comparing renders to original imagery

### Success Metrics:

- ✓ Analysis confidence scores >85% for critical features
- ✓ 3D render matches imagery with <5% dimension variance
- ✓ Feature tracking shows 100% implementation of planned features
- ✓ Production deployment in <3 weeks per facility

---

## Appendix: Useful References

**Vision AI Comparisons:**
- [Claude vs GPT-4.5 vs Gemini](https://www.evolution.ai/post/claude-vs-gpt-4o-vs-gemini)
- [Multimodal Model Comparison](https://encord.com/blog/gpt-4o-vs-gemini-vs-claude-3-opus/)

**Architectural Detection:**
- [Multiscale object detection on floor plans](https://www.sciencedirect.com/science/article/pii/S092658052400222X)
- [Vision AI in Built Environment](https://medium.com/@kedar.prachi.16it1068/from-pixels-to-plans-the-rise-of-vision-ai-in-the-built-environment-59dc619d4311)

**Prompt Engineering:**
- [Claude Documentation](https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview)
- [Prompt Engineering Techniques](https://www.walturn.com/insights/mastering-prompt-engineering-for-claude)

**JSON Schema:**
- [JSON Schema Specification](https://json-schema.org/specification)
- [Getting Started with Schemas](https://json-schema.org/learn/getting-started-step-by-step)

**3D Generation:**
- [Three.js Procedural Generation](https://medium.com/@LEM_ing/procedural-generation-of-3d-objects-with-three-js-9874806da449)
- [Image to 3D Workflows](https://www.frontiersin.org/journals/computer-science/articles/10.3389/fcomp.2025.1467103/full)

**Gap Analysis:**
- [Gap Analysis Guide](https://balancedscorecard.ltslean.com/software-blog/how-to-perform-gap-analysis)
- [Fit-Gap Analysis Templates](https://fibery.io/blog/product-management/fit-gap-analysis-guide/)

---

**Document Version**: 1.0
**Last Updated**: November 22, 2025
**Author**: Claude Code Research Agent
**Status**: Complete & Ready for Implementation
