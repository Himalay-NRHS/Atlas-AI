import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/db";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }
        
        // Find the user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
       
        if (!user) {
          throw new Error("Invalid email or password");
        }
        
        // Removed bcrypt - using a simple string equality check
        if (credentials.password !== user.password) {
          throw new Error("Invalid credentials");
        }
       
        // Return user object; convert id to string if needed
        return { ...user, id: user.id.toString() };
      }
    }),
  ],
});

export { handler as GET, handler as POST };
