# GitHub Pages Deployment Guide

This project uses GitHub Actions to automatically build and deploy to GitHub Pages from both `main` and `dev` branches.

## Setup Instructions

### 1. Enable GitHub Pages

1. Go to your repository settings
2. Navigate to **Pages** (under "Code and automation")
3. Under **Source**, select **GitHub Actions**

### 2. Deployment Strategy

The workflow automatically:
- Builds the `main` branch and deploys to the root path (`/`)
- Builds the `dev` branch and deploys to `/dev/` path
- Combines both builds into a single deployment

### 3. Triggering Deployments

Deployments are triggered automatically when you push to either:
- `main` branch → Updates the production site at `https://<username>.github.io/<repo>/`
- `dev` branch → Updates the dev site at `https://<username>.github.io/<repo>/dev/`

Both builds happen together regardless of which branch triggered the workflow, ensuring both sites are always in sync with their respective branches.

## URLs

After deployment, your sites will be available at:

- **Production (main)**: `https://<username>.github.io/<repo>/`
- **Development (dev)**: `https://<username>.github.io/<repo>/dev/`

Replace `<username>` with your GitHub username and `<repo>` with your repository name.

## How It Works

1. **Build Phase**:
   - Checks out and builds the `main` branch with base path `/`
   - Checks out and builds the `dev` branch with base path `/dev/`
   - Combines both builds into a single deployment directory

2. **Deploy Phase**:
   - Uploads the combined artifact to GitHub Pages
   - GitHub Pages serves both sites from the same deployment

## Monitoring Deployments

- Go to the **Actions** tab in your repository
- View the workflow runs for "Build and Deploy to GitHub Pages"
- Each run shows the build and deployment status

## Troubleshooting

### Deployment fails with "Artifact not found"
- Ensure the workflow has completed the build phase successfully
- Check the build logs for any compilation errors

### 404 errors on deployed site
- Verify that GitHub Pages is enabled in repository settings
- Confirm the source is set to "GitHub Actions"
- Wait a few minutes after deployment completes

### Assets not loading correctly
- Check that `vite.config.ts` correctly sets the base path
- Verify the VITE_BASE_PATH environment variable in the workflow

## Local Testing

To test the builds locally before deploying:

```bash
# Test main branch build
VITE_BASE_PATH=/ npm run build
npm run preview

# Test dev branch build
VITE_BASE_PATH=/dev/ npm run build
npm run preview
```

## Customization

To modify deployment behavior, edit `.github/workflows/deploy.yml`:

- Change trigger branches in the `on.push.branches` section
- Modify base paths in the `VITE_BASE_PATH` environment variables
- Adjust Node.js version in the `Setup Node.js` step
