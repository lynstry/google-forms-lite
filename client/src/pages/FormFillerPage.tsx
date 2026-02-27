import { Link, useParams } from "react-router-dom";
import { useGetFormQuery } from "../store/api";
import { useFormFiller } from "../hooks/useFormFiller";

export function FormFillerPage() {
    const { id } = useParams<{ id: string }>();

    // Fetch form data
    const { data, isLoading, isError } = useGetFormQuery({ id: id! });
    const form = data?.form;

    const {
        answers,
        status,
        setAnswer,
        toggleCheckbox,
        handleSubmit,
        resetForm
    } = useFormFiller(id!, form);

    if (isLoading) {
        return (
            <div className="page-content">
                <div className="loading-state">Loading form...</div>
            </div>
        );
    }

    if (isError || !form) {
        return (
            <div className="page-content">
                <div className="alert alert--error">
                    <p className="alert__message">Form not found or error loading form.</p>
                    <Link to="/" className="btn btn--secondary" style={{ marginTop: 12 }}>
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    if (status === "success") {
        return (
            <div className="page-content">
                <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
                    <p className="card__title">Form Submitted!</p>
                    <p className="card__subtitle" style={{ marginTop: 8 }}>
                        Your response has been recorded. Thank you!
                    </p>
                    <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center" }}>
                        <Link to="/" className="btn btn--secondary">
                            Back to Forms
                        </Link>
                        <button
                            className="btn btn--secondary"
                            onClick={resetForm}
                        >
                            Submit another response
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-content">
            <div className="page-header">
                <Link to="/" className="page-header__back" title="Back" aria-label="Back">
                    ←
                </Link>
                <span className="page-header__title">Fill Form</span>
                <div style={{ flex: 1 }} />
                <Link
                    to={`/forms/${id}/responses`}
                    id="btn-view-responses"
                    className="btn btn--secondary btn--sm"
                >
                    View Responses
                </Link>
            </div>

            {status === "error" ? (
                <div className="alert alert--error">
                    <p className="alert__message">Error submitting form. Please try again.</p>
                </div>
            ) : null}
            <form onSubmit={handleSubmit} noValidate>
                <div className="form-header-card" style={{ marginBottom: 12 }}>
                    <div style={{ height: 10, background: "var(--color-accent)" }} />
                    <div className="form-header-card__body">
                        <h1 className="card__title">{form.title}</h1>
                        {form.description && (
                            <p className="card__subtitle" style={{ marginTop: 8 }}>
                                {form.description}
                            </p>
                        )}
                        <p className="text-sm text-secondary" style={{ marginTop: 12 }}>
                            <span style={{ color: "var(--color-error)" }}>*</span> Indicates required question
                        </p>
                    </div>
                </div>

                {form.questions.map((q) => (
                    <div key={q.id} className="question-card">
                        <div className="question-card__body">
                            <div className="form-group">
                                <label htmlFor={q.id} style={{ display: "block", marginBottom: 12, fontWeight: 500 }}>
                                    {q.text} {q.required && <span style={{ color: "var(--color-error)" }}>*</span>}
                                </label>
                                {q.type === "TEXT" && (
                                    <input
                                        id={q.id}
                                        type="text"
                                        className="form-input"
                                        value={answers[q.id] || ""}
                                        onChange={(e) => setAnswer(q.id, e.target.value)}
                                        placeholder="Your answer"
                                    />
                                )}
                                {q.type === "MULTIPLE_CHOICE" && (
                                    <div className="radio-group">
                                        {q.options?.map((option) => (
                                            <div key={option} className="radio-item">
                                                <input
                                                    type="radio"
                                                    id={`${q.id}-${option}`}
                                                    name={q.id}
                                                    value={option}
                                                    checked={answers[q.id] === option}
                                                    onChange={(e) => setAnswer(q.id, e.target.value)}
                                                />
                                                <label htmlFor={`${q.id}-${option}`}>{option}</label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {q.type === "CHECKBOX" && (
                                    <div className="checkbox-group">
                                        {q.options?.map((option) => (
                                            <div key={option} className="checkbox-item">
                                                <input
                                                    type="checkbox"
                                                    id={`${q.id}-${option}`}
                                                    name={q.id}
                                                    value={option}
                                                    checked={Array.isArray(answers[q.id]) && (answers[q.id] as string[]).includes(option)}
                                                    onChange={() => toggleCheckbox(q.id, option)}
                                                />
                                                <label htmlFor={`${q.id}-${option}`}>{option}</label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {q.type === "DATE" && (
                                    <input
                                        id={q.id}
                                        type="date"
                                        className="form-input"
                                        value={answers[q.id] || ""}
                                        onChange={(e) => setAnswer(q.id, e.target.value)}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                <div className="flex gap-4 items-center" style={{ marginTop: 24, flexWrap: "wrap" }}>
                    <button
                        type="submit"
                        className="btn btn--accent"
                        disabled={status === "submitting"}
                    >
                        {status === "submitting" ? "Submitting…" : "Submit"}
                    </button>
                    <button
                        type="button"
                        className="btn btn--secondary"
                        onClick={() => {
                            if (window.confirm("Are you sure you want to clear the form?")) {
                                resetForm();
                            }
                        }}
                    >
                        Clear form
                    </button>
                </div>
            </form>
        </div>
    );
}
