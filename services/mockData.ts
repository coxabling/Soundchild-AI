import type { ArtistProfileData, CuratorProfileData, CampaignPerformanceData, SubscriptionPlan, Conversation, Badge, CreditPack, TrackMetadata, SoundNeighborhood, CuratorListData } from '../types';

export const mockCreditPacks: CreditPack[] = [
    { id: 'pack1', credits: 10, price: 10, bonus: 'Basic' },
    { id: 'pack2', credits: 55, price: 50, bonus: '+5 Credits' },
    { id: 'pack3', credits: 120, price: 100, bonus: '+20 Credits' },
];

export const getTrackByISRC = (isrc: string): TrackMetadata | null => {
    if (isrc.toUpperCase() === 'US-S1Z-23-00001') {
        return {
            artist_name: 'Luna Bloom',
            track_title: 'Neon Tides',
            genre: 'Synthwave',
            isrc: 'US-S1Z-23-00001'
        };
    }
    return null;
}

export const mockCampaignPerformance: CampaignPerformanceData[] = [
    {
        id: 'perf1',
        curatorName: 'Synthwave Central',
        placementDate: '2023-10-15',
        streamUplift: 25.4,
        listenerGrowth: 1200,
        saveRate: 18.2,
        roi: 3.2,
    },
    {
        id: 'perf2',
        curatorName: 'LofiLoft',
        placementDate: '2023-10-20',
        streamUplift: 15.1,
        listenerGrowth: 850,
        saveRate: 22.5,
        roi: 2.1,
    }
];

export const mockSubscriptionPlans: SubscriptionPlan[] = [
    {
        name: 'Starter',
        price: '15',
        features: [
            '10 AI Evaluations / mo',
            'Basic Campaign Optimizer',
            'Standard Curator Access',
            'AI Pitch Writer',
        ]
    },
    {
        name: 'Pro',
        price: '45',
        features: [
            'Unlimited AI Evaluations',
            'Advanced Campaign Optimizer',
            'Priority Curator Access',
            'Full AI Toolkit Access',
            'Verified Impact Reports',
            'A/B Test Remix Tool',
        ],
        isFeatured: true,
    },
    {
        name: 'Label',
        price: '125',
        features: [
            'All Pro Features',
            'Multi-User Accounts',
            'AI Scouting Portal Access',
            'API Access',
            'Dedicated Support',
        ]
    }
];

const mockBadges: Badge[] = [
    { name: 'Top Reviewer', description: 'Consistently provides high-quality, helpful feedback.', icon: 'award' },
    { name: 'Fast Responder', description: 'Known for quick turnaround times on submissions.', icon: 'clock' },
    { name: 'Genre Specialist', description: 'Deep expertise in their declared genres.', icon: 'target' },
];


const mockArtists: ArtistProfileData[] = [
    {
        id: 'luna-bloom',
        name: 'Luna Bloom',
        genre: 'Synthwave',
        location: 'Miami, USA',
        bio: 'Luna Bloom crafts nostalgic synthwave soundscapes that transport listeners to a neon-drenched 80s dream. With a blend of modern production and retro aesthetics, her music is both a tribute and a fresh take on the genre.',
        imageUrl: `https://i.pravatar.cc/150?u=luna-bloom`,
        monthlyListeners: 85230,
        saves: 12450,
        socials: { spotify: '#', instagram: '#', twitter: '#' },
        topTracks: [
            { title: 'Neon Tides', streams: 1205432 },
            { title: 'Midnight Drive', streams: 987345 },
            { title: 'Sunset Fader', streams: 754231 },
        ],
    },
    {
        id: 'sol',
        name: 'Sol',
        genre: 'Lofi Hip-Hop',
        location: 'Kyoto, Japan',
        bio: 'Sol is a producer and beatmaker known for his exceptionally chill and reflective lofi hip-hop tracks. His music often features sampled vinyl crackle, soothing piano melodies, and a sense of calm introspection, making it perfect for study or relaxation.',
        imageUrl: `https://i.pravatar.cc/150?u=sol`,
        monthlyListeners: 210450,
        saves: 45830,
        socials: { spotify: '#', instagram: '#', twitter: '#' },
        topTracks: [
            { title: 'Morning Mist', streams: 3450231 },
            { title: 'Rainy Day Ramen', streams: 2890112 },
            { title: 'Kyoto Dreams', streams: 1543890 },
        ],
    },
    {
        id: 'the-fuse',
        name: 'The Fuse',
        genre: 'Indie Rock',
        location: 'Manchester, UK',
        bio: 'The Fuse delivers raw, high-energy indie rock with fuzzy guitars, powerful vocals, and an anthemic quality. Drawing inspiration from garage rock and post-punk revival, their music is unapologetically loud and honest.',
        imageUrl: `https://i.pravatar.cc/150?u=the-fuse`,
        monthlyListeners: 48930,
        saves: 9870,
        socials: { spotify: '#', instagram: '#', twitter: '#' },
        topTracks: [
            { title: 'Riot', streams: 876543 },
            { title: 'City Lights', streams: 654321 },
            { title: 'Last Stand', streams: 432109 },
        ],
    }
];

const mockCurators: CuratorProfileData[] = [
    {
        id: 'synthwave-central',
        name: 'Synthwave Central',
        tagline: 'Your #1 Source for Retro-Futuristic Sounds',
        bio: 'Synthwave Central is a playlist and blog dedicated to the best of synthwave, retrowave, and vaporwave. We champion both established and emerging artists who capture the essence of the 80s.',
        imageUrl: 'https://i.pravatar.cc/150?u=synthwave-central',
        acceptanceRate: 15,
        avgResponseTime: '48 hours',
        reputation: 95,
        genres: ['Synthwave', 'Retrowave', 'Vaporwave', 'Electronic'],
        vibes: ['Nostalgic', 'Driving', 'Dreamy', 'Energetic'],
        recentReviews: [
            { track: 'Neon Tides', artist: 'Luna Bloom', snippet: 'A masterclass in modern synthwave. The production is crisp and the melody is unforgettable.' },
            { track: 'Starlight Runner', artist: 'Vector Hold', snippet: 'Great track, but the mix feels a bit too compressed for our main playlist. Keep up the great work!' },
        ],
        verifiedPlaylists: [
            { name: 'Retrowave Dreams', followers: 120543, url: '#' },
            { name: 'Vaporwave Vibes', followers: 75832, url: '#' },
        ],
        badges: [mockBadges[0], mockBadges[2]],
    },
    // Add more curators as needed
];

// FIX: Add mock data and exported function for Curator Discovery list.
const mockCuratorList: CuratorListData[] = [
    {
        id: 'cl1',
        name: 'IndieVibes',
        type: 'Playlist Curator',
        presentation: 'Curating the best of indie pop, rock, and alternative. Focus on catchy hooks and strong songwriting. Over 150k followers across platforms.',
        country: 'USA',
        job: 'Independent Curator',
        website: '#',
        imageUrl: 'https://i.pravatar.cc/150?u=indievibes',
    },
    {
        id: 'cl2',
        name: 'ChillWave Radio',
        type: 'Blog & Radio',
        presentation: 'The home for lofi, chillhop, and downtempo electronic. We feature tracks on our 24/7 radio stream and write in-depth reviews on our blog.',
        country: 'UK',
        job: 'Music Blogger',
        website: '#',
        imageUrl: 'https://i.pravatar.cc/150?u=chillwaveradio',
    },
    {
        id: 'cl3',
        name: 'EDM Pulse',
        type: 'Influencer',
        presentation: 'TikTok and Instagram influencer focused on high-energy EDM. If it\'s a banger, I\'ll share it with my 500k+ followers.',
        country: 'Germany',
        job: 'Social Media Influencer',
        website: '#',
        imageUrl: 'https://i.pravatar.cc/150?u=edmpulse',
    },
    {
        id: 'cl4',
        name: 'Synthwave Central',
        type: 'Playlist Curator',
        presentation: 'Your #1 Source for Retro-Futuristic Sounds. Dedicated to the best of synthwave, retrowave, and vaporwave.',
        country: 'USA',
        job: 'Playlist Curator',
        website: '#',
        imageUrl: 'https://i.pravatar.cc/150?u=synthwave-central',
    },
    {
        id: 'cl5',
        name: 'Acoustic Mornings',
        type: 'Playlist Curator',
        presentation: 'Gentle acoustic, folk, and singer-songwriter tracks for a calm start to your day. Perfect for coffee shops and quiet moments.',
        country: 'Canada',
        job: 'Independent Curator',
        website: '#',
        imageUrl: 'https://i.pravatar.cc/150?u=acousticmornings',
    },
    {
        id: 'cl6',
        name: 'The Pit',
        type: 'Blog & Zine',
        presentation: 'Covering all things heavy: metal, hardcore, punk, and everything in between. We do reviews, interviews, and premiere new tracks.',
        country: 'Australia',
        job: 'Music Journalist',
        website: '#',
        imageUrl: 'https://i.pravatar.cc/150?u=thepit',
    },
];

export const getCuratorListData = (): CuratorListData[] => {
    return mockCuratorList;
};

const mockConversationsArtist: Conversation[] = [
    {
        id: 'conv1',
        participantId: 'synthwave-central',
        participantName: 'Synthwave Central',
        participantImageUrl: 'https://i.pravatar.cc/150?u=synthwave-central',
        lastMessage: "Thanks for the kind words! We'll definitely keep an eye out.",
        timestamp: '1 day ago',
        unreadCount: 0,
        messages: [
            { id: 'm1', sender: 'me', text: "Hey! Just wanted to follow up on my submission 'Neon Tides'. Really appreciate you taking the time to listen.", timestamp: '2 days ago', isRead: true },
            { id: 'm2', sender: 'curator', text: "Hey! Loved the track, great production. Wasn't quite the right fit for our main playlist this week, but it's on our radar for sure.", timestamp: '1 day ago', isRead: true },
            { id: 'm3', sender: 'me', text: "That's awesome to hear, thank you so much! Glad you enjoyed it.", timestamp: '1 day ago', isRead: true },
            { id: 'm4', sender: 'curator', text: "Thanks for the kind words! We'll definitely keep an eye out.", timestamp: '1 day ago', isRead: true },
        ]
    },
    {
        id: 'conv2',
        participantId: 'lofi-loft',
        participantName: 'LofiLoft',
        participantImageUrl: 'https://i.pravatar.cc/150?u=lofi-loft',
        lastMessage: "Yeah, for sure. Happy to take another listen.",
        timestamp: '3 hours ago',
        unreadCount: 2,
        messages: [
             { id: 'm5', sender: 'curator', text: "Yeah, for sure. Happy to take another listen.", timestamp: '3 hours ago', isRead: false },
             { id: 'm6', sender: 'curator', text: "I've just uploaded the new master with the vocals turned up a bit as you suggested.", timestamp: '3 hours ago', isRead: false },
        ]
    }
];

const mockConversationsCurator: Conversation[] = [
    {
        id: 'conv3',
        participantId: 'luna-bloom',
        participantName: 'Luna Bloom',
        participantImageUrl: 'https://i.pravatar.cc/150?u=luna-bloom',
        lastMessage: "That's awesome to hear, thank you so much! Glad you enjoyed it.",
        timestamp: '1 day ago',
        unreadCount: 0,
        messages: [
            { id: 'm1', sender: 'artist', text: "Hey! Just wanted to follow up on my submission 'Neon Tides'. Really appreciate you taking the time to listen.", timestamp: '2 days ago', isRead: true },
            { id: 'm2', sender: 'me', text: "Hey! Loved the track, great production. Wasn't quite the right fit for our main playlist this week, but it's on our radar for sure.", timestamp: '1 day ago', isRead: true },
            { id: 'm3', sender: 'artist', text: "That's awesome to hear, thank you so much! Glad you enjoyed it.", timestamp: '1 day ago', isRead: true },
        ]
    },
    {
        id: 'conv4',
        participantId: 'sol',
        participantName: 'Sol',
        participantImageUrl: 'https://i.pravatar.cc/150?u=sol',
        lastMessage: "Okay great, I'll send it over soon. Thanks again!",
        timestamp: '5 days ago',
        unreadCount: 0,
        messages: [
            { id: 'm4', sender: 'me', text: "The mix on 'Morning Mist' is super clean, but the main melody gets a little repetitive. Have you considered adding a B-section or a counter-melody?", timestamp: '5 days ago', isRead: true },
            { id: 'm5', sender: 'artist', text: "That's great feedback, thank you. I actually have a version with a flute melody in the second half, I could send that over.", timestamp: '5 days ago', isRead: true },
            { id: 'm6', sender: 'me', text: "Sounds interesting, feel free to send a private link here when you're ready.", timestamp: '5 days ago', isRead: true },
            { id: 'm7', sender: 'artist', text: "Okay great, I'll send it over soon. Thanks again!", timestamp: '5 days ago', isRead: true },
        ]
    },
];

export const getConversations = (userType: 'artist' | 'curator'): Conversation[] => {
    return userType === 'artist' ? mockConversationsArtist : mockConversationsCurator;
};

export const getArtistProfile = (name: string): ArtistProfileData | undefined => {
    return mockArtists.find(a => a.name.toLowerCase() === name.toLowerCase());
};

export const getCuratorProfile = (name: string): CuratorProfileData | undefined => {
     // For mock purposes, let's just return the first one if the name matches roughly
    if (name.toLowerCase().includes('synthwave')) {
        return mockCurators[0];
    }
    // Return a generic profile for others
    const otherCurator: CuratorProfileData = {
        id: 'generic-curator',
        name: name,
        tagline: 'Champion of Independent Music',
        bio: `${name} is a curator dedicated to finding the best new music across a variety of genres.`,
        imageUrl: `https://i.pravatar.cc/150?u=${name.replace(/\s+/g, '-')}`,
        acceptanceRate: 22,
        avgResponseTime: '72 hours',
        reputation: 88,
        genres: ['Indie', 'Alternative', 'Electronic', 'Hip-Hop'],
        vibes: ['Chill', 'Energetic', 'Uplifting', 'Melancholic'],
        recentReviews: [
            { track: 'Sample Track', artist: 'Sample Artist', snippet: 'A really promising track with a unique sound.' },
        ],
        verifiedPlaylists: [
            { name: 'Indie Gems', followers: 250123, url: '#' },
        ],
        badges: [mockBadges[1]],
    };
    return mockCurators.find(c => c.name.toLowerCase() === name.toLowerCase()) || otherCurator;
};

export const getPerformanceReport = (id: string): CampaignPerformanceData | undefined => {
    return mockCampaignPerformance.find(p => p.id === id);
}

const mockNeighborhoods: SoundNeighborhood[] = [
    {
        name: "Retro-Futurist Drive",
        description: "A high-energy blend of modern synthwave and classic 80s outrun aesthetics. Characterized by driving basslines, neon-soaked synths, and a feeling of nostalgic velocity.",
        tags: ["Synthwave", "Outrun", "Retrowave", "Nostalgic"],
        coverArtUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
        trendingTracks: [
            { artist: "Luna Bloom", title: "Neon Tides" },
            { artist: "Vector Hold", title: "Starlight Runner" },
            { artist: "Grid Shifter", title: "Highway Zero" },
        ]
    },
    {
        name: "Kyoto Chillhop",
        description: "The sound of a rainy day in a quiet café. These lofi hip-hop beats are defined by their soothing piano melodies, vinyl crackle textures, and a deep sense of calm introspection.",
        tags: ["Lofi Hip-Hop", "Chillhop", "Study Beats", "Relaxing"],
        coverArtUrl: "https://images.unsplash.com/photo-1542875953-b8a73f5fe049?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
        trendingTracks: [
            { artist: "Sol", title: "Morning Mist" },
            { artist: "Nujabes", title: "Aruarian Dance" },
            { artist: "Idealism", title: "Snowfall" },
        ]
    },
    {
        name: "Garage Rock Revival",
        description: "Raw, unapologetic, and loud. This scene is all about fuzzy guitars, powerful vocals, and anthemic hooks that feel both timeless and urgent.",
        tags: ["Indie Rock", "Garage Rock", "Post-Punk", "High-Energy"],
        coverArtUrl: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
        trendingTracks: [
            { artist: "The Fuse", title: "Riot" },
            { artist: "The Strokes", title: "Last Nite" },
            { artist: "Arctic Monkeys", title: "I Bet You Look Good on the Dancefloor" },
        ]
    }
];

export const getSoundNeighborhoods = (): SoundNeighborhood[] => {
    return mockNeighborhoods;
}
