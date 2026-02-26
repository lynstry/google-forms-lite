import { Link } from "react-router-dom";
import { FormCard } from "../components/FormCard";
import { useGetFormsQuery } from "../store/api";

export function HomePage() {
    const { data, isLoading, isError } = useGetFormsQuery();
    const forms = data?.forms || [];

    if (isLoading) {
        return (
            <div className="page-content page-content--wide">
                <div className="loading-state">Loading forms...</div>
            </div>
        );
    }

    return (
        <div className="page-content page-content--wide">
            <div className="card" style={{ marginBottom: 32 }}>
                <div className="card__header-bar card__header-bar--orange" />
                <div className="card__body">
                    <div className="flex items-center justify-between" style={{ flexWrap: "wrap", gap: 12 }}>
                        <div>
                            <p className="card__title">Start a new form</p>
                            <p className="card__subtitle">Create something amazing today</p>
                        </div>
                        <Link
                            to="/forms/new"
                            id="btn-create-form"
                            className="btn btn--accent"
                        >
                            + Create New Form
                        </Link>
                    </div>
                </div>
            </div>

            <div className="section-heading">
                <span className="section-heading__title">Recent forms</span>
            </div>

            {isError ? (
                <div className="alert alert--error">
                    <p className="alert__message">Error loading forms. Please check if the server is running.</p>
                </div>
            ) : forms.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state__icon">📄</div>
                    <p className="empty-state__title">No forms yet</p>
                    <p className="empty-state__subtitle">
                        Click the button above or the floating action button below to create your first form.
                    </p>
                </div>
            ) : (
                <div className="forms-grid">
                    {forms.map((form, i) => (
                        <FormCard key={form.id} form={form} />
                    ))}
                </div>
            )}

            <Link
                to="/forms/new"
                id="fab-create-form"
                className="fab"
                title="Create new form"
                aria-label="Create new form"
            >
                +
            </Link>
        </div>
    );
}
