"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useDispatch } from 'react-redux';
import { addFavItem,removeFavItem  } from '@/app/redux/authSlice';
import { useAppSelector } from '@/app/redux/hooks/useAppSelector';
import Header from '@/app/Header';
import { Article } from '@/app/ArticleInterface';
  
const ViewPage = () => {
    const [url, setCurrentUrl] = useState('');
    const [allArticles, setArticles] = useState<Article[]>([]);
    const [reqArticle, setReqArticle] = useState<Article>();
    const [reqid, setReqId] = useState<string>();
    const dispatch = useDispatch();
    const router = useRouter();
    const favItems = useAppSelector((state) => state.auth.favItems);
    useEffect(() => {
      setCurrentUrl(window.location.href);
      const urlSegments = url.split('/');
      const id = urlSegments.pop();
      const search = id?.split('++')[0];
      setReqId(id);

      const fetchArticles = async () => {
        try {
          const response = await fetch(`https://newsapi.org/v2/everything?q=${search}&apiKey=a9b89f52d239446390f7ea84e2f75565`);
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          const data = await response.json();
          const articlesWithIds = data.articles.map((article: object, index: number) => ({
            ...article,
            id: `${search}++${index}`,
            isFavorite: false,
          }));
          const favItemIds = new Set<string>(favItems.map((item) => item.id));
          const updatedArticles = articlesWithIds.map((article: Article) => ({
            ...article,
            isFavorite: favItemIds.has(article.id),
          }));
          setArticles(updatedArticles);
        } catch (error) {
          console.error("Error fetching news:", error);
        }
      };
  
      fetchArticles();
    }, [url,favItems]);
  
    useEffect(() => {
      if (reqid && allArticles.length > 0) {
        const articleToView = allArticles.find((article) => article.id === reqid);
        setReqArticle(articleToView);
      }
    }, [allArticles, reqid]);
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
    return (
      <>
      <Header/>
      <div className='w-[95%] md:w-[75%] m-auto my-10'>
        <div className='w-full h-[250px] md:h-[400px]'><img className='w-full h-full' src={reqArticle?.urlToImage}/>
        {
          reqArticle && (
            <button
                onClick={() => handleAddToFavorites(reqArticle?.id || '' , reqArticle?.isFavorite)}
                className="float-end m-3 p-1"
                style={{
                  color: reqArticle?.isFavorite ? "red" : "white",
                  backgroundColor: reqArticle?.isFavorite ? "transparent" : "rgb(30 58 138)",
                }}
              >
                {reqArticle?.isFavorite ? <FavoriteIcon style={{fontSize:35}}/> : <FavoriteBorderIcon style={{fontSize:30}} />}
              </button>
          )
        }
            </div>
        <div className=''>
                <p className=' text-2xl md:text-3xl font-extrabold my-5 text-blue-950'>{reqArticle?.title}</p>
                {
                  reqArticle && (
                    <>
                    <p className='font-semibold md:float-right my-3'>Author : <span className='bg-blue-900 text-white px-2 py-1'>{reqArticle?.author}</span></p>
                <p className='font-semibold my-3'>Published : <span className='bg-blue-900 text-white px-2 py-1'>{reqArticle?.publishedAt}</span></p>
                    </>
                  )
                }
                <p className='text-base md:text-xl font-bold my-5 text-gray-500'>{reqArticle?.content}</p>
                <p className='font-semibold text-base'>{reqArticle?.description}</p>
                {
                  reqArticle && (
                    <Link href={reqArticle?.url ?? '/'}>
                <button className='bg-blue-900 text-white px-2 py-1 font-semibold my-5'>Go to Website</button>
                </Link>
                  )
                }
            </div>
      </div>
        
      </>
    );
  };
  
  export default ViewPage;
  