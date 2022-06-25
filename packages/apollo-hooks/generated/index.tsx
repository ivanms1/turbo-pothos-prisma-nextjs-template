import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any;
};

export type Article = {
  __typename?: 'Article';
  author: User;
  content: Scalars['String'];
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  isPublished: Scalars['Boolean'];
  lead: Scalars['String'];
  preview: Scalars['String'];
  tags: Array<Scalars['String']>;
  title: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type ArticlesResponse = {
  __typename?: 'ArticlesResponse';
  nextCursor?: Maybe<Scalars['String']>;
  prevCursor?: Maybe<Scalars['String']>;
  results: Array<Article>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type CreateArticleInput = {
  content: Scalars['String'];
  description: Scalars['String'];
  lead: Scalars['String'];
  preview: Scalars['String'];
  tags?: InputMaybe<Array<Scalars['String']>>;
  title: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createArticle?: Maybe<Article>;
  deleteArticle?: Maybe<Scalars['String']>;
  deleteManyArticles?: Maybe<Scalars['JSONObject']>;
  signup: Scalars['JSONObject'];
  /** Change an article status */
  updateArticleStatus?: Maybe<Article>;
  updateProject?: Maybe<Article>;
  updateUser: User;
  uploadImage?: Maybe<Scalars['JSONObject']>;
};


export type MutationCreateArticleArgs = {
  input?: InputMaybe<CreateArticleInput>;
};


export type MutationDeleteArticleArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteManyArticlesArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationSignupArgs = {
  avatar: Scalars['String'];
  email: Scalars['String'];
  name: Scalars['String'];
};


export type MutationUpdateArticleStatusArgs = {
  isPublished: Scalars['Boolean'];
  projectId: Scalars['String'];
};


export type MutationUpdateProjectArgs = {
  input?: InputMaybe<UpdateArticleInput>;
  projectId: Scalars['ID'];
};


export type MutationUpdateUserArgs = {
  input?: InputMaybe<UpdateUsertInput>;
  userId: Scalars['String'];
};


export type MutationUploadImageArgs = {
  path: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getArticle?: Maybe<Article>;
  /** Admin query to get articles */
  getArticlesAdmin: ArticlesResponse;
  getCurrentUser?: Maybe<User>;
  /** Get all my projects */
  getMyProjects: ArticlesResponse;
  /** Get all published articles */
  getPublishedArticles: ArticlesResponse;
  getUser?: Maybe<User>;
  /** Get all the articles from a certain user */
  getUserArticles: ArticlesResponse;
  getUsers: Array<Maybe<User>>;
  /** Search articles */
  searchArticles: ArticlesResponse;
};


export type QueryGetArticleArgs = {
  id: Scalars['ID'];
};


export type QueryGetArticlesAdminArgs = {
  cursor?: InputMaybe<Scalars['String']>;
};


export type QueryGetMyProjectsArgs = {
  cursor?: InputMaybe<Scalars['String']>;
};


export type QueryGetPublishedArticlesArgs = {
  cursor?: InputMaybe<Scalars['String']>;
};


export type QueryGetUserArgs = {
  id: Scalars['ID'];
};


export type QueryGetUserArticlesArgs = {
  cursor?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};


export type QuerySearchArticlesArgs = {
  cursor?: InputMaybe<Scalars['String']>;
  input?: InputMaybe<SearchArticlesInput>;
};

export enum Role {
  Admin = 'ADMIN',
  Author = 'AUTHOR'
}

/** Search input fields */
export type SearchArticlesInput = {
  order: SearchOrder;
  orderBy: Scalars['String'];
  search: Scalars['String'];
};

/** Search order */
export enum SearchOrder {
  Asc = 'asc',
  Desc = 'desc'
}

export type UpdateArticleInput = {
  content: Scalars['String'];
  description: Scalars['String'];
  lead: Scalars['String'];
  preview: Scalars['String'];
  tags?: InputMaybe<Array<Scalars['String']>>;
  title: Scalars['String'];
};

/** Update the user information */
export type UpdateUsertInput = {
  discord: Scalars['String'];
  email: Scalars['String'];
  github: Scalars['String'];
  name: Scalars['String'];
  role: Role;
};

export type User = {
  __typename?: 'User';
  articles?: Maybe<Array<Article>>;
  avatar?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  role: Role;
};

export type SearchArticlesQueryVariables = Exact<{ [key: string]: never; }>;


export type SearchArticlesQuery = { __typename?: 'Query', articles: { __typename?: 'ArticlesResponse', results: Array<{ __typename?: 'Article', id: string, title: string }> } };


export const SearchArticlesDocument = gql`
    query SearchArticles {
  articles: getPublishedArticles {
    results {
      id
      title
    }
  }
}
    `;

/**
 * __useSearchArticlesQuery__
 *
 * To run a query within a React component, call `useSearchArticlesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchArticlesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchArticlesQuery({
 *   variables: {
 *   },
 * });
 */
export function useSearchArticlesQuery(baseOptions?: Apollo.QueryHookOptions<SearchArticlesQuery, SearchArticlesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchArticlesQuery, SearchArticlesQueryVariables>(SearchArticlesDocument, options);
      }
export function useSearchArticlesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchArticlesQuery, SearchArticlesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchArticlesQuery, SearchArticlesQueryVariables>(SearchArticlesDocument, options);
        }
export type SearchArticlesQueryHookResult = ReturnType<typeof useSearchArticlesQuery>;
export type SearchArticlesLazyQueryHookResult = ReturnType<typeof useSearchArticlesLazyQuery>;
export type SearchArticlesQueryResult = Apollo.QueryResult<SearchArticlesQuery, SearchArticlesQueryVariables>;