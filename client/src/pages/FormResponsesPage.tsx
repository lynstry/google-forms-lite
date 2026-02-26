import { Link, useParams } from "react-router-dom";
import { useGetFormQuery, useGetResponsesQuery } from "../store/api";

export function FormResponsesPage() {
    const { id } = useParams<{ id: string }>();

    const { data: formData, isLoading: isLoadingForm } = useGetFormQuery({ id: id! });
    const { data: responsesData, isLoading: isLoadingResponses } = useGetResponsesQuery({ formId: id! });

    const form = formData?.form;
    const responses = responsesData?.responses || [];

    if (isLoadingForm || isLoadingResponses) {
        return (
            <div className="page-content">
                <div className="loading-state">Loading responses...</div>
            </div>
        );
    }

    if (!form) {
        return (
            <div className="page-content">
                <div className="alert alert--error">
                    <p className="alert__message">Form not found.</p>
                    <Link to="/" className="btn btn--secondary" style={{ marginTop: 12 }}>
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    // Build a lookup map from questionId -> questionText
    const questionMap = form.questions.reduce((acc, q) => {
        acc[q.id] = q.text;
        return acc;
    }, {} as Record<string, string>);

    function formatDate(iso: string): string {
        try {
            return new Date(iso).toLocaleString([], {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return iso;
        }
    }

    return (
        <div className="page-content">
            <div className="page-header">
                <Link to="/" className="page-header__back" title="Back" aria-label="Back">
                    ←
                </Link>
                <span className="page-header__title">{form.title} - Responses</span>
                <div style={{ flex: 1 }} />
                <Link
                    to={`/forms/${id}/fill`}
                    id="btn-fill-form"
                    className="btn btn--secondary btn--sm"
                >
                    Fill Form
                </Link>
            </div>

            <div className="card" style={{ marginBottom: 24 }}>
                <div className="card__body card__body--sm">
                    <div className="flex items-center gap-4" style={{ flexWrap: "wrap", justifyContent: "center" }}>
                        <div style={{ textAlign: "center", padding: "8px 24px" }}>
                            <p style={{ fontSize: 32, fontWeight: 700, color: "var(--color-accent)" }}>
                                {responses.length}
                            </p>
                            <p className="text-sm text-secondary">Total responses</p>
                        </div>
                        <div style={{ width: 1, height: 50, background: "var(--color-border)" }} className="hidden sm-block" />
                        <div style={{ textAlign: "center", padding: "8px 24px" }}>
                            <p style={{ fontSize: 32, fontWeight: 700, color: "var(--color-primary)" }}>
                                {form.questions.length}
                            </p>
                            <p className="text-sm text-secondary">Questions</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="section-heading">
                <span className="section-heading__title">{responses.length} Responses</span>
            </div>

            {responses.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state__icon">📥</div>
                    <p className="empty-state__title">No responses yet</p>
                    <p className="empty-state__subtitle">
                        Be the first to <Link to={`/forms/${id}/fill`}>fill out this form</Link>!
                    </p>
                </div>
            ) : (
                <div className="responses-list">
                    {responses.map((resp, idx) => (
                        <div key={resp.id} className="response-item">
                            <div className="response-item__header">
                                <span className="response-item__title">Response #{responses.length - idx}</span>
                                <span className="response-item__date">{formatDate(resp.submittedAt)}</span>
                            </div>
                            <div className="response-item__body" style={{ marginTop: 12 }}>
                                {resp.answers.map((ans) => (
                                    <div key={ans.questionId} className="response-answer" style={{ marginBottom: 16 }}>
                                        <p className="response-answer__question">
                                            {questionMap[ans.questionId] || "Unknown Question"}
                                        </p>
                                        <p className="response-answer__value">
                                            {ans.value || <i style={{ opacity: 0.5 }}>No answer</i>}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
