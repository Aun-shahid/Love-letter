/**
 * ActOne Scene - "The Land of Love" (Chichi's World)
 * 
 * Setting: Chichi's Bedroom in Strasbourg. Cozy, Fall vibes, Spooky-Cute.
 * 
 * Flow:
 * 1. Chichi wakes up, shows opening dialogue
 * 2. Player can move around
 * 3. Player touches Bat -> Bat blocks door dialogue
 * 4. After Bat dialogue -> Delice appears (glowing)
 * 5. Player talks to Delice -> Cat dialogue
 * 6. After Delice dialogue -> Bat smiles and flies away
 * 7. Door unlocks -> Player can proceed to Act 2
 */

import React, { useEffect, useCallback, useState, useRef } from 'react';
import useGameStore from '../../store/useGameStore';
import Player from '../Game/Player';
import Cat from '../Game/cat';
import NPC from '../Game/NPC';
import Furniture from '../Game/Furniture';
import UIButton from '../Game/UIButton';
import DialogueBox from '../Game/DialogueBox';
import { ACT1_DIALOGUES } from '../../data/dialogues';
import bedroomMusic from '../../assets/music/bedroom.mp3';
import './ActOne.css';

// Movement speed (pixels per tick)
const MOVE_SPEED = 5;

// Collision detection helper
const checkCollision = (rect1, rect2, threshold = 30) => {
  return Math.abs(rect1.x - rect2.x) < threshold && 
         Math.abs(rect1.y - rect2.y) < threshold;
};

const ActOne = () => {
  // Create audio reference for background music
  const audioRef = useRef(null);

  // Get state and actions from store
  const {
    playerPosition,
    movePlayer,
    stopPlayer,
    flags,
    setFlag,
    npcStates,
    setNPCVisible,
    furnitureStates,
    toggleFurniture,
    collectibles,
    collectItem,
    hasAllCollectibles,
    startDialogue,
    isDialogueActive,
    nextAct,
  } = useGameStore();

  // Local state for tracking current story phase
  const [storyPhase, setStoryPhase] = useState('opening');
  const [batFadingOut, setBatFadingOut] = useState(false);
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);

  /**
   * Initialize background music on mount
   */
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(bedroomMusic);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3; // Set volume to 30%
      
      // Try to play immediately
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Music playing');
          })
          .catch(err => {
            console.log('Autoplay blocked, waiting for user interaction:', err);
            // Add click listener to enable audio on user interaction
            const enableAudio = () => {
              if (audioRef.current) {
                audioRef.current.play().catch(e => console.log('Play failed:', e));
              }
              document.removeEventListener('click', enableAudio);
            };
            document.addEventListener('click', enableAudio);
          });
      }
    }

    // Cleanup: stop music when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  /**
   * Toggle music on/off
   */
  const toggleMusic = useCallback(() => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.log('Audio play failed:', err));
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  }, [isMusicPlaying]);

  /**
   * Initialize Act 1 - Show opening dialogue
   */
  useEffect(() => {
    if (!flags.hasWokenUp && storyPhase === 'opening') {
      // Small delay before showing opening dialogue
      const timer = setTimeout(() => {
        startDialogue(ACT1_DIALOGUES.opening.chichi.wakeUp);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [flags.hasWokenUp, storyPhase, startDialogue]);

  /**
   * Handle opening dialogue completion
   */
  const handleOpeningComplete = useCallback(() => {
    setFlag('hasWokenUp', true);
    setStoryPhase('exploration');
  }, [setFlag]);

  /**
   * Handle bat interaction - Check if all collectibles are collected
   */
  const handleBatClick = useCallback(() => {
    if (flags.hasTalkedToBat || isDialogueActive) return;
    
    // Check if player has all collectibles
    if (hasAllCollectibles()) {
      // Player has everything, let them through
      startDialogue(ACT1_DIALOGUES.batEncounter.bat.allowExit);
      setStoryPhase('batAllowingExit');
    } else {
      // Player is missing items, bat blocks them
      startDialogue(ACT1_DIALOGUES.batEncounter.bat.blockDoor);
      setStoryPhase('batTalking');
    }
  }, [flags.hasTalkedToBat, isDialogueActive, startDialogue, hasAllCollectibles]);

  /**
   * Handle bat dialogue completion
   */
  const handleBatDialogueComplete = useCallback(() => {
    setFlag('hasTalkedToBat', true);
    
    if (hasAllCollectibles()) {
      // All items collected, door unlocks
      startDialogue(ACT1_DIALOGUES.doorUnlocked.narrator.description);
      setStoryPhase('doorUnlocking');
    }
    // If still missing items, just end dialogue and stay in exploration
    setStoryPhase('exploration');
  }, [setFlag, hasAllCollectibles, startDialogue]);

  /**
   * Handle Chichi noticing cat dialogue complete
   */
  const handleChichiNoticeComplete = useCallback(() => {
    // Now start Delice's dialogue
    startDialogue(ACT1_DIALOGUES.catEncounter.delice.introduction);
    setStoryPhase('deliceTalking');
  }, [startDialogue]);

  /**
   * Handle wardrobe click - offers to take tooth earrings
   */
  const handleWardrobeClick = useCallback(() => {
    toggleFurniture('wardrobe1');
    
    if (!furnitureStates.wardrobe1.isOpen && !collectibles.toothEarrings) {
      // Just opened, offer to take earrings
      startDialogue(ACT1_DIALOGUES.furnitureInteraction.wardrobe.takeEarrings);
      setStoryPhase('takingEarrings');
    }
  }, [toggleFurniture, furnitureStates.wardrobe1.isOpen, collectibles.toothEarrings, startDialogue]);

  /**
   * Handle bedside table click - offers to take Jonas spider
   */
  const handleBedsideTableClick = useCallback(() => {
    toggleFurniture('bedsideTable');
    
    if (!furnitureStates.bedsideTable.isOpen && !collectibles.jonaSpider) {
      // Just opened, offer to take spider
      startDialogue(ACT1_DIALOGUES.furnitureInteraction.table.takeSpider);
      setStoryPhase('takingSpider');
    }
  }, [toggleFurniture, furnitureStates.bedsideTable.isOpen, collectibles.jonaSpider, startDialogue]);

  /**
   * Handle bed click - check under bed for macaron
   */
  const handleBedClick = useCallback(() => {
    if (!collectibles.macaron) {
      // Show macaron collection dialogue
      startDialogue(ACT1_DIALOGUES.furnitureInteraction.bed.takeMacaron);
      setStoryPhase('takingMacaron');
    }
  }, [collectibles.macaron, startDialogue]);

  /**
   * Handle choice to take item or not
   */
  const handleItemChoice = useCallback((choiceId) => {
    if (choiceId === 'takeYes') {
      // Actually collect the item based on current phase
      if (storyPhase === 'takingEarrings') {
        collectItem('toothEarrings');
      } else if (storyPhase === 'takingSpider') {
        collectItem('jonaSpider');
      } else if (storyPhase === 'takingMacaron') {
        collectItem('macaron');
      }
      setStoryPhase('exploration');
    } else if (choiceId === 'takeNo') {
      setStoryPhase('exploration');
    }
  }, [storyPhase, collectItem]);

  /**
   * Handle Delice dialogue completion
   */
  const handleDeliceDialogueComplete = useCallback(() => {
    setFlag('hasTalkedToDelice', true);
    
    // Bat sees the cat and leaves
    startDialogue(ACT1_DIALOGUES.batEncounter.bat.afterCatAppears);
    setStoryPhase('batLeaving');
  }, [setFlag, startDialogue]);

  /**
   * Handle collision with Delice - Initiate conversation
   */
  const handleDeliceCollision = useCallback(() => {
    startDialogue(ACT1_DIALOGUES.catEncounter.chichi.meetDelice);
    setStoryPhase('meetsDelice');
  }, [startDialogue]);

  /**
   * Handle choice selection from dialogue
   */
  const handleChoice = useCallback((choiceId) => {
    // Store the choice and end dialogue
    if (choiceId === 'petYes') {
      setStoryPhase('petYes');
    } else if (choiceId === 'petNo') {
      setStoryPhase('petNo');
    }
  }, []);

  /**
   * Handle bat leaving dialogue complete
   */
  const handleBatLeavingComplete = useCallback(() => {
    // Start bat fade out animation
    setBatFadingOut(true);
    
    setTimeout(() => {
      setNPCVisible('bat', false);
      
      // Show door unlocking narration
      startDialogue(ACT1_DIALOGUES.doorUnlocked.narrator.description);
      setStoryPhase('doorUnlocking');
    }, 1000);
  }, [setNPCVisible, startDialogue]);

  /**
   * Handle door unlock narration complete
   */
  const handleDoorUnlockComplete = useCallback(() => {
    setFlag('isDoorUnlocked', true);
    setStoryPhase('canProceed');
  }, [setFlag]);

  /**
   * Master dialogue end handler - Routes to appropriate handler based on story phase
   */
  const handleDialogueEnd = useCallback(() => {
    switch (storyPhase) {
      case 'opening':
        handleOpeningComplete();
        break;
      case 'batTalking':
        handleBatDialogueComplete();
        break;
      case 'chichiNoticingCat':
        handleChichiNoticeComplete();
        break;
      case 'meetsDelice':
        // Show delice's meow, then show pet choice
        startDialogue(ACT1_DIALOGUES.catEncounter.delice.introduction);
        setStoryPhase('deliceIntroduction');
        break;
      case 'deliceIntroduction':
        // After meow, show pet choice
        setStoryPhase('showPetChoice');
        break;
      case 'petYes':
        // Show purr dialogue
        startDialogue(ACT1_DIALOGUES.catEncounter.delice.interaction.pet);
        setStoryPhase('delicePurring');
        break;
      case 'delicePurring':
        setFlag('hasTalkedToDelice', true);
        // Just end, don't auto-trigger bat dialogue
        setStoryPhase('exploration');
        break;
      case 'petNo':
        setFlag('hasTalkedToDelice', true);
        // Just end, don't auto-trigger bat dialogue
        setStoryPhase('exploration');
        break;
      case 'batTalking':
        handleBatDialogueComplete();
        break;
      case 'batAllowingExit':
        // Bat allows exit, set door as unlocked
        setFlag('isDoorUnlocked', true);
        setStoryPhase('canProceed');
        break;
      case 'takingEarrings':
        // Show choice buttons for taking earrings
        setStoryPhase('earringChoice');
        break;
      case 'takingSpider':
        // Show choice buttons for taking spider
        setStoryPhase('spiderChoice');
        break;
      case 'takingMacaron':
        // Show choice buttons for taking macaron
        setStoryPhase('macaronChoice');
        break;
      case 'deliceTalking':
        handleDeliceDialogueComplete();
        break;
      case 'batLeaving':
        handleBatLeavingComplete();
        break;
      case 'doorUnlocking':
        handleDoorUnlockComplete();
        break;
      default:
        break;
    }
  }, [
    storyPhase,
    handleOpeningComplete,
    handleBatDialogueComplete,
    handleChichiNoticeComplete,
    handleDeliceCollision,
    handleBatLeavingComplete,
    handleDoorUnlockComplete,
    startDialogue,
    setFlag,
  ]);

  /**
   * Handle keyboard movement
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isDialogueActive) return;
      
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        e.preventDefault();
        setPressedKeys(prev => new Set(prev).add(key));
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      setPressedKeys(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isDialogueActive]);

  /**
   * Movement loop
   */
  useEffect(() => {
    if (isDialogueActive || pressedKeys.size === 0) {
      stopPlayer();
      return;
    }

    const moveLoop = setInterval(() => {
      let deltaX = 0;
      let deltaY = 0;

      if (pressedKeys.has('w') || pressedKeys.has('arrowup')) deltaY -= MOVE_SPEED;
      if (pressedKeys.has('s') || pressedKeys.has('arrowdown')) deltaY += MOVE_SPEED;
      if (pressedKeys.has('a') || pressedKeys.has('arrowleft')) deltaX -= MOVE_SPEED;
      if (pressedKeys.has('d') || pressedKeys.has('arrowright')) deltaX += MOVE_SPEED;

      if (deltaX !== 0 || deltaY !== 0) {
        // Calculate new position - bounded within 600x500 room
        // Player area: X from 30 to 530, Y from 280 to 420 (floor area)
        const newX = Math.max(30, Math.min(playerPosition.x + deltaX, 530));
        const newY = Math.max(280, Math.min(playerPosition.y + deltaY, 420));
        
        // Calculate actual deltas after bounds checking
        const actualDeltaX = newX - playerPosition.x;
        const actualDeltaY = newY - playerPosition.y;
        
        // Check for door collision (right side) - only allow if door is unlocked
        if (newX > 480 && !flags.isDoorUnlocked) {
          // Blocked by door - still update facing direction
          movePlayer(0, actualDeltaY);
          return;
        }
        
        // Check for exiting through door
        if (newX > 520 && flags.isDoorUnlocked) {
          // Proceed to Act 2
          nextAct();
          return;
        }

        // Use movePlayer to update position AND facing direction
        movePlayer(actualDeltaX, actualDeltaY);
      }
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(moveLoop);
  }, [pressedKeys, isDialogueActive, playerPosition, flags.isDoorUnlocked, movePlayer, stopPlayer, nextAct]);

  /**
   * Check for collision with Delice NPC
   */
  useEffect(() => {
    if (!npcStates.delice.visible || flags.hasTalkedToDelice || isDialogueActive) return;

    if (checkCollision(playerPosition, npcStates.delice.position, 60)) {
      handleDeliceCollision();
    }
  }, [playerPosition, npcStates.delice, flags.hasTalkedToDelice, isDialogueActive, handleDeliceCollision]);

  /**
   * Check for collision with Bat NPC
   */
  useEffect(() => {
    if (!npcStates.bat.visible || flags.hasTalkedToBat || isDialogueActive) return;

    if (checkCollision(playerPosition, npcStates.bat.position, 60)) {
      handleBatClick();
    }
  }, [playerPosition, npcStates.bat, flags.hasTalkedToBat, isDialogueActive, handleBatClick]);

  return (
    <div className="act-one">
      {/* Music Toggle Button - Using FreeUi pixel art */}
      <UIButton 
        type="classical"
        icon={isMusicPlaying ? '🔊' : '🔇'}
        onClick={toggleMusic}
        className="music-toggle-btn"
        title={isMusicPlaying ? 'Mute music' : 'Unmute music'}
      />

      {/* Centered Room Container */}
      <div className="room-container">
        {/* Room elements */}
        <div className="room-wall" />
        <div className="room-floor" />
        
        {/* Interactive Furniture - Organized along back wall */}
        <Furniture 
          type="bed" 
          position={{ x: 50, y: 165 }} 
          scale={1.5}
          onClick={handleBedClick}
        />
        
        <Furniture 
          type="wardrobe" 
          position={{ x: 200, y: 165 }} 
          isOpen={furnitureStates.wardrobe1.isOpen}
          onClick={handleWardrobeClick}
          scale={1.5}
        />
        
        <Furniture 
          type="wardrobe" 
          position={{ x: 280, y: 165 }} 
          isOpen={furnitureStates.wardrobe2.isOpen}
          onClick={() => toggleFurniture('wardrobe2')}
          scale={1.5}
        />
        
        <Furniture 
          type="cupboard" 
          position={{ x: 360, y: 165 }} 
          isOpen={furnitureStates.cupboard.isOpen}
          onClick={() => toggleFurniture('cupboard')}
          scale={1.5}
        />
        
        <Furniture 
          type="bedside-table" 
          position={{ x: 450, y: 185 }} 
          isOpen={furnitureStates.bedsideTable.isOpen}
          onClick={handleBedsideTableClick}
          scale={1.5}
        />

        {/* Window with fall scenery */}
        <div className="window">
          <div className="window-frame" />
          <div className="window-view">
            <div className="fall-tree" />
            <div className="fall-leaves">🍂</div>
          </div>
        </div>

        {/* Door (right side) */}
        <div className={`door ${flags.isDoorUnlocked ? 'unlocked' : 'locked'}`}>
          <div className="door-frame" />
          <div className="door-knob" />
          {!flags.isDoorUnlocked && <div className="door-lock-indicator">🔒</div>}
          {flags.isDoorUnlocked && <div className="door-exit-hint">→ Exit</div>}
        </div>

        {/* Decorative elements - Fall/Spooky aesthetic */}
        <div className="decoration pumpkin">🎃</div>
        <div className="decoration ghost-plush">👻</div>
        <div className="decoration fairy-lights">✨</div>

        {/* Player (Chichi) - Now inside room container */}
        <Player />

        {/* NPCs - Now inside room container */}
        <NPC
          type="bat"
          position={npcStates.bat.position}
          visible={npcStates.bat.visible && !batFadingOut}
          onClick={handleBatClick}
        />

        {/* Delice the Cat */}
        <Cat
          position={npcStates.delice.position}
          visible={npcStates.delice.visible}
        />

        {/* UI Hints */}
        {!isDialogueActive && flags.hasWokenUp && !flags.isDoorUnlocked && (
          <div className="game-hint">
            Use <kbd>WASD</kbd> or <kbd>Arrow Keys</kbd> to move
          </div>
        )}

        {flags.isDoorUnlocked && (
          <div className="game-hint proceed-hint">
            The door is open! Walk through to continue →
          </div>
        )}
      </div>
      {/* Dialogue Box - Outside room for full screen overlay */}
      <DialogueBox 
        onDialogueEnd={handleDialogueEnd} 
        onChoice={(storyPhase === 'takingEarrings' || storyPhase === 'takingSpider' || storyPhase === 'takingMacaron' || storyPhase === 'earringChoice' || storyPhase === 'spiderChoice' || storyPhase === 'macaronChoice') ? handleItemChoice : handleChoice} 
      />
    </div>
  );
};

export default ActOne;
