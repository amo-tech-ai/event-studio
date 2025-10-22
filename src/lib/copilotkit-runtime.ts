import { CopilotRuntime, OpenAIAdapter } from "@copilotkit/react-core";

// Create CopilotKit runtime with OpenAI adapter
export const runtime = new CopilotRuntime({
  actions: [
    {
      name: "createEvent",
      description: "Create a new event with the provided details",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "The name of the event"
          },
          date: {
            type: "string", 
            description: "The date of the event"
          },
          location: {
            type: "string",
            description: "The location of the event"
          },
          capacity: {
            type: "number",
            description: "The maximum number of attendees"
          },
          description: {
            type: "string",
            description: "A description of the event"
          }
        },
        required: ["name", "date", "location"]
      },
      handler: async ({ name, date, location, capacity, description }) => {
        console.log("Creating event:", { name, date, location, capacity, description });
        
        // Here you would typically save to your database
        // For now, we'll just return the event data
        return {
          success: true,
          event: {
            id: Date.now().toString(),
            name,
            date,
            location,
            capacity: capacity || 100,
            description: description || "No description provided"
          }
        };
      }
    },
    {
      name: "updateEvent",
      description: "Update an existing event",
      parameters: {
        type: "object",
        properties: {
          eventId: {
            type: "string",
            description: "The ID of the event to update"
          },
          updates: {
            type: "object",
            description: "The fields to update"
          }
        },
        required: ["eventId", "updates"]
      },
      handler: async ({ eventId, updates }) => {
        console.log("Updating event:", eventId, updates);
        return { success: true, eventId, updates };
      }
    },
    {
      name: "searchVenues",
      description: "Search for venues based on criteria",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city or area to search in"
          },
          capacity: {
            type: "number",
            description: "Minimum capacity required"
          },
          budget: {
            type: "number",
            description: "Maximum budget for the venue"
          }
        },
        required: ["location"]
      },
      handler: async ({ location, capacity, budget }) => {
        console.log("Searching venues:", { location, capacity, budget });
        
        // Mock venue data - in real app, this would query a venue database
        const mockVenues = [
          {
            id: "1",
            name: "Convention Center Downtown",
            location: location,
            capacity: capacity || 500,
            price: budget ? Math.min(budget, 5000) : 3000,
            amenities: ["Parking", "Catering", "AV Equipment"]
          },
          {
            id: "2", 
            name: "Grand Hotel Ballroom",
            location: location,
            capacity: capacity || 300,
            price: budget ? Math.min(budget, 4000) : 2500,
            amenities: ["Catering", "Parking", "WiFi"]
          }
        ];
        
        return {
          success: true,
          venues: mockVenues
        };
      }
    }
  ],
  // Use OpenAI adapter - you'll need to set OPENAI_API_KEY in your environment
  adapter: new OpenAIAdapter({
    model: "gpt-4",
    apiKey: process.env.OPENAI_API_KEY || "your-openai-api-key-here"
  })
});
