import { useState } from "react";
import { useSubmitResponseMutation } from "../store/api";
import type { GetFormQuery } from "../store/api";

type FormStatus = "idle" | "submitting" | "success" | "error";

// The form shape as returned by the GetForm query, excluding null
type FilledForm = NonNullable<GetFormQuery["form"]>;

export function useFormFiller(id: string, form: FilledForm | null | undefined) {
    const [submitResponse] = useSubmitResponseMutation();
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
    const [status, setStatus] = useState<FormStatus>("idle");

    const setAnswer = (questionId: string, value: string | string[]): void => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const toggleCheckbox = (questionId: string, option: string): void => {
        const currentOptions = (answers[questionId] as string[]) || [];
        const newOptions = currentOptions.includes(option)
            ? currentOptions.filter((o) => o !== option)
            : [...currentOptions, option];
        setAnswer(questionId, newOptions);
    };

    const resetForm = (): void => {
        setAnswers({});
        setStatus("idle");
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if (!form) return;

        // Validation
        for (const q of form.questions) {
            const answer = answers[q.id];
            const isEmpty = !answer || (Array.isArray(answer) && answer.length === 0);
            if (q.required && isEmpty) {
                alert(`Please answer the required question: "${q.text}"`);
                return;
            }
        }

        setStatus("submitting");
        try {
            const formattedAnswers = Object.entries(answers).map(([questionId, value]) => ({
                questionId,
                value: Array.isArray(value) ? value.join(", ") : value,
            }));

            await submitResponse({
                input: {
                    formId: id,
                    answers: formattedAnswers,
                },
            }).unwrap();
            setStatus("success");
        } catch (err: unknown) {
            console.error("Failed to submit:", err);
            setStatus("error");
        }
    };

    return { answers, status, setAnswer, toggleCheckbox, handleSubmit, resetForm };
}
