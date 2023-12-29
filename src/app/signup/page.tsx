"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth,db } from '../firebaseConfig';
import {doc,setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword , updateProfile } from 'firebase/auth';


function SignUpForm() {
  const[userName,setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');

  const router = useRouter();
  const handleLogin = () => {
    router.push(`/login`);
};
const [error, setError] = useState("")

const handleSignup = async ()=>{
    if(email && userName && password===confirmpassword){
      await createUserWithEmailAndPassword(auth,email,password).then(async(userCredential)=>{
        const user = userCredential.user;
        await setDoc(doc(db, "users",user.uid), {
          isLoggedIn: false,
          username: userName, 
          favItems: [],
          uid : user.uid
        });
        updateProfile(user, {
          displayName: userName,
        });
        setEmail("");
        setPassword("");
        router.push(`/login`);
      })
      .catch((error)=>{
        setError(error.message);
      })
    }
    else{
      setError("Passwords didn't match !")
    }
  }

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
                  className="mx-4 rounded-xl bg-white bg-opacity-20 px-10 py-14
shadow-xl"
                >
                  <h1 className="text-4xl font-titleFont font-bold mb-5 text-blue-300 text-center">
                    Signup
                  </h1>

                  {error && (
                    <div className="w-[100%] rounded-md bg-blue-200 text-blue-900 font-semibold flex items-center justify-center py-10 px-2 text-sm">
                      {error}
                    </div>
                  )}
                  <div className="my-2">
                    <label className="text-sm text-white font-semibold">
                      Your Name
                    </label>
                  </div>
                  <div className="flex justify-center">
                    <input
                      type="email"
                      onChange={(e) => setName(e.target.value)}
                      className="w-[100%] text-white outline-none focus:border-blue-300 focus:border-[3px] px-3 py-1 border-[1px] rounded-md placeholder:text-xs bg-transparent"
                    />
                  </div>
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
                      className="w-[100%]  text-white outline-none focus:border-blue-300 focus:border-[3px] px-3 py-1 border-[1px] rounded-md placeholder:text-xs bg-transparent"
                    />
                  </div>
                  <div className="my-2">
                    <label className="text-sm text-white font-semibold">
                      Confirm Password
                    </label>
                  </div>
                  <div className="flex justify-center">
                    <input
                      type="password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-[100%] text-white outline-none focus:border-blue-300 focus:border-[3px] px-3 py-1 border-[1px] rounded-md placeholder:text-xs bg-transparent"
                    />
                  </div>
                  <div className="my-5">
                    <button
                      onClick={handleSignup}
                      className="bg-blue-300 text-blue-800 font-bold text-base w-[100%] p-1 rounded-md  hover:cursor-pointer hover:bg-blue-200 "
                    >
                     Create Account
                    </button>
                  </div>
                  <hr/>
                  <p className='text-sm text-white text-center mt-3'>Already have an account ? <span className='text-blue-300 font-semibold hover:underline' onClick={handleLogin}>LogIn</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUpForm;
