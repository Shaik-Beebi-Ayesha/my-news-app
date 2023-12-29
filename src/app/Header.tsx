"use client";
import Link from "next/link";
import NavLinks from "./NavLinks";
import Search from "./Search";
import './global.css'
import { auth,db } from "./firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useEffect ,useState} from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "./redux/hooks/useAppSelector";
import { useDispatch } from "react-redux";
import { setIsLoggedIn ,setFavItems } from "./redux/authSlice";
import PublicIcon from '@mui/icons-material/Public';
import FavoriteIcon from "@mui/icons-material/Favorite";


interface Article {
  id: string; 
  author: string;
  content: string;
  description: string;
  publishedAt: string;
  title: string;
  url: string;
  urlToImage: string;
  isFavorite?: boolean;
}

const Header = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const userName = useAppSelector((state) => state.auth.userName);
  const router = useRouter();
  const Login = () => {
    router.push(`/login`);
  };

  const [loggedOut,setLoggedOut] = useState(false);
  const [cancel,setCancel] = useState(false);
  const LogOut = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          isLoggedIn: false,
        });
      }
      await signOut(auth);
      dispatch(setIsLoggedIn(false));
      dispatch(setFavItems([]));
      setLoggedOut(true);
    } catch (error:any) {
      alert(error.message);
    }
  };
  const Signup = () => {
    router.push(`/signup`);
  };

  const Favorites = () => {
    router.push(`/fav`);
  };
  const favItems = useAppSelector((state) => state.auth.favItems);
  const [favArticles, setFavArticles] = useState<Article[]>([]);
  useEffect(() => {
    
    const fetchNews = async () => {
      try {
        setFavArticles(favItems);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  
}, [favItems]);

  return (
    <>
      <div className="bg-[url('https://motionarray.imgix.net/preview-195598-wSPLWjfONB-high_0000.jpg?w=660&q=60&fit=max&auto=format')] px-4 h-16 flex items-center justify-between sticky top-0 z-10 w-full">
      
        <Link href="/" prefetch={false}>
          <h1 className="text-white italic text-2xl md:text-3xl font-extrabold flex items-center">
            <PublicIcon className=""  style={{fontSize:35}}/><span>AY NEWS</span>
          </h1>
        </Link>

        <div className="flex items-center gap-2">
          <div className="hidden md:block"><Search /></div>
          {isLoggedIn ? <p className="font-bold text-base text-blue-300">Hii {userName.toUpperCase()}</p> : <p></p>}
          {!isLoggedIn ? (
            <span className="font-semibold">
              <button
                className="bg-gradient-to-r from-blue-900 to-red-500 text-white px-3 py-1 text-base rounded-md font-semibold focus:ring ring-black ring-opacity-10 gradient element-to-rotate"
                onClick={Login}
              >
                Log In
              </button>
            </span>
          ) : (
            <span className="font-semibold">
              <button
                className="bg-gradient-to-r from-blue-900 to-red-500 text-white px-3 py-1 text-base rounded-md font-semibold focus:ring ring-black ring-opacity-10 gradient element-to-rotate"
                onClick={LogOut}
              >
                Log Out
              </button>
            </span>
          )}

          {
            !isLoggedIn && (
              <span className="font-semibold">
            <button
              className="bg-gradient-to-r from-blue-900 to-red-500 text-white px-3 py-1 text-base rounded-md font-semibold focus:ring ring-black ring-opacity-10 gradient element-to-rotate"
              onClick={Signup}
            >
              Sign Up
            </button>
          </span>
            )
          }
          {
            isLoggedIn && (
              <>
              <span className="font-semibold">
            <button
              
              onClick={Favorites}
            >
              <FavoriteIcon style={{fontSize:45 , color:'red'}}/>
            </button>
          </span>
              <div className="font-bold text-base bg-blue-300 text-blue-950 px-2 relative bottom-4 right-5 rounded-full">{favArticles?.length || 0}</div>
              </>
            )
          }
        </div>
      </div>
      
      <hr className="border-blue-900 border-[1px]" />
      <NavLinks />
      {
        loggedOut && (
          <div className={cancel ? "hidden" : "float-right mx-3 block"}>
    <div className="bg-red-200 text-red-800 px-5 py-3 border-[1px] border-red-700 flex gap-4 rounded-md">
      <p className="text-sm font-semibold text-red-800">You have been successfully logged out.</p>
      <span onClick={()=>setCancel(true)} className="rounded-full px-2 py-0 bg-red-700 text-white font-bold text-base cursor-pointer">X</span>
    </div>
</div>
        )
      }
      <hr className="border-blue-900 border-[1px]" />
      
    </>
  );
};

export default Header;
