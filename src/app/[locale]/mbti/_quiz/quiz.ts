export const mbtiSurveyJson = {
  title: 'Get Your Unique Digital Persona based on Your Personality',
  description: 'This only takes 3 minutes',
  logo: 'https://dttd-mootiez.s3.ap-southeast-1.amazonaws.com/assets/mbti-quiz/icon.png',
  logoWidth: '30px',
  logoHeight: '20px',
  logoPosition: 'right',
  showTitle: false,
  questionErrorLocation: 'bottom',
  showProgressBar: 'top',
  progressBarType: 'pages',
  // goNextPageAutomatic: true,
  allowCompleteSurveyAutomatic: false,
  completeText: 'Get my result',
  questionsOnPageMode: 'questionPerPage',
  headerView: 'advanced',
  showCompletedPage: true,
  completedHtml:
    "<div class='center-div'><h3>Sending result to your email...</h3></div>",
  pages: [
    {
      name: 'Questions',
      elements: [
        {
          type: 'html',
          name: 'welcome',
          html: '<h2>Get Your Unique Digital Persona based on Your Personality</h2>',
        },
        {
          type: 'radiogroup',
          name: 'question1',
          title:
            "Friday's here and the gang's rallying for a night out. What's your move?",
          isRequired: true,
          choicesOrder: 'random',
          choices: [
            {
              value: 'a',
              text: 'Home Hermit: "Big nights out? Hard pass. I\'m all about cozy evenings in."',
            },
            {
              value: 'b',
              text: 'Maybe...: "I\'ll see how I feel. Sometimes yes, but I need my downtime too."',
            },
            {
              value: 'c',
              text: 'I\'m Down!: "Absolutely, I\'m in! Hanging with friends is always a boost."',
            },
            {
              value: 'd',
              text: 'LFG!!!!: "Oh yes! Bring on the night - I\'m here for all the fun and new faces!"',
            },
          ],
        },
        {
          type: 'radiogroup',
          name: 'question2',
          title: "Friend-o-meter: What's your vibe in the wild?",
          isRequired: true,
          choicesOrder: 'random',
          choices: [
            {
              value: 'a',
              text: 'Stealth Mode: "I\'m wallpaper with eyes-great at observing, not so much at mingling."',
            },
            {
              value: 'b',
              text: 'Deep Diver: "I dive deep into chats that grab my interest, usually one-on-one or in small crews."',
            },
            {
              value: 'c',
              text: 'People Presence: "I soak up the crowd\'s vibe without needing to dive into the mix."',
            },
            {
              value: 'd',
              text: 'Social Butterfly: "I\'m all about chatting up new faces — socializing is my sport!"',
            },
          ],
        },
        {
          type: 'radiogroup',
          name: 'question3',
          title: 'Big win alert! How are you celebrating?',
          isRequired: true,
          choicesOrder: 'random',
          choices: [
            {
              value: 'a',
              text: 'Solo mode activated: "Quiet time for me — I savor wins solo style!"',
            },
            {
              value: 'b',
              text: 'Lowkey Vibes: "Just the inner circle — small gatherings are my jam."',
            },
            {
              value: 'c',
              text: 'Hit Up the \'Gram: "Quick post to share the joy, then back to the grind!"',
            },
            {
              value: 'd',
              text: 'Full Send!: "Big bash with everyone! If it\'s not shared, did it even happen?"',
            },
          ],
        },
        {
          type: 'radiogroup',
          name: 'question4',
          title: "Thinking about the future... what's your pick?",
          isRequired: true,
          choicesOrder: 'random',
          choices: [
            {
              value: 'a',
              text: 'Team Blueprint: "All about solid plans and proven paths. Realism is my guide."',
            },
            {
              value: 'b',
              text: 'Remix Mode: "I remix the old with new twists for cool, practical innovations."',
            },
            {
              value: 'c',
              text: 'Hybrid Hustle: "I mix practical steps with bold, new ideas. Always eyeing the next big thing."',
            },
            {
              value: 'd',
              text: 'Dream Weaver: "I dream big and ask \'what if?\', pushing boundaries beyond the usual."',
            },
          ],
        },
        {
          type: 'radiogroup',
          name: 'question5',
          title:
            "You're at the park with friends and it suddenly rains! What's the first thought you have",
          isRequired: true,
          choicesOrder: 'random',
          choices: [
            {
              value: 'a',
              text: 'Umbrella Check: "Umbrella time? I quickly gauge the rain and seek shelter—always practical!"',
            },
            {
              value: 'b',
              text: 'Shirt Saver: "Oh no, my white shirt! I\'m on it — finding a dry spot ASAP."',
            },
            {
              value: 'c',
              text: 'Idea Tsunami: "Wow, this rain? Just like life\'s curveballs — always making me think on my feet."',
            },
            {
              value: 'd',
              text: 'Connect-the-Dots Champ: "Rainy days flood me with memories — each drop a reminder of past moments."',
            },
          ],
        },
        {
          type: 'radiogroup',
          name: 'question6',
          title:
            "You're playing a solo RPG game and you're facing the BOSS level now. How do you approach it?",
          isRequired: true,
          choicesOrder: 'random',
          choices: [
            {
              value: 'a',
              text: 'Study & Win: "I hit the books and guides to master the game plan before I play."',
            },
            {
              value: 'b',
              text: 'Inventory Review: "I check my gear and past wins to strategize my next move."',
            },
            {
              value: 'c',
              text: 'I have a feeling I know what should happen. "I follow my gut, tweaking my plan with a mix of instinct and insight."',
            },
            {
              value: 'd',
              text: 'Just Try First! "I dive right in and figure it out on the fly — adapt and overcome!"',
            },
          ],
        },
        {
          type: 'radiogroup',
          name: 'question7',
          title:
            "Now you're playing a board game with 3 friends. You're winning by far right now. What's on your mind",
          isRequired: true,
          choicesOrder: 'random',
          choices: [
            {
              value: 'a',
              text: 'CRYING FOR YOU: "Oops, I\'m winning too much! Drinks on me later to make up for this game domination."',
            },
            {
              value: 'b',
              text: 'Empathetic Opponent: "I feel for my pals losing the game; I\'m here cheering them on to boost their spirits!"',
            },
            {
              value: 'c',
              text: 'Diplomatic Sportsman: "Still playing to win, but I\'ll ease up a bit — let\'s keep this game fun for everyone."',
            },
            {
              value: 'd',
              text: 'Logic Lord: "I\'m just nailing this game. It\'s all in the strategy."',
            },
          ],
        },
        {
          type: 'radiogroup',
          name: 'question8',
          title:
            'Your Friend is rejected by a crush. Which unaired Friends episode do you show them',
          isRequired: true,
          choicesOrder: 'random',
          choices: [
            {
              value: 'a',
              text: 'The One On Your Side: "I reassure them of their worth, always on their team no matter what."',
            },
            {
              value: 'b',
              text: 'The One With the Shoulder to Cry On: "I\'m here for a good cry and a big hug — let it all out."',
            },
            {
              value: 'c',
              text: 'The One with the Sugar Coat: "I gently remind them it\'s the other person\'s loss, not theirs."',
            },
            {
              value: 'd',
              text: 'The One with the Truth Bomb: "I lay out the facts and help them figure out what went wrong."',
            },
          ],
        },
        {
          type: 'radiogroup',
          name: 'question9',
          title: "Team Troubleshooting: What's Your Style?",
          isRequired: true,
          choicesOrder: 'random',
          choices: [
            {
              value: 'a',
              text: 'Emotions Coach: "Team cheerleader, boosting spirits and keeping morale sky-high!"',
            },
            {
              value: 'b',
              text: 'Pep Talk Captain: "We\'re all about inspiring talks! Motivation is our magic for victory."',
            },
            {
              value: 'c',
              text: 'Balanced Player: "I mix strategy with good vibes, planning for success while keeping the team happy."',
            },
            {
              value: 'd',
              text: 'Strategy Coach: "Game plan guru here! I design winning strategies and keep emotions off the field."',
            },
          ],
        },
        {
          type: 'radiogroup',
          name: 'question10',
          title: "We're turning your first date into movie! What's the script?",
          isRequired: true,
          choicesOrder: 'random',
          choices: [
            {
              value: 'a',
              text: 'The Detailed Script: "Scripted to perfection — every moment planned, every detail dialed in!"',
            },
            {
              value: 'b',
              text: 'Plan and Pivot: "I plan key scenes but am ready to adjust based on how we vibe together."',
            },
            {
              value: 'c',
              text: 'The Guided Journey: "Starting point set, the rest is up for surprises!"',
            },
            {
              value: 'd',
              text: 'The Unplanned Adventure: "Who needs plans? We\'re winging it for spontaneous thrills!"',
            },
          ],
        },
        {
          type: 'radiogroup',
          name: 'question11',
          title: 'Task Tackling: How do you handle it?',
          isRequired: true,
          choicesOrder: 'random',
          choices: [
            {
              value: 'a',
              text: 'Blueprint Boss: "I draft every detail and follow my blueprint to the letter — precision is key!"',
            },
            {
              value: 'b',
              text: 'Flexi-Strategist: "I mark key milestones and play with different paths to hit them — flexibility meets focus',
            },
            {
              value: 'c',
              text: 'Flow Rider: "Goal in mind, I ride the wave of creativity and tweak the plan as inspiration strikes."',
            },
            {
              value: 'd',
              text: 'Flyin\' Free: "No plans, no problem! I improvise and enjoy the journey as it unfolds."',
            },
          ],
        },
        {
          type: 'radiogroup',
          name: 'question12',
          title: "Tomorrow's your day off— yay! What will the day look like?",
          isRequired: true,
          choicesOrder: 'random',
          choices: [
            {
              value: 'a',
              text: 'Itinerary Expert: "Every hour\'s booked — my day\'s as planned as it gets!"',
            },
            {
              value: 'b',
              text: 'Planned but Pliable: "I\'ve lined up some cool stuff, yet I\'m all for last-minute changes."',
            },
            {
              value: 'c',
              text: 'Flexible & Free: "I\'ve got ideas but no set plans — let\'s see where the day takes us!"',
            },
            {
              value: 'd',
              text: 'Go with the Flow: "Plan? What plan? I make it up as I go!"',
            },
          ],
        },
        {
          type: 'imagepicker',
          name: 'gender',
          title: 'How would you like your Mootiez avatar to be represented...',
          isRequired: true,
          choices: [
            {
              value: 'f',
              text: 'Female',
              imageLink:
                'https://dttd-mootiez.s3.ap-southeast-1.amazonaws.com/assets/mbti-quiz/female.jpeg',
            },
            {
              value: 'm',
              text: 'Male',
              imageLink:
                'https://dttd-mootiez.s3.ap-southeast-1.amazonaws.com/assets/mbti-quiz/male.jpeg',
            },
            {
              value: 'nb',
              text: 'Non-binary',
              imageLink:
                'https://dttd-mootiez.s3.ap-southeast-1.amazonaws.com/assets/mbti-quiz/non-binary.jpeg',
            },
          ],
          imageFit: 'cover',
          showLabel: true,
        },
        {
          type: 'text',
          name: 'email',
          title:
            "Enter your email that you'd like to connect to Mootiez with\n(We’ll send you a magic link to claim your Mootiez and personality report)",
          inputType: 'email',
          isRequired: true,
        },

        // Additional questions
        //         {
        //           type: 'html',
        //           name: 'headsup',
        //           html: "<h5>You're almost done! Mootiez is in open beta right now, and we want to learn how to make this the best experience possible! There are 1 quick last question we just want your help with. Thank you so much!</h5>",
        //         },
        //         /**
        //          *  Question: spend money on

        // Option 1: a wristband monitor to track your health
        // Option 2: cooling pads to beat the summer heat
        //          */

        //         {
        //           type: 'radiogroup',
        //           name: 'opt_q1',
        //           title: 'Would you rather spend money on...',
        //           isRequired: false,
        //           choicesOrder: 'random',
        //           choices: [
        //             {
        //               value: 'a wristband monitor to track your health',
        //               text: 'a wristband monitor to track your health',
        //             },
        //             {
        //               value: 'cooling pads to beat the summer heat',
        //               text: 'cooling pads to beat the summer heat',
        //             },
        //           ],
        //         },
      ],
    },
  ],
};
