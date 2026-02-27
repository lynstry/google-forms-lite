import { Link } from "react-router-dom";
import { useFormBuilder } from "../hooks/useFormBuilder";

const QUESTION_TYPE_LABELS: Record<string, string> = {
    TEXT: "Text",
    MULTIPLE_CHOICE: "Multiple choice",
    CHECKBOX: "Checkboxes",
    DATE: "Date",
};

export function FormBuilderPage() {
    const {
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
    } = useFormBuilder();

    const hasChoiceOptions = (type: string) =>
        type === "MULTIPLE_CHOICE" || type === "CHECKBOX";

    return (
        <div className="page-content">
            <div className="page-header">
                <Link to="/" className="page-header__back" title="Back to forms" aria-label="Back">
                    ←
                </Link>
                <span className="page-header__title">Form Builder</span>
                <div style={{ flex: 1 }} />
                <button
                    id="btn-save-form"
                    className="btn btn--accent"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? "Saving…" : "Save Form"}
                </button>
            </div>

            <div className="form-header-card" style={{ marginBottom: 12 }}>
                <div style={{ height: 10, background: "var(--color-accent)" }} />
                <div className="form-header-card__body">
                    <div className="form-group">
                        <input
                            id="form-title-input"
                            type="text"
                            className="form-input form-input--title"
                            placeholder="Untitled form"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <input
                            id="form-description-input"
                            type="text"
                            className="form-input form-input--description"
                            placeholder="Form description (optional)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {questions.map((q) => (
                <div
                    key={q.id}
                    className={`question-card ${focusedId === q.id ? "question-card--focused" : ""}`}
                    onClick={() => setFocusedId(q.id)}
                >
                    {focusedId === q.id && <div className="question-card__header-bar" />}
                    <div className="question-card__body">
                        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                            <input
                                type="text"
                                className="form-input"
                                style={{ flex: 1, fontSize: 16 }}
                                placeholder="Question"
                                value={q.text}
                                onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                            />
                            <select
                                className="form-select"
                                style={{ width: 200 }}
                                value={q.type}
                                onChange={(e) => updateQuestion(q.id, { type: e.target.value })}
                            >
                                {Object.entries(QUESTION_TYPE_LABELS).map(([val, label]) => (
                                    <option key={val} value={val}>{label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="question-card__answer-preview">
                            {q.type === "TEXT" && (
                                <input type="text" className="form-input" placeholder="Text" disabled />
                            )}
                            {hasChoiceOptions(q.type) && (
                                <div className="options-list">
                                    {q.options.map((opt) => (
                                        <div key={opt.id} className="option-row" style={{ marginBottom: 8 }}>
                                            <span className="option-row__bullet">
                                                {q.type === "CHECKBOX" ? "" : ""}
                                            </span>
                                            <input
                                                type="text"
                                                className="form-input"
                                                style={{ flex: 1 }}
                                                value={opt.text}
                                                onChange={(e) => updateOption(q.id, opt.id, e.target.value)}
                                            />
                                            <button
                                                className="btn btn--icon"
                                                onClick={() => removeOption(q.id, opt.id)}
                                                title="Remove option"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                    <button className="btn btn--secondary btn--sm" onClick={() => addOption(q.id)}>
                                        + Add option
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="question-toolbar">
                        <label className="toggle-label">
                            <span className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={q.required}
                                    onChange={(e) => updateQuestion(q.id, { required: e.target.checked })}
                                />
                                <span className="toggle-slider"></span>
                            </span>
                            Required
                        </label>
                        <div className="question-toolbar__divider" />
                        <button
                            className="btn btn--icon"
                            onClick={() => removeQuestion(q.id)}
                            title="Delete question"
                        >
                            🗑
                        </button>
                    </div>
                </div>
            ))}

            <div className="add-question-bar">
                <span className="add-question-bar__label">Add:</span>
                {Object.entries(QUESTION_TYPE_LABELS).map(([type, label]) => (
                    <button
                        key={type}
                        className="btn btn--secondary btn--sm"
                        onClick={() => addQuestion(type)}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
}
