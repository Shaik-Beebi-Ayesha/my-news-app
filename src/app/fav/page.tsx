"use client"
import Header from "../Header"
import { useRouter } from 'next/navigation';
import { useAppSelector } from "../redux/hooks/useAppSelector";
import { useEffect,useState } from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Pagination from "../pagination";
import { useDispatch } from 'react-redux';
import { addFavItem,removeFavItem } from '@/app/redux/authSlice';
import { useMediaQuery } from "@mui/material";
import { Article } from '@/app/ArticleInterface';

function page() {
  const [allArticles, setArticles] = useState<Article[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const isMobileOrTablet = useMediaQuery('(max-width: 768px)');
  const articlesPerPage = isMobileOrTablet ? 25 : 12;
  

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = allArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  const favItems = useAppSelector((state) => state.auth.favItems);
  useEffect(() => {
    
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        setArticles(favItems);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setIsLoading(false);
      }
    };

    fetchNews();
  
}, [favItems]);

const router = useRouter();

const handleViewArticle = (articleId: string): void => {
  const articleToView = allArticles.find((article) => article.id === articleId);
  if (articleToView) {
    router.push(`/fullArticle/${articleToView.id}`);
  }
};


const dispatch = useDispatch();

const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
const handleAddToFavorites = (articleId: string,isFavorite?:boolean): void => {
  if(isLoggedIn){
    setArticles((prevArticles) =>
    prevArticles.map((article) =>
      article.id === articleId
        ? { ...article, isFavorite: !article.isFavorite }
        : article
    )
  );
  if (isFavorite) {
    dispatch(removeFavItem(articleId)); 
  } else {
    const articleToAdd = allArticles.find((article) => article.id === articleId);
    if (articleToAdd) {
      dispatch(addFavItem(articleToAdd)); 
    }
  }
  }
  else{
    router.push(`/login`);
  }
};

const isGridView = useAppSelector((state) => state.auth.isGridView);

  return (
    <div>
        <Header/>
        <div >
          {
            allArticles?.length==0 && (
              <div className="grid place-items-center md:flex md:justify-center md:items-center w-screen h-[400px]">
                <p className="text-2xl font-bold text-gray-500 mx-10 md:mx-0 text-center">Uh-oh! No Favorite Articles Yet.</p>
                <img className='w-[200px] h-[200px]' src='https://media.istockphoto.com/id/1018127028/vector/sorry.jpg?s=612x612&w=0&k=20&c=Ghc4Qgtbg1V-dreFXiGGT5haoq3Cwo6Kw6qpv2ibwRg='/>
              </div>
            )
          }
      <ul className={isGridView ? 'flex flex-wrap justify-around my-5' : 'flex flex-col justify-around my-5'}>
        {currentArticles.map((article) => (
          <li key={article.id}  className={isGridView ? 'cursor-pointer border-[1px] my-5 w-[85%] md:w-[45%] lg:w-[30%] mx-auto bg-white':'cursor-pointer border-[1px] my-5 w-[95%] mx-auto bg-white'}>
            <div className={isGridView ? 'my-2' : 'md:flex gap-10 my-2 mx-4'}>
            <div className={isGridView ? 'w-[98%] h-[300px] bg-cover bg-center m-auto' :'w-[95%] md:w-[450px] h-[150px] bg-cover bg-center m-auto'} style={{ backgroundImage: `url(${article.urlToImage})` }} >
                <button
                onClick={() => handleAddToFavorites(article.id,article.isFavorite)}
                className={isGridView ? 'float-end m-1 p-1' : 'float-end p-1'}
                style={{
                  color: article.isFavorite ? "red" : "white",
                  backgroundColor: article.isFavorite ? "transparent" : "rgb(30 58 138)",
                }}
              >
                {article.isFavorite ? <FavoriteIcon style={{fontSize:35}}/> : <FavoriteBorderIcon style={{fontSize:30}} />}
              </button>
              </div>
              <div onClick={()=>handleViewArticle(article.id)} className="m-auto w-[90%]">
                <p className="font-semibold text-2xl">{article.title}</p>
                <p className="text-sm m-auto">{article.description}</p>
                <div className="flex items-center my-4">
                  <button className="h-8 px-1 bg-blue-900 text-white">
                    <KeyboardArrowRightIcon />
                  </button>
                  
                  <button onClick={()=>handleViewArticle(article.id)} className="h-8 px-4 text-blue-1000 hover:bg-blue-900 hover:text-white font-semibold">
                    View More
                  </button>
                
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <Pagination allArticles={allArticles}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      isLoading={isLoading}
      />
      
    </div>
    </div>
  )
}

export default page
