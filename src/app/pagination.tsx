import { useMediaQuery } from "@mui/material";
import { Article } from "./ArticleInterface";

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

interface PaginationProps {
    allArticles: Article[];
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    currentPage: number;
    isLoading: boolean;
  }

  const Pagination: React.FC<PaginationProps> = ({
    allArticles,
    setCurrentPage,
    currentPage,
    isLoading,
  })=> {
    const isMobileOrTablet = useMediaQuery('(max-width: 768px)');
    const articlesPerPage = isMobileOrTablet ? 25 : 12;
  
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
    const handlePrevPage = () => {
        if (currentPage > 1) {
          setCurrentPage((prevPage:any) => prevPage - 1);
        }
      };
    
      const handleNextPage = () => {
        if (currentPage < Math.ceil(allArticles.length / articlesPerPage)) {
          setCurrentPage((prevPage:any) => prevPage + 1);
        }
      };
    
  return (
    <>
      <ul className="flex justify-center mb-32">
      {
        !isLoading && allArticles?.length>0 && (
          <li
          onClick={handlePrevPage}
          className="cursor-pointer mx-1 px-3 py-1 rounded-full bg-blue-300 text-blue-900 font-semibold"
        >
          <KeyboardArrowLeftIcon />
        </li>
        )
      }
        {Array.from({ length: Math.ceil(allArticles.length / articlesPerPage) }, (_, index) => (
          <li
            key={index}
            onClick={() => paginate(index + 1)}
            className={`cursor-pointer mx-1 px-3 py-1 rounded-full font-semibold ${
              currentPage === index + 1 ? 'bg-blue-900 text-white' : ' bg-blue-300 text-blue-900'
            }`}
          >
            {index + 1}
          </li>
        ))}
        {
          !isLoading && allArticles?.length>0 &&(
            <li
          onClick={handleNextPage}
          className="cursor-pointer mx-1 px-3 py-1 rounded-full bg-blue-300 text-blue-900 font-semibold"
        >
          <KeyboardArrowRightIcon />
        </li>
          )
        }
      </ul>
    </>
  )
}

export default Pagination
