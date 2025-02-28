class GameUI {
    constructor(game) {
        this.game = game;
        this.screens = new Map();
        this.currentScreen = null;
        this.dialogueManager = new DialogueManager();
        this.inventoryUI = new InventoryUI();
        this.skillsUI = new SkillsUI();
        this.notifications = new NotificationSystem();
        
        this.items = this.initializeItems();
        this.setupInventory();
        this.setupHPBar();
        
        this.initializeUI();
    }

    initializeUI() {
        // Initialize all UI screens
        document.querySelectorAll('.screen').forEach(screen => {
            this.screens.set(screen.id, screen);
        });

        // Setup event listeners
        this.setupEventListeners();

        // Initialize HUD elements
        this.initializeHUD();

        // Test dialog system
        setTimeout(() => {
            this.dialogueManager.showDialog('elder_sage', 'welcome');
        }, 1000);
    }

    setupEventListeners() {
        // Main menu buttons
        document.getElementById('start-game').addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('load-game').addEventListener('click', () => {
            // TODO: Implement load game
            console.log('Load game clicked');
        });

        document.getElementById('settings').addEventListener('click', () => {
            document.getElementById('settings-modal').classList.remove('hidden');
        });

        // Settings modal
        const settingsModal = document.getElementById('settings-modal');
        document.querySelector('.save-settings').addEventListener('click', () => {
            this.saveSettings();
            settingsModal.classList.add('hidden');
        });
        document.querySelector('.close-modal').addEventListener('click', () => {
            settingsModal.classList.add('hidden');
        });
    }

    startGame() {
        // Skip loading screen and start game immediately
        this.showScreen('game-screen');
        this.game.start();
        
        // Initialize player
        const canvas = document.getElementById('game-canvas');
        const player = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            size: 30,
            color: '#4a90e2',
            speed: 5
        };
        
        // Add keyboard controls
        window.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                    player.y -= player.speed;
                    break;
                case 'ArrowDown':
                case 's':
                    player.y += player.speed;
                    break;
                case 'ArrowLeft':
                case 'a':
                    player.x -= player.speed;
                    break;
                case 'ArrowRight':
                case 'd':
                    player.x += player.speed;
                    break;
                case 'e':
                    // Test dialog
                    this.dialogueManager.showDialog('elder_sage', 'welcome');
                    break;
            }
        });

        // Game loop
        const gameLoop = () => {
            const ctx = canvas.getContext('2d');
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw background
            ctx.fillStyle = '#2a2a40';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw player
            ctx.fillStyle = player.color;
            ctx.beginPath();
            ctx.arc(player.x, player.y, player.size/2, 0, Math.PI * 2);
            ctx.fill();
            
            // Keep player in bounds
            player.x = Math.max(player.size/2, Math.min(canvas.width - player.size/2, player.x));
            player.y = Math.max(player.size/2, Math.min(canvas.height - player.size/2, player.y));
            
            requestAnimationFrame(gameLoop);
        };
        
        // Start game loop
        gameLoop();
    }

    showScreen(screenId) {
        if (this.currentScreen) {
            this.currentScreen.classList.remove('active');
        }
        const screen = this.screens.get(screenId);
        if (screen) {
            screen.classList.add('active');
            this.currentScreen = screen;
        }
    }

    initializeHUD() {
        // Initialize stat bars with default values
        this.updateStatBars({
            health: 100,
            mana: 100,
            exp: 0
        });

        // Initialize resource counters
        this.updateResources({
            gold: 0,
            gems: 0
        });
    }

    updateStatBars(stats) {
        if (stats.health !== undefined) {
            const healthBar = document.querySelector('.health .stat-fill');
            const healthValue = document.querySelector('.health .stat-value');
            if (healthBar && healthValue) {
                healthBar.style.width = `${stats.health}%`;
                healthValue.textContent = `${Math.floor(stats.health)}/100`;
            }
        }

        if (stats.mana !== undefined) {
            const manaBar = document.querySelector('.mana .stat-fill');
            const manaValue = document.querySelector('.mana .stat-value');
            if (manaBar && manaValue) {
                manaBar.style.width = `${stats.mana}%`;
                manaValue.textContent = `${Math.floor(stats.mana)}/100`;
            }
        }

        if (stats.exp !== undefined) {
            const expBar = document.querySelector('.exp .stat-fill');
            const expValue = document.querySelector('.exp .stat-value');
            if (expBar && expValue) {
                expBar.style.width = `${stats.exp}%`;
                expValue.textContent = `Level ${Math.floor(stats.exp / 100) + 1}`;
            }
        }
    }

    updateResources(resources) {
        if (resources.gold !== undefined) {
            const goldValue = document.querySelector('.gold .resource-value');
            if (goldValue) goldValue.textContent = resources.gold;
        }
        if (resources.gems !== undefined) {
            const gemsValue = document.querySelector('.gems .resource-value');
            if (gemsValue) gemsValue.textContent = resources.gems;
        }
    }

    initializeItems() {
        return {
            sword: {
                name: 'Iron Sword',
                type: 'weapon',
                draw: (ctx, x, y, size) => {
                    // Draw sword
                    ctx.save();
                    ctx.translate(x + size/2, y + size/2);
                    
                    // Blade
                    ctx.fillStyle = '#silver';
                    ctx.beginPath();
                    ctx.moveTo(-size/8, -size/2);
                    ctx.lineTo(size/8, -size/2);
                    ctx.lineTo(size/4, size/4);
                    ctx.lineTo(-size/4, size/4);
                    ctx.closePath();
                    ctx.fill();
                    ctx.strokeStyle = '#gray';
                    ctx.stroke();
                    
                    // Handle
                    ctx.fillStyle = '#8B4513';
                    ctx.fillRect(-size/8, size/4, size/4, size/4);
                    
                    // Guard
                    ctx.fillStyle = '#gold';
                    ctx.fillRect(-size/3, size/6, size*2/3, size/8);
                    
                    ctx.restore();
                }
            },
            shield: {
                name: 'Wooden Shield',
                type: 'armor',
                draw: (ctx, x, y, size) => {
                    ctx.save();
                    ctx.translate(x + size/2, y + size/2);
                    
                    // Shield base
                    ctx.fillStyle = '#8B4513';
                    ctx.beginPath();
                    ctx.moveTo(0, -size/2);
                    ctx.lineTo(size/3, -size/3);
                    ctx.lineTo(size/3, size/3);
                    ctx.lineTo(0, size/2);
                    ctx.lineTo(-size/3, size/3);
                    ctx.lineTo(-size/3, -size/3);
                    ctx.closePath();
                    ctx.fill();
                    ctx.strokeStyle = '#gold';
                    ctx.stroke();
                    
                    // Shield emblem
                    ctx.fillStyle = '#gold';
                    ctx.beginPath();
                    ctx.arc(0, 0, size/6, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.restore();
                }
            },
            armor: {
                name: 'Chain Mail',
                type: 'armor',
                draw: (ctx, x, y, size) => {
                    ctx.save();
                    ctx.translate(x + size/2, y + size/2);
                    
                    // Armor body
                    ctx.fillStyle = '#gray';
                    ctx.beginPath();
                    ctx.moveTo(-size/3, -size/3);
                    ctx.lineTo(size/3, -size/3);
                    ctx.lineTo(size/2, size/3);
                    ctx.lineTo(-size/2, size/3);
                    ctx.closePath();
                    ctx.fill();
                    
                    // Chain mail pattern
                    ctx.strokeStyle = '#darkgray';
                    for(let i = -2; i <= 2; i++) {
                        ctx.beginPath();
                        ctx.moveTo(-size/3, i * size/8);
                        ctx.lineTo(size/3, i * size/8);
                        ctx.stroke();
                    }
                    
                    ctx.restore();
                }
            },
            potion: {
                name: 'Health Potion',
                type: 'consumable',
                draw: (ctx, x, y, size) => {
                    ctx.save();
                    ctx.translate(x + size/2, y + size/2);
                    
                    // Bottle
                    ctx.fillStyle = '#transparent';
                    ctx.beginPath();
                    ctx.moveTo(-size/4, -size/3);
                    ctx.lineTo(size/4, -size/3);
                    ctx.lineTo(size/3, size/3);
                    ctx.lineTo(-size/3, size/3);
                    ctx.closePath();
                    ctx.fill();
                    ctx.strokeStyle = '#white';
                    ctx.stroke();
                    
                    // Liquid
                    ctx.fillStyle = '#red';
                    ctx.beginPath();
                    ctx.moveTo(-size/4, 0);
                    ctx.lineTo(size/4, 0);
                    ctx.lineTo(size/3, size/3);
                    ctx.lineTo(-size/3, size/3);
                    ctx.closePath();
                    ctx.fill();
                    
                    // Bottle neck
                    ctx.fillStyle = '#transparent';
                    ctx.fillRect(-size/8, -size/2, size/4, size/6);
                    ctx.strokeStyle = '#white';
                    ctx.strokeRect(-size/8, -size/2, size/4, size/6);
                    
                    ctx.restore();
                }
            }
        };
    }

    setupInventory() {
        const inventoryGrid = document.querySelector('.inventory-grid');
        // Clear existing slots
        inventoryGrid.innerHTML = '';
        
        // Create inventory slots
        for(let i = 0; i < 15; i++) {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot';
            
            const canvas = document.createElement('canvas');
            slot.appendChild(canvas);
            
            const nameLabel = document.createElement('div');
            nameLabel.className = 'item-name';
            slot.appendChild(nameLabel);
            
            inventoryGrid.appendChild(slot);
            
            // Set canvas size
            canvas.width = 100;
            canvas.height = 100;
            
            // Add example items
            if(i === 0) this.drawItemInSlot(canvas, this.items.sword);
            if(i === 1) this.drawItemInSlot(canvas, this.items.shield);
            if(i === 2) this.drawItemInSlot(canvas, this.items.armor);
            if(i === 3) this.drawItemInSlot(canvas, this.items.potion);
        }
    }

    drawItemInSlot(canvas, item) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        item.draw(ctx, 0, 0, canvas.width);
        
        // Update name label
        const slot = canvas.parentElement;
        const nameLabel = slot.querySelector('.item-name');
        nameLabel.textContent = item.name;
    }

    setupHPBar() {
        const hpContainer = document.createElement('div');
        hpContainer.className = 'hp-container';
        
        const hpBar = document.createElement('div');
        hpBar.className = 'hp-bar';
        
        const hpFill = document.createElement('div');
        hpFill.className = 'hp-fill';
        
        const hpText = document.createElement('div');
        hpText.className = 'hp-text';
        
        hpBar.appendChild(hpFill);
        hpContainer.appendChild(hpBar);
        hpContainer.appendChild(hpText);
        
        document.getElementById('game-ui').appendChild(hpContainer);
        
        this.updateHPBar(100, 100);
    }

    updateHPBar(currentHP, maxHP) {
        const hpFill = document.querySelector('.hp-fill');
        const hpText = document.querySelector('.hp-text');
        
        const percentage = (currentHP / maxHP) * 100;
        hpFill.style.width = `${percentage}%`;
        hpText.textContent = `${currentHP}/${maxHP} HP`;
    }
}

class DialogueManager {
    constructor() {
        this.dialogBox = document.getElementById('dialog-box');
        this.speakerName = document.getElementById('dialog-speaker');
        this.dialogText = document.getElementById('dialog-text');
        this.dialogChoices = document.getElementById('dialog-choices');
        this.portrait = document.getElementById('dialog-portrait');
        this.currentDialog = null;
        this.textSpeed = 50; // ms per karakter
        this.isTyping = false;
        this.typingInterval = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Klik dimana saja untuk melanjutkan text
        this.dialogBox.addEventListener('click', () => {
            if (this.isTyping) {
                // Skip typing animation
                this.completeTyping();
            }
        });
    }

    showDialog(npcId, dialogId) {
        console.log('Showing dialog:', npcId, dialogId);
        const npcDialogs = window.GameDialogs[npcId];
        if (!npcDialogs) {
            console.error('No dialogs found for NPC:', npcId);
            return;
        }

        const dialog = npcDialogs[dialogId];
        if (!dialog) {
            console.error('No dialog found with ID:', dialogId);
            return;
        }

        this.currentDialog = dialog;
        this.dialogBox.classList.remove('hidden');
        this.speakerName.textContent = dialog.speaker;
        
        // Set portrait
        if (dialog.portrait) {
            this.portrait.style.backgroundImage = `url(assets/images/portraits/${dialog.portrait}.png)`;
        } else {
            // Default portrait background
            this.portrait.style.backgroundImage = 'none';
        }

        // Reset and hide choices until typing is complete
        this.dialogChoices.style.display = 'none';
        this.dialogChoices.innerHTML = '';

        // Animate text
        this.typeText(dialog.text);
    }

    typeText(text) {
        this.isTyping = true;
        this.dialogText.textContent = '';
        let i = 0;
        
        if (this.typingInterval) {
            clearInterval(this.typingInterval);
        }
        
        this.typingInterval = setInterval(() => {
            if (i < text.length) {
                this.dialogText.textContent += text.charAt(i);
                i++;
            } else {
                this.completeTyping();
            }
        }, this.textSpeed);
    }

    completeTyping() {
        if (this.typingInterval) {
            clearInterval(this.typingInterval);
            this.typingInterval = null;
        }
        if (this.currentDialog) {
            this.dialogText.textContent = this.currentDialog.text;
            this.setupChoices(this.currentDialog.choices);
            this.dialogChoices.style.display = 'flex';
        }
        this.isTyping = false;
    }

    setupChoices(choices) {
        this.dialogChoices.innerHTML = '';
        if (!choices || choices.length === 0) {
            const closeButton = document.createElement('button');
            closeButton.className = 'dialog-choice';
            closeButton.textContent = 'Close';
            closeButton.addEventListener('click', () => this.closeDialog());
            this.dialogChoices.appendChild(closeButton);
            return;
        }

        choices.forEach(choice => {
            const button = document.createElement('button');
            button.className = 'dialog-choice';
            button.textContent = choice.text;
            
            button.addEventListener('click', () => {
                this.handleChoice(choice);
            });
            
            this.dialogChoices.appendChild(button);
        });
    }

    handleChoice(choice) {
        if (choice.action) {
            // Handle special actions
            switch(choice.action) {
                case 'accept_main_quest':
                    console.log('Main quest accepted!');
                    break;
                case 'open_shop':
                    console.log('Opening shop...');
                    break;
                case 'open_upgrade_menu':
                    console.log('Opening upgrade menu...');
                    break;
                // Add more actions as needed
            }
        }
        
        if (choice.next) {
            // Find the NPC that owns the next dialog
            const nextNpcId = Object.keys(window.GameDialogs).find(
                npcId => window.GameDialogs[npcId][choice.next]
            );
            if (nextNpcId) {
                this.showDialog(nextNpcId, choice.next);
            } else {
                console.error('Could not find next dialog:', choice.next);
                this.closeDialog();
            }
        } else {
            this.closeDialog();
        }
    }

    closeDialog() {
        this.dialogBox.classList.add('hidden');
        this.currentDialog = null;
    }
}

class InventoryUI {
    constructor() {
        this.canvas = document.getElementById('inventory-background');
        this.ctx = this.canvas.getContext('2d');
        this.items = this.initializeItems();
        this.setupInventory();
        this.setupMap();
    }

    initializeItems() {
        return {
            sword: {
                name: 'Iron Sword',
                type: 'weapon',
                draw: (ctx, x, y, size) => {
                    // Draw sword
                    ctx.save();
                    ctx.translate(x + size/2, y + size/2);
                    
                    // Blade
                    const gradient = ctx.createLinearGradient(-size/8, -size/2, size/8, size/4);
                    gradient.addColorStop(0, '#C0C0C0');
                    gradient.addColorStop(1, '#808080');
                    
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.moveTo(-size/8, -size/2);
                    ctx.lineTo(size/8, -size/2);
                    ctx.lineTo(size/4, size/4);
                    ctx.lineTo(-size/4, size/4);
                    ctx.closePath();
                    ctx.fill();
                    
                    // Handle
                    const handleGradient = ctx.createLinearGradient(-size/8, size/4, size/8, size/2);
                    handleGradient.addColorStop(0, '#8B4513');
                    handleGradient.addColorStop(1, '#654321');
                    
                    ctx.fillStyle = handleGradient;
                    ctx.fillRect(-size/8, size/4, size/4, size/4);
                    
                    // Guard
                    ctx.fillStyle = '#FFD700';
                    ctx.fillRect(-size/3, size/6, size*2/3, size/8);
                    
                    // Add shine
                    ctx.strokeStyle = '#FFFFFF';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(-size/16, -size/2);
                    ctx.lineTo(-size/16, size/4);
                    ctx.stroke();
                    
                    ctx.restore();
                }
            },
            shield: {
                name: 'Iron Shield',
                type: 'shield',
                draw: (ctx, x, y, size) => {
                    ctx.save();
                    ctx.translate(x + size/2, y + size/2);
                    
                    // Shield base gradient
                    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size/2);
                    gradient.addColorStop(0, '#C0C0C0');
                    gradient.addColorStop(1, '#808080');
                    
                    // Shield shape
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.moveTo(0, -size/2);
                    ctx.quadraticCurveTo(size/2, -size/3, size/2, 0);
                    ctx.quadraticCurveTo(size/2, size/2, 0, size/2);
                    ctx.quadraticCurveTo(-size/2, size/2, -size/2, 0);
                    ctx.quadraticCurveTo(-size/2, -size/3, 0, -size/2);
                    ctx.closePath();
                    ctx.fill();
                    
                    // Border
                    ctx.strokeStyle = '#FFD700';
                    ctx.lineWidth = 4;
                    ctx.stroke();
                    
                    // Shield emblem
                    ctx.fillStyle = '#FFD700';
                    ctx.beginPath();
                    ctx.moveTo(0, -size/4);
                    ctx.lineTo(size/4, 0);
                    ctx.lineTo(0, size/4);
                    ctx.lineTo(-size/4, 0);
                    ctx.closePath();
                    ctx.fill();
                    
                    ctx.restore();
                }
            },
            potion: {
                name: 'Health Potion',
                type: 'consumable',
                draw: (ctx, x, y, size) => {
                    ctx.save();
                    ctx.translate(x + size/2, y + size/2);
                    
                    // Bottle
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.beginPath();
                    ctx.moveTo(-size/4, -size/3);
                    ctx.quadraticCurveTo(-size/4, -size/2, 0, -size/2);
                    ctx.quadraticCurveTo(size/4, -size/2, size/4, -size/3);
                    ctx.lineTo(size/3, size/3);
                    ctx.quadraticCurveTo(size/3, size/2, 0, size/2);
                    ctx.quadraticCurveTo(-size/3, size/2, -size/3, size/3);
                    ctx.closePath();
                    ctx.fill();
                    
                    // Liquid
                    const gradient = ctx.createLinearGradient(0, -size/6, 0, size/2);
                    gradient.addColorStop(0, '#FF0000');
                    gradient.addColorStop(1, '#8B0000');
                    
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.moveTo(-size/4, 0);
                    ctx.lineTo(size/4, 0);
                    ctx.lineTo(size/3, size/3);
                    ctx.quadraticCurveTo(size/3, size/2, 0, size/2);
                    ctx.quadraticCurveTo(-size/3, size/2, -size/3, size/3);
                    ctx.closePath();
                    ctx.fill();
                    
                    // Shine
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(-size/8, -size/3);
                    ctx.lineTo(-size/8, size/3);
                    ctx.stroke();
                    
                    ctx.restore();
                }
            },
            armor: {
                name: 'Iron Armor',
                type: 'armor',
                draw: (ctx, x, y, size) => {
                    ctx.save();
                    ctx.translate(x + size/2, y + size/2);
                    
                    // Armor body gradient
                    const gradient = ctx.createLinearGradient(0, -size/2, 0, size/2);
                    gradient.addColorStop(0, '#C0C0C0');
                    gradient.addColorStop(1, '#808080');
                    
                    // Main armor piece
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.moveTo(-size/3, -size/2);
                    ctx.lineTo(size/3, -size/2);
                    ctx.lineTo(size/2, 0);
                    ctx.lineTo(size/3, size/2);
                    ctx.lineTo(-size/3, size/2);
                    ctx.lineTo(-size/2, 0);
                    ctx.closePath();
                    ctx.fill();
                    
                    // Armor details
                    ctx.strokeStyle = '#FFD700';
                    ctx.lineWidth = 2;
                    
                    // Horizontal lines
                    for(let i = -2; i <= 2; i++) {
                        ctx.beginPath();
                        ctx.moveTo(-size/3, i * size/8);
                        ctx.lineTo(size/3, i * size/8);
                        ctx.stroke();
                    }
                    
                    // Shoulder pads
                    ctx.beginPath();
                    ctx.arc(-size/3, -size/3, size/6, 0, Math.PI * 2);
                    ctx.arc(size/3, -size/3, size/6, 0, Math.PI * 2);
                    ctx.stroke();
                    
                    ctx.restore();
                }
            }
        };
    }

    setupInventory() {
        // Set canvas size
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        // Draw inventory background
        this.drawInventoryBackground();
        
        // Create item slots
        const slotsContainer = document.querySelector('.inventory-slots');
        slotsContainer.innerHTML = '';
        
        for(let i = 0; i < 15; i++) {
            const slot = document.createElement('div');
            slot.className = 'item-slot';
            
            const canvas = document.createElement('canvas');
            canvas.width = 80;
            canvas.height = 80;
            slot.appendChild(canvas);
            
            const nameLabel = document.createElement('div');
            nameLabel.className = 'item-name';
            slot.appendChild(nameLabel);
            
            slotsContainer.appendChild(slot);
            
            // Add example items
            if(i === 0) this.drawItemInSlot(canvas, this.items.sword);
            if(i === 1) this.drawItemInSlot(canvas, this.items.shield);
            if(i === 2) this.drawItemInSlot(canvas, this.items.armor);
            if(i === 3) this.drawItemInSlot(canvas, this.items.potion);
        }
    }

    drawInventoryBackground() {
        const ctx = this.ctx;
        
        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Border
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 4;
        ctx.strokeRect(2, 2, this.canvas.width-4, this.canvas.height-4);
        
        // Title
        ctx.fillStyle = '#FFD700';
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Inventory', this.canvas.width/2, 50);
        
        // Decorative lines
        ctx.beginPath();
        ctx.moveTo(50, 70);
        ctx.lineTo(this.canvas.width-50, 70);
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    drawItemInSlot(canvas, item) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw slot background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw border
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, canvas.width-2, canvas.height-2);
        
        // Draw item
        if(item) {
            item.draw(ctx, 0, 0, canvas.width);
            
            // Update name label
            const slot = canvas.parentElement;
            const nameLabel = slot.querySelector('.item-name');
            nameLabel.textContent = item.name;
        }
    }

    setupMap() {
        const mapCanvas = document.getElementById('map-canvas');
        const ctx = mapCanvas.getContext('2d');
        
        // Set canvas size
        mapCanvas.width = 200;
        mapCanvas.height = 200;
        
        // Draw map background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, mapCanvas.width, mapCanvas.height);
        
        // Draw border
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.strokeRect(2, 2, mapCanvas.width-4, mapCanvas.height-4);
        
        // Draw some example map features
        ctx.fillStyle = '#228B22'; // Forest green
        ctx.fillRect(20, 20, 50, 50);
        
        ctx.fillStyle = '#8B4513'; // Brown for mountains
        ctx.fillRect(100, 80, 60, 40);
        
        ctx.fillStyle = '#4169E1'; // Royal blue for water
        ctx.fillRect(40, 120, 80, 30);
        
        // Draw player position (example)
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(100, 100, 5, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialize inventory when page loads
window.addEventListener('load', () => {
    const inventory = new InventoryUI();
    
    // Add event listeners for inventory toggle
    const inventoryPanel = document.querySelector('.inventory-panel');
    const inventoryButton = document.getElementById('inventory-button');
    const closeButton = document.querySelector('.inventory-close');
    
    function toggleInventory() {
        inventoryPanel.classList.toggle('active');
    }
    
    inventoryButton.addEventListener('click', toggleInventory);
    closeButton.addEventListener('click', () => {
        inventoryPanel.classList.remove('active');
    });
    
    // Close inventory with Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            inventoryPanel.classList.remove('active');
        } else if (e.key.toLowerCase() === 'i') {
            toggleInventory();
        }
    });
});

class GameUI2 {
    constructor(game) {
        this.game = game;
        this.setupInventoryUI();
        this.setupCombatUI();
    }

    setupInventoryUI() {
        const inventoryGrid = document.querySelector('.inventory-grid');
        
        // Create inventory slots
        for (let i = 0; i < GameData.ui.inventory.slots; i++) {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot';
            slot.dataset.index = i;
            inventoryGrid.appendChild(slot);
        }

        // Setup equipment slots
        const equipmentSlots = document.querySelectorAll('.equipment-slot');
        equipmentSlots.forEach(slot => {
            slot.addEventListener('click', () => {
                // Handle equipment slot click
                const type = slot.dataset.type;
                // TODO: Implement equipment handling
            });
        });
    }

    setupCombatUI() {
        this.combatUI = document.getElementById('combat-ui');
        this.playerHealthBar = this.combatUI.querySelector('.health-bar .health-fill');
        this.playerHealthText = this.combatUI.querySelector('.health-bar .health-text');
        this.enemyHealthBar = this.combatUI.querySelector('.enemy-health-bar .enemy-health-fill');
        this.enemyName = this.combatUI.querySelector('.enemy-health-bar .enemy-name');

        // Show combat UI
        this.combatUI.style.display = 'block';
    }

    updatePlayerHealth(current, max) {
        const percentage = (current / max) * 100;
        this.playerHealthBar.style.width = `${percentage}%`;
        this.playerHealthText.textContent = `${current}/${max}`;
    }

    showEnemyHealth(enemy) {
        const enemyHealthContainer = this.combatUI.querySelector('.enemy-health-bar');
        enemyHealthContainer.style.display = 'block';
        this.enemyName.textContent = enemy.type.charAt(0).toUpperCase() + enemy.type.slice(1);
        this.updateEnemyHealth(enemy.health, enemy.maxHealth);
    }

    hideEnemyHealth() {
        const enemyHealthContainer = this.combatUI.querySelector('.enemy-health-bar');
        enemyHealthContainer.style.display = 'none';
    }

    updateEnemyHealth(current, max) {
        const percentage = (current / max) * 100;
        this.enemyHealthBar.style.width = `${percentage}%`;
    }

    showDialog(speaker, text, choices = []) {
        const dialogBox = document.getElementById('dialog-box');
        const speakerElement = dialogBox.querySelector('.dialog-speaker');
        const textElement = dialogBox.querySelector('.dialog-text');
        const choicesElement = dialogBox.querySelector('.dialog-choices');

        speakerElement.textContent = speaker;
        textElement.textContent = text;
        
        // Clear previous choices
        choicesElement.innerHTML = '';
        
        // Add new choices if any
        choices.forEach(choice => {
            const button = document.createElement('button');
            button.className = 'dialog-choice';
            button.textContent = choice.text;
            button.addEventListener('click', () => {
                if (choice.action) {
                    choice.action();
                }
                dialogBox.style.display = 'none';
            });
            choicesElement.appendChild(button);
        });

        dialogBox.style.display = 'block';
    }

    hideDialog() {
        const dialogBox = document.getElementById('dialog-box');
        dialogBox.style.display = 'none';
    }
}

// Simple InventoryUI class
class InventoryUI {
    initialize() {
        // Initialize empty inventory
    }
}

// Simple SkillsUI class
class SkillsUI {
    initialize() {
        // Initialize empty skills
    }
}

// Simple NotificationSystem class
class NotificationSystem {
    show(message, type = 'info') {
        console.log(`${type}: ${message}`);
    }
}

// Export the GameUI class
window.GameUI = GameUI;
window.GameUI2 = GameUI2;
