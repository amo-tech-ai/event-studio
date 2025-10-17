# Docker Setup Guide for Supabase Local Development

## Current Status: ❌ NOT RUNNING

**Problem**: Docker Desktop is installed but not started. All Supabase CLI commands fail without a running Docker daemon.

---

## 🔧 Quick Fix (Start Docker Desktop)

### Option 1: GUI Method (Recommended)
```bash
# Launch Docker Desktop from your application menu
# Search for "Docker Desktop" and click to open
# Accept terms if prompted
```

### Option 2: Terminal Method
```bash
# Start Docker Desktop service
systemctl --user start docker-desktop

# Verify it's running
systemctl --user status docker-desktop

# Enable auto-start on login
systemctl --user enable docker-desktop
```

### Verify Docker is Running
```bash
# Should show version info (not errors)
docker ps

# Should return daemon info
docker info

# Check Desktop status
docker context ls
```

**Success Criteria**: 
- `docker ps` shows empty list (not error)
- `docker info` shows system details
- No "cannot connect to daemon" errors

---

## 🏗️ Complete Docker Desktop Setup

### 1. Post-Installation Configuration

#### a) Add User to Docker Group (Optional)
```bash
# Check if docker group exists
getent group docker

# Add your user (requires logout/login to take effect)
sudo usermod -aG docker $USER

# Verify after re-login
groups | grep docker
```

#### b) Configure Docker Desktop Settings

Launch Docker Desktop GUI and configure:

1. **Resources** → Allocate:
   - CPUs: 4+ (Supabase needs multiple containers)
   - Memory: 6GB+ (recommended for local dev)
   - Swap: 2GB
   - Disk: 20GB+

2. **General**:
   - ✅ Start Docker Desktop when you sign in
   - ✅ Enable Docker Compose V2

3. **Advanced** (if needed):
   - Enable experimental features: Optional
   - Enable containerd image store: Optional

#### c) Verify Configuration
```bash
# Check resource allocation
docker info | grep -E 'CPUs|Total Memory'

# Check Docker Compose version (should be V2)
docker compose version
```

---

## 🐳 Docker Engine vs Docker Desktop

**You have Docker Desktop** - This is correct for Ubuntu Desktop systems.

### Key Differences:
- **Docker Engine** (server only): Systemd service at system level
- **Docker Desktop** (GUI + Engine): User-level service + VM wrapper

### Your Setup:
```bash
# ✅ Installed (correct)
docker-desktop          4.47.0-206054

# ❌ Removed (ignore this)
docker.io               rc (removed, config remains)

# ✅ CLI tools (correct)
docker-ce-cli           5:28.5.1-1
docker-compose-plugin   2.40.0-1
```

**Action**: No changes needed. Docker Desktop is the right choice for desktop Ubuntu.

---

## 🔍 Troubleshooting Docker Issues

### Issue 1: "Cannot connect to Docker daemon"
```bash
# Symptom
docker ps
# Error: Cannot connect to the Docker daemon at unix:///var/run/docker.sock

# Solution
systemctl --user start docker-desktop
# Wait 10-20 seconds for startup
docker ps
```

### Issue 2: "Permission denied" socket errors
```bash
# Symptom
/socket_mnt/home/sk/.docker/desktop/docker.sock: permission denied

# Solution 1: Restart Docker Desktop
systemctl --user restart docker-desktop

# Solution 2: Add user to docker group (then logout/login)
sudo usermod -aG docker $USER
```

### Issue 3: Docker Desktop won't start
```bash
# Check logs
journalctl --user -u docker-desktop -n 50

# Common fix: Reset to factory defaults
# Docker Desktop → Settings → Troubleshoot → Reset to factory defaults

# Nuclear option: Reinstall
sudo apt-get purge docker-desktop
sudo apt-get install ./docker-desktop-amd64.deb
```

### Issue 4: Containers fail to start
```bash
# Check disk space
df -h /var/lib/docker

# Prune unused resources
docker system prune -a --volumes
# ⚠️ WARNING: This deletes all stopped containers and unused images

# Check for conflicting processes
sudo lsof -i :5432  # PostgreSQL port
sudo lsof -i :8000  # Supabase Studio
```

---

## 📋 Docker Health Checklist

Run these commands to verify your setup:

```bash
# 1. Docker Desktop service running?
systemctl --user status docker-desktop | grep Active
# Should show: Active: active (running)

# 2. Docker CLI working?
docker --version
# Should show: Docker version 28.5.1

# 3. Docker daemon accessible?
docker ps
# Should show: Empty list or running containers (not error)

# 4. Docker Compose available?
docker compose version
# Should show: Docker Compose version v2.40.0

# 5. Contexts configured?
docker context ls
# Should show: desktop-linux (current)

# 6. Resource allocation?
docker info | grep -E 'CPUs|Total Memory'
# Should show: CPUs: 4+, Total Memory: 6GB+
```

**All checks passing?** ✅ Docker is production-ready for Supabase local dev.

---

## 🚀 Production-Ready Configuration

### Recommended Settings for Supabase Development

```bash
# 1. Set Docker Desktop to use sufficient resources
# Via GUI: Settings → Resources
# - CPUs: 4 (minimum 2)
# - Memory: 6 GB (minimum 4 GB)
# - Swap: 2 GB
# - Disk: 20 GB+

# 2. Enable BuildKit for faster builds
export DOCKER_BUILDKIT=1
# Add to ~/.bashrc for persistence

# 3. Configure logging driver (prevent disk filling)
# Create or edit ~/.docker/daemon.json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
# Then restart: systemctl --user restart docker-desktop

# 4. Set up Docker Compose memory limits
# Supabase will handle this automatically
```

---

## 🔗 Integration with Supabase CLI

Once Docker is running, Supabase CLI will:

1. **Automatically pull required images**:
   - `supabase/postgres:17.6.1.016`
   - `supabase/gotrue:v2.179.0`
   - `supabase/studio:latest`
   - And ~10 more services

2. **Create local containers** (prefixed `supabase_*`):
   ```bash
   docker ps --filter "name=supabase_"
   ```

3. **Manage networks and volumes**:
   ```bash
   docker network ls | grep supabase
   docker volume ls | grep supabase
   ```

---

## 📚 Reference Links

- [Docker Desktop for Ubuntu](https://docs.docker.com/desktop/setup/install/linux/ubuntu/)
- [Supabase Self-Hosting with Docker](https://supabase.com/docs/guides/self-hosting/docker)
- [Docker Desktop Release Notes](https://docs.docker.com/desktop/release-notes/)

---

## ✅ Success Criteria

Your Docker setup is **production-ready** when:

- [ ] `systemctl --user status docker-desktop` shows "active (running)"
- [ ] `docker ps` executes without errors
- [ ] `docker info` returns daemon information
- [ ] `docker compose version` shows V2.x
- [ ] Resource allocation: 4+ CPUs, 6+ GB RAM
- [ ] Disk space: 20+ GB available
- [ ] No permission errors when running Docker commands
- [ ] Auto-start on login enabled

**Next Step**: Proceed to Supabase CLI setup → `02-cli.md`

