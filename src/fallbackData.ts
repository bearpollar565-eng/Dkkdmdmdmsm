import { MediaItem } from './types';

export const FALLBACK_MEDIA_ITEMS: MediaItem[] = [
  {
    id: "dune_2",
    title: "Dune: Part Two",
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.",
    type: "movie",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80", // Cosmic vibe
    backdrop: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=1200&auto=format&fit=crop&q=80",
    logo: "", // fallback to styled text logo if image logo empty
    defaultUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    trailer: "https://www.youtube.com/watch?v=U2Qp5pL3ovA",
    year: "2024",
    genre: "Sci-Fi, Adventure, Action",
    isPromo: true,
    addedAt: 1710000000
  },
  {
    id: "stranger_things",
    title: "Stranger Things",
    description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
    type: "series",
    poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80", // Retro neon arcade vibe
    backdrop: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80",
    defaultUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    trailer: "https://www.youtube.com/watch?v=b9EkMc79ZSU",
    year: "2022",
    genre: "Sci-Fi, Horror, Drama",
    isPromo: false,
    addedAt: 1700000000,
    seasons: {
      "1": [
        { title: "Chapter One: The Vanishing of Will Byers", duration: "48m", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
        { title: "Chapter Two: The Weirdo on Maple Street", duration: "55m", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
        { title: "Chapter Three: Holly, Jolly", duration: "51m", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
        { title: "Chapter Four: The Body", duration: "50m", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" }
      ]
    }
  },
  {
    id: "avatar_2",
    title: "Avatar: The Way of Water",
    description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
    type: "movie",
    poster: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=500&auto=format&fit=crop&q=80", // Oceanic blue vibe
    backdrop: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&auto=format&fit=crop&q=80",
    defaultUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    trailer: "https://www.youtube.com/watch?v=d9MyW72ELq0",
    year: "2022",
    genre: "Action, adventure, Sci-Fi",
    isPromo: false,
    addedAt: 1690000000
  },
  {
    id: "spiderman_verse",
    title: "Spider-Man: Across the Spider-Verse",
    description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.",
    type: "movie",
    poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&auto=format&fit=crop&q=80", // Comic illustration vibe
    backdrop: "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?w=1200&auto=format&fit=crop&q=80",
    defaultUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    trailer: "https://www.youtube.com/watch?v=cqGjhVJWtEg",
    year: "2023",
    genre: "Animation, Action, Adventure",
    isPromo: false,
    addedAt: 1680000000
  },
  {
    id: "interstellar",
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival in a spectacular cosmic voyage.",
    type: "movie",
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=80", // Stellar galaxy vibe
    backdrop: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&auto=format&fit=crop&q=80",
    defaultUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    trailer: "https://www.youtube.com/watch?v=zSWdZAOn3NY",
    year: "2014",
    genre: "Sci-Fi, Drama, Mystery",
    isPromo: false,
    addedAt: 1670000000
  },
  {
    id: "wednesday",
    title: "Wednesday",
    description: "Smart, sarcastic and a little dead inside, Wednesday Addams investigates a murder spree while making new friends — and foes — at Nevermore Academy.",
    type: "series",
    poster: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=500&auto=format&fit=crop&q=80", // Gothic mystery vibe
    backdrop: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1200&auto=format&fit=crop&q=80",
    defaultUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    trailer: "https://www.youtube.com/watch?v=Di310WS8zLk",
    year: "2022",
    genre: "Comedy, Horror, Fantasy",
    isPromo: false,
    addedAt: 1660000000,
    seasons: {
      "1": [
        { title: "Chapter 1: Wednesday's Child Is Full of Woe", duration: "47m", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" },
        { title: "Chapter 2: Woe Is the Loneliest Number", duration: "48m", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
        { title: "Chapter 3: Friend or Woe", duration: "49m", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" }
      ]
    }
  }
];
