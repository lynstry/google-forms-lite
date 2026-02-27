import { api } from './emptyApi';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Answer = {
  __typename?: 'Answer';
  questionId: Scalars['ID']['output'];
  value: Scalars['String']['output'];
};

export type AnswerInput = {
  questionId: Scalars['ID']['input'];
  value: Scalars['String']['input'];
};

export type CreateFormInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  questions: Array<QuestionInput>;
  title: Scalars['String']['input'];
};

export type Form = {
  __typename?: 'Form';
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  questions: Array<Question>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type FormResponse = {
  __typename?: 'FormResponse';
  answers: Array<Answer>;
  formId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  submittedAt: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createForm: Form;
  submitResponse: FormResponse;
};


export type MutationCreateFormArgs = {
  input: CreateFormInput;
};


export type MutationSubmitResponseArgs = {
  input: SubmitResponseInput;
};

export type Query = {
  __typename?: 'Query';
  form?: Maybe<Form>;
  forms: Array<Form>;
  responses: Array<FormResponse>;
};


export type QueryFormArgs = {
  id: Scalars['ID']['input'];
};


export type QueryResponsesArgs = {
  formId: Scalars['ID']['input'];
};

export type Question = {
  __typename?: 'Question';
  id: Scalars['ID']['output'];
  options?: Maybe<Array<Scalars['String']['output']>>;
  order: Scalars['Int']['output'];
  required: Scalars['Boolean']['output'];
  text: Scalars['String']['output'];
  type: QuestionType;
};

export type QuestionInput = {
  options?: InputMaybe<Array<Scalars['String']['input']>>;
  order: Scalars['Int']['input'];
  required: Scalars['Boolean']['input'];
  text: Scalars['String']['input'];
  type: QuestionType;
};

export enum QuestionType {
  Checkbox = 'CHECKBOX',
  Date = 'DATE',
  MultipleChoice = 'MULTIPLE_CHOICE',
  Text = 'TEXT'
}

export type SubmitResponseInput = {
  answers: Array<AnswerInput>;
  formId: Scalars['ID']['input'];
};

export type GetFormsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFormsQuery = { __typename?: 'Query', forms: Array<{ __typename?: 'Form', id: string, title: string, description?: string | null, createdAt: string }> };

export type GetFormQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetFormQuery = { __typename?: 'Query', form?: { __typename?: 'Form', id: string, title: string, description?: string | null, createdAt: string, updatedAt: string, questions: Array<{ __typename?: 'Question', id: string, text: string, type: QuestionType, options?: Array<string> | null, required: boolean, order: number }> } | null };

export type CreateFormMutationVariables = Exact<{
  input: CreateFormInput;
}>;


export type CreateFormMutation = { __typename?: 'Mutation', createForm: { __typename?: 'Form', id: string, title: string, description?: string | null, createdAt: string, updatedAt: string, questions: Array<{ __typename?: 'Question', id: string, text: string, type: QuestionType, options?: Array<string> | null, required: boolean, order: number }> } };

export type SubmitResponseMutationVariables = Exact<{
  input: SubmitResponseInput;
}>;


export type SubmitResponseMutation = { __typename?: 'Mutation', submitResponse: { __typename?: 'FormResponse', id: string, formId: string, submittedAt: string, answers: Array<{ __typename?: 'Answer', questionId: string, value: string }> } };

export type GetResponsesQueryVariables = Exact<{
  formId: Scalars['ID']['input'];
}>;


export type GetResponsesQuery = { __typename?: 'Query', responses: Array<{ __typename?: 'FormResponse', id: string, formId: string, submittedAt: string, answers: Array<{ __typename?: 'Answer', questionId: string, value: string }> }> };


export const GetFormsDocument = `
    query GetForms {
  forms {
    id
    title
    description
    createdAt
  }
}
    `;
export const GetFormDocument = `
    query GetForm($id: ID!) {
  form(id: $id) {
    id
    title
    description
    questions {
      id
      text
      type
      options
      required
      order
    }
    createdAt
    updatedAt
  }
}
    `;
export const CreateFormDocument = `
    mutation CreateForm($input: CreateFormInput!) {
  createForm(input: $input) {
    id
    title
    description
    questions {
      id
      text
      type
      options
      required
      order
    }
    createdAt
    updatedAt
  }
}
    `;
export const SubmitResponseDocument = `
    mutation SubmitResponse($input: SubmitResponseInput!) {
  submitResponse(input: $input) {
    id
    formId
    answers {
      questionId
      value
    }
    submittedAt
  }
}
    `;
export const GetResponsesDocument = `
    query GetResponses($formId: ID!) {
  responses(formId: $formId) {
    id
    formId
    submittedAt
    answers {
      questionId
      value
    }
  }
}
    `;

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    GetForms: build.query<GetFormsQuery, GetFormsQueryVariables | void>({
      query: (variables) => ({ document: GetFormsDocument, variables })
    }),
    GetForm: build.query<GetFormQuery, GetFormQueryVariables>({
      query: (variables) => ({ document: GetFormDocument, variables })
    }),
    CreateForm: build.mutation<CreateFormMutation, CreateFormMutationVariables>({
      query: (variables) => ({ document: CreateFormDocument, variables })
    }),
    SubmitResponse: build.mutation<SubmitResponseMutation, SubmitResponseMutationVariables>({
      query: (variables) => ({ document: SubmitResponseDocument, variables })
    }),
    GetResponses: build.query<GetResponsesQuery, GetResponsesQueryVariables>({
      query: (variables) => ({ document: GetResponsesDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };
export const { useGetFormsQuery, useLazyGetFormsQuery, useGetFormQuery, useLazyGetFormQuery, useCreateFormMutation, useSubmitResponseMutation, useGetResponsesQuery, useLazyGetResponsesQuery } = injectedRtkApi;

