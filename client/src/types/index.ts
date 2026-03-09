import type { QuestionType } from "shared";

export interface QuestionOption {
    id: string;
    text: string;
}

export interface Question {
    id: string;
    text: string;
    type: QuestionType;
    options: QuestionOption[];
    required: boolean;
}
