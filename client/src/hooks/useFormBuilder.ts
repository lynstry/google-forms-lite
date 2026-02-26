import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateFormMutation, QuestionType } from "../store/api";

interface QuestionOption {
    id: string;
    text: string;
}

interface Question {
    id: string;
    text: string;
    type: string;
    options: QuestionOption[];
    required: boolean;
}

function makeId(): string {
    return Math.random().toString(36).slice(2, 9);
}

function makeQuestion(type: string = "SHORT_ANSWER"): Question {
    const isChoice = type === "MULTIPLE_CHOICE" || type === "CHECKBOX" || type === "DROPDOWN";
    return {
        id: makeId(),
        text: "",
        type: type,
        options: isChoice ? [{ id: makeId(), text: "Option 1" }] : [],
        required: false,
    };
}

export function useFormBuilder() {
    const navigate = useNavigate();
    const [createForm] = useCreateFormMutation();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [questions, setQuestions] = useState<Question[]>(() => [makeQuestion("SHORT_ANSWER")]);
    const [focusedId, setFocusedId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (questions.length > 0 && !focusedId) {
            setFocusedId(questions[0].id);
        }
    }, [questions, focusedId]);

    const addQuestion = (type: string) => {
        const newQuestion = makeQuestion(type);
        setQuestions((prev) => [...prev, newQuestion]);
        setFocusedId(newQuestion.id);
    };

    const removeQuestion = (id: string) => {
        setQuestions((prev) => prev.filter((q) => q.id !== id));
    };

    const updateQuestion = (id: string, patch: Partial<Question>) => {
        setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));
    };

    const addOption = (questionId: string) => {
        setQuestions((prev) =>
            prev.map((q) =>
                q.id === questionId
                    ? { ...q, options: [...q.options, { id: makeId(), text: `Option ${q.options.length + 1}` }] }
                    : q
            )
        );
    };

    const removeOption = (questionId: string, optionId: string) => {
        setQuestions((prev) =>
            prev.map((q) =>
                q.id === questionId
                    ? { ...q, options: q.options.filter((opt) => opt.id !== optionId) }
                    : q
            )
        );
    };

    const updateOption = (questionId: string, optionId: string, text: string) => {
        setQuestions((prev) =>
            prev.map((q) =>
                q.id === questionId
                    ? { ...q, options: q.options.map((opt) => (opt.id === optionId ? { ...opt, text } : opt)) }
                    : q
            )
        );
    };

    const handleSave = async () => {
        if (title.trim() === "") {
            alert("Title is required");
            return;
        }

        setSaving(true);
        try {
            await createForm({
                input: {
                    title,
                    description,
                    questions: questions.map((q, idx) => ({
                        text: q.text,
                        type: q.type as QuestionType,
                        required: q.required,
                        order: idx,
                        options: q.options.map((opt) => opt.text),
                    })),
                },
            }).unwrap();
            navigate("/");
        } catch (error) {
            console.error("Failed to save form:", error);
            alert("Failed to save form. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return {
        title,
        setTitle,
        description,
        setDescription,
        questions,
        focusedId,
        setFocusedId,
        saving,
        addQuestion,
        removeQuestion,
        updateQuestion,
        addOption,
        removeOption,
        updateOption,
        handleSave,
    };
}
