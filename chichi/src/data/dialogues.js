/**
 * Dialogue Data Structure for "Protocol: Reunion"
 * 
 * Structure: ACT -> SCENE -> CHARACTER -> INTERACTION_ID -> Lines[]
 * Each line can be a simple string or an object with metadata
 */

export const dialogues = {
  // ============================================
  // ACT 1: THE LAND OF LOVE (Chichi's World)
  // ============================================
  act1: {
    // Opening sequence - Chichi wakes up
    opening: {
      chichi: {
        wakeUp: [
          { speaker: "Chichi", text: "...", emotion: "sleepy" },
          { speaker: "Chichi", text: "I had that nightmare again...", emotion: "sad" },
          { speaker: "Chichi", text: "I miss him.", emotion: "longing" },
        ],
      },
    },

    // Interaction with the Bat NPC (blocking the door)
    batEncounter: {
      bat: {
        blockDoor: [
          { speaker: "Bat", text: "Hold on, Chichi! 🦇", emotion: "concerned" },
          { speaker: "Bat", text: "You can't leave alone...", emotion: "worried" },
          { speaker: "Bat", text: "Bring me three things first:", emotion: "determined" },
          { speaker: "Bat", text: "Your tooth earrings (in wardrobe)", emotion: "determined" },
          { speaker: "Bat", text: "Jonas the spider (on the table)", emotion: "determined" },
          { speaker: "Bat", text: "A macaron for food (under the bed)", emotion: "determined" },
        ],
        allowExit: [
          { speaker: "Bat", text: "Ah! You have everything! 🦇", emotion: "happy" },
          { speaker: "Bat", text: "You're ready for your journey. Go find him!", emotion: "happy" },
          { speaker: "Bat", text: "*flutters away*", emotion: "happy", isAction: true },
        ],
      },
    },

    // Delice the Cat appears
    catEncounter: {
      chichi: {
        noticeCat: [
          { speaker: "Chichi", text: "!", emotion: "surprised" },
          { speaker: "Chichi", text: "Oh you! I didn't notice you!", emotion: "surprised" },
          { speaker: "Chichi", text: "Bonjour monsieur pussycat.", emotion: "affectionate" },
        ],
        meetDelice: [
          { speaker: "Chichi", text: "Delice!", emotion: "surprised" },
          { speaker: "Chichi", text: "Bonjour Monsieur pussy cat!", emotion: "affectionate" },
        ],
      },
      delice: {
        introduction: [
          { speaker: "Delice", text: "Meow ✨", emotion: "calm", isAction: false },
          { 
            speaker: "Chichi", 
            text: "Pet Delice?", 
            emotion: "affectionate",
            choices: [
              { id: 'petYes', text: 'Yes 💕' },
              { id: 'petNo', text: 'No' },
            ]
          },
        ],
      },
      interaction: {
        pet: [
          { speaker: "Delice", text: "Purrr... 💕", emotion: "happy", isAction: false },
        ],
      },
    },

    // Furniture interactions for collectibles
    furnitureInteraction: {
      wardrobe: {
        takeEarrings: [
          { speaker: "Chichi", text: "My tooth earrings... I need these.", emotion: "nostalgic" },
          {
            speaker: "Chichi",
            text: "Take them with me?",
            emotion: "thoughtful",
            choices: [
              { id: 'takeYes', text: 'Take them 💍' },
              { id: 'takeNo', text: 'Leave them' },
            ]
          },
        ],
      },
      table: {
        takeSpider: [
          { speaker: "Chichi", text: "Jonas... my little friend.", emotion: "affectionate" },
          {
            speaker: "Chichi",
            text: "Should I bring him along?",
            emotion: "thoughtful",
            choices: [
              { id: 'takeYes', text: 'Take him 🕷️' },
              { id: 'takeNo', text: 'Leave him' },
            ]
          },
        ],
      },
      bed: {
        takeMacaron: [
          { speaker: "Chichi", text: "A macaron... under the bed?", emotion: "surprised" },
          {
            speaker: "Chichi",
            text: "This could be useful for the journey.",
            emotion: "thoughtful",
            choices: [
              { id: 'takeYes', text: 'Take it 🧁' },
              { id: 'takeNo', text: 'Leave it' },
            ]
          },
        ],
      },
    },

    // Door unlocks
    doorUnlocked: {
      narrator: {
        description: [
          { speaker: "Narrator", text: "The door glows softly and unlocks...", isNarration: true },
          { speaker: "Narrator", text: "The journey to find Nienie begins.", isNarration: true },
        ],
      },
    },
  },

  // ============================================
  // ACT 2: THE VOID (The Distance)
  // ============================================
  act2: {
    // Entering the void between worlds
    entering: {
      narrator: {
        description: [
          { speaker: "Narrator", text: "The world splits in two...", isNarration: true },
          { speaker: "Narrator", text: "Colors on one side, darkness on the other.", isNarration: true },
        ],
      },
      chichi: {
        reaction: [
          { speaker: "Chichi", text: "I can see him... he's right there!", emotion: "hopeful" },
          { speaker: "Chichi", text: "Nienie!", emotion: "calling" },
        ],
      },
    },

    // Hitting the invisible wall (The Distance)
    theDistance: {
      narrator: {
        description: [
          { speaker: "Narrator", text: "An invisible force blocks the way...", isNarration: true },
          { speaker: "Narrator", text: "THE DISTANCE stands between two hearts.", isNarration: true },
        ],
      },
      chichi: {
        reaction: [
          { speaker: "Chichi", text: "No... I can't get through!", emotion: "frustrated" },
          { speaker: "Chichi", text: "There has to be a way...", emotion: "determined" },
        ],
      },
      delice: {
        hint: [
          { speaker: "Delice", text: "*glows mysteriously*", emotion: "mystical", isAction: true },
          { speaker: "Delice", text: "Connect your hearts.", emotion: "wise" },
          { speaker: "Delice", text: "Love always finds a path.", emotion: "encouraging" },
        ],
      },
    },

    // Puzzle introduction
    puzzleStart: {
      narrator: {
        description: [
          { speaker: "Narrator", text: "A puzzle materializes before you...", isNarration: true },
          { speaker: "Narrator", text: "Connect the path from Chichi's heart to Nienie's.", isNarration: true },
        ],
      },
    },

    // Puzzle solved
    puzzleSolved: {
      narrator: {
        description: [
          { speaker: "Narrator", text: "The connection is made!", isNarration: true },
          { speaker: "Narrator", text: "Darkness fades... Sunrise breaks through.", isNarration: true },
        ],
      },
      chichi: {
        reaction: [
          { speaker: "Chichi", text: "The wall... it's gone!", emotion: "joyful" },
          { speaker: "Chichi", text: "I'm coming, Nienie!", emotion: "determined" },
        ],
      },
    },
  },

  // ============================================
  // ACT 3: THE REUNION (Our World)
  // ============================================
  act3: {
    // Arriving at the beach
    arrival: {
      narrator: {
        description: [
          { speaker: "Narrator", text: "The sound of waves fills the air...", isNarration: true },
          { speaker: "Narrator", text: "A peaceful beach stretches before you.", isNarration: true },
          { speaker: "Narrator", text: "Spring colors bloom everywhere.", isNarration: true },
        ],
      },
    },

    // Approaching Nienie
    approach: {
      chichi: {
        reaction: [
          { speaker: "Chichi", text: "There he is...", emotion: "emotional" },
          { speaker: "Chichi", text: "He's sleeping... in jeans again 😂", emotion: "amused" },
        ],
      },
    },

    // The reunion
    reunion: {
      nienie: {
        wakeUp: [
          { speaker: "Nienie", text: "...", emotion: "sleepy" },
          { speaker: "Nienie", text: "Chichi...? Is this a dream?", emotion: "confused" },
          { speaker: "Nienie", text: "You're really here!", emotion: "overjoyed" },
        ],
      },
      chichi: {
        response: [
          { speaker: "Chichi", text: "I traveled through worlds to find you.", emotion: "emotional" },
          { speaker: "Chichi", text: "No distance can keep us apart.", emotion: "loving" },
        ],
      },
      together: {
        ending: [
          { speaker: "Both", text: "Happy 2nd Anniversary! 💕", emotion: "joyful" },
        ],
      },
    },

    // Final letter (shown in modal)
    letter: {
      content: `My Dearest Chichi,

Two years ago, the universe decided to bring us together, and every day since has been a gift I never knew I needed.

You are my Fall in a world of endless summers – cozy, beautiful, and full of magic. Even though an ocean separates us, my heart has never felt closer to anyone.

This little game is my way of saying: no matter the distance, no matter how dark the void between us gets, I will always be here, waiting for you, dreaming of the day we won't have to say goodbye.

You make every pixel of my world brighter.

Forever yours,
Nienie 🌸

P.S. - Bonjour, madame pussycat. 💕`,
    },
  },
};

// Helper function to get dialogue sequence
export const getDialogue = (act, scene, character, interactionId) => {
  try {
    return dialogues[act][scene][character][interactionId] || [];
  } catch (e) {
    console.warn(`Dialogue not found: ${act}.${scene}.${character}.${interactionId}`);
    return [];
  }
};

// Export specific dialogue sequences for easy access
export const ACT1_DIALOGUES = dialogues.act1;
export const ACT2_DIALOGUES = dialogues.act2;
export const ACT3_DIALOGUES = dialogues.act3;

export default dialogues;
