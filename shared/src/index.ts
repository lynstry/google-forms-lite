export type QuestionType =
    | "TEXT"
    | "MULTIPLE_CHOICE"
    | "CHECKBOX"
    | "DATE";

export interface Question {
    id: string;
    text: string;
    type: QuestionType;
    options: string[] | null;
    required: boolean;
    order: number;
}

export interface Form {
    id: string;
    title: string;
    description: string | null;
    questions: Question[];
    createdAt: string;
    updatedAt: string;
}

export interface Answer {
    questionId: string;
    value: string;
}

export interface FormResponse {
    id: string;
    formId: string;
    answers: Answer[];
    submittedAt: string;
}

// ----- Input Types (what the resolvers receive from Apollo) -----

export interface QuestionInput {
    text: string;
    type: QuestionType;
    options?: string[] | null;
    required: boolean;
    order: number;
}

export interface CreateFormInput {
    title: string;
    description?: string | null;
    questions: QuestionInput[];
}

export interface AnswerInput {
    questionId: string;
    value: string;
}

export interface SubmitResponseInput {
    formId: string;
    answers: AnswerInput[];
}
