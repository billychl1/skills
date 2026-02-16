---
name: paramus-chemistry
description: 319 chemistry, materials science, thermodynamics, and data science tools from Paramus Chemistry OS
metadata: {"openclaw": {"emoji": "⚗", "requires": {"anyBins": ["curl", "wget"]}, "primaryEnv": "PARAMUS_API_TOKEN", "homepage": "https://cloud1.paramus.ai"}}
---

## Paramus Chemistry & Materials Science

You have access to Paramus, a scientific computing platform with 319 tools for chemistry, polymer science, thermodynamics, electrochemistry, materials science, and data science.

### Auto-detect connection

Before the first Paramus call, run this once to auto-detect whether local or cloud mode is available:

```bash
# Auto-detect: try local first, fall back to cloud
if curl -sf -o /dev/null --connect-timeout 2 http://localhost:8765/health 2>/dev/null; then
  PARAMUS_URL="http://localhost:8765/"
  PARAMUS_AUTH=""
  echo "Paramus: local mode (localhost:8765)"
elif [ -n "$PARAMUS_API_TOKEN" ]; then
  PARAMUS_URL="https://cloud1.paramus.ai/mcp"
  PARAMUS_AUTH="-H \"Authorization: Bearer $PARAMUS_API_TOKEN\""
  echo "Paramus: cloud mode (cloud1.paramus.ai)"
else
  echo "Paramus: not available. Start the tray app or set PARAMUS_API_TOKEN."
fi
```

If both fail, tell the user:
- **Local**: Download Paramus from https://cloud1.paramus.ai and start the tray app. It runs on `localhost:8765`.
- **Cloud**: Visit https://cloud1.paramus.ai/api/token, enter your XXX-XXX-XXX license key, copy the Bearer token, and set `export PARAMUS_API_TOKEN="<token>"`.

### How to call tools

All calls use JSON-RPC via curl. After auto-detect sets `PARAMUS_URL` and `PARAMUS_AUTH`:

**Search** (find a tool by description):
```bash
curl -s -X POST "$PARAMUS_URL" \
  -H "Content-Type: application/json" \
  $PARAMUS_AUTH \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"search","arguments":{"query":"molecular weight from SMILES"}}}'
```

**Direct call** (run a tool by exact name):
```bash
curl -s -X POST "$PARAMUS_URL" \
  -H "Content-Type: application/json" \
  $PARAMUS_AUTH \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"directCall","arguments":{"tool_name":"calculate_molecular_weight","parameters":{"smiles":"CCO"}}}}'
```

**Get schema** (check parameters before calling):
```bash
curl -s -X POST "$PARAMUS_URL" \
  -H "Content-Type: application/json" \
  $PARAMUS_AUTH \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"getSchema","arguments":{"tool_name":"calculate_logp"}}}'
```

**List categories:**
```bash
curl -s -X POST "$PARAMUS_URL" \
  -H "Content-Type: application/json" \
  $PARAMUS_AUTH \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"listCategories","arguments":{}}}'
```

**List tools in a category:**
```bash
curl -s -X POST "$PARAMUS_URL" \
  -H "Content-Type: application/json" \
  $PARAMUS_AUTH \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"listByCategory","arguments":{"category":"Chemistry"}}}'
```

### Available tool categories

| Category | Examples |
|----------|---------|
| Chemistry | molecular weight, LogP, TPSA, H-bond donors/acceptors, Lipinski, QED, fingerprints, similarity |
| Molecular Conversion | SMILES to InChI, InChI to SMILES, canonicalization, validation |
| Structure Analysis | aromaticity, substructure search, ring info, stereoisomers, 3D conformers |
| Polymers | BigSMILES validation, polymer fingerprints, pSMILES parsing, polymer similarity |
| Thermodynamics | CoolProp fluid properties (120+ fluids), saturation, critical/triple point, transport |
| Kinetics | Cantera equilibrium, reaction rates, flame speed, ignition delay |
| Electrochemistry | Nernst equation, Butler-Volmer, conductivity, Faraday electrolysis |
| Data Science | DOE (factorial, Latin hypercube), PCA, k-means, regression, statistics |
| Materials Science | pymatgen crystal structures, XRD patterns |
| BRAIN Platform | ML property predictions, Tg estimation, HPC quantum chemistry (Psi4, NWChem, ORCA) |

### Workflow

1. First call: run the **auto-detect** script above
2. **search** for relevant tools
3. **getSchema** to see required parameters
4. **directCall** with the parameters
5. Parse JSON response and present results

### Notes

- First call after server restart may take ~1s (library loading). Subsequent calls are <10ms.
- SMILES strings are the primary molecular input format. If the user gives a compound name, ask for the SMILES or look it up.
- All numeric results include units where applicable.
