# Workflows & Procedures

Development workflows, deployment procedures, and recovery systems for the ACE 3D visualization project.

## Documents in This Section

### Deployment
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - GitHub Pages deployment guide
- **[workflows/IMPLEMENTATION_COMPLETE.md](workflows/IMPLEMENTATION_COMPLETE.md)** - Implementation completion checklist

### Recovery & Rollback
- **[ROLLBACK_SYSTEM_COMPLETE.md](ROLLBACK_SYSTEM_COMPLETE.md)** - Complete rollback system documentation
- **[workflows/ROLLBACK_PROCEDURES.md](workflows/ROLLBACK_PROCEDURES.md)** - Detailed rollback procedures and emergency recovery

## Deployment Workflows

### GitHub Pages Deployment
Automatic deployment to GitHub Pages from both `main` and `dev` branches.

**URLs:**
- Production (main): `https://<username>.github.io/<repo>/`
- Development (dev): `https://<username>.github.io/<repo>/dev/`

**Triggers:**
- Push to `main` branch → Updates production site
- Push to `dev` branch → Updates dev site

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete setup instructions.

### Local Testing
```bash
# Test main branch build
VITE_BASE_PATH=/ npm run build
npm run preview

# Test dev branch build
VITE_BASE_PATH=/dev/ npm run build
npm run preview
```

## Rollback & Recovery

### Emergency Recovery System
Complete rollback system with 4 recovery scripts:

1. **create-snapshot.sh** - Save current state before changes
2. **rollback-to-snapshot.sh** - Restore previous state
3. **emergency-reset.sh** - Nuclear reset to clean state
4. **verify-state.sh** - Health check for project state

### Quick Recovery Commands

```bash
# Before making risky changes
./scripts/create-snapshot.sh "description"

# If something breaks
./scripts/rollback-to-snapshot.sh

# Check project health
./scripts/verify-state.sh

# Nuclear option (requires confirmation)
./scripts/emergency-reset.sh
```

### Recovery Workflow
```
1. Detect Problem → Run verify-state.sh
2. Assess Severity → Check health score
3. Choose Recovery:
   - Health 80-100%: Fix manually
   - Health 50-79%: Rollback to snapshot
   - Health 0-49%: Emergency reset
4. Verify Fix → Run verify-state.sh again
```

## Development Workflows

### Feature Development
```bash
# 1. Create snapshot
./scripts/create-snapshot.sh "before-new-feature"

# 2. Create feature branch
git checkout -b feature/new-feature

# 3. Implement feature
# ... development work ...

# 4. Test changes
npm run test
npm run perf:test

# 5. If successful, merge
git checkout main
git merge feature/new-feature

# 6. If failed, rollback
./scripts/rollback-to-snapshot.sh
```

### Pre-Deployment Checklist
- [ ] All tests passing
- [ ] Performance tests passing
- [ ] No console errors in monitoring
- [ ] Bundle size within limits
- [ ] Visual regression tests passing
- [ ] Documentation updated
- [ ] CHANGELOG updated

### Post-Deployment Verification
```bash
# 1. Monitor deployment
# Check GitHub Actions workflow

# 2. Verify live site
# Test production and dev URLs

# 3. Check monitoring
npm run monitor:start
# Test functionality in browser
npm run monitor:status

# 4. Verify performance
npm run perf:test
```

## Snapshot Management

### Creating Snapshots
```bash
# Before risky changes
./scripts/create-snapshot.sh "before-refactor"

# Before dependency updates
./scripts/create-snapshot.sh "before-npm-update"

# Before major features
./scripts/create-snapshot.sh "before-feature-x"
```

### Viewing Snapshots
```bash
# List all snapshots
git stash list

# View snapshot log
cat .snapshots/snapshot-log.txt

# Interactive restoration
./scripts/rollback-to-snapshot.sh
```

### Cleaning Old Snapshots
```bash
# List snapshots
git stash list

# Remove specific snapshot
git stash drop stash@{5}

# Remove all snapshots (careful!)
git stash clear
```

## Health Monitoring

### Health Score Interpretation
- **80-100%** - Healthy: Everything working well
- **50-79%** - Needs Attention: Some issues to address
- **0-49%** - Critical: Consider emergency reset

### Health Check Components
- Git repository status
- Dependency verification
- Build configuration validation
- TypeScript type checking
- Test file detection
- Development environment status

## Emergency Procedures

### Build Suddenly Breaks
```bash
# 1. Check health
./scripts/verify-state.sh

# 2. If health < 50%
./scripts/emergency-reset.sh

# 3. If health 50-79%
./scripts/rollback-to-snapshot.sh
```

### Dependency Update Gone Wrong
```bash
# 1. Rollback to pre-update snapshot
./scripts/rollback-to-snapshot.sh

# 2. System detects package.json change
# Automatically runs npm install

# 3. Verify state
./scripts/verify-state.sh
```

### Git History Corrupted
```bash
# 1. Create emergency backup
./scripts/create-snapshot.sh "emergency-backup"

# 2. Reset to known good state
./scripts/emergency-reset.sh

# 3. Type 'RESET' to confirm
```

## Best Practices

### Snapshot Strategy
- Snapshot before every risky change
- Use descriptive snapshot names
- Clean up old snapshots monthly
- Tag working deployments

### Deployment Strategy
- Deploy dev branch first
- Test thoroughly on dev deployment
- Merge to main only after validation
- Monitor production after deployment

### Recovery Strategy
- Always try least destructive option first
- Document what broke and why
- Update procedures with lessons learned
- Practice recovery in test branch

## Related Documentation

- **Monitoring:** [../04-monitoring-operations/](../04-monitoring-operations/)
- **Testing:** [../03-testing-quality/](../03-testing-quality/)
- **Quick Reference:** [../QUICK_REFERENCE.md](../QUICK_REFERENCE.md)

## Emergency Contacts

For critical issues:
1. Check [ROLLBACK_PROCEDURES.md](workflows/ROLLBACK_PROCEDURES.md)
2. Run `./scripts/verify-state.sh`
3. Review monitoring logs
4. Follow emergency procedures above

---

[← Back to Documentation Home](../README.md)
