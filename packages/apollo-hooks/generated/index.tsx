import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: any;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
};

export type Article = {
  __typename?: 'Article';
  author?: Maybe<User>;
  content?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['Date']>;
  id?: Maybe<Scalars['ID']>;
  isPublished?: Maybe<Scalars['Boolean']>;
  lead?: Maybe<Scalars['String']>;
  preview?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['Date']>;
};

/** Articles query input */
export type ArticlesInput = {
  cursor?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<SearchOrder>;
  orderBy?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
};

/** Paginated list of articles */
export type ArticlesResponse = {
  __typename?: 'ArticlesResponse';
  nextCursor?: Maybe<Scalars['String']>;
  prevCursor?: Maybe<Scalars['String']>;
  results: Array<Article>;
  totalCount: Scalars['Int'];
};

export type CreateArticleInput = {
  content: Scalars['String'];
  lead: Scalars['String'];
  preview: Scalars['String'];
  title: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createArticle?: Maybe<Article>;
  deleteArticle?: Maybe<Article>;
  signUp?: Maybe<User>;
  updateArticle?: Maybe<Article>;
};


export type MutationCreateArticleArgs = {
  input: CreateArticleInput;
  userId: Scalars['String'];
};


export type MutationDeleteArticleArgs = {
  articleId: Scalars['String'];
};


export type MutationSignUpArgs = {
  avatar: Scalars['String'];
  email: Scalars['String'];
  name: Scalars['String'];
};


export type MutationUpdateArticleArgs = {
  articleId: Scalars['String'];
  input: CreateArticleInput;
};

export type Query = {
  __typename?: 'Query';
  getArticle?: Maybe<Article>;
  getUser?: Maybe<User>;
  getUserArticles?: Maybe<ArticlesResponse>;
  getUsers?: Maybe<Array<User>>;
  searchArticles?: Maybe<ArticlesResponse>;
};


export type QueryGetArticleArgs = {
  articleId: Scalars['String'];
};


export type QueryGetUserArgs = {
  userId: Scalars['String'];
};


export type QueryGetUserArticlesArgs = {
  input: ArticlesInput;
  userId: Scalars['String'];
};


export type QuerySearchArticlesArgs = {
  input?: InputMaybe<ArticlesInput>;
};

/** Search order */
export enum SearchOrder {
  Asc = 'asc',
  Desc = 'desc'
}

export type User = {
  __typename?: 'User';
  avatar?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
};

export type SearchArticlesQueryVariables = Exact<{
  input?: InputMaybe<ArticlesInput>;
}>;


export type SearchArticlesQuery = { __typename?: 'Query', articles?: { __typename?: 'ArticlesResponse', results: Array<{ __typename?: 'Article', id?: string | null, title?: string | null }> } | null };


export const SearchArticlesDocument = gql`
    query SearchArticles($input: ArticlesInput) {
  articles: searchArticles(input: $input) {
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
 *      input: // value for 'input'
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
export function useSearchArticlesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchArticlesQuery, SearchArticlesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchArticlesQuery, SearchArticlesQueryVariables>(SearchArticlesDocument, options);
        }
export type SearchArticlesQueryHookResult = ReturnType<typeof useSearchArticlesQuery>;
export type SearchArticlesLazyQueryHookResult = ReturnType<typeof useSearchArticlesLazyQuery>;
export type SearchArticlesSuspenseQueryHookResult = ReturnType<typeof useSearchArticlesSuspenseQuery>;
export type SearchArticlesQueryResult = Apollo.QueryResult<SearchArticlesQuery, SearchArticlesQueryVariables>;