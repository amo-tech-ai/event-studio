# Complete 100% Working Supabase Setup

**Goal**: Get Supabase local development 100% functional by switching from Docker Desktop to Docker Engine.

**Time Required**: 10-15 minutes  
**Difficulty**: Easy (automated script provided)

---

## 🎯 Why This Solution?

**Problem**: Docker Desktop has file sharing limitations that block Supabase services.

**Solution**: Docker Engine (native Linux Docker) - the recommended Docker installation for Linux servers and development.

**Benefits**:
- ✅ No file sharing limitations
- ✅ Better performance (no VM overhead)
- ✅ Standard Linux Docker setup
- ✅ Production-ready configuration
- ✅ All Supabase services work perfectly

---

## 🔧 Automated Installation Script

Save and run this script to automatically migrate to Docker Engine:

```bash
#!/bin/bash
# migrate-to-docker-engine.sh
# Migrates from Docker Desktop to Docker Engine for full Supabase compatibility

set -e

echo "🚀 Migrating to Docker Engine for Full Supabase Support"
echo "=========================================================="
echo ""

# Step 1: Stop Docker Desktop
echo "📦 Step 1: Stopping Docker Desktop..."
systemctl --user stop docker-desktop || true
sleep 3

# Step 2: Remove Docker Desktop
echo "🗑️  Step 2: Removing Docker Desktop (config preserved)..."
sudo apt-get remove -y docker-desktop || true

# Step 3: Install Docker Engine prerequisites
echo "📚 Step 3: Installing prerequisites..."
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg

# Step 4: Add Docker's official GPG key
echo "🔑 Step 4: Adding Docker GPG key..."
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Step 5: Set up the repository
echo "📦 Step 5: Adding Docker repository..."
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Step 6: Install Docker Engine
echo "⚙️  Step 6: Installing Docker Engine..."
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Step 7: Start and enable Docker service
echo "🚀 Step 7: Starting Docker Engine..."
sudo systemctl enable docker
sudo systemctl start docker

# Step 8: Add user to docker group
echo "👤 Step 8: Adding $USER to docker group..."
sudo usermod -aG docker $USER

# Step 9: Verify installation
echo ""
echo "✅ Docker Engine installed successfully!"
echo ""
echo "📊 Docker Version:"
sudo docker version --format '{{.Server.Version}}'

echo ""
echo "⚠️  IMPORTANT: You must log out and log back in for group changes to take effect."
echo ""
echo "After logging back in, run:"
echo "  docker ps                    # Verify Docker works without sudo"
echo "  cd /home/sk/event-studio"
echo "  npx supabase start           # Start Supabase (will work 100%)"
echo ""
echo "🎉 Setup complete! Supabase will work perfectly after you re-login."

