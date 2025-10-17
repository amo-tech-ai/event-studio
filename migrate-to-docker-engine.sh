#!/bin/bash
# migrate-to-docker-engine.sh
# Migrates from Docker Desktop to Docker Engine for full Supabase compatibility

set -e

echo "🚀 Migrating to Docker Engine for Full Supabase Support"
echo "=========================================================="
echo ""

# Step 1: Stop Docker Desktop
echo "📦 Step 1: Stopping Docker Desktop..."
systemctl --user stop docker-desktop 2>/dev/null || true
sleep 3

# Step 2: Remove Docker Desktop
echo "🗑️  Step 2: Removing Docker Desktop (config preserved)..."
sudo apt-get remove -y docker-desktop 2>/dev/null || true

# Step 3: Install Docker Engine prerequisites
echo "📚 Step 3: Installing prerequisites..."
sudo apt-get update -qq
sudo apt-get install -y ca-certificates curl gnupg

# Step 4: Add Docker's official GPG key
echo "🔑 Step 4: Adding Docker GPG key..."
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg 2>/dev/null || true
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Step 5: Set up the repository
echo "📦 Step 5: Adding Docker repository..."
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Step 6: Install Docker Engine
echo "⚙️  Step 6: Installing Docker Engine..."
sudo apt-get update -qq
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
sudo docker version --format '{{.Server.Version}}' 2>/dev/null || sudo docker --version

echo ""
echo "⚠️  IMPORTANT: Group changes applied. Testing Docker access..."
echo ""

# Test if we can use docker without sudo (may fail if not logged in fresh)
if sudo -u $USER docker ps &>/dev/null; then
    echo "✅ Docker works! Starting Supabase now..."
    cd /home/sk/event-studio
    sudo -u $USER docker ps
    echo ""
    echo "Starting Supabase local development environment..."
    sudo -u $USER npx supabase start
else
    echo "⚠️  You need to log out and log back in for docker group to take effect."
    echo ""
    echo "After logging back in, run:"
    echo "  cd /home/sk/event-studio"
    echo "  npx supabase start"
fi

echo ""
echo "🎉 Migration complete!"
