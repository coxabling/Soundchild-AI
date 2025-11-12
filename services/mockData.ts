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

export const getPerformanceReport = (id: string): CampaignPerformanceData | null => {
    return mockCampaignPerformance.find(p => p.id === id) || null;
}

export const mockSubscriptionPlans: SubscriptionPlan[] = [
    {
        name: 'Artist',
        price: '29',
        features: [
            '20 AI Credits/month',
            'Track Evaluator',
            'AI Pitch Writer',
            'Smart Follow-Up',
            'Basic Analytics',
        ],
    },
    {
        name: 'Pro Artist',
        price: '79',
        features: [
            '100 AI Credits/month',
            'All Artist features',
            'Campaign Optimizer',
            'A/B Test Remix Feedback',
            'AI Report Card',
            'Advanced Analytics',
            'Priority Support',
        ],
        isFeatured: true,
    },
    {
        name: 'Label',
        price: '249',
        features: [
            '500 AI Credits/month',
            'All Pro Artist features',
            'A&R Scouting Assistant',
            'Market Trend Analysis',
            'Multi-user access',
            'Dedicated Account Manager',
        ],
    },
];

const mockArtistProfiles: ArtistProfileData[] = [
    {
        id: 'luna-bloom',
        name: 'Luna Bloom',
        genre: 'Synthwave',
        location: 'Los Angeles, CA',
        bio: 'Luna Bloom is an independent synthwave producer known for her dreamy, nostalgic soundscapes and driving 80s-inspired rhythms. Her music blends classic analog synth textures with modern production techniques to create a sound that is both timeless and fresh.',
        imageUrl: 'https://i.pravatar.cc/150?u=luna-bloom',
        monthlyListeners: 85230,
        saves: 15400,
        socials: {
            spotify: '#',
            instagram: '#',
            twitter: '#',
        },
        topTracks: [
            { title: 'Neon Tides', streams: 1250000 },
            { title: 'Starlight Runner', streams: 875000 },
            { title: 'Sunset Fader', streams: 650000 },
        ],
    },
    {
        id: 'sol',
        name: 'Sol',
        genre: 'Lofi Hip-Hop',
        location: 'Kyoto, Japan',
        bio: 'Sol is a lofi hip-hop beatmaker from Kyoto, Japan. His music is characterized by its chill, reflective mood, often incorporating elements of jazz and soul. Perfect for studying, relaxing, or a late-night drive.',
        imageUrl: 'https://i.pravatar.cc/150?u=sol',
        monthlyListeners: 150200,
        saves: 32000,
        socials: {
            spotify: '#',
            instagram: '#',
            twitter: '#',
        },
        topTracks: [
            { title: 'Morning Mist', streams: 2500000 },
            { title: 'Kyoto Dreams', streams: 1800000 },
            { title: 'Cherry Blossom', streams: 1200000 },
        ],
    },
    {
        id: 'the-fuse',
        name: 'The Fuse',
        genre: 'Indie Rock',
        location: 'Manchester, UK',
        bio: 'The Fuse are a high-energy indie rock band from Manchester, UK. Their sound is a mix of garage rock revival and post-punk, with raw, fuzzy guitars and powerful vocals.',
        imageUrl: 'https://i.pravatar.cc/150?u=the-fuse',
        monthlyListeners: 45000,
        saves: 7800,
        socials: {
            spotify: '#',
            instagram: '#',
            twitter: '#',
        },
        topTracks: [
            { title: 'Riot', streams: 500000 },
            { title: 'City Lights', streams: 350000 },
            { title: 'Static', streams: 200000 },
        ],
    }
];

export const getArtistProfile = (name: string): ArtistProfileData | null => {
    return mockArtistProfiles.find(p => p.name.toLowerCase() === name.toLowerCase()) || null;
}

const mockCuratorProfiles: CuratorProfileData[] = [
    {
        id: 'synthwave-central',
        name: 'Synthwave Central',
        tagline: 'Your #1 source for retro-futuristic sounds.',
        bio: 'Dedicated to promoting the best synthwave, retrowave, and outrun music from around the globe. We feature both established and emerging artists who capture the essence of the 80s aesthetic. If it has neon grids and analog warmth, we want to hear it.',
        imageUrl: 'https://i.pravatar.cc/150?u=synthwave-central',
        acceptanceRate: 15,
        avgResponseTime: '3 days',
        reputation: 94,
        genres: ['Synthwave', 'Retrowave', 'Darksynth', 'Outrun'],
        vibes: ['Nostalgic', 'Driving', 'Cinematic', 'Energetic'],
        recentReviews: [
            { track: 'Neon Tides', artist: 'Luna Bloom', snippet: 'An absolute masterpiece of modern synthwave. The production is crisp, and the melody is unforgettable. An instant add to our main playlist.' },
            { track: 'Highway Zero', artist: 'Grid Shifter', snippet: 'Solid track with a great driving beat, but the mix feels a bit thin. With a stronger low-end, this would be a hit.' },
        ],
        verifiedPlaylists: [
            { name: 'Synthwave Central', followers: 250000, url: '#' },
            { name: 'Retrowave Dreams', followers: 120000, url: '#' },
        ],
        badges: [
            { name: 'Top Performer', description: 'Consistently high performance for placed tracks.', icon: 'award' },
            { name: 'Swift Responder', description: 'Known for quick feedback times.', icon: 'clock' },
        ],
    },
    {
        id: 'lofiloft',
        name: 'LofiLoft',
        tagline: 'Chill beats for focus and relaxation.',
        bio: 'Curating the finest lofi hip-hop and chillhop for our community of students, creatives, and anyone in need of a moment of calm. We value smooth melodies, dusty drums, and a cozy atmosphere.',
        imageUrl: 'https://i.pravatar.cc/150?u=lofiloft',
        acceptanceRate: 25,
        avgResponseTime: '2 days',
        reputation: 89,
        genres: ['Lofi Hip-Hop', 'Chillhop', 'Jazz Hop'],
        vibes: ['Chill', 'Reflective', 'Cozy', 'Melancholic'],
        recentReviews: [
            { track: 'Morning Mist', artist: 'Sol', snippet: 'The perfect embodiment of what lofi should be. Soothing piano, subtle vinyl crackle, and an atmosphere that just melts stress away.' },
            { track: 'Kyoto Dreams', artist: 'Sol', snippet: 'Another beautiful track from Sol. The vibes are immaculate. Instantly approved.' },
        ],
        verifiedPlaylists: [
            { name: 'Lofi Loft 24/7', followers: 500000, url: '#' },
            { name: 'Chillhop Cafe', followers: 180000, url: '#' },
        ],
        badges: [
            { name: 'Genre Specialist', description: 'Recognized expert in the lofi genre.', icon: 'target' },
        ],
    }
];

export const getCuratorProfile = (name: string): CuratorProfileData | null => {
    return mockCuratorProfiles.find(p => p.name.toLowerCase() === name.toLowerCase()) || null;
}

const artistConversations: Conversation[] = [
    {
        id: 'conv1',
        participantId: 'synthwave-central',
        participantName: 'Synthwave Central',
        participantImageUrl: 'https://i.pravatar.cc/150?u=synthwave-central',
        lastMessage: 'Thanks for the add! Really appreciate the support.',
        timestamp: '2 days ago',
        unreadCount: 0,
        messages: [
            { id: 'm1', sender: 'curator', text: 'Hey! Loved "Neon Tides". We\'ve added it to our main playlist.', timestamp: '3 days ago', isRead: true },
            { id: 'm2', sender: 'me', text: 'Thanks for the add! Really appreciate the support.', timestamp: '2 days ago', isRead: true },
        ],
    },
    {
        id: 'conv2',
        participantId: 'lofiloft',
        participantName: 'LofiLoft',
        participantImageUrl: 'https://i.pravatar.cc/150?u=lofiloft',
        lastMessage: 'No problem! Keep up the great work.',
        timestamp: '1 week ago',
        unreadCount: 0,
        messages: [
             { id: 'm3', sender: 'me', text: 'Just wanted to say thanks for the feedback on my last track.', timestamp: '1 week ago', isRead: true },
             { id: 'm4', sender: 'curator', text: 'No problem! Keep up the great work.', timestamp: '1 week ago', isRead: true },
        ],
    },
];

const curatorConversations: Conversation[] = [
    {
        id: 'conv3',
        participantId: 'luna-bloom',
        participantName: 'Luna Bloom',
        participantImageUrl: 'https://i.pravatar.cc/150?u=luna-bloom',
        lastMessage: 'Awesome, thank you so much!',
        timestamp: '2 days ago',
        unreadCount: 1,
        messages: [
            { id: 'm5', sender: 'me', text: 'Hey! Loved "Neon Tides". We\'ve added it to our main playlist.', timestamp: '3 days ago', isRead: true },
            { id: 'm6', sender: 'artist', text: 'Awesome, thank you so much!', timestamp: '2 days ago', isRead: false },
        ],
    },
    {
        id: 'conv4',
        participantId: 'sol',
        participantName: 'Sol',
        participantImageUrl: 'https://i.pravatar.cc/150?u=sol',
        lastMessage: 'For sure, will do!',
        timestamp: '1 week ago',
        unreadCount: 0,
        messages: [
            { id: 'm7', sender: 'artist', text: 'Just wanted to say thanks for the feedback on my last track.', timestamp: '1 week ago', isRead: true },
            { id: 'm8', sender: 'me', text: 'No problem! Keep up the great work.', timestamp: '1 week ago', isRead: true },
            { id: 'm9', sender: 'artist', text: 'For sure, will do!', timestamp: '1 week ago', isRead: true },
        ],
    },
];

export const getConversations = (userType: 'artist' | 'curator'): Conversation[] => {
    return userType === 'artist' ? artistConversations : curatorConversations;
};

export const getSoundNeighborhoods = (): SoundNeighborhood[] => [
    {
        name: 'Retro Futurist',
        description: 'A vibrant scene blending classic 80s synth sounds with modern production. Characterized by driving basslines, neon-soaked melodies, and a sense of nostalgic optimism.',
        tags: ['Synthwave', 'Retrowave', 'Outrun'],
        coverArtUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60',
        trendingTracks: [
            { artist: 'Luna Bloom', title: 'Neon Tides' },
            { artist: 'Vector Hold', title: 'Starlight Runner' },
            { artist: 'Grid Shifter', title: 'Highway Zero' },
        ],
    },
    {
        name: 'Midnight Vinyl',
        description: 'The auditory equivalent of a rainy night in a cozy café. This neighborhood is defined by dusty drum loops, melancholic piano chords, and a laid-back, reflective atmosphere.',
        tags: ['Lofi Hip-Hop', 'Chillhop', 'Jazz Hop'],
        coverArtUrl: 'https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60',
        trendingTracks: [
            { artist: 'Sol', title: 'Morning Mist' },
            { artist: 'Nujabes', title: 'Aruarian Dance' },
            { artist: 'Idealism', title: 'Controlla' },
        ],
    },
    {
        name: 'Garage Revival',
        description: 'Raw, energetic, and unapologetic. This scene is all about fuzzy guitars, driving rhythms, and powerful, anthemic vocals that hark back to the golden age of indie rock.',
        tags: ['Indie Rock', 'Garage Rock', 'Post-Punk'],
        coverArtUrl: 'https://images.unsplash.com/photo-1550985223-b1dc331f0c2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60',
        trendingTracks: [
            { artist: 'The Fuse', title: 'Riot' },
            { artist: 'Arctic Monkeys', title: 'I Bet You Look Good on the Dancefloor' },
            { artist: 'The Strokes', title: 'Last Nite' },
        ],
    },
];

const mockCuratorListData: CuratorListData[] = [
    { id: 'curator1', name: 'Synthwave Central', type: 'Playlist', presentation: 'Dedicated to promoting the best synthwave, retrowave, and outrun music from around the globe.', country: 'USA', job: 'Playlist Curator', website: '#', imageUrl: 'https://i.pravatar.cc/150?u=synthwave-central' },
    { id: 'curator2', name: 'LofiLoft', type: 'Playlist', presentation: 'Curating the finest lofi hip-hop and chillhop for our community of students and creatives.', country: 'Japan', job: 'Playlist Curator', website: '#', imageUrl: 'https://i.pravatar.cc/150?u=lofiloft' },
    { id: 'curator3', name: 'Indie Mixtape', type: 'Blog', presentation: 'A blog dedicated to discovering and sharing the best new indie rock and alternative music.', country: 'UK', job: 'Music Blogger', website: '#', imageUrl: 'https://i.pravatar.cc/150?u=indie-mixtape' },
    { id: 'curator4', name: 'Electronic Gems', type: 'YouTube Channel', presentation: 'A visual and auditory experience, featuring a wide range of electronic music from ambient to experimental.', country: 'Germany', job: 'YouTuber', website: '#', imageUrl: 'https://i.pravatar.cc/150?u=electronic-gems' },
    { id: 'curator5', name: 'Radio Fuego', type: 'Radio Show', presentation: 'Broadcasting the hottest tracks in Latin pop and reggaeton to a global audience.', country: 'Colombia', job: 'Radio Host', website: '#', imageUrl: 'https://i.pravatar.cc/150?u=radio-fuego' },
    { id: 'curator6', name: 'The Alternative', type: 'Magazine', presentation: 'An online magazine covering everything in the alternative music scene, from punk to folk.', country: 'USA', job: 'Editor', website: '#', imageUrl: 'https://i.pravatar.cc/150?u=the-alternative' },
];
export const getCuratorListData = (): CuratorListData[] => {
    return mockCuratorListData;
};
