/**
 * DialogueBox Component for "Protocol: Reunion"
 * 
 * Displays dialogue text with speaker name, emotion indicator,
 * and a "Next" button to advance through dialogue sequences.
 * 
 * Reads from the Zustand store and auto-updates when dialogue changes.
 */

import React, { useEffect, useCallback } from 'react';
import useGameStore from '../../store/useGameStore';
import './DialogueBox.css';

// Speaker color mapping for visual distinction
const SPEAKER_COLORS = {
  Chichi: '#ff9ecd',    // Pink - Fall/Spooky vibes
  Nienie: '#98d4bb',    // Soft green - Spring vibes
  Delice: '#7fffd4',    // Aquamarine - Ghost cat spirit
  Bat: '#9370db',       // Purple - Spooky cute
  Narrator: '#c0c0c0',  // Silver - Neutral narration
  Both: '#ffb6c1',      // Light pink - Together
};

// Emotion emoji mapping
const EMOTION_EMOJIS = {
  sleepy: '😴',
  sad: '😢',
  longing: '💭',
  happy: '😊',
  concerned: '😟',
  worried: '😰',
  surprised: '😲',
  affectionate: '🥰',
  calm: '😌',
  wise: '✨',
  determined: '💪',
  mystical: '🔮',
  hopeful: '🌟',
  calling: '📢',
  frustrated: '😤',
  encouraging: '💕',
  joyful: '🎉',
  emotional: '🥹',
  amused: '😂',
  confused: '😕',
  overjoyed: '🥳',
  loving: '❤️',
};

const DialogueBox = ({ onDialogueEnd, onChoice }) => {
  // Get dialogue state from store
  const {
    isDialogueActive,
    dialogueQueue,
    currentDialogueIndex,
    nextDialogue,
  } = useGameStore();

  // Get current dialogue line
  const currentDialogue = dialogueQueue[currentDialogueIndex];

  /**
   * Handle advancing to next dialogue or ending sequence
   */
  const handleNext = useCallback(() => {
    const hasMoreDialogue = nextDialogue();
    
    // If dialogue ended, trigger callback
    if (!hasMoreDialogue && onDialogueEnd) {
      onDialogueEnd();
    }
  }, [nextDialogue, onDialogueEnd]);

  /**
   * Handle choice selection
   */
  const handleChoice = useCallback((choiceId) => {
    if (onChoice) {
      onChoice(choiceId);
    }
    // After choice is made, end dialogue to trigger next phase
    if (onDialogueEnd) {
      setTimeout(() => onDialogueEnd(), 100);
    }
  }, [onChoice, onDialogueEnd]);

  /**
   * Handle keyboard input (Space or Enter to advance)
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isDialogueActive) return;
      
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDialogueActive, handleNext]);

  // Don't render if no active dialogue
  if (!isDialogueActive || !currentDialogue) {
    return null;
  }

  // Extract dialogue properties
  const {
    speaker,
    text,
    emotion,
    isAction,
    isNarration,
  } = currentDialogue;

  // Get speaker color
  const speakerColor = SPEAKER_COLORS[speaker] || '#ffffff';
  
  // Get emotion emoji
  const emotionEmoji = emotion ? EMOTION_EMOJIS[emotion] || '' : '';

  // Calculate progress
  const progress = `${currentDialogueIndex + 1}/${dialogueQueue.length}`;

  return (
    <div className="dialogue-overlay">
      <div 
        className={`dialogue-box ${isNarration ? 'narration' : ''} ${isAction ? 'action' : ''}`}
      >
        {/* Speaker name (not shown for narration) */}
        {!isNarration && (
          <div className="dialogue-speaker" style={{ color: speakerColor }}>
            {speaker} {emotionEmoji}
          </div>
        )}

        {/* Dialogue text */}
        <div className={`dialogue-text ${isAction ? 'action-text' : ''} ${isNarration ? 'narration-text' : ''}`}>
          {text}
        </div>

        {/* Bottom bar with progress and next button */}
        <div className="dialogue-footer">
          <span className="dialogue-progress">{progress}</span>
          {!currentDialogue.choices ? (
            <button 
              className="dialogue-next-btn"
              onClick={handleNext}
            >
              {currentDialogueIndex < dialogueQueue.length - 1 ? 'Next ▶' : 'Close ✓'}
            </button>
          ) : (
            <div className="dialogue-choices">
              {currentDialogue.choices.map((choice) => (
                <button
                  key={choice.id}
                  className="choice-btn"
                  onClick={() => handleChoice(choice.id)}
                >
                  {choice.text}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Hint for keyboard users */}
        <div className="dialogue-hint">
          Press <kbd>Space</kbd> or <kbd>Enter</kbd> to continue
        </div>
      </div>
    </div>
  );
};

export default DialogueBox;
