import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, email, password,stdclass } = await req.json();

    // No bcrypt hashing – directly saving plain password (not secure) to ssave time for now
    // In production, you should hash the password before saving it
    console.log("Received data:", { name, email, password, stdclass });
    const result = await prisma.user.create({
      data: {
        name,
        email,
        password,
        
        // Save the stdclass field to the database
      },
    });

    return new Response(JSON.stringify("User created successfully!!!"), { status: 201 });
  } catch (err) {
    console.error("Database Error:", err);
    return new Response("Something went wrong", { status: 500 });
  }
}
