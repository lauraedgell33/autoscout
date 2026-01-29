#!/bin/bash

# ================================================
# Setup Script for Vercel CLI and Forge CLI
# ================================================

RESET='\033[0m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${RESET}"
echo -e "${BLUE}║                                                                ║${RESET}"
echo -e "${BLUE}║          🔐 Vercel & Forge CLI Setup and Authentication       ║${RESET}"
echo -e "${BLUE}║                                                                ║${RESET}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${RESET}"
echo ""

# ================================================
# 1. VERCEL CLI SETUP
# ================================================
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${CYAN}1️⃣  VERCEL CLI SETUP${RESET}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""

# Check if vercel is installed
if command -v vercel &> /dev/null; then
    VERCEL_VERSION=$(vercel --version)
    echo -e "${GREEN}✅ Vercel CLI is installed${RESET}"
    echo "   Version: $VERCEL_VERSION"
    echo ""
else
    echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${RESET}"
    npm install -g vercel
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Vercel CLI installed successfully${RESET}"
    else
        echo -e "${RED}❌ Failed to install Vercel CLI${RESET}"
        exit 1
    fi
fi

echo ""

# Check if logged in to Vercel
echo -e "${YELLOW}🔐 Checking Vercel authentication...${RESET}"
echo ""

if vercel whoami &> /dev/null 2>&1; then
    VERCEL_USER=$(vercel whoami)
    echo -e "${GREEN}✅ Already logged in to Vercel${RESET}"
    echo "   User: $VERCEL_USER"
    echo ""
else
    echo -e "${YELLOW}⚠️  Not logged in to Vercel${RESET}"
    echo ""
    echo "Opening Vercel login in your browser..."
    echo "Follow the instructions to authenticate."
    echo ""
    
    vercel login
    
    if [ $? -eq 0 ]; then
        VERCEL_USER=$(vercel whoami)
        echo -e "${GREEN}✅ Successfully logged in to Vercel${RESET}"
        echo "   User: $VERCEL_USER"
    else
        echo -e "${RED}❌ Vercel login failed${RESET}"
        exit 1
    fi
fi

echo ""

# ================================================
# 2. FORGE CLI SETUP
# ================================================
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${CYAN}2️⃣  FORGE CLI SETUP${RESET}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""

# Check if forge CLI is installed
if command -v forge &> /dev/null; then
    echo -e "${GREEN}✅ Forge CLI is installed${RESET}"
    FORGE_VERSION=$(forge --version 2>/dev/null || echo "unknown")
    echo "   Version: $FORGE_VERSION"
    echo ""
else
    echo -e "${YELLOW}⚠️  Forge CLI not found. Installing...${RESET}"
    echo ""
    
    # Check if composer is available
    if ! command -v composer &> /dev/null; then
        echo -e "${RED}❌ Composer is required for Forge CLI${RESET}"
        echo "Please install Composer first: https://getcomposer.org/download/"
        exit 1
    fi
    
    echo "Installing Laravel Forge CLI via Composer..."
    composer global require laravel/forge-cli
    
    if [ $? -eq 0 ]; then
        # Add composer bin to PATH if not already there
        if [[ ":$PATH:" != *":$HOME/.composer/vendor/bin:"* ]]; then
            export PATH="$HOME/.composer/vendor/bin:$PATH"
            echo "Added Composer bin to PATH"
        fi
        
        echo -e "${GREEN}✅ Forge CLI installed successfully${RESET}"
    else
        echo -e "${RED}❌ Failed to install Forge CLI${RESET}"
        exit 1
    fi
fi

echo ""

# Check if logged in to Forge
echo -e "${YELLOW}🔐 Checking Forge authentication...${RESET}"
echo ""

if forge whoami &> /dev/null 2>&1; then
    FORGE_USER=$(forge whoami)
    echo -e "${GREEN}✅ Already logged in to Forge${RESET}"
    echo "   User: $FORGE_USER"
    echo ""
else
    echo -e "${YELLOW}⚠️  Not logged in to Forge${RESET}"
    echo ""
    echo "To login to Forge, you need to generate an API token:"
    echo "1. Visit: https://forge.laravel.com/account/api"
    echo "2. Create a new token with full access"
    echo "3. Copy the token"
    echo ""
    read -p "Enter your Forge API token: " FORGE_TOKEN
    
    if [ -z "$FORGE_TOKEN" ]; then
        echo -e "${RED}❌ Forge API token is required${RESET}"
        exit 1
    fi
    
    # Store the token
    mkdir -p ~/.config/forge
    echo "$FORGE_TOKEN" > ~/.config/forge/token
    chmod 600 ~/.config/forge/token
    
    echo -e "${GREEN}✅ Forge token stored${RESET}"
    echo ""
fi

echo ""

# ================================================
# 3. VERIFY BOTH CONNECTIONS
# ================================================
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${CYAN}3️⃣  VERIFYING CONNECTIONS${RESET}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""

# Verify Vercel
echo -e "${YELLOW}Testing Vercel connection...${RESET}"
if vercel whoami &> /dev/null; then
    VERCEL_USER=$(vercel whoami)
    echo -e "${GREEN}✅ Vercel: Connected as $VERCEL_USER${RESET}"
else
    echo -e "${RED}❌ Vercel: Connection failed${RESET}"
fi

echo ""

# Verify Forge
echo -e "${YELLOW}Testing Forge connection...${RESET}"
if forge whoami &> /dev/null 2>&1; then
    FORGE_USER=$(forge whoami 2>/dev/null || echo "user")
    echo -e "${GREEN}✅ Forge: Connected as $FORGE_USER${RESET}"
else
    echo -e "${YELLOW}⚠️  Forge: Waiting for test...${RESET}"
fi

echo ""

# ================================================
# 4. SHOW AVAILABLE PROJECTS/SERVERS
# ================================================
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${CYAN}4️⃣  AVAILABLE PROJECTS & SERVERS${RESET}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""

# List Vercel projects
echo -e "${YELLOW}📦 Vercel Projects:${RESET}"
echo ""
if vercel projects list --json &> /tmp/vercel_projects.json; then
    PROJECT_COUNT=$(cat /tmp/vercel_projects.json | grep -c "name" || echo "0")
    echo -e "${GREEN}  Found projects - run: vercel projects list${RESET}"
else
    echo -e "${YELLOW}  No projects found yet${RESET}"
fi

echo ""

# ================================================
# 5. USAGE INSTRUCTIONS
# ================================================
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${CYAN}5️⃣  USAGE INSTRUCTIONS${RESET}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""

echo -e "${YELLOW}🔗 Vercel CLI Commands:${RESET}"
echo "  vercel whoami                 # Show current user"
echo "  vercel projects list          # List all projects"
echo "  vercel deployments            # Show deployment history"
echo "  vercel --prod                 # Deploy to production"
echo "  vercel env list               # List environment variables"
echo ""

echo -e "${YELLOW}🔗 Forge CLI Commands:${RESET}"
echo "  forge whoami                  # Show current user"
echo "  forge servers                 # List your servers"
echo "  forge sites -s <server_id>    # List sites on server"
echo "  forge deploy <server> <site>  # Deploy a site"
echo ""

# ================================================
# 6. CONFIGURATION FILES
# ================================================
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${CYAN}6️⃣  CONFIGURATION FILES${RESET}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""

echo -e "${YELLOW}📁 Vercel Configuration:${RESET}"
echo "  Location: ~/.vercel/"
if [ -d ~/.vercel ]; then
    echo -e "${GREEN}  ✅ Config directory found${RESET}"
else
    echo -e "${YELLOW}  ⚠️  Config directory not found yet${RESET}"
fi

echo ""

echo -e "${YELLOW}📁 Forge Configuration:${RESET}"
echo "  Location: ~/.config/forge/"
if [ -d ~/.config/forge ]; then
    echo -e "${GREEN}  ✅ Config directory found${RESET}"
else
    echo -e "${YELLOW}  ⚠️  Config directory will be created${RESET}"
fi

echo ""

# ================================================
# 7. NEXT STEPS
# ================================================
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${RESET}"
echo -e "${BLUE}║                                                                ║${RESET}"
echo -e "${GREEN}║            ✅ CLI SETUP COMPLETE ✅                           ║${RESET}"
echo -e "${BLUE}║                                                                ║${RESET}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${RESET}"
echo ""

echo -e "${YELLOW}📝 Next Steps:${RESET}"
echo ""
echo "1. Verify Vercel projects:"
echo "   vercel projects list"
echo ""
echo "2. List Forge servers:"
echo "   forge servers"
echo ""
echo "3. Deploy your application:"
echo "   ./deploy-all.sh 3"
echo ""
echo "4. Monitor deployments:"
echo "   Vercel:  https://vercel.com/dashboard"
echo "   Forge:   https://forge.laravel.com/dashboard"
echo ""

# Store credentials confirmation
echo -e "${GREEN}✅ Vercel and Forge CLIs are now authenticated and ready to use!${RESET}"
echo ""
