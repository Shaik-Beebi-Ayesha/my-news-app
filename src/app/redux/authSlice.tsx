"use client"
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { updateDoc,doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface FavoriteItem {
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

interface AuthState {
  isLoggedIn: boolean;
  uid : string;
  userName : string;
  favItems: FavoriteItem[];
  isGridView: boolean,
}

const initialState: AuthState = {
  isLoggedIn: false,
  uid : '',
  userName : '',
  favItems: [], 
  isGridView: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToggleView(state) {
      state.isGridView = !state.isGridView;
    },
    setIsLoggedIn(state, action: PayloadAction<boolean>) {
    state.isLoggedIn = action.payload;
    },
    setUid(state,action: PayloadAction<string>) {
      state.uid = action.payload;
  },
    setUserName(state,action: PayloadAction<string>) {
      state.userName = action.payload;
    },
    setFavItems(state, action: PayloadAction<FavoriteItem[]>) {
      state.favItems = action.payload;
      console.log(state.favItems);
    },
    addFavItem(state, action: PayloadAction<Partial<FavoriteItem>>) {
      const newItem = { ...action.payload, isFavorite: true } as FavoriteItem;
      const existingItemIndex = state.favItems.findIndex(item => item.id === newItem.id);
      if (existingItemIndex !== -1) {
        const updatedFavItems = [...state.favItems];
        updatedFavItems[existingItemIndex] = { ...updatedFavItems[existingItemIndex], isFavorite: true };
        const newState = { ...state, favItems: updatedFavItems };
        updateFirestore(newState);
        return newState;
      } else {
        const newState = { ...state, favItems: [...state.favItems, newItem] };
        updateFirestore(newState);
        return newState;
      }
    },
    removeFavItem(state, action: PayloadAction<string>) {
      const itemIdToRemove = action.payload;
      const updatedFavItems = state.favItems.filter(item => item.id !== itemIdToRemove);
      const newState = { ...state, favItems: updatedFavItems };
      updateFirestore(newState);
      return newState;
    },
    
  },
});
const updateFirestore = async (state: AuthState) => {
  try {
    const { uid, favItems } = state;
    await updateDoc(doc(db, 'users', uid), { favItems });
    console.log('Firestore updated with new favItems');
  } catch (error) {
    console.error('Error updating Firestore:', error);
  }
};
export const { setIsLoggedIn,setUserName,setToggleView ,addFavItem,removeFavItem , setFavItems,setUid} = authSlice.actions;

export default authSlice.reducer;
