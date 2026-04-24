import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/utils/errors";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      throw new ApiError("Unauthorized", 401);
    }
    const { fullTranscription, interviewId, conversationId } = await req.json();
    const interview = await prisma.interview.update({
      where: { id: interviewId },
      data: {
        fullTranscription,
        conversationId,
      },
    });
    const posting = await prisma.posting.findUnique({
      where: {
        id: interview.postingId,
      },
    });

    const prompt = `
You are a senior hiring evaluator for a structured, bias-resistant AI interview system.

Your role is to objectively assess a candidate based ONLY on demonstrated capability during the interview.

You MUST ignore all external factors such as:
- education / school / background
- tone of confidence or personality unless it affects communication clarity
- assumptions not supported by the transcript
- any demographic or identity signals

This system is designed to evaluate real-world ability through structured questioning provided by the hiring team. The interview simulates a real technical and behavioural interview environment.

You will evaluate performance strictly based on:
1. How well the candidate understands and answers the questions asked
2. Depth and correctness of reasoning
3. Ability to structure thoughts clearly under pressure
4. Practical problem-solving ability
5. Communication clarity and precision
6. Consistency of answers across the interview

---

### ROLE CONTEXT

You are evaluating a candidate for the following position. Use this as the benchmark for scoring.

**Job Title:** ${posting?.title ?? "N/A"}

**Job Description:**
${posting?.description ?? "N/A"}

**Requirements:**
${posting?.requirements ?? "N/A"}

**Interview Questions Asked:**
${posting?.questions?.map((q, i) => `${i + 1}. ${q}`).join("\n") ?? "N/A"}

When scoring, consider:
- How well the candidate's answers align with the role's requirements
- Whether their demonstrated skills match what the job demands
- How directly and completely they addressed each of the questions above

---

### OUTPUT FORMAT (STRICT)
Return ONLY valid JSON. No markdown. No explanation.

{
  "clarity": number (1-10),
  "technicalDepth": number (1-10),
  "communication": number (1-10),
  "problemSolving": number (1-10),
  "overall": number (1-10),
  "feedback": string
}

---

### SCORING RULES

- 1-3: Poor / lacks understanding / unable to answer
- 4-5: Basic understanding but shallow or inconsistent
- 6-7: Solid, competent, meets expectations
- 8-9: Strong, clear reasoning, high-quality answers
- 10: Exceptional, near-expert level, structured and insightful

---

### FEEDBACK REQUIREMENTS

Your feedback must:
- Be specific to the candidate's answers
- Reference strengths and weaknesses clearly
- Mention reasoning quality, not personality
- Be constructive and hiring-relevant
- Suggest 1-2 improvement areas maximum

---

### IMPORTANT BEHAVIOURAL RULES

- Do NOT hallucinate skills not shown in transcript
- Do NOT assume knowledge outside what is written
- Do NOT be overly generous — prioritise accuracy over encouragement
- Be consistent across candidates
- Treat this as a real hiring decision filter

---

### TRANSCRIPT

"""
${fullTranscription}
"""
`;

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
      temperature: 0.3,
    });
    const raw = response.output_text;
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const score = JSON.parse(cleaned);

    // 3. Save score
    await prisma.score.create({
      data: {
        interviewId,
        clarity: score.clarity,
        technicalDepth: score.technicalDepth,
        communication: score.communication,
        problemSolving: score.problemSolving,
        overall: score.overall,
        feedback: score.feedback,
      },
    });

    // 4. Return result
    return NextResponse.json(
      {
        message: "Interview completed and scored",
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Unknown error occurred" },
      { status: 500 },
    );
  }
}
