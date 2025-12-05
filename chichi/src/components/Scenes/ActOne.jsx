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

import React, { useEffect, useCallback, useState } from 'react';
import useGameStore from '../../store/useGameStore';
import Player from '../Game/Player';
import NPC from '../Game/NPC';
import DialogueBox from '../Game/DialogueBox';
import { ACT1_DIALOGUES } from '../../data/dialogues';
import './ActOne.css';

// Movement speed (pixels per tick)
const MOVE_SPEED = 5;

// Collision detection helper
const checkCollision = (rect1, rect2, threshold = 30) => {
  return Math.abs(rect1.x - rect2.x) < threshold && 
         Math.abs(rect1.y - rect2.y) < threshold;
};

const ActOne = () => {
  // Get state and actions from store
  const {
    playerPosition,
    setPlayerPosition,
    movePlayer,
    stopPlayer,
    flags,
    setFlag,
    npcStates,
    setNPCVisible,
    startDialogue,
    isDialogueActive,
    nextAct,
  } = useGameStore();

  // Local state for tracking current story phase
  const [storyPhase, setStoryPhase] = useState('opening');
  const [batFadingOut, setBatFadingOut] = useState(false);
  const [pressedKeys, setPressedKeys] = useState(new Set());

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
   * Handle bat interaction
   */
  const handleBatClick = useCallback(() => {
    if (flags.hasTalkedToBat || isDialogueActive) return;
    
    startDialogue(ACT1_DIALOGUES.batEncounter.bat.blockDoor);
    setStoryPhase('batTalking');
  }, [flags.hasTalkedToBat, isDialogueActive, startDialogue]);

  /**
   * Handle bat dialogue completion - Reveal Delice
   */
  const handleBatDialogueComplete = useCallback(() => {
    setFlag('hasTalkedToBat', true);
    
    // Reveal Delice the Cat after a moment
    setTimeout(() => {
      setNPCVisible('delice', true);
      setFlag('hasMetDelice', true);
      setStoryPhase('deliceAppeared');
      
      // Auto-start Chichi's reaction to seeing Delice
      setTimeout(() => {
        startDialogue(ACT1_DIALOGUES.catEncounter.chichi.noticeCat);
        setStoryPhase('chichiNoticingCat');
      }, 1500);
    }, 500);
  }, [setFlag, setNPCVisible, startDialogue]);

  /**
   * Handle Chichi noticing cat dialogue complete
   */
  const handleChichiNoticeComplete = useCallback(() => {
    // Now start Delice's dialogue
    startDialogue(ACT1_DIALOGUES.catEncounter.delice.introduction);
    setStoryPhase('deliceTalking');
  }, [startDialogue]);

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
    handleDeliceDialogueComplete,
    handleBatLeavingComplete,
    handleDoorUnlockComplete,
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
        // Calculate new position
        const newX = Math.max(50, Math.min(playerPosition.x + deltaX, 750));
        const newY = Math.max(200, Math.min(playerPosition.y + deltaY, 450));
        
        // Check for door collision (right side) - only allow if door is unlocked
        if (newX > 700 && !flags.isDoorUnlocked) {
          // Blocked by door
          return;
        }
        
        // Check for exiting through door
        if (newX > 750 && flags.isDoorUnlocked) {
          // Proceed to Act 2
          nextAct();
          return;
        }

        setPlayerPosition(newX, newY);
      }
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(moveLoop);
  }, [pressedKeys, isDialogueActive, playerPosition, flags.isDoorUnlocked, setPlayerPosition, stopPlayer, nextAct]);

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
      {/* Background - Chichi's Bedroom */}
      <div className="bedroom-bg">
        {/* Room elements */}
        <div className="room-wall" />
        <div className="room-floor" />
        
        {/* Bed */}
        <div className="bed">
          <div className="bed-frame" />
          <div className="bed-blanket" />
          <div className="bed-pillow" />
        </div>

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

        {/* Decorative elements */}
        <div className="decoration pumpkin">🎃</div>
        <div className="decoration ghost-plush">👻</div>
        <div className="decoration fairy-lights">✨</div>
      </div>

      {/* Player (Chichi) */}
      <Player />

      {/* NPCs */}
      <NPC
        type="bat"
        position={npcStates.bat.position}
        visible={npcStates.bat.visible && !batFadingOut}
        onClick={handleBatClick}
      />

      <NPC
        type="delice"
        position={npcStates.delice.position}
        visible={npcStates.delice.visible}
        glowing={storyPhase === 'deliceAppeared'}
      />

      {/* Dialogue Box */}
      <DialogueBox onDialogueEnd={handleDialogueEnd} />

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
  );
};

export default ActOne;
