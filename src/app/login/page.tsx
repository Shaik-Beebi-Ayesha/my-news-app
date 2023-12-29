"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../redux/hooks/useAppSelector";
import {
  setFavItems,
  setIsLoggedIn,
  setUserName,
  setUid,
} from "../redux/authSlice";

// type User = {
//   uid: string;
// };

function SignInForm() {
  const dispatch = useDispatch();
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const userName = useAppSelector((state) => state.auth.userName);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const handleSignup = () => {
    router.push(`/signup`);
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        dispatch(setIsLoggedIn(true));
        dispatch(setUserName(docSnap.data().username || ""));
        dispatch(setUid(docSnap.data().uid));
        dispatch(setFavItems(docSnap.data().favItems));
      } else {
        console.log("No such document!");
      }
      await updateDoc(doc(db, "users", user.uid), {
        isLoggedIn: true,
      });
      router.push(`/`);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleReset = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        router.push("/login");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <>
      <div className="overflow-hidden">
        <div
          className="relative z-[9] h-screen bg-[url('https://img.freepik.com/free-vector/global-technology-earth-news-bulletin-background_1017-33687.jpg')]
bg-cover after:absolute after:left-0 after: top-0 after:z-[-1]
after:h-screen after:w-full after:bg-[#00000057] after:content-
['']"
        >
          <div
            className="mx-auto flex h-full flex-1 items-center
justify-center"
          >
            <div className="w-[450px] max-w-lg">
              <div className="">
                <div
                  className="m-4 rounded-xl bg-white bg-opacity-20 p-10
shadow-xl"
                >
                  <h1 className="text-4xl font-titleFont font-bold mb-5 text-blue-300 text-center">
                    Login
                  </h1>

                  {error && (
                    <div className="w-[100%] rounded-md bg-blue-200 text-blue-900 font-semibold flex items-center justify-center py-10 px-2 text-sm">
                      {error}
                    </div>
                  )}
                  <div className="my-2">
                    <label className="text-sm text-white font-semibold">
                      Email
                    </label>
                  </div>
                  <div className="flex justify-center">
                    <input
                      type="email"
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-[100%] text-white outline-none focus:border-blue-300 focus:border-[3px] px-3 py-1 border-[1px] rounded-md placeholder:text-xs bg-transparent"
                    />
                  </div>
                  <div className="my-2">
                    <label className="text-sm text-white font-semibold">
                      Password
                    </label>
                  </div>
                  <div className="flex justify-center">
                    <input
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className=" text-white w-[100%] outline-none focus:border-blue-300 focus:border-[3px] px-3 py-1 border-[1px] rounded-md placeholder:text-xs bg-transparent"
                    />
                  </div>
                  <div className="my-5">
                    <button
                      onClick={handleLogin}
                      className="bg-blue-300 text-blue-800 font-bold text-base w-[100%] p-1 rounded-md  hover:cursor-pointer hover:bg-blue-200 "
                    >
                      Log In
                    </button>
                  </div>
                  <hr />

                  <div className="my-5">
                    <p className="text-sm mb-4 text-white">
                      Forgot Password ?{" "}
                      <span
                        className="text-blue-300 hover:underline font-semibold"
                        onClick={handleReset}
                      >
                        Click Here
                      </span>
                    </p>
                    <p className="text-sm text-white mb-4">
                      Don't have an account?{" "}
                      <span
                        className="text-blue-300 hover:underline font-semibold"
                        onClick={handleSignup}
                      >
                        SignUp
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignInForm;
