# Operations

This directory contains infrastructure configuration for deploying the for-all.dev website.

## Files

### nginx-website.conf

Nginx configuration for serving the static site from `/home/quinn/website/dist/`.

**Setup:**
1. Copy to `/etc/nginx/sites-available/for-all.dev`
2. Create symlink: `sudo ln -s /etc/nginx/sites-available/for-all.dev /etc/nginx/sites-enabled/`
3. Test configuration: `sudo nginx -t`
4. Reload nginx: `sudo systemctl reload nginx`
5. Set up SSL with certbot: `sudo certbot --nginx -d for-all.dev`

**Key features:**
- Serves static files from `dist/` directory
- Aggressive caching for assets (1 year)
- CORS headers for cross-origin requests
- Fallback to index.html for client-side routing
- HTTPS with automatic HTTP to HTTPS redirect

## Deployment

Deployment is automated via GitHub Actions (see `.github/workflows/deploy.yml`).

On push to master:
1. Code is checked out
2. Dependencies are installed
3. Static site is built with `npm run build`
4. Built files are copied to server via SSH/SCP

**Required GitHub Secrets:**
- `DEPLOY_SSH_KEY`: SSH private key for deployment
- `FORALLDEV_IP4`: Server IP address

## Manual Deployment

To deploy manually:

```bash
# Build locally
npm run build

# Copy to server
scp -r dist/* quinn@SERVER_IP:/home/quinn/website/dist/
```
