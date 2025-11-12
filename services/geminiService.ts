
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import type { 
    EvaluatorFormData, EvaluatorResponse, 
    CuratorFormData, CuratorResponse,
    OptimizerFormData, OptimizerResponse,
    PitchWriterFormData, PitchWriterResponse,
    FollowUpFormData, FollowUpResponse,
    NeighborhoodsFormData, NeighborhoodsResponse,
    ScoutingFormData, ScoutingResponse,
    RemixABTestFormData, RemixABTestResponse,
    FeedbackSynthesizerFormData, FeedbackSynthesizerResponse,
    LyricAnalyzerFormData, LyricAnalyzerResponse,
    PlaylistAssistantFormData, PlaylistAssistantResponse,
    PersonaGeneratorFormData, PersonaGeneratorResponse,
    MarketAnalysisFormData, MarketAnalysisResponse,
    DealMemoFormData, DealMemoResponse
} from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- MODULE 1: ARTIST EVALUATOR ---

const evaluatorSchema = {
    type: Type.OBJECT,
    properties: {
        readiness_score: { type: Type.INTEGER },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        improvement_recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
        ideal_curator_profile: { type: Type.STRING },
        confidence_level: { type: Type.NUMBER },
    },
    required: ["readiness_score", "strengths", "weaknesses", "improvement_recommendations", "ideal_curator_profile", "confidence_level"]
};

export const runArtistEvaluation = async (formData: EvaluatorFormData): Promise<EvaluatorResponse> => {
    const prompt = `
        You are Soundchild Artist Evaluator — a professional A&R and audio analyst.
        Your role is to assess an artist’s song submission in three dimensions:
        1. Technical quality (mix, master, loudness, clarity, stereo imaging)
        2. Creative quality (composition, originality, hook, emotion)
        3. Market fit (genre accuracy, audience match, metadata completeness)
        You provide numeric readiness scores, highlight strengths, and recommend 3–5 actionable improvements.
        Stay encouraging and constructive — avoid harsh criticism.
        Never output unstructured text; always respond in valid JSON.

        **INPUT DATA:**
        - Artist Name: ${formData.artist_name}
        - Track Title: ${formData.track_title}
        - Genre: ${formData.genre}
        - Mood: ${formData.mood}
        - BPM: ${formData.bpm}
        - Audio Features: loudness=${formData.loudness} LUFS, dynamic_range=${formData.dynamic_range}, energy=${formData.energy}, valence=${formData.valence}
        - Track Description: ${formData.description}
        - Artist Goal: ${formData.goal}
        - Upload Context: ${formData.context} (e.g., demo, final master)

        **TASKS:**
        1. Rate the track readiness (0–100).
        2. Identify strengths and weaknesses.
        3. Recommend 3–5 concrete improvements (technical or artistic).
        4. Suggest best target audience / curator type.

        **OUTPUT FORMAT:**
        Return a single, valid JSON object matching the provided schema. Do not include any markdown formatting or commentary outside the JSON structure.
    `;
    return callGemini(prompt, evaluatorSchema);
};


// --- MODULE 2: CURATOR ASSISTANT ---

const curatorSchema = {
    type: Type.OBJECT,
    properties: {
        fit_score: { type: Type.INTEGER },
        decision: { type: Type.STRING, enum: ["accept", "pass", "consider later"] },
        fit_reason: { type: Type.STRING },
        review_for_artist: { type: Type.STRING },
        social_caption: { type: Type.STRING },
        confidence_level: { type: Type.NUMBER },
        review_quality_score: { type: Type.INTEGER, description: "A score from 0-100 evaluating the quality, helpfulness, and constructiveness of the generated 'review_for_artist'." },
    },
    required: ["fit_score", "decision", "fit_reason", "review_for_artist", "social_caption", "confidence_level", "review_quality_score"]
};

export const runCuratorAssistant = async (formData: CuratorFormData): Promise<CuratorResponse> => {
    const prompt = `
        You are Soundchild Curator Assistant — a virtual curation co-pilot.
        You help music curators review artist submissions quickly by:
        - Analyzing the song’s vibe, technical quality, and originality
        - Generating 1 short written review (for the artist)
        - Generating 1 short social media caption (for sharing)
        - Suggesting whether to “accept”, “pass”, or “consider later”
        Keep reviews polite, professional, and genre-aware. If the song doesn’t fit, focus feedback on relevance, not criticism.
        Always return structured JSON.

        **INPUT DATA:**
        - Curator Name: ${formData.curator_name}
        - Curator Genres: ${formData.curator_genres}
        - Curator Audience: ${formData.curator_audience}
        - Submission:
            - Artist Name: ${formData.artist_name}
            - Track Title: ${formData.track_title}
            - Genre: ${formData.genre}
            - Mood: ${formData.mood}
            - Description: ${formData.description}
            - Audio Features: loudness=${formData.loudness}, energy=${formData.energy}, valence=${formData.valence}
            - Artist Pitch: "${formData.pitch}"

        **TASKS:**
        1. Analyze musical and emotional fit with the curator's style.
        2. Produce a short written review (1–2 paragraphs) for the artist.
        3. Suggest a social media caption or blurb for sharing if accepted.
        4. Recommend "accept", "pass", or "consider later", with reason.
        5. After generating the 'review_for_artist', critically assess its quality. Provide a 'review_quality_score' from 0-100 based on its helpfulness, specificity, and constructive tone.

        **OUTPUT FORMAT:**
        Return a single, valid JSON object matching the provided schema. Do not include any markdown formatting or commentary outside the JSON structure.
    `;
    return callGemini(prompt, curatorSchema);
};


// --- MODULE 3: CAMPAIGN OPTIMIZER ---

const optimizerSchema = {
    type: Type.OBJECT,
    properties: {
        recommended_curators: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    curator_name: { type: Type.STRING },
                    predicted_acceptance_rate: { type: Type.NUMBER },
                    estimated_cost: { type: Type.NUMBER },
                    expected_impact: { type: Type.STRING }
                },
                required: ["curator_name", "predicted_acceptance_rate", "estimated_cost", "expected_impact"]
            }
        },
        budget_allocation: {
            type: Type.OBJECT,
            properties: {
                total_budget: { type: Type.NUMBER },
                distribution: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            curator_name: { type: Type.STRING },
                            allocation_amount: { type: Type.NUMBER }
                        },
                        required: ["curator_name", "allocation_amount"]
                    }
                }
            },
            required: ["total_budget", "distribution"]
        },
        recommended_timing: { type: Type.STRING },
        strategy_summary: { type: Type.STRING },
        predicted_roi_multiplier: { type: Type.NUMBER }
    },
    required: ["recommended_curators", "budget_allocation", "recommended_timing", "strategy_summary", "predicted_roi_multiplier"]
};

export const runCampaignOptimization = async (formData: OptimizerFormData): Promise<OptimizerResponse> => {
    const prompt = `
        You are Soundchild Campaign Optimizer — an AI strategist trained on thousands of music submissions, curator outcomes, and engagement metrics.
        You analyze artist goals, track characteristics, and curator performance data to:
        - Predict curator fit scores
        - Suggest campaign budget allocation
        - Recommend submission timing and sequencing
        You optimize for the artist’s stated goal: playlist adds, feedback quality, or exposure.
        Keep reasoning explainable, data-driven, and output clean JSON.

        **INPUT DATA:**
        - Artist Name: ${formData.artist_name}
        - Track Title: ${formData.track_title}
        - Genre: ${formData.genre}
        - Mood: ${formData.mood}
        - Artist Goals: ${formData.goals}
        - Budget: ${formData.budget}
        - Available Curators: ${formData.curator_profiles || 'No specific curators provided; use general knowledge.'}
        - Past Campaign Results: ${formData.past_results || 'No past data provided.'}

        **TASKS:**
        1. Rank the top 5 curators by expected outcome (acceptance, stream uplift).
        2. Recommend how to distribute the total budget.
        3. Suggest optimal submission timing (day/time/week pattern).
        4. Summarize the campaign strategy and expected results.

        **OUTPUT FORMAT:**
        Return a single, valid JSON object matching the provided schema. Do not include any markdown formatting or commentary outside the JSON structure.
    `;
    return callGemini(prompt, optimizerSchema);
};

// --- TOOL: PITCH WRITER ---
const pitchWriterSchema = {
    type: Type.OBJECT,
    properties: {
        generated_pitch: { type: Type.STRING },
    },
    required: ["generated_pitch"]
};

export const runPitchWriter = async (formData: PitchWriterFormData): Promise<PitchWriterResponse> => {
    const prompt = `
        You are Soundchild AI, an expert A&R assistant. Your task is to write a concise, persuasive, and personalized pitch for a music submission.
        - The tone should be ${formData.pitch_tone}.
        - The pitch should be 2-3 sentences long.
        - Mention the track title, artist name, genre, and mood.
        - Address the curator by name.

        **INPUT DATA:**
        - Artist Name: ${formData.artist_name}
        - Track Title: ${formData.track_title}
        - Curator Name: ${formData.curator_name}
        - Genre: ${formData.genre}
        - Mood: ${formData.mood}

        **TASK:**
        Generate a 2-3 sentence pitch based on the data provided.

        **OUTPUT FORMAT:**
        Return a single, valid JSON object with a "generated_pitch" key.
    `;
    return callGemini(prompt, pitchWriterSchema);
};

// --- TOOL: SMART FOLLOW-UP ---
const followUpSchema = {
    type: Type.OBJECT,
    properties: {
        follow_up_suggestion: { type: Type.STRING },
        next_step_advice: { type: Type.STRING },
        suggested_timing: { type: Type.STRING }
    },
    required: ["follow_up_suggestion", "next_step_advice", "suggested_timing"]
};

export const runSmartFollowUp = async (formData: FollowUpFormData): Promise<FollowUpResponse> => {
    const prompt = `
        You are Soundchild's "Smart Follow-Up" assistant. You help artists respond to curator feedback constructively.
        Analyze the feedback and suggest a polite, professional response or a strategic next step. Do not be overly apologetic.
        Focus on building a relationship for the future.

        **INPUT DATA:**
        - Artist Name: ${formData.artist_name}
        - Track Title: ${formData.track_title}
        - Curator Name: ${formData.curator_name}
        - Artist's Original Goal: ${formData.original_goal}
        - Curator's Feedback: "${formData.curator_feedback}"

        **TASKS:**
        1. Generate a short, polite follow-up message to the curator (if appropriate). If no message is needed, state "No immediate response needed."
        2. Provide strategic advice for the artist's next step with this curator (e.g., "Incorporate feedback for a future submission," "This may not be the right fit, focus elsewhere").
        3. Suggest a timeline for re-engaging with this curator (e.g., "Wait for your next major release in 3-4 months").

        **OUTPUT FORMAT:**
        Return a single, valid JSON object matching the provided schema.
    `;
    return callGemini(prompt, followUpSchema);
};

// --- TOOL: SOUND NEIGHBORHOODS ---
const neighborhoodsSchema = {
    type: Type.OBJECT,
    properties: {
        similar_artists: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: { name: { type: Type.STRING }, reason: { type: Type.STRING } },
                required: ["name", "reason"]
            }
        },
        recommended_curators: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: { name: { type: Type.STRING }, reason: { type: Type.STRING } },
                required: ["name", "reason"]
            }
        },
        emerging_scene_description: { type: Type.STRING }
    },
    required: ["similar_artists", "recommended_curators", "emerging_scene_description"]
};

export const runSoundNeighborhoods = async (formData: NeighborhoodsFormData): Promise<NeighborhoodsResponse> => {
    const prompt = `
        You are Soundchild's "Discovery & Recommendation" engine. You analyze a track to place it within a "Sound Neighborhood."
        Your goal is to help artists discover similar artists for collaboration and new curators for promotion.

        **INPUT DATA:**
        - Artist Name: ${formData.artist_name}
        - Track Title: ${formData.track_title}
        - Genre: ${formData.genre}
        - Mood: ${formData.mood}

        **TASKS:**
        1. Identify 3-5 similar artists, explaining the sonic or thematic connection.
        2. Recommend 3-5 curators or playlists that champion this sound, explaining why they are a good fit.
        3. Provide a brief, one-paragraph description of the "emerging scene" or "sound neighborhood" this track belongs to.

        **OUTPUT FORMAT:**
        Return a single, valid JSON object matching the provided schema.
    `;
    return callGemini(prompt, neighborhoodsSchema);
};

// --- TOOL: SCOUTING ASSISTANT ---
const scoutingSchema = {
    type: Type.OBJECT,
    properties: {
        recommended_artists: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    genre: { type: Type.STRING },
                    location: { type: Type.STRING },
                    monthly_listeners: { type: Type.INTEGER },
                    reason_for_selection: { type: Type.STRING }
                },
                required: ["name", "genre", "location", "monthly_listeners", "reason_for_selection"]
            }
        },
        market_insight: { type: Type.STRING }
    },
    required: ["recommended_artists", "market_insight"]
};

export const runScoutingAssistant = async (formData: ScoutingFormData): Promise<ScoutingResponse> => {
    const prompt = `
        You are Soundchild's "A&R Scouting Assistant." You help label executives and A&R scouts discover unsigned talent.
        Analyze the provided criteria and generate a list of promising, unsigned artists. Fabricate realistic data for these artists.

        **INPUT CRITERIA:**
        - Target Genre: ${formData.genre}
        - Desired Mood: ${formData.mood}
        - Minimum Growth Velocity: ${formData.min_growth_velocity}% month-over-month
        - Maximum Monthly Listeners: ${formData.max_monthly_listeners}

        **TASKS:**
        1. Generate a list of 3-5 fictional, unsigned artists that match the criteria.
        2. For each artist, provide their name, genre, location, monthly listeners, and a compelling reason for why they are a good fit.
        3. Provide a brief, one-paragraph "market insight" summary about the current state of the specified genre/mood combination.

        **OUTPUT FORMAT:**
        Return a single, valid JSON object matching the provided schema. Do not include any markdown formatting.
    `;
    return callGemini(prompt, scoutingSchema);
};


// --- TOOL: A/B TEST REMIX ---
const remixABTestSchema = {
    type: Type.OBJECT,
    properties: {
        predicted_winner: { type: Type.STRING, enum: ["Version A", "Version B", "Inconclusive"] },
        winner_reasoning: { type: Type.STRING },
        recommendations_for_a: { type: Type.STRING },
        recommendations_for_b: { type: Type.STRING }
    },
    required: ["predicted_winner", "winner_reasoning", "recommendations_for_a", "recommendations_for_b"]
};

export const runRemixABTest = async (formData: RemixABTestFormData): Promise<RemixABTestResponse> => {
    const prompt = `
        You are Soundchild's "AI Remix Feedback" tool. You predict which version of a song will perform better with a target audience.
        Analyze the two descriptions and provide a data-driven recommendation.

        **INPUT DATA:**
        - Track Title: ${formData.track_title}
        - Target Audience: ${formData.target_audience}
        - Version A Description: "${formData.version_a_description}"
        - Version B Description: "${formData.version_b_description}"

        **TASKS:**
        1. Predict which version ("Version A" or "Version B") is more likely to succeed. If it's too close to call, select "Inconclusive".
        2. Provide a clear, one-sentence reasoning for your prediction, focusing on audience alignment.
        3. Give a concise recommendation for improving Version A.
        4. Give a concise recommendation for improving Version B.

        **OUTPUT FORMAT:**
        Return a single, valid JSON object matching the provided schema.
    `;
    return callGemini(prompt, remixABTestSchema);
};

// --- TOOL: FEEDBACK SYNTHESIZER ---
const feedbackSynthesizerSchema = {
    type: Type.OBJECT,
    properties: {
        overall_verdict: { type: Type.STRING },
        key_strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        common_criticisms: { type: Type.ARRAY, items: { type: Type.STRING } },
        actionable_next_steps: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["overall_verdict", "key_strengths", "common_criticisms", "actionable_next_steps"]
};

export const runFeedbackSynthesizer = async (formData: FeedbackSynthesizerFormData): Promise<FeedbackSynthesizerResponse> => {
    const prompt = `
        You are Soundchild's "Feedback Synthesizer." You create a consolidated "Artist Report Card" from multiple curator reviews.
        Analyze the provided feedback, identify patterns, and summarize the key takeaways.

        **INPUT DATA:**
        - Track Title: ${formData.track_title}
        - Curator Feedbacks (JSON Array): ${formData.curator_feedbacks}

        **TASKS:**
        1. Provide a one-sentence "Overall Verdict" based on the general sentiment of the feedback.
        2. List the 2-3 most frequently mentioned "Key Strengths".
        3. List the 2-3 most frequently mentioned "Common Criticisms".
        4. Suggest 2-3 "Actionable Next Steps" for the artist based on the feedback.

        **OUTPUT FORMAT:**
        Return a single, valid JSON object matching the provided schema.
    `;
    return callGemini(prompt, feedbackSynthesizerSchema);
};

// --- TOOL: LYRIC ANALYZER ---
const lyricAnalyzerSchema = {
    type: Type.OBJECT,
    properties: {
        key_themes: { type: Type.ARRAY, items: { type: Type.STRING } },
        emotional_arc: { type: Type.STRING },
        suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ["key_themes", "emotional_arc", "suggestions"]
};
export const runLyricAnalyzer = async (formData: LyricAnalyzerFormData): Promise<LyricAnalyzerResponse> => {
    const prompt = `
        You are a literary analyst and expert songwriter. Analyze the following lyrics for thematic depth, storytelling, emotional arc, and rhyme schemes. Provide constructive feedback.

        **INPUT LYRICS:**
        ${formData.lyrics}

        **TASKS:**
        1. Identify the key themes present in the lyrics.
        2. Describe the emotional arc of the song from beginning to end.
        3. Provide 2-3 actionable suggestions for strengthening the lyrics.

        **OUTPUT FORMAT:**
        Return a single, valid JSON object matching the provided schema.
    `;
    return callGemini(prompt, lyricAnalyzerSchema);
};

// --- TOOL: PLAYLIST ASSISTANT ---
const playlistAssistantSchema = {
    type: Type.OBJECT,
    properties: {
        playlist_name: { type: Type.STRING },
        playlist_description: { type: Type.STRING },
        track_sequence: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    artist: { type: Type.STRING }
                },
                required: ["title", "artist"]
            }
        },
    },
    required: ["playlist_name", "playlist_description", "track_sequence"]
};
export const runPlaylistAssistant = async (formData: PlaylistAssistantFormData): Promise<PlaylistAssistantResponse> => {
    const prompt = `
        You are a master playlist curator. Your task is to create a compelling playlist from a list of available tracks.
        
        **INPUT DATA:**
        - Desired Mood: ${formData.mood}
        - Seed Tracks (for inspiration): ${formData.seed_tracks}
        - Available Tracks (JSON): ${JSON.stringify(formData.curator_tracks)}

        **TASKS:**
        1. Generate a creative and fitting name for the playlist.
        2. Write a short, engaging description for the playlist.
        3. Select and sequence at least 5-10 tracks from the available list to create a cohesive listening experience that matches the desired mood. The sequence should have a logical flow (e.g., build energy, cool down).

        **OUTPUT FORMAT:**
        Return a single, valid JSON object matching the provided schema.
    `;
    return callGemini(prompt, playlistAssistantSchema);
};

// --- TOOL: AUDIENCE PERSONA GENERATOR ---
const personaGeneratorSchema = {
    type: Type.OBJECT,
    properties: {
        personas: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    demographics: { type: Type.STRING },
                    listening_habits: { type: Type.STRING },
                    other_interests: { type: Type.STRING }
                },
                required: ["name", "demographics", "listening_habits", "other_interests"]
            }
        }
    },
    required: ["personas"]
};
export const runPersonaGenerator = async (formData: PersonaGeneratorFormData): Promise<PersonaGeneratorResponse> => {
    const prompt = `
        You are a market research expert specializing in music audiences. Based on the following curator profile data, generate 2-3 detailed listener personas.
        
        **INPUT DATA:**
        - Curator's Genres: ${formData.curator_genres.join(', ')}
        - Sample of Accepted Tracks (JSON): ${JSON.stringify(formData.curator_accepted_tracks)}

        **TASKS:**
        1. Create 2-3 distinct, fictional listener personas.
        2. For each persona, provide a name, likely demographics (age, location, occupation), listening habits (when/where they listen), and other interests (hobbies, media).

        **OUTPUT FORMAT:**
        Return a single, valid JSON object matching the provided schema.
    `;
    return callGemini(prompt, personaGeneratorSchema);
};

// --- TOOL: MARKET ANALYSIS (w/ Google Search) ---
export const runMarketAnalysis = async (formData: MarketAnalysisFormData): Promise<MarketAnalysisResponse> => {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `You are a market analyst for the music industry. Analyze the market for ${formData.genre} in ${formData.location}. Synthesize information on key radio stations, popular venues, competing local artists, and current online discussion. Structure your response in markdown with the following sections: '### Market Overview', '### Key Opportunities', '### Potential Risks', and '### Relevant Media & Venues'.`,
            config: {
                tools: [{googleSearch: {}}],
            },
        });
        
        const analysis_text = response.text;
        const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources = rawChunks
            .map(chunk => chunk.web)
            .filter(web => web && web.uri)
            .map(web => ({ uri: web.uri, title: web.title || 'Untitled Source' }));

        return { analysis_text, sources };

    } catch (error) {
        console.error("Error calling Gemini API for market analysis:", error);
        throw new Error("Failed to get market analysis from AI.");
    }
};

// --- TOOL: DEAL MEMO DRAFTER ---
const dealMemoSchema = {
    type: Type.OBJECT,
    properties: {
        memo_text: { type: Type.STRING }
    },
    required: ["memo_text"]
};
export const runDealMemo = async (formData: DealMemoFormData): Promise<DealMemoResponse> => {
    const prompt = `
        You are an A&R assistant. Your task is to draft a friendly, non-binding introductory deal memo for an artist.
        This is NOT a legal document, but a starting point for discussion. Emphasize clarity and a positive tone.

        **INPUT DATA:**
        - Artist Name: ${formData.artist_name}
        - Deal Type: ${formData.deal_type.replace(/_/g, ' ')}
        - Key Terms to Include: ${formData.key_terms}

        **TASK:**
        Generate a clear, well-structured memo outlining the provided terms. Start with a friendly introduction and end with a disclaimer that this is not a formal contract.

        **OUTPUT FORMAT:**
        Return a single, valid JSON object with a "memo_text" key.
    `;
    return callGemini(prompt, dealMemoSchema);
}


// --- GENERIC API CALLER ---

async function callGemini<T>(prompt: string, schema: object): Promise<T> {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.7,
            },
        });

        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText);
        return parsedData as T;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof SyntaxError) {
            console.error("Failed to parse JSON response from API.");
        }
        throw new Error("Failed to get analysis from AI. The response may be malformed.");
    }
}