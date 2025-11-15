
import { GoogleGenAI, Type } from "@google/genai";
import type { RouteOption, RoutePreference } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const routeSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      mode: { 
        type: Type.STRING,
        description: "The mode of transport. Options: 'Walking', 'Cycling', 'Public Transport', 'Driving', 'Multi-modal'.",
        enum: ['Walking', 'Cycling', 'Public Transport', 'Driving', 'Multi-modal']
      },
      duration: {
        type: Type.STRING,
        description: "Estimated travel time, e.g., '25 mins'."
      },
      distance: {
        type: Type.STRING,
        description: "Total distance of the route, e.g., '5.2 km'."
      },
      carbonFootprint: {
        type: Type.NUMBER,
        description: "Estimated carbon footprint in grams of CO2 equivalent (CO2e). Example: 0 for walking, 25 for cycling, 150 for public transport, 1200 for driving."
      },
      description: {
        type: Type.STRING,
        description: "A brief, compelling description of the route and its benefits. e.g., 'A refreshing walk through the park, perfect for a sunny day.'"
      },
      steps: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING
        },
        description: "A list of key steps or segments for the journey. For multi-modal, list the different parts of the journey. e.g., ['Walk to Central Station', 'Take the metro Line 2 to North Gate', 'Walk to destination']"
      },
    },
    required: ["mode", "duration", "distance", "carbonFootprint", "description", "steps"]
  }
};

export const getEcoFriendlyRoutes = async (start: string, destination: string, preference: RoutePreference): Promise<RouteOption[]> => {
  const prompt = `
    As an expert eco-friendly route planner, provide a set of travel options from "${start}" to "${destination}".
    The user's primary preference is the "${preference}" route.
    
    Please provide at least 4 diverse options, including:
    1. A walking route.
    2. A cycling route.
    3. A public transport route (e.g., metro, bus).
    4. A multi-modal route combining options (e.g., walk + metro).
    5. If significantly faster, also include a driving route for comparison but emphasize its higher carbon footprint.
    
    For each route, provide the mode, duration, distance, a realistic carbon footprint estimation in grams of CO2e, a short description, and key steps.
    Base your estimates on typical urban travel. For example, walking and cycling have 0 CO2e. A typical bus/metro ride might be 50-100g/km, while a car might be 200-250g/km.
    
    Return the response as a JSON array that strictly adheres to the provided schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: routeSchema,
      },
    });

    const jsonText = response.text;
    const routes = JSON.parse(jsonText);

    if (!Array.isArray(routes)) {
        throw new Error("API did not return a valid array of routes.");
    }
    
    return routes as RouteOption[];

  } catch (error) {
    console.error("Error fetching or parsing routes from Gemini API:", error);
    throw new Error("Failed to generate routes. The API may be unavailable or the response was malformed.");
  }
};
