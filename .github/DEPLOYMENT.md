# GitHub Pages deployment

ACE publishes three build channels into one GitHub Pages artifact.

## Channels

- main -> https://kvnloo.github.io/ace/
- dev -> https://kvnloo.github.io/ace/dev/
- nightly -> https://kvnloo.github.io/ace/nightly/

The nightly branch is the fast-moving preview surface. It can receive direct landing-page work without merging into dev or main.

## Workflow

.github/workflows/deploy.yml triggers on pushes to main, dev, or nightly.

Every run:
1. checks out main and builds with VITE_BASE_PATH=/ace/;
2. checks out dev and builds with VITE_BASE_PATH=/ace/dev/;
3. checks out nightly and builds with VITE_BASE_PATH=/ace/nightly/;
4. uploads the combined artifact;
5. deploys it through GitHub Pages.

Every successful deployment refreshes all three channels from their current branch heads.

## Setup

Repository Settings -> Pages -> Source must be GitHub Actions.

The workflow needs contents:read, pages:write, and id-token:write.

The deployment job deliberately avoids a branch-restricted environment gate so pushes to the dedicated nightly branch can publish the preview channel.

## Verification

Before treating a channel as live:
1. confirm the latest Validate workflow passed;
2. confirm Build and Deploy to GitHub Pages passed both build and deploy jobs;
3. open the exact channel URL;
4. verify the channel badge;
5. check asset requests and console errors;
6. exercise Home, System, Facility, Campus, Contact, and the pretotype guide on desktop and narrow mobile widths.

## Local channel builds

Production-shaped:
VITE_BASE_PATH=/ace/ npm run build

Dev-shaped:
VITE_BASE_PATH=/ace/dev/ npm run build

Nightly-shaped:
VITE_BASE_PATH=/ace/nightly/ npm run build

## Troubleshooting

Build succeeds but deploy job never starts:
Check repository Pages/environment protection settings. A branch-restricted github-pages environment can reject pushes from nightly before any deploy action executes.

Artifact missing:
The build job must finish all three branch builds and the upload-pages-artifact step.

Assets 404 under a channel:
Confirm the matching VITE_BASE_PATH: /ace/, /ace/dev/, or /ace/nightly/.

A later deployment removes nightly:
The workflow merged to the branch that triggered Pages must include the nightly build. Until this workflow lands in long-lived branches, a legacy main/dev deployment can replace the Pages artifact without /nightly/. Pushing nightly again restores it.

## Honesty

A successful Pages deployment proves only that the public pretotype built and published. It does not prove that private twins, simulations, facility automation, coaching interventions, or campus systems are live.
