# File Lifecycle Policy

## 1. Lifecycle Zones

We use explicit zones to separate active work from permanent documentation.

### Research (`claudedocs/06-research/`)
- **Active** (`/active/`): Current research tasks, investigations, and experiments.
- **Archive** (`/archive/`): Completed research, preserved for historical context.

### Stories & Tasks (`claudedocs/08-stories/`)
- **Active** (`/active/`): Current story breakdowns, task lists, and active implementation notes.
- **Completed** (`/completed/`): Finished stories, awaiting consolidation into official docs.

### Scratch (`claudedocs/scratch/`)
- Temporary, throwaway experiments. Can be deleted at any time.

### Official Documentation (`claudedocs/` & `docs/`)
- **`docs/`**: Human-readable documentation, facility guides, and high-level architecture.
- **`claudedocs/`**: Developer documentation, implementation details, and technical guides.

## 2. Workflow

### Creation
- **Research**: Create new files in `claudedocs/06-research/active/` with date prefix (e.g., `YYYY-MM-DD-topic.md`).
- **Tasks**: Create new files in `claudedocs/08-stories/active/`.
- **Experiments**: Use `claudedocs/scratch/`.

### Completion & Consolidation
1. **Review**: When a task or research is done, review the file.
2. **Consolidate**: Extract permanent value (decisions, API details, architecture) into the appropriate file in `docs/` or `claudedocs/`.
   - *Do not just move the file.* Update the canonical documentation.
3. **Archive**: Move the original research/task file to the corresponding `archive/` or `completed/` directory.
4. **Delete**: If the file has no historical value, delete it.

### Periodic Cleanup
- **Weekly**: Audit `active` directories. Move stalled items to archive or delete.
- **Bi-weekly**: Check `scratch` and delete old files.

## 3. Naming Conventions
- **Research/Archive**: `YYYY-MM-DD-descriptive-name.md`
- **Stories**: `[ID]-descriptive-name.md` (if applicable)

## 4. "SOTA" Rules
- **Consolidation over Creation**: Always ask "should this be added to existing docs?" before creating a new permanent file.
- **Archive, don't delete**: Research has value. Archive it.
- **Keep Root Clean**: No loose markdown files in `claudedocs/` root (except this one and README).
