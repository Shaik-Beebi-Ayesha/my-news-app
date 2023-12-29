export interface Article {
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