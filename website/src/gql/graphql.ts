/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Product = {
  __typename?: 'Product';
  id?: Maybe<Scalars['String']>;
  link?: Maybe<Scalars['String']>;
  main_category?: Maybe<Scalars['String']>;
  overall_rating?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['String']>;
  product_description?: Maybe<Scalars['String']>;
  product_name?: Maybe<Scalars['String']>;
  product_sub_title?: Maybe<Scalars['String']>;
  sub_category?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  product?: Maybe<Product>;
  products?: Maybe<Array<Maybe<Product>>>;
  searchProduct?: Maybe<Product>;
};


export type QueryProductArgs = {
  id: Scalars['String'];
};


export type QueryProductsArgs = {
  pageNumber: Scalars['Int'];
};


export type QuerySearchProductArgs = {
  name: Scalars['String'];
};
