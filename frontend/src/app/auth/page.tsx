import { AuthCard } from "@/feature/auth/components/auth-card";

export default function AuthPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-5"
      style={{
        backgroundColor: "#F9FAFB",
        backgroundImage: [
          "radial-gradient(at 50% 0%, hsla(225,39%,30%,0.05) 0, hsla(225,39%,30%,0) 50%)",
          "radial-gradient(at 100% 0%, hsla(339,49%,30%,0.04) 0, hsla(339,49%,30%,0) 50%)",
        ].join(", "),
      }}
    >
      <AuthCard />
    </div>
  );
}
