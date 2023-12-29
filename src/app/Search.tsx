"use client"
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { KeyboardEvent } from 'react';

function Search() {
    const[search,setSearch]  = useState("");
    const router = useRouter();
    const handleSearch = (event :KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            if(!search)return ;
            router.push(`/search/${search}`);
            setSearch("");
        }
      };
      const handleSearchIcon = () => {
            if(!search)return ;
            router.push(`/search/${search}`);
            setSearch("");
      };
  return (
    <div className='flex justify-center border-[1px] border-blue-900 items-center rounded-lg overflow-hidden'>
    
        <span className='bg-opacity-30 md:bg-white md:bg-opacity-30 px-2 '>
        <input type='text' placeholder='Search' className='text-black md:text-white outline-none bg-transparent placeholder:px-1 h-7 w-[100px] sm:w-[250px]' value={search} onChange={(e)=>{setSearch(e.target.value)}} onKeyDown={handleSearch}/>
        </span>
        <SearchIcon className='bg-blue-300 text-blue-900 h-7 px-1' style={{fontSize : 30}} onClick={handleSearchIcon}/>
    </div>
  )
}

export default Search
