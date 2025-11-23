# CI/CD Publishing Guide

## Overview

This repository uses GitHub Actions to automatically publish to npm when you create a new release. No manual `npm publish` needed!

## 🔧 Setup (One-time)

### 1. Create an npm Access Token

1. Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. Click **"Generate New Token"** → **"Classic Token"**
3. Select **"Automation"** type (for CI/CD)
4. Copy the token (starts with `npm_...`)

### 2. Add Token to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Name: `NPM_TOKEN`
5. Value: Paste your npm token
6. Click **"Add secret"**

## 🚀 Publishing Workflow

### Automated Publishing (Recommended)

> ⚠️ **IMPORTANT**: You must bump the version before creating a release. npm doesn't allow publishing the same version twice.

1. **Update version in package.json**
   ```bash
   npm version patch  # 1.0.0 → 1.0.1 (bug fixes)
   # or
   npm version minor  # 1.0.0 → 1.1.0 (new features)
   # or
   npm version major  # 1.0.0 → 2.0.0 (breaking changes)
   ```
   This creates a git tag automatically (e.g., `v1.0.1`).

2. **Push the tag to GitHub**
   ```bash
   git push
   git push --tags
   ```

3. **Create a GitHub Release**
   - Go to your repository on GitHub
   - Click **"Releases"** → **"Create a new release"**
   - Select the tag you just pushed (e.g., `v1.0.1`)
   - Add release title (e.g., `v1.0.1`)
   - Add release notes describing changes
   - Click **"Publish release"**

4. **GitHub Actions takes over!**
   - Workflow runs automatically
   - Installs dependencies
   - Runs build
   - Publishes to npm
   - Check progress in **Actions** tab

### Manual Publishing (Fallback)

If you prefer manual publishing or need to bypass CI/CD:

```bash
# 1. Build
npm run build

# 2. Publish
npm publish
```

## 📋 What Each Workflow Does

### `publish.yml` - Publish to npm
- **Trigger**: When you publish a GitHub release
- **Actions**:
  - Checks out code
  - Sets up Node.js 20
  - Installs dependencies (`npm ci`)
  - Builds the package (`npm run build`)
  - Publishes to npm with provenance

### `ci.yml` - Continuous Integration
- **Trigger**: On push to `main` or pull requests
- **Actions**:
  - Tests on Node.js 18, 20, and 22
  - Runs linter (`npm run lint`)
  - Runs type checking (`npm run type-check`)
  - Builds the package
  - Verifies build outputs exist

## 🎯 Quick Publish Example

```bash
# Make your changes, commit them
git add .
git commit -m "feat: add new feature"

# Bump version (creates git tag)
npm version minor  # 1.0.0 → 1.1.0

# Push code and tags
git push && git push --tags

# Go to GitHub and create release from tag
# → GitHub Actions automatically publishes to npm!
```

## 🔍 Monitoring Builds

- Go to **Actions** tab in your GitHub repository
- Click on the running workflow to see logs
- Green checkmark = successful publish ✅
- Red X = failed, click to see error logs ❌

## ⚠️ Important Notes

1. **npm token security**: Never commit your NPM_TOKEN to the repository
2. **Provenance**: The workflow includes `--provenance` flag for supply chain security
3. **Version must be bumped**: npm won't allow publishing the same version twice
4. **Tests run on every push**: CI workflow ensures code quality before you release

## 🛠️ Troubleshooting

### "Error: Unable to authenticate"
- Check that NPM_TOKEN secret is set correctly in GitHub
- Verify the token hasn't expired
- Regenerate token if needed

### "Error: Version already exists"
- Bump the version in package.json
- Run `npm version patch/minor/major`

### "Build failed"
- Check the workflow logs in Actions tab
- Test locally with `npm run build`
- Ensure all dependencies are in package.json

### "Cannot find package after publishing"
- Wait a few minutes (npm registry can take time to update)
- Check https://www.npmjs.com/package/use-async-view
- Verify package was published successfully in Actions logs

## 🎉 Benefits of CI/CD

✅ **Consistent builds** - Same environment every time  
✅ **No manual steps** - Automated testing and publishing  
✅ **Provenance** - Cryptographically signed packages  
✅ **Multi-Node testing** - Ensures compatibility  
✅ **Release notes** - GitHub releases document changes  
✅ **Rollback friendly** - Tag-based versioning

## 📚 Additional Resources

- [npm provenance documentation](https://docs.npmjs.com/generating-provenance-statements)
- [GitHub Actions documentation](https://docs.github.com/en/actions)
- [Semantic Versioning (semver)](https://semver.org/)
