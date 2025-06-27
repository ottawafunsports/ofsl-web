import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

interface InviteRequest {
  email: string
  teamName: string
  leagueName: string
  captainName: string
}

serve(async (req: Request) => {
  try {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      })
    }

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    const { email, teamName, leagueName, captainName }: InviteRequest = await req.json()

    if (!email || !teamName || !leagueName || !captainName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    // Create the invite email content
    const inviteUrl = `${Deno.env.get("SITE_URL") || "https://ofsl.ca"}/signup?invite=true`
    
    const emailContent = {
      to: [email],
      subject: `You've been invited to join ${teamName} in OFSL!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(90deg, #B20000 0%, #781212 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Ottawa Fun Sports League</h1>
          </div>
          
          <div style="padding: 30px; background: #ffffff;">
            <h2 style="color: #6F6F6F; margin-bottom: 20px;">You've been invited to join a team!</h2>
            
            <p style="color: #6F6F6F; font-size: 16px; line-height: 1.5;">
              Hi there!
            </p>
            
            <p style="color: #6F6F6F; font-size: 16px; line-height: 1.5;">
              <strong>${captainName}</strong> has invited you to join their team <strong>${teamName}</strong> 
              in the <strong>${leagueName}</strong> league.
            </p>
            
            <p style="color: #6F6F6F; font-size: 16px; line-height: 1.5;">
              To accept this invitation and join the team, you'll need to create an account with OFSL.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${inviteUrl}" 
                 style="background: #B20000; color: white; padding: 12px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">
                Create Account & Join Team
              </a>
            </div>
            
            <p style="color: #6F6F6F; font-size: 14px; line-height: 1.5;">
              About OFSL: We're Ottawa's premier adult sports league, offering volleyball, badminton, and more. 
              Our leagues provide structured environments that encourage sportsmanship, physical activity, and healthy competition.
            </p>
            
            <p style="color: #6F6F6F; font-size: 14px; line-height: 1.5;">
              If you have any questions, feel free to contact us at 
              <a href="mailto:info@ofsl.ca" style="color: #B20000;">info@ofsl.ca</a>
            </p>
          </div>
          
          <div style="background: #f8f8f8; padding: 20px; text-align: center; color: #6F6F6F; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Ottawa Fun Sports League. All rights reserved.</p>
            <p>This invitation was sent by ${captainName} on behalf of ${teamName}.</p>
          </div>
        </div>
      `
    }

    // Send email using Resend API
    const resendApiKey = Deno.env.get("RESEND_API_KEY")
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not found")
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "OFSL <noreply@ofsl.ca>",
        ...emailContent
      })
    })

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text()
      console.error("Resend API error:", errorText)
      return new Response(
        JSON.stringify({ error: "Failed to send invite email" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    const emailResult = await emailResponse.json()
    console.log("Email sent successfully:", emailResult)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Invite email sent successfully",
        emailId: emailResult.id 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )

  } catch (error) {
    console.error("Error in send-invite function:", error)
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
  }
})