"use client"

import { usePathname } from 'next/navigation';
import Navlink from './Navlink';
import ListIcon from '@mui/icons-material/List';
import MenuIcon from '@mui/icons-material/Menu';
import AppsIcon from '@mui/icons-material/Apps';
import { setToggleView } from './redux/authSlice';
import { useAppSelector } from './redux/hooks/useAppSelector';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import Search from './Search';

function NavLinks() {
    const pathname = usePathname();
    const categories : string[] = [
        "general",
        "business",
        "entertainment",
        "health",
        "science",
        "sports",
        "technology",
    ];
    const activeState = (category : string) =>{
        return pathname?.split('/').pop() === category;
    } ;
    
    const dispatch = useDispatch();
    const isGridView = useAppSelector((state) => state.auth.isGridView);
    const toggleView = () => {
        dispatch(setToggleView());
      };
      const [menuView,setMenuView] = useState(false);
      const toggleMenu = () => {
        setMenuView((prevMenuView) => !prevMenuView);
      };
      
  return (
    <div className='flex justify-between items-start md:items-center mx-5 my-2'>
    <div className='hidden md:block'>
    {
        categories.map((category:any)=>{
            return <Navlink key={category} category={category} activeState={activeState(category)}  />
        })
    }
    </div>
    <div className='block md:hidden'>
      <div onClick={toggleMenu} className='text-white bg-blue-900 px-2 py-[1px] cursor-pointer flex items-center gap-2'>
        <MenuIcon className='cursor-pointer text-white' style={{fontSize:20}}/>
        <p>Menu</p></div>
      {menuView && (
        <div>
          {categories.map((category) => (
             <div><Navlink key={category} category={category} activeState={activeState(category)}  /></div>
          ))}
        </div>
      )}
    </div>
    <div className='flex gap-2'>
    <div className="block md:hidden"><Search /></div>
    <button onClick={toggleView}>
        {isGridView ? <ListIcon className='cursor-pointer text-blue-900' style={{fontSize:30}}/> : <AppsIcon className='cursor-pointer text-blue-900' style={{fontSize:30}}/>}
    </button>
    </div>
    </div>
  )
}

export default NavLinks
