import { NextRequest } from "next/server";
import { runtime } from "@/lib/copilotkit-runtime";

export async function POST(req: NextRequest) {
  try {
    const { method, url, headers, body } = req;
    
    // Create a mock request object for CopilotKit
    const mockReq = {
      method,
      url: url.toString(),
      headers: Object.fromEntries(headers.entries()),
      body: await req.text()
    };
    
    // Handle the CopilotKit request
    const response = await runtime.response(mockReq as any);
    
    return new Response(response.body, {
      status: response.status,
      headers: response.headers
    });
  } catch (error) {
    console.error("CopilotKit API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function GET() {
  return new Response(JSON.stringify({ 
    message: "CopilotKit API is running",
    status: "ok" 
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
