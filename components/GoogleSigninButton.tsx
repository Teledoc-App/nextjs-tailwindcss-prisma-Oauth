import React, { FC, ReactNode } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
interface GoogleSignInButtonProps {
  children: ReactNode;
}

const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({ children }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const userId = session?.user?.id;
  const userRole = session?.user?.role;
  let callbackUrl = `/profile/patient/${userId}`;

  if (userRole === "doctor") {
    callbackUrl = `/profile/doctor/${userId}`;
  } else if (userRole !== "patient") {
    console.error("Invalid user role:", userRole);
    //return;
  }
  const loginWithGoogle = async () => {
    const signInData = await signIn("google", {
      callbackUrl: callbackUrl,
    });

    if (signInData?.error) {
      console.error(signInData.error);
    } else {
      return router.push(callbackUrl);
    }
  };

  return (
    <button
      type="button"
      onClick={loginWithGoogle}
      className="bg-[#d9d9d9]/30 border border-[#d9d9d9] text-gray-500 rounded-lg w-full h-[60px] font-semibold relative"
    >
      {children}
    </button>
  );
};

export default GoogleSignInButton;
