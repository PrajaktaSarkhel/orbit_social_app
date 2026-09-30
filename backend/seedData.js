const samplePosts = [
  {
    username: 'minimal_spaces',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    text: 'Raw concrete, natural white oak, and afternoon light in this Kyoto pavilion. The boundary between interior and nature completely dissolves here. Architecture by Kengo Kuma studio. 🌿\n\n#architecture #minimalism #interiordesign #kyoto #japan #wabisabi',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    likes: ['sarah_designs', 'alex_codes', 'elena_wanderlust', 'chef_matteo', 'charlotte_film', 'david_k', 'nina_v', 'hannah_arc'],
    savedBy: [],
    sharesCount: 142,
    comments: [
      {
        username: 'arch_digest',
        text: 'The proportion of that cantilevered ceiling is masterclass.',
        createdAt: new Date(Date.now() - 3600000 * 4)
      },
      {
        username: 'hannah_arc',
        text: 'Adding this to my dream home moodboard immediately ✨',
        createdAt: new Date(Date.now() - 3600000 * 2)
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 3)
  },
  {
    username: 'elena_wanderlust',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    text: 'Golden hour over the Amalfi Coast 🍋🌊 Spent the afternoon wandering the steep staircases of Positano, grabbing fresh lemon granita, and watching the fishing boats return to shore. Every corner feels like a film still.\n\n#amalficoast #positano #italytravel #summerinitaly #wanderlust',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    likes: ['minimal_spaces', 'alex_codes', 'clara_travels', 'marco_rome', 'sophia.captures'],
    savedBy: [],
    sharesCount: 89,
    comments: [
      {
        username: 'marco_rome',
        text: 'Welcome to Italy Elena! Make sure to try the handmade scialatielli pasta in Amalfi town 🍝',
        createdAt: new Date(Date.now() - 3600000 * 5)
      },
      {
        username: 'clara_travels',
        text: 'That view never gets old! Unreal lighting.',
        createdAt: new Date(Date.now() - 3600000 * 1)
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 6)
  },
  {
    username: 'alex_codes',
    userAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    text: 'Sunday reset. Clean desk, fresh coffee, and zero open tabs (for now). Built a custom oak shelf to tuck away all the cables and added a warm 2700K backlight behind the monitor. Calm environment = calm code.\n\n#desksetup #workspace #minimalistsetup #developer #cleandesk #tech',
    image: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=1200&q=80',
    likes: ['sarah_frontend', 'dev_alex', 'code_and_coffee', 'minimal_spaces', 'tech_daily', 'jordan_b', 'emily_dev'],
    savedBy: [],
    sharesCount: 115,
    comments: [
      {
        username: 'sarah_frontend',
        text: 'The cable management is so satisfying! What monitor stand is that?',
        createdAt: new Date(Date.now() - 3600000 * 7)
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 10)
  },
  {
    username: 'daily_brew_club',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    text: 'Slow morning pour over ☕ Notes of bergamot, peach blossom, and honeyed apricot from this washed Ethiopian Yirgacheffe. Taking ten minutes to just listen to the kettle and brew before the world wakes up.\n\n#pourover #specialtycoffee #coffeetime #v60 #morningroutine #baristadaily',
    image: 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=1200&q=80',
    likes: ['coffee_nerd_99', 'elena_wanderlust', 'matteo_food', 'clara_travels'],
    savedBy: [],
    sharesCount: 38,
    comments: [
      {
        username: 'coffee_nerd_99',
        text: 'Ethiopian beans through a V60 are untouchable. Great cup clarity!',
        createdAt: new Date(Date.now() - 3600000 * 2)
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 14)
  },
  {
    username: 'chef_matteo',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    text: 'Handmade tagliatelle with wild chanterelle mushrooms, thyme-infused brown butter, and generous 24-month Parmigiano Reggiano. 4 simple ingredients, infinite comfort.\n\n#pastalover #homemade #italianfood #comfortfood #culinaryarts',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80',
    likes: ['foodie_mia', 'elena_wanderlust', 'daily_brew_club', 'sophia.captures', 'lucas_chef', 'clara_travels'],
    savedBy: [],
    sharesCount: 62,
    comments: [
      {
        username: 'foodie_mia',
        text: 'Literal perfection on a plate! Craving this right now 🤤',
        createdAt: new Date(Date.now() - 3600000 * 4)
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 18)
  },
  {
    username: 'charlotte_film',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    text: 'Pacific Coast Highway at 7:45 PM. Shot on Kodak Portra 400. That golden haze when the marine layer rolls in against the cliffs is impossible to replicate digitally.\n\n#filmphotography #35mm #kodakportra #california #highway1 #analog',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    likes: ['analog_vibes', 'alex_codes', 'minimal_spaces', 'elena_wanderlust'],
    savedBy: [],
    sharesCount: 45,
    comments: [
      {
        username: 'analog_vibes',
        text: 'Portra colors are undefeated during coastal sunset.',
        createdAt: new Date(Date.now() - 3600000 * 8)
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 22)
  },
  {
    username: 'urban_explorations',
    userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    text: 'Finding quiet alleys in Shinjuku right as the neon signs begin to flicker on in the gentle rain 🌧️ Tokyo at twilight never fails to ignite creativity.\n\n#tokyo #streetphotography #cyberpunk #traveljapan #nightphotography',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    likes: ['neon_wanderer', 'alex_codes', 'charlotte_film', 'minimal_spaces', 'tokyo_drift', 'kai_lens', 'maya_z', 'sam_shot'],
    savedBy: [],
    sharesCount: 160,
    comments: [
      {
        username: 'neon_wanderer',
        text: 'Rainy Tokyo nights are pure mood and inspiration!',
        createdAt: new Date(Date.now() - 3600000 * 6)
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 26)
  }
];

module.exports = samplePosts;
