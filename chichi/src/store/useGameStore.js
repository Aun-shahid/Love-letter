/**
 * Zustand Store for "Protocol: Reunion"
 * 
 * This store manages all game state including:
 * - Current act/scene progression
 * - Dialogue queue and display
 * - Game flags for story progression
 * - Player position and movement
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Initial state configuration
const initialState = {
  // Current act (1 = Land of Love, 2 = The Void, 3 = The Reunion)
  currentAct: 1,
  
  // Current scene within the act
  currentScene: 'opening',
  
  // Dialogue system
  dialogueQueue: [],           // Array of dialogue objects to display
  currentDialogueIndex: 0,     // Current position in the dialogue queue
  isDialogueActive: false,     // Whether dialogue box is showing
  
  // Story progression flags
  flags: {
    // Act 1 flags
    hasWokenUp: false,         // Chichi has completed opening dialogue
    hasTalkedToBat: false,     // Player has interacted with the Bat
    hasMetDelice: false,       // Delice the Cat has appeared
    hasTalkedToDelice: false,  // Completed dialogue with Delice
    isDoorUnlocked: false,     // Door is unlocked, can proceed to Act 2
    
    // Act 2 flags
    hasEnteredVoid: false,     // Player has entered the void
    hasHitDistance: false,     // Player has encountered "The Distance"
    puzzleStarted: false,      // Puzzle overlay is active
    puzzleSolved: false,       // Puzzle has been completed
    
    // Act 3 flags
    hasReachedBeach: false,    // Player has arrived at the beach
    hasApproachedNienie: false, // Player walked up to Nienie
    hasWokenNienie: false,     // Nienie is awake
    reunionComplete: false,    // Final reunion dialogue complete
    giftClaimed: false,        // Player clicked "Claim Gift"
  },
  
  // Player state - starting position in the 600x500 room
  playerPosition: { x: 280, y: 350 },
  playerFacing: 'down',        // 'up', 'down', 'left', or 'right' (for LPC sprites)
  isPlayerMoving: false,
  
  // NPC visibility states - positions relative to 600x500 room
  npcStates: {
    bat: { visible: true, position: { x: 500, y: 330 } },
    delice: { visible: true, position: { x: 80, y: 420 } },
    nienie: { visible: false, position: { x: 500, y: 350 } },
  },
  
  // Furniture states - track open/closed state
  furnitureStates: {
    wardrobe1: { isOpen: false },
    wardrobe2: { isOpen: false },
    cupboard: { isOpen: false },
    bedsideTable: { isOpen: false },
  },
  
  // Collectibles - items needed to unlock the door
  collectibles: {
    toothEarrings: false,      // From wardrobe
    jonaSpider: false,         // From bedside table
    macaron: false,            // From under bed
  },
  
  // Game UI state
  showPuzzle: false,
  showLetter: false,
  gameStarted: false,
};

// Create the Zustand store with devtools for debugging
const useGameStore = create(
  devtools(
    (set, get) => ({
      ...initialState,

      // ============================================
      // ACT & SCENE MANAGEMENT
      // ============================================
      
      /**
       * Progress to the next act
       */
      nextAct: () => set((state) => {
        const nextActNum = Math.min(state.currentAct + 1, 3);
        return {
          currentAct: nextActNum,
          currentScene: 'entering', // Reset to first scene of new act
        };
      }),
      
      /**
       * Set specific act (for debugging or scene jumping)
       */
      setAct: (actNumber) => set({ currentAct: actNumber }),
      
      /**
       * Set current scene within an act
       */
      setScene: (sceneName) => set({ currentScene: sceneName }),

      // ============================================
      // DIALOGUE SYSTEM
      // ============================================
      
      /**
       * Start a dialogue sequence
       * @param {Array} dialogueArray - Array of dialogue objects
       */
      startDialogue: (dialogueArray) => set({
        dialogueQueue: dialogueArray,
        currentDialogueIndex: 0,
        isDialogueActive: true,
      }),
      
      /**
       * Advance to the next line of dialogue
       * Returns true if there are more lines, false if dialogue ended
       */
      nextDialogue: () => {
        const state = get();
        const nextIndex = state.currentDialogueIndex + 1;
        
        if (nextIndex >= state.dialogueQueue.length) {
          // Dialogue sequence complete
          set({
            isDialogueActive: false,
            currentDialogueIndex: 0,
            dialogueQueue: [],
          });
          return false;
        }
        
        set({ currentDialogueIndex: nextIndex });
        return true;
      },
      
      /**
       * Get the current dialogue line
       */
      getCurrentDialogue: () => {
        const state = get();
        if (!state.isDialogueActive || state.dialogueQueue.length === 0) {
          return null;
        }
        return state.dialogueQueue[state.currentDialogueIndex];
      },
      
      /**
       * End dialogue immediately
       */
      endDialogue: () => set({
        isDialogueActive: false,
        currentDialogueIndex: 0,
        dialogueQueue: [],
      }),

      // ============================================
      // FLAG MANAGEMENT
      // ============================================
      
      /**
       * Set a specific flag
       * @param {string} flagName - Name of the flag to set
       * @param {boolean} value - Value to set (default: true)
       */
      setFlag: (flagName, value = true) => set((state) => ({
        flags: {
          ...state.flags,
          [flagName]: value,
        },
      })),
      
      /**
       * Get a flag value
       */
      getFlag: (flagName) => get().flags[flagName],
      
      /**
       * Set multiple flags at once
       */
      setFlags: (flagsObject) => set((state) => ({
        flags: {
          ...state.flags,
          ...flagsObject,
        },
      })),

      // ============================================
      // PLAYER MOVEMENT
      // ============================================
      
      /**
       * Update player position
       */
      setPlayerPosition: (x, y) => set({ playerPosition: { x, y } }),
      
      /**
       * Move player by delta amounts
       * Updates facing direction based on dominant movement direction
       */
      movePlayer: (deltaX, deltaY) => set((state) => {
        // Determine facing direction based on movement
        let newFacing = state.playerFacing;
        if (Math.abs(deltaX) >= Math.abs(deltaY)) {
          // Horizontal movement is dominant
          newFacing = deltaX > 0 ? 'right' : deltaX < 0 ? 'left' : newFacing;
        } else {
          // Vertical movement is dominant
          newFacing = deltaY > 0 ? 'down' : deltaY < 0 ? 'up' : newFacing;
        }
        
        return {
          playerPosition: {
            x: state.playerPosition.x + deltaX,
            y: state.playerPosition.y + deltaY,
          },
          playerFacing: newFacing,
          isPlayerMoving: true,
        };
      }),
      
      /**
       * Stop player movement
       */
      stopPlayer: () => set({ isPlayerMoving: false }),
      
      /**
       * Set player facing direction
       */
      setPlayerFacing: (direction) => set({ playerFacing: direction }),

      // ============================================
      // NPC MANAGEMENT
      // ============================================
      
      /**
       * Show/hide an NPC
       */
      setNPCVisible: (npcName, visible) => set((state) => ({
        npcStates: {
          ...state.npcStates,
          [npcName]: {
            ...state.npcStates[npcName],
            visible,
          },
        },
      })),
      
      /**
       * Update NPC position
       */
      setNPCPosition: (npcName, x, y) => set((state) => ({
        npcStates: {
          ...state.npcStates,
          [npcName]: {
            ...state.npcStates[npcName],
            position: { x, y },
          },
        },
      })),

      // ============================================
      // FURNITURE MANAGEMENT
      // ============================================
      
      /**
       * Toggle furniture open/closed state
       */
      toggleFurniture: (furnitureName) => set((state) => ({
        furnitureStates: {
          ...state.furnitureStates,
          [furnitureName]: {
            ...state.furnitureStates[furnitureName],
            isOpen: !state.furnitureStates[furnitureName].isOpen,
          },
        },
      })),
      
      /**
       * Set furniture state explicitly
       */
      setFurnitureState: (furnitureName, isOpen) => set((state) => ({
        furnitureStates: {
          ...state.furnitureStates,
          [furnitureName]: {
            ...state.furnitureStates[furnitureName],
            isOpen,
          },
        },
      })),

      // ============================================
      // COLLECTIBLES MANAGEMENT
      // ============================================
      
      /**
       * Collect an item
       */
      collectItem: (itemName) => set((state) => ({
        collectibles: {
          ...state.collectibles,
          [itemName]: true,
        },
      })),
      
      /**
       * Check if all collectibles are collected
       */
      hasAllCollectibles: () => {
        const state = get();
        return state.collectibles.toothEarrings && 
               state.collectibles.jonaSpider && 
               state.collectibles.macaron;
      },

      // ============================================
      // UI STATE
      // ============================================
      
      /**
       * Toggle puzzle overlay
       */
      setShowPuzzle: (show) => set({ showPuzzle: show }),
      
      /**
       * Toggle letter modal
       */
      setShowLetter: (show) => set({ showLetter: show }),
      
      /**
       * Start the game
       */
      startGame: () => set({ gameStarted: true }),

      // ============================================
      // GAME RESET & DEBUG
      // ============================================
      
      /**
       * Reset game to initial state
       */
      resetGame: () => set(initialState),
      
      /**
       * Debug: Skip to specific act with appropriate flags
       */
      debugSkipToAct: (actNumber) => {
        const flagsForAct = {
          1: {},
          2: {
            hasWokenUp: true,
            hasTalkedToBat: true,
            hasMetDelice: true,
            hasTalkedToDelice: true,
            isDoorUnlocked: true,
          },
          3: {
            hasWokenUp: true,
            hasTalkedToBat: true,
            hasMetDelice: true,
            hasTalkedToDelice: true,
            isDoorUnlocked: true,
            hasEnteredVoid: true,
            hasHitDistance: true,
            puzzleStarted: true,
            puzzleSolved: true,
          },
        };
        
        set({
          currentAct: actNumber,
          flags: { ...initialState.flags, ...flagsForAct[actNumber] },
        });
      },
    }),
    { name: 'protocol-reunion-store' }
  )
);

export default useGameStore;
