class GameEngine {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.minimapCanvas = document.getElementById('minimap-canvas');
        this.minimapCtx = this.minimapCanvas.getContext('2d');
        
        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        this.player = null;
        this.gameObjects = [];
        this.items = [];
        this.npcs = [];
        this.enemies = [];
        this.houses = [];
        this.inventory = [];
        this.camera = { x: 0, y: 0 };
        this.lastAttackTime = 0;
        this.setupPlayer();
        this.setupGameWorld();
        this.lastTime = 0;
        this.start();
    }

    resizeCanvas() {
        // Main canvas
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Minimap canvas
        this.minimapCanvas.width = 200;
        this.minimapCanvas.height = 200;
    }

    setupPlayer() {
        this.player = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            width: 32,
            height: 48,
            speed: 5,
            direction: 'down',
            moving: false,
            attacking: false,
            attackFrame: 0,
            animationFrame: 0,
            inventory: [],
            equipment: {
                weapon: null,
                armor: null
            },
            stats: {
                health: 100,
                maxHealth: 100,
                mana: 100,
                maxMana: 100,
                exp: 0,
                level: 1,
                damage: 10
            }
        };
    }

    setupGameWorld() {
        // Load houses from game data
        this.houses = GameData.map.houses.map(house => ({
            ...house,
            width: 100,
            height: 80
        }));

        // Load enemies from game data
        this.enemies = GameData.map.enemies.map(enemy => ({
            ...enemy,
            width: 32,
            height: 48,
            direction: 'down',
            moving: false,
            animationFrame: 0,
            attackRange: GameData.combat.attackRange
        }));

        // Create map objects (trees, rocks, etc)
        for(let i = 0; i < 20; i++) {
            this.gameObjects.push({
                x: Math.random() * GameData.map.width,
                y: Math.random() * GameData.map.height,
                type: Math.random() > 0.5 ? 'tree' : 'rock'
            });
        }
    }

    start() {
        this.setupControls();
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    setupControls() {
        window.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                    this.player.y -= this.player.speed;
                    this.player.direction = 'up';
                    this.player.moving = true;
                    break;
                case 'ArrowDown':
                case 's':
                    this.player.y += this.player.speed;
                    this.player.direction = 'down';
                    this.player.moving = true;
                    break;
                case 'ArrowLeft':
                case 'a':
                    this.player.x -= this.player.speed;
                    this.player.direction = 'left';
                    this.player.moving = true;
                    break;
                case 'ArrowRight':
                case 'd':
                    this.player.x += this.player.speed;
                    this.player.direction = 'right';
                    this.player.moving = true;
                    break;
                case ' ': // Space bar for attack
                    this.attack();
                    break;
                case 'i': // Toggle inventory
                    this.toggleInventory();
                    break;
            }
        });

        window.addEventListener('keyup', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
                this.player.moving = false;
            }
        });

        // Mouse click for attack
        this.canvas.addEventListener('click', (e) => {
            this.attack();
        });
    }

    attack() {
        const now = Date.now();
        if (now - this.lastAttackTime < GameData.combat.attackSpeed) return;
        
        this.lastAttackTime = now;
        this.player.attacking = true;
        this.player.attackFrame = 0;

        // Check for enemies in range
        this.enemies.forEach(enemy => {
            const dx = enemy.x - this.player.x;
            const dy = enemy.y - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= GameData.combat.attackRange) {
                enemy.health -= this.player.stats.damage;
                if (enemy.health <= 0) {
                    this.enemies = this.enemies.filter(e => e !== enemy);
                    this.player.stats.exp += GameData.combat.experiencePoints.skeleton;
                }
            }
        });
    }

    toggleInventory() {
        const inventory = document.getElementById('inventory');
        inventory.style.display = inventory.style.display === 'none' ? 'block' : 'none';
    }

    updateCamera() {
        this.camera.x = this.player.x - this.canvas.width / 2;
        this.camera.y = this.player.y - this.canvas.height / 2;

        // Clamp camera to map bounds
        this.camera.x = Math.max(0, Math.min(this.camera.x, GameData.map.width - this.canvas.width));
        this.camera.y = Math.max(0, Math.min(this.camera.y, GameData.map.height - this.canvas.height));
    }

    gameLoop(timestamp) {
        // Calculate delta time
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        // Update camera
        this.updateCamera();

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Save context state
        this.ctx.save();
        
        // Apply camera transform
        this.ctx.translate(-this.camera.x, -this.camera.y);
        
        // Draw map
        this.drawMap();
        
        // Draw houses
        this.houses.forEach(house => this.drawHouse(house));
        
        // Draw game objects
        this.gameObjects.forEach(obj => this.drawGameObject(obj));
        
        // Draw enemies
        this.enemies.forEach(enemy => this.drawEnemy(enemy));
        
        // Draw player
        this.drawPlayer();
        
        // Restore context state
        this.ctx.restore();

        // Draw minimap
        this.drawMinimap();
        
        // Update animation frames
        if (this.player.moving) {
            this.player.animationFrame = (this.player.animationFrame + 1) % 30;
        }
        if (this.player.attacking) {
            this.player.attackFrame++;
            if (this.player.attackFrame >= 10) {
                this.player.attacking = false;
            }
        }
        
        // Request next frame
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    drawMap() {
        // Draw grass background
        this.ctx.fillStyle = '#4a844c';
        this.ctx.fillRect(0, 0, GameData.map.width, GameData.map.height);

        // Draw grid pattern for tiles
        this.ctx.strokeStyle = '#45784a';
        this.ctx.lineWidth = 1;

        for(let x = 0; x < GameData.map.width; x += GameData.map.tileSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, GameData.map.height);
            this.ctx.stroke();
        }

        for(let y = 0; y < GameData.map.height; y += GameData.map.tileSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(GameData.map.width, y);
            this.ctx.stroke();
        }
    }

    drawHouse(house) {
        // Draw house base
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(house.x, house.y, house.width, house.height);

        // Draw roof
        this.ctx.fillStyle = '#A52A2A';
        this.ctx.beginPath();
        this.ctx.moveTo(house.x - 10, house.y);
        this.ctx.lineTo(house.x + house.width/2, house.y - 30);
        this.ctx.lineTo(house.x + house.width + 10, house.y);
        this.ctx.closePath();
        this.ctx.fill();

        // Draw door
        this.ctx.fillStyle = '#4a4a4a';
        this.ctx.fillRect(house.x + house.width/2 - 10, house.y + house.height - 30, 20, 30);

        // Draw windows
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(house.x + 15, house.y + 15, 20, 20);
        this.ctx.fillRect(house.x + house.width - 35, house.y + 15, 20, 20);

        // Draw owner name
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(house.owner, house.x + house.width/2, house.y + house.height + 20);
    }

    drawEnemy(enemy) {
        // Draw enemy shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.beginPath();
        this.ctx.ellipse(enemy.x, enemy.y + 20, 15, 8, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw skeleton body
        this.ctx.fillStyle = '#E0E0E0';
        
        // Draw legs with animation
        const legOffset = Math.sin(enemy.animationFrame * 0.2) * 5;
        this.ctx.fillRect(enemy.x - 8, enemy.y, 6, 20 + legOffset);
        this.ctx.fillRect(enemy.x + 2, enemy.y, 6, 20 - legOffset);

        // Draw body
        this.ctx.fillRect(enemy.x - 12, enemy.y - 15, 24, 20);

        // Draw arms
        this.ctx.fillRect(enemy.x - 15, enemy.y - 10, 5, 15);
        this.ctx.fillRect(enemy.x + 10, enemy.y - 10, 5, 15);

        // Draw skull
        this.ctx.beginPath();
        this.ctx.arc(enemy.x, enemy.y - 25, 10, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw eye sockets
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(enemy.x - 4, enemy.y - 25, 2, 0, Math.PI * 2);
        this.ctx.arc(enemy.x + 4, enemy.y - 25, 2, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw health bar if damaged
        if (enemy.health < enemy.maxHealth) {
            const healthPercentage = enemy.health / enemy.maxHealth;
            this.ctx.fillStyle = '#ff0000';
            this.ctx.fillRect(enemy.x - 15, enemy.y - 40, 30 * healthPercentage, 5);
            this.ctx.strokeStyle = '#000';
            this.ctx.strokeRect(enemy.x - 15, enemy.y - 40, 30, 5);
        }
    }

    drawPlayer() {
        // Draw player shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.beginPath();
        this.ctx.ellipse(this.player.x, this.player.y + 20, 15, 8, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw player legs with animation
        this.ctx.fillStyle = '#4444ff';
        const legOffset = Math.sin(this.player.animationFrame * 0.2) * 5;
        this.ctx.fillRect(this.player.x - 10, this.player.y, 8, 20 + legOffset);
        this.ctx.fillRect(this.player.x + 2, this.player.y, 8, 20 - legOffset);

        // Draw player body
        this.ctx.fillStyle = '#2196F3';
        this.ctx.fillRect(this.player.x - 15, this.player.y - 20, 30, 25);

        // Draw player head
        this.ctx.fillStyle = '#FFE4C4';
        this.ctx.beginPath();
        this.ctx.arc(this.player.x, this.player.y - 30, 12, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw player eyes based on direction
        this.ctx.fillStyle = '#000';
        switch(this.player.direction) {
            case 'left':
                this.ctx.beginPath();
                this.ctx.arc(this.player.x - 5, this.player.y - 30, 2, 0, Math.PI * 2);
                this.ctx.fill();
                break;
            case 'right':
                this.ctx.beginPath();
                this.ctx.arc(this.player.x + 5, this.player.y - 30, 2, 0, Math.PI * 2);
                this.ctx.fill();
                break;
            case 'up':
                this.ctx.beginPath();
                this.ctx.arc(this.player.x - 5, this.player.y - 32, 2, 0, Math.PI * 2);
                this.ctx.arc(this.player.x + 5, this.player.y - 32, 2, 0, Math.PI * 2);
                this.ctx.fill();
                break;
            case 'down':
                this.ctx.beginPath();
                this.ctx.arc(this.player.x - 5, this.player.y - 28, 2, 0, Math.PI * 2);
                this.ctx.arc(this.player.x + 5, this.player.y - 28, 2, 0, Math.PI * 2);
                this.ctx.fill();
                break;
        }

        // Draw attack animation
        if (this.player.attacking) {
            const weaponAngle = this.player.attackFrame * Math.PI / 5;
            this.ctx.save();
            this.ctx.translate(this.player.x, this.player.y - 10);
            this.ctx.rotate(weaponAngle);
            
            // Draw sword
            this.ctx.fillStyle = '#C0C0C0';
            this.ctx.fillRect(0, 0, 5, 30);
            // Draw handle
            this.ctx.fillStyle = '#8B4513';
            this.ctx.fillRect(-8, 0, 16, 8);
            
            this.ctx.restore();
        }
        // Draw equipped items when not attacking
        else if (this.player.equipment.weapon) {
            // Draw weapon on back
            this.ctx.fillStyle = '#C0C0C0';
            this.ctx.fillRect(this.player.x + 15, this.player.y - 15, 5, 25);
        }
        
        if (this.player.equipment.armor) {
            // Add armor details to body
            this.ctx.strokeStyle = '#8B4513';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(this.player.x - 15, this.player.y - 20, 30, 25);
        }
    }

    drawGameObject(obj) {
        if (obj.type === 'tree') {
            // Draw tree shadow
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            this.ctx.beginPath();
            this.ctx.ellipse(obj.x, obj.y + 25, 20, 10, 0, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw tree trunk
            this.ctx.fillStyle = '#8B4513';
            this.ctx.fillRect(obj.x - 10, obj.y - 20, 20, 40);
            
            // Draw tree leaves in layers for more depth
            this.ctx.fillStyle = '#228B22';
            this.ctx.beginPath();
            this.ctx.arc(obj.x, obj.y - 50, 25, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.fillStyle = '#2E8B57';
            this.ctx.beginPath();
            this.ctx.arc(obj.x, obj.y - 40, 20, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.fillStyle = '#3CB371';
            this.ctx.beginPath();
            this.ctx.arc(obj.x, obj.y - 30, 15, 0, Math.PI * 2);
            this.ctx.fill();
        } else if (obj.type === 'rock') {
            // Draw rock shadow
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            this.ctx.beginPath();
            this.ctx.ellipse(obj.x, obj.y + 15, 25, 10, 0, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw rock with gradient for depth
            const gradient = this.ctx.createRadialGradient(
                obj.x - 5, obj.y - 5, 5,
                obj.x, obj.y, 25
            );
            gradient.addColorStop(0, '#A9A9A9');
            gradient.addColorStop(1, '#696969');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.ellipse(obj.x, obj.y, 25, 20, Math.PI / 6, 0, Math.PI * 2);
            this.ctx.fill();

            // Add highlights
            this.ctx.strokeStyle = '#B8B8B8';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(obj.x - 10, obj.y - 5);
            this.ctx.lineTo(obj.x - 5, obj.y - 10);
            this.ctx.stroke();
        }
    }

    drawMinimap() {
        // Clear minimap
        this.minimapCtx.clearRect(0, 0, this.minimapCanvas.width, this.minimapCanvas.height);
        
        // Draw background
        this.minimapCtx.fillStyle = '#4a844c';
        this.minimapCtx.fillRect(0, 0, this.minimapCanvas.width, this.minimapCanvas.height);
        
        // Calculate scale
        const scaleX = this.minimapCanvas.width / GameData.map.width;
        const scaleY = this.minimapCanvas.height / GameData.map.height;
        
        // Draw houses
        this.minimapCtx.fillStyle = '#8B4513';
        this.houses.forEach(house => {
            this.minimapCtx.fillRect(
                house.x * scaleX,
                house.y * scaleY,
                house.width * scaleX,
                house.height * scaleY
            );
        });
        
        // Draw enemies
        this.minimapCtx.fillStyle = '#ff0000';
        this.enemies.forEach(enemy => {
            this.minimapCtx.beginPath();
            this.minimapCtx.arc(
                enemy.x * scaleX,
                enemy.y * scaleY,
                2,
                0,
                Math.PI * 2
            );
            this.minimapCtx.fill();
        });
        
        // Draw player
        this.minimapCtx.fillStyle = '#00ff00';
        this.minimapCtx.beginPath();
        this.minimapCtx.arc(
            this.player.x * scaleX,
            this.player.y * scaleY,
            3,
            0,
            Math.PI * 2
        );
        this.minimapCtx.fill();
        
        // Draw view rectangle
        this.minimapCtx.strokeStyle = '#ffffff';
        this.minimapCtx.strokeRect(
            this.camera.x * scaleX,
            this.camera.y * scaleY,
            this.canvas.width * scaleX,
            this.canvas.height * scaleY
        );
    }
}

// Export the GameEngine class
window.GameEngine = GameEngine;
