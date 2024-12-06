enum EArticleStatus {
    UNAPPROVED = 'Unapproved',
    APPROVED = 'Approved',
    PUBLISHED = 'Published',
    ARCHIVED = 'Archived'
  }
  
  interface IArticle {
    id: number
    ext_id: number | null;
    rank: number;
    status: EArticleStatus
    highlight: {[key: string]: any};
    public_urls: string;
    created_at: string | null
    updated_at: string | null;
    published_at: string | null
  }

  interface ICategory {
    [key: string]: any;
  }

  interface IInstance {
    [key: string]: any;
    entityName: 'Instance';
  }

  type ArticleItem = IArticle & { isViewed?: boolean };
  type ArticleItemsList = Array<ArticleItem>;
  
  interface IGetEntitiesListResponse<T> {
    next: string | null;
    previous: string | null;
    results: Array<T>;
    entityName?: string;
  }

  type ArticlesList = Array<IArticle>;

  export type  { EArticleStatus, IArticle, ArticleItem, ArticleItemsList, IGetEntitiesListResponse, ArticlesList, ICategory, IInstance };