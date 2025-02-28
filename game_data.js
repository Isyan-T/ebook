// Game data and configurations
window.GameData = {
    // Map configuration
    map: {
        width: 2000,
        height: 2000,
        tileSize: 32,
        houses: [
            { x: 200, y: 150, type: 'merchant', owner: 'Village Merchant' },
            { x: 600, y: 250, type: 'blacksmith', owner: 'Master Smith' },
            { x: 400, y: 350, type: 'elder', owner: 'Elder Sage' }
        ],
        enemies: [
            { x: 800, y: 300, type: 'skeleton', health: 50, damage: 10, level: 1 },
            { x: 900, y: 400, type: 'skeleton', health: 50, damage: 10, level: 1 },
            { x: 1000, y: 500, type: 'skeleton', health: 75, damage: 15, level: 2 }
        ]
    },

    // Items configuration
    items: {
        weapons: {
            woodenSword: { damage: 5, durability: 100, type: 'sword', rarity: 'common', name: 'Wooden Sword' },
            ironSword: { damage: 10, durability: 200, type: 'sword', rarity: 'uncommon', name: 'Iron Sword' },
            steelSword: { damage: 15, durability: 300, type: 'sword', rarity: 'rare', name: 'Steel Sword' }
        },
        armor: {
            leatherArmor: { defense: 5, durability: 100, type: 'light', rarity: 'common', name: 'Leather Armor' },
            chainArmor: { defense: 10, durability: 200, type: 'medium', rarity: 'uncommon', name: 'Chain Mail' },
            plateArmor: { defense: 15, durability: 300, type: 'heavy', rarity: 'rare', name: 'Plate Armor' }
        },
        potions: {
            healthPotion: { restore: 30, type: 'health', name: 'Health Potion' },
            manaPotion: { restore: 30, type: 'mana', name: 'Mana Potion' }
        }
    },

    // Combat configuration
    combat: {
        attackSpeed: 500, // ms between attacks
        attackRange: 50, // pixels
        experiencePoints: {
            skeleton: 10
        }
    },

    // UI configuration
    ui: {
        inventory: {
            slots: 20,
            rows: 4,
            columns: 5
        },
        minimap: {
            size: 150,
            scale: 0.1
        }
    },

    // Existing game data
    items: {
        weapons: {
            wooden_sword: {
                id: 'wooden_sword',
                name: 'Wooden Sword',
                type: 'weapon',
                damage: 5,
                durability: 100,
                rarity: 'common',
                description: 'A basic wooden sword. Not very durable but gets the job done.',
                sprite: 'wooden_sword.png',
                requirements: {
                    level: 1
                },
                effects: []
            },
            iron_sword: {
                id: 'iron_sword',
                name: 'Iron Sword',
                type: 'weapon',
                damage: 10,
                durability: 200,
                rarity: 'uncommon',
                description: 'A sturdy iron sword. Reliable and effective.',
                sprite: 'iron_sword.png',
                requirements: {
                    level: 5
                },
                effects: [
                    {
                        type: 'bleed',
                        chance: 0.1,
                        damage: 2,
                        duration: 3000
                    }
                ]
            }
        },
        armor: {
            leather_armor: {
                id: 'leather_armor',
                name: 'Leather Armor',
                type: 'armor',
                defense: 5,
                durability: 100,
                rarity: 'common',
                description: 'Basic leather armor. Provides minimal protection.',
                sprite: 'leather_armor.png',
                requirements: {
                    level: 1
                },
                effects: []
            }
        },
        potions: {
            health_potion: {
                id: 'health_potion',
                name: 'Health Potion',
                type: 'consumable',
                rarity: 'common',
                description: 'Restores 50 health points.',
                sprite: 'health_potion.png',
                effects: [
                    {
                        type: 'heal',
                        value: 50,
                        duration: 0
                    }
                ]
            }
        }
    },

    skills: {
        combat: {
            slash: {
                id: 'slash',
                name: 'Slash',
                type: 'active',
                damage: 15,
                manaCost: 10,
                cooldown: 1000,
                description: 'A basic sword slash attack.',
                icon: 'slash_icon.png',
                animation: 'slash_animation',
                requirements: {
                    level: 1,
                    weapon_type: ['sword']
                }
            },
            whirlwind: {
                id: 'whirlwind',
                name: 'Whirlwind',
                type: 'active',
                damage: 25,
                manaCost: 30,
                cooldown: 5000,
                description: 'Spin around, damaging all nearby enemies.',
                icon: 'whirlwind_icon.png',
                animation: 'whirlwind_animation',
                requirements: {
                    level: 5,
                    weapon_type: ['sword', 'axe']
                }
            }
        },
        magic: {
            fireball: {
                id: 'fireball',
                name: 'Fireball',
                type: 'active',
                damage: 30,
                manaCost: 25,
                cooldown: 3000,
                description: 'Launch a ball of fire at your enemies.',
                icon: 'fireball_icon.png',
                animation: 'fireball_animation',
                requirements: {
                    level: 3,
                    magic_level: 2
                },
                effects: [
                    {
                        type: 'burn',
                        damage: 5,
                        duration: 3000
                    }
                ]
            }
        }
    },

    enemies: {
        slime: {
            id: 'slime',
            name: 'Slime',
            health: 30,
            damage: 5,
            defense: 2,
            experience: 10,
            sprite: 'slime.png',
            animations: {
                idle: 'slime_idle',
                move: 'slime_move',
                attack: 'slime_attack'
            },
            drops: [
                {
                    item: 'slime_gel',
                    chance: 0.7,
                    quantity: { min: 1, max: 3 }
                }
            ]
        },
        skeleton: {
            id: 'skeleton',
            name: 'Skeleton',
            health: 50,
            damage: 8,
            defense: 3,
            experience: 20,
            sprite: 'skeleton.png',
            animations: {
                idle: 'skeleton_idle',
                move: 'skeleton_move',
                attack: 'skeleton_attack'
            },
            drops: [
                {
                    item: 'bone',
                    chance: 0.5,
                    quantity: { min: 1, max: 2 }
                },
                {
                    item: 'rusty_sword',
                    chance: 0.1,
                    quantity: { min: 1, max: 1 }
                }
            ]
        }
    },

    quests: {
        slime_hunt: {
            id: 'slime_hunt',
            name: 'Slime Hunter',
            description: 'Clear the forest of slimes that have been troubling the villagers.',
            type: 'hunt',
            level: 1,
            objectives: [
                {
                    type: 'kill',
                    target: 'slime',
                    quantity: 5,
                    current: 0
                }
            ],
            rewards: {
                experience: 100,
                gold: 50,
                items: [
                    {
                        id: 'health_potion',
                        quantity: 2
                    }
                ]
            }
        }
    },

    crafting: {
        recipes: {
            health_potion: {
                id: 'health_potion',
                name: 'Health Potion',
                materials: [
                    {
                        item: 'red_herb',
                        quantity: 2
                    },
                    {
                        item: 'water_flask',
                        quantity: 1
                    }
                ],
                result: {
                    item: 'health_potion',
                    quantity: 1
                },
                requirements: {
                    crafting_level: 1
                }
            }
        }
    },

    dialogue: {
        villager_1: {
            id: 'villager_1',
            name: 'Village Elder',
            portrait: 'elder_portrait.png',
            conversations: {
                greeting: {
                    text: "Welcome, traveler. Our village has been troubled by monsters lately.",
                    choices: [
                        {
                            text: "I can help with that.",
                            next: 'quest_offer'
                        },
                        {
                            text: "Sorry to hear that.",
                            next: 'farewell'
                        }
                    ]
                },
                quest_offer: {
                    text: "Would you help us clear the nearby forest of slimes?",
                    choices: [
                        {
                            text: "I'll do it.",
                            action: 'accept_quest',
                            quest: 'slime_hunt',
                            next: 'quest_accepted'
                        },
                        {
                            text: "Not right now.",
                            next: 'farewell'
                        }
                    ]
                }
            }
        }
    }
};

const GameDialogs = {
    'elder_sage': {
        'welcome': {
            speaker: 'Elder Sage',
            portrait: 'elder_sage_portrait',
            text: 'Selamat datang di Mystic Realms, Petualang Muda. Dunia ini sedang dalam bahaya...',
            choices: [
                { text: 'Apa yang terjadi?', next: 'explain_threat' },
                { text: 'Bagaimana aku bisa membantu?', next: 'explain_mission' },
                { text: 'Siapa kau?', next: 'explain_self' }
            ]
        },
        'explain_threat': {
            speaker: 'Elder Sage',
            portrait: 'elder_sage_portrait',
            text: 'Artifact kuno yang menjaga keseimbangan dunia telah dicuri. Kegelapan mulai menyebar...',
            choices: [
                { text: 'Di mana artifact itu sekarang?', next: 'explain_location' },
                { text: 'Siapa yang mencurinya?', next: 'explain_villain' }
            ]
        },
        'explain_mission': {
            speaker: 'Elder Sage',
            portrait: 'elder_sage_portrait',
            text: 'Kau harus menemukan 4 artifact suci dan mengembalikannya ke kuil. Tapi berhati-hatilah, banyak bahaya menghadang.',
            choices: [
                { text: 'Aku siap untuk misi ini', next: 'start_quest', action: 'accept_main_quest' },
                { text: 'Aku perlu persiapan lebih', next: 'preparation_advice' }
            ]
        },
        'explain_self': {
            speaker: 'Elder Sage',
            portrait: 'elder_sage_portrait',
            text: 'Aku adalah penjaga terakhir dari Kuil Cahaya Suci. Sudah ribuan tahun kami melindungi artifact...',
            choices: [
                { text: 'Ceritakan lebih banyak tentang kuil', next: 'temple_story' },
                { text: 'Kembali ke masalah utama', next: 'welcome' }
            ]
        }
    },

    'merchant': {
        'greeting': {
            speaker: 'Pedagang Marcus',
            portrait: 'merchant_portrait',
            text: 'Ah! Pelanggan baru! Aku punya banyak barang bagus untuk petualanganmu.',
            choices: [
                { text: 'Tunjukkan barang daganganmu', action: 'open_shop' },
                { text: 'Aku ingin menjual sesuatu', action: 'open_sell_menu' },
                { text: 'Tidak sekarang, terima kasih', next: null }
            ]
        }
    },

    'blacksmith': {
        'greeting': {
            speaker: 'Pandai Besi Thor',
            portrait: 'blacksmith_portrait',
            text: 'Selamat datang di pandai besiku! Perlu memperkuat senjatamu?',
            choices: [
                { text: 'Upgrade senjata', action: 'open_upgrade_menu' },
                { text: 'Perbaiki equipment', action: 'open_repair_menu' },
                { text: 'Tidak sekarang', next: null }
            ]
        }
    },

    'village_chief': {
        'quest_start': {
            speaker: 'Kepala Desa',
            portrait: 'chief_portrait',
            text: 'Desa kami diserang monster belakangan ini. Bisakah kau membantu?',
            choices: [
                { text: 'Tentu, aku akan membantu', next: 'quest_details', action: 'accept_village_quest' },
                { text: 'Maaf, aku sedang sibuk', next: null }
            ]
        },
        'quest_details': {
            speaker: 'Kepala Desa',
            portrait: 'chief_portrait',
            text: 'Kalahkan 5 monster di sekitar desa. Aku akan memberimu hadiah yang bagus.',
            choices: [
                { text: 'Baik, aku mengerti', next: null, action: 'start_village_quest' },
                { text: 'Apa hadiahnya?', next: 'quest_reward' }
            ]
        },
        'quest_reward': {
            speaker: 'Kepala Desa',
            portrait: 'chief_portrait',
            text: 'Kau akan mendapatkan 500 gold dan sebuah senjata langka.',
            choices: [
                { text: 'Baik, aku akan mulai sekarang', next: null, action: 'start_village_quest' },
                { text: 'Akan kupikirkan dulu', next: null }
            ]
        }
    }
};

// Export untuk digunakan di file lain
window.GameData = GameData;
window.GameDialogs = GameDialogs;
