# LawnTech Dynamics Licensing Guide

## Overview

LawnTech Dynamics uses a **multi-license approach** to balance open innovation with appropriate intellectual property protections. Different types of assets are licensed under different terms optimized for their use cases.

## Quick Reference

| Asset Type | License | Commercial Use? | Share-Alike? | Location |
|------------|---------|-----------------|--------------|----------|
| **Source Code** | MIT | ✅ Yes | ❌ No | [LICENSE](../LICENSE) |
| **Facility Designs** | CC-BY-SA 4.0 | ✅ Yes | ✅ Yes | [LICENSE-DESIGNS](../LICENSE-DESIGNS) |
| **3D Models** | CC-BY-SA 4.0 | ✅ Yes | ✅ Yes | [LICENSE-MODELS](../LICENSE-MODELS) |
| **Documentation** | CC-BY-SA 4.0 | ✅ Yes | ✅ Yes | [LICENSE-DOCS](../LICENSE-DOCS) |

## What You Can Do

### ✅ Permitted Uses (All Licenses)

- **Use the project** for personal, educational, or commercial purposes
- **Modify and adapt** the work to your needs
- **Distribute copies** to others
- **Create derivative works** based on the project
- **Use in commercial facilities** and products

### 📋 Your Obligations

**For Source Code (MIT)**:
- Include the copyright notice and license text
- No other restrictions

**For Designs, Models, and Documentation (CC-BY-SA 4.0)**:
- **Attribute** the original work to LawnTech Dynamics
- **Share-Alike**: License derivative works under the same CC-BY-SA 4.0 license
- Indicate if you made changes to the original
- Include a link to the license

## Detailed License Breakdown

### 1. Source Code: MIT License

**Applies To**:
- All TypeScript/JavaScript source code (`.ts`, `.tsx`, `.js`, `.jsx`)
- Configuration files (`vite.config.ts`, `tsconfig.json`, etc.)
- Build scripts and development tooling
- Test suites and testing utilities
- Algorithm implementations (grass growth, scheduling, optimization)
- Utility functions and helper libraries

**License Terms**:
```
MIT License
Copyright (c) 2025 LawnTech Dynamics (Kevin Rajan)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

**What This Means**:
- ✅ Use the code in proprietary software
- ✅ Modify without sharing changes back
- ✅ Sublicense to others
- ✅ Sell products built with the code
- ⚠️ Must include copyright notice

**Why MIT?**
- Industry standard for JavaScript/TypeScript projects
- Compatible with React, Three.js, Vite ecosystems
- Encourages maximum adoption and innovation
- Research-friendly for universities and labs

### 2. Facility Designs: CC-BY-SA 4.0

**Applies To**:
- Facility floor plans and layouts (`docs/designs/`, `docs/blueprint.md`)
- Spatial optimization specifications
- Safety compliance documentation
- Architectural drawings and blueprints
- CAD files and technical specifications
- Court layout designs

**License Terms**: Creative Commons Attribution-ShareAlike 4.0 International

**What This Means**:
- ✅ Use designs for commercial facilities
- ✅ Modify and adapt layouts
- ✅ Create derivative facility designs
- ⚠️ Must attribute LawnTech Dynamics
- ⚠️ Derivative designs must also be CC-BY-SA 4.0
- ⚠️ Cannot create proprietary closed-source facility designs

**Why CC-BY-SA 4.0?**
- Ensures facility design improvements benefit the community
- Prevents proprietary capture of open innovations
- Encourages sharing of design optimizations
- Standard for open hardware and architecture projects

**Attribution Example**:
```
Facility layout based on LawnTech Dynamics open source design
by Kevin Rajan, licensed under CC-BY-SA 4.0.
Source: https://github.com/kvnloo/ace
```

### 3. 3D Models and Visual Assets: CC-BY-SA 4.0

**Applies To**:
- 3D facility models (`components/ThreeScene.tsx`)
- Court surface textures and materials
- Equipment 3D models
- Interactive scene components
- Architectural 3D representations
- Rendered visualizations and screenshots

**License Terms**: Creative Commons Attribution-ShareAlike 4.0 International

**What This Means**:
- ✅ Use 3D models in commercial projects
- ✅ Create improved or adapted models
- ✅ Use in presentations and marketing
- ⚠️ Must attribute LawnTech Dynamics
- ⚠️ Derivative models must also be CC-BY-SA 4.0
- ⚠️ Share improvements to models openly

**Technical Note**:
Shader code used to generate 3D visuals may also be available under MIT license (as source code). The visual output and 3D models themselves remain CC-BY-SA 4.0.

**Why CC-BY-SA 4.0?**
- Aligns with open source 3D communities (Blender, OpenSCAD)
- Encourages sharing of rendering improvements
- Standard in Three.js community for model assets
- Prevents proprietary 3D asset libraries

**Attribution Example**:
```
3D facility model from LawnTech Dynamics by Kevin Rajan,
licensed under CC-BY-SA 4.0.
Source: https://github.com/kvnloo/ace
```

### 4. Documentation: CC-BY-SA 4.0

**Applies To**:
- User guides and tutorials (`docs/`, `claudedocs/`)
- Technical specifications
- API documentation and JSDoc comments
- Contributing guidelines (`CONTRIBUTING.md`)
- Governance documents (`GOVERNANCE.md`)
- Research papers and technical reports
- README files and wiki content

**License Terms**: Creative Commons Attribution-ShareAlike 4.0 International

**What This Means**:
- ✅ Translate documentation to other languages
- ✅ Create derivative guides and tutorials
- ✅ Include in books or courses
- ⚠️ Must attribute LawnTech Dynamics
- ⚠️ Derivative documentation must also be CC-BY-SA 4.0
- ⚠️ Cannot create proprietary documentation forks

**Why CC-BY-SA 4.0?**
- Standard for wiki-style collaborative documentation
- Allows translations while keeping knowledge open
- Prevents commercial entities from creating proprietary manuals
- Similar to Wikipedia licensing model

**Translation Policy**:
Translations are encouraged! Translated documentation must:
- Be licensed under CC-BY-SA 4.0
- Attribute the original English work
- Indicate it is a translation

**Attribution Example**:
```
Based on LawnTech Dynamics documentation by Kevin Rajan,
licensed under CC-BY-SA 4.0.
Source: https://github.com/kvnloo/ace
```

## Common Use Cases

### Building a Commercial Facility

**Scenario**: You want to build an autonomous tennis facility using LawnTech Dynamics designs.

**You Can**:
- ✅ Use facility floor plans and layouts (CC-BY-SA 4.0)
- ✅ Use source code for facility management systems (MIT)
- ✅ Modify designs for your location and needs (CC-BY-SA 4.0)
- ✅ Build proprietary software on top of open source code (MIT)

**You Must**:
- ⚠️ Attribute LawnTech Dynamics for facility designs
- ⚠️ Share your facility layout improvements under CC-BY-SA 4.0
- ⚠️ Include MIT copyright notice if distributing modified code
- ⚠️ Indicate changes you made to designs

**You Cannot**:
- ❌ Create closed-source proprietary facility designs
- ❌ Remove attribution from designs or models
- ❌ Claim LawnTech Dynamics endorsement without permission

### Academic Research

**Scenario**: You're researching autonomous facility management for a thesis.

**You Can**:
- ✅ Use all algorithms and code (MIT)
- ✅ Reference designs in your research (CC-BY-SA 4.0)
- ✅ Publish your findings and derivative work
- ✅ Create educational materials (CC-BY-SA 4.0)

**You Must**:
- ⚠️ Cite LawnTech Dynamics appropriately
- ⚠️ License derivative educational materials under CC-BY-SA 4.0
- ⚠️ Share algorithm improvements (encouraged, not required by MIT)

**Citation Format**:
```
Rajan, K. (2025). LawnTech Dynamics: Autonomous Indoor Sports Facility.
GitHub. https://github.com/kvnloo/ace
```

### Software as a Service (SaaS)

**Scenario**: You want to offer facility management software based on LawnTech Dynamics code.

**You Can**:
- ✅ Build SaaS product using the source code (MIT)
- ✅ Modify and extend the codebase (MIT)
- ✅ Keep your modifications private (MIT allows this)
- ✅ Charge customers for your service

**You Must**:
- ⚠️ Include MIT copyright notice in your software
- ⚠️ Attribute LawnTech Dynamics if using designs or documentation
- ⚠️ License any derivative documentation under CC-BY-SA 4.0

**You Cannot**:
- ❌ Remove MIT license from source code
- ❌ Claim you created the original code without attribution

### Creating a Derivative Design

**Scenario**: You want to create a modified facility design for a different sport.

**You Can**:
- ✅ Adapt the facility layout (CC-BY-SA 4.0)
- ✅ Create optimized versions for specific contexts
- ✅ Use as basis for racquetball, squash, or badminton facilities

**You Must**:
- ⚠️ License your derivative design under CC-BY-SA 4.0
- ⚠️ Attribute LawnTech Dynamics as the original
- ⚠️ Share your design openly
- ⚠️ Indicate what you changed

**You Cannot**:
- ❌ Create a proprietary closed-source design
- ❌ Prevent others from using your derivative design

## License Compatibility

### Using LawnTech Dynamics with Other Open Source

| Your Project License | Can Use LT Code? | Can Use LT Designs? | Notes |
|---------------------|------------------|---------------------|-------|
| MIT | ✅ Yes | ✅ Yes (with attribution) | Fully compatible |
| Apache 2.0 | ✅ Yes | ✅ Yes (with attribution) | Compatible |
| GPL 3.0 | ✅ Yes | ✅ Yes (GPL is SA-compatible) | GPL can incorporate CC-BY-SA |
| BSD | ✅ Yes | ✅ Yes (with attribution) | Compatible |
| CC-BY-SA 4.0 | ✅ Yes | ✅ Yes | Same license |
| CC-BY 4.0 | ✅ Yes | ⚠️ No (SA conflict) | Would need to adopt SA |
| Proprietary/Closed | ✅ Yes (code) | ❌ No (designs) | MIT allows, CC-BY-SA prevents |

### Incorporating Third-Party Code

We can incorporate code licensed under:
- ✅ MIT, Apache 2.0, BSD (permissive licenses)
- ⚠️ GPL (isolate or avoid, license incompatibility)
- ⚠️ CC-BY-SA 4.0 (for designs/docs only, not code)

## Contributor Licensing

### What Happens to Your Contributions

**By contributing to LawnTech Dynamics, you agree**:

1. **You grant the project rights** to use your contribution under the applicable license (MIT for code, CC-BY-SA 4.0 for designs/docs)

2. **You retain copyright** to your original contribution

3. **You can use it elsewhere** - your contribution is not exclusive to this project

4. **You confirm you have the right** to submit the contribution

5. **You understand contributions are public** and will be used under open source licenses

**No CLA Required**: We do not require a formal Contributor License Agreement. GitHub's Terms of Service and the project licenses provide sufficient legal framework.

### Attribution for Contributors

Contributors are recognized through:
- Git commit history (automatic)
- CONTRIBUTORS.md file (manual addition)
- Release notes for significant contributions
- Project documentation acknowledging expertise

## Trademark and Branding

### Separate from Copyright

**Trademarks** (separate from copyright licenses):
- "LawnTech Dynamics" name
- Project logos and branding
- Facility certification marks

**These are NOT licensed** under MIT or CC-BY-SA 4.0.

### Trademark Usage

**Permitted**:
- ✅ "Based on LawnTech Dynamics open source project"
- ✅ "Compatible with LawnTech Dynamics specifications"
- ✅ Academic citations and presentations

**Requires Permission**:
- ⚠️ "LawnTech Dynamics [Product Name]" (implies official status)
- ⚠️ Using LawnTech Dynamics logos in commercial products
- ⚠️ Facility certification programs

**Prohibited**:
- ❌ Misleading claims of endorsement
- ❌ Using trademarked name to imply official partnership

## Patent Considerations

### Current Patent Policy

**MIT License** does not include explicit patent grant.

**Implications**:
- Contributors retain patent rights
- No automatic patent licensing beyond copyright
- Patent issues handled case-by-case

**Defensive Stance**:
- We will not assert patents against open source users
- Contributors should not assert patents against project
- Patent disputes resolved through mediation

**Future Consideration**: May adopt Apache 2.0 for stronger patent protection if patent concerns arise.

## Frequently Asked Questions

### Can I use this for my company's facility?

Yes! Both MIT (code) and CC-BY-SA 4.0 (designs) allow commercial use. You must:
- Attribute the facility design to LawnTech Dynamics
- Share your facility design modifications under CC-BY-SA 4.0
- Include MIT license notice if distributing software

### Can I sell products based on this project?

Yes! MIT license explicitly allows commercial use. For designs, you can use them commercially but must share improvements under CC-BY-SA 4.0.

### Do I have to share my code modifications?

**For source code (MIT)**: No, you can keep modifications private.
**For designs/docs (CC-BY-SA 4.0)**: Yes, you must share under the same license.

### Can I relicense the code?

**MIT allows** you to sublicense the code however you want.
**CC-BY-SA 4.0 requires** derivative works use the same license.

### What if I contribute code? Do I lose my copyright?

No! You retain copyright to your contributions. You grant the project (and others) rights to use your contribution under the project licenses.

### Can I remove the attribution?

No. Both MIT and CC-BY-SA 4.0 require attribution. This is a legal requirement.

### What happens if I violate the license?

License violations can result in:
- Loss of license rights
- Legal action for copyright infringement
- Removal from contributor community
- Requirement to cease distribution

Always comply with license terms!

## Getting Help

### License Questions

**General questions**: Open a GitHub Discussion with `licensing` tag

**Specific use case**: Contact maintainers via GitHub issue

**Legal advice**: Consult your own legal counsel (we cannot provide legal advice)

### Reporting License Violations

If you discover license violations:
1. Contact project maintainers privately
2. Provide details of the violation
3. Allow time for resolution
4. Escalate to legal counsel if needed

## Additional Resources

### Project Documents
- [LICENSE](../LICENSE) - MIT License (source code)
- [LICENSE-DESIGNS](../LICENSE-DESIGNS) - CC-BY-SA 4.0 (facility designs)
- [LICENSE-MODELS](../LICENSE-MODELS) - CC-BY-SA 4.0 (3D models)
- [LICENSE-DOCS](../LICENSE-DOCS) - CC-BY-SA 4.0 (documentation)
- [LICENSE_RECOMMENDATIONS.md](LICENSE_RECOMMENDATIONS.md) - Detailed licensing analysis and rationale
- [CONTRIBUTING.md](CONTRIBUTING.md) - How to contribute
- [GOVERNANCE.md](GOVERNANCE.md) - Project governance and decision-making

### External Resources
- [MIT License](https://opensource.org/licenses/MIT) - Full license text and explanation
- [Creative Commons CC-BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) - Full license and FAQ
- [Choose a License](https://choosealicense.com/) - License selection guide
- [Open Source Initiative](https://opensource.org/) - Open source licensing authority
- [Creative Commons](https://creativecommons.org/) - Creative Commons licensing authority

---

**Last Updated**: 2025-11-22
**License Version**: 1.0

**Disclaimer**: This document provides information about the project's licensing. It is not legal advice. Consult a lawyer for legal questions about licensing.

---

*LawnTech Dynamics is committed to open innovation while protecting the rights of contributors and users. These licenses balance openness with sustainability.*
