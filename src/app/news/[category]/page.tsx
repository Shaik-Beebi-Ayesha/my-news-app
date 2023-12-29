"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Pagination from "@/app/pagination";
import Header from "@/app/Header";
import { useDispatch } from "react-redux";
import { addFavItem, removeFavItem } from "@/app/redux/authSlice";
import { useAppSelector } from "@/app/redux/hooks/useAppSelector";
import { useMediaQuery } from "@mui/material";
import { Article } from '@/app/ArticleInterface';

const Page: React.FC<{ params: { category: string } }> = ({ params }) => {
  const [allArticles, setArticles] = useState<Article[]>([]);
  const { category } = params;

  const validCategories = ['GENERAL', 'BUSINESS', 'ENTERTAINMENT', 'HEALTH', 'SCIENCE', 'SPORTS', 'TECHNOLOGY'];
  const isCategoryValid = validCategories.includes(category.toUpperCase());
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const isMobileOrTablet = useMediaQuery('(max-width: 768px)');
  const articlesPerPage = isMobileOrTablet ? 25 : 12;
  

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = allArticles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );
  const favItems = useAppSelector((state) => state.auth.favItems);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=${category}&apiKey=eb417353bc29429e8bf40701df2b481a`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        const articlesWithIds = data.articles.map(
          (article: object, index: number) => ({
            ...article,
            id: `${category}++${index}`,
            isFavorite: false,
          })
        );
        const favItemIds = new Set<string>(favItems.map((item) => item.id));
        const updatedArticles = articlesWithIds.map((article: Article) => ({
          ...article,
          isFavorite: favItemIds.has(article.id),
        }));
        setArticles(updatedArticles);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, [favItems]);

  const dispatch = useDispatch();
  const router = useRouter();

  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const handleAddToFavorites = (
    articleId: string,
    isFavorite?: boolean
  ): void => {
    if (isLoggedIn) {
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
        const articleToAdd = allArticles.find(
          (article) => article.id === articleId
        );
        if (articleToAdd) {
          dispatch(addFavItem(articleToAdd));
        }
      }
    } else {
      router.push(`/login`);
    }
  };

  const handleViewArticle = (articleId: string): void => {
    const articleToView = allArticles.find((article) => article.id === articleId);
    if (articleToView) {
      router.push(`/fullArticle/${articleToView.id}`);
    }
  };
  
  const isGridView = useAppSelector((state) => state.auth.isGridView);

  return (
    <>
      <Header />
      {isCategoryValid && (
      <h1 className="text-blue-900 text-xl md:text-4xl font-extrabold text-center mt-5">
        BREAKING {category.toUpperCase()} NEWS
      </h1>
    )}      
      {
            allArticles?.length==0 && (
              <div className="flex justify-center items-center w-screen mt-40 mx-3">
                <div>
                <p className="text-2xl font-bold text-gray-500">Oops! Looks like the articles are taking a nap.</p>
                <p className="text-gray-500">Try refreshing the page or check if your internet is playing hide-and-seek.</p>
                </div>
              </div>
            )
          }
          
      <div className="">
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
                <div  onClick={()=>handleViewArticle(article.id)} className="m-auto w-[90%]">
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
    </>
  );
};

export default Page;
