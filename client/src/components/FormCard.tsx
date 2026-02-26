import { Link } from "react-router-dom";

interface StubForm {
    id: string;
    title: string;
    description?: string | null;
    createdAt: string;
}

const ACCENT_COLORS = [
    "var(--color-accent)",
    "var(--color-primary)",
    "#009688",
    "#e91e63",
    "#ff9800",
    "#4caf50",
];

const STRIPE_COLORS = [
    "#ff9800",
    "var(--color-primary)",
    "#26a69a",
    "#ec407a",
    "#ffa726",
    "#66bb6a",
];



interface FormCardProps {
    form: StubForm;
    index?: number;
}

export function FormCard({ form, index = 0 }: FormCardProps) {
    const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];
    const stripe = STRIPE_COLORS[index % STRIPE_COLORS.length];

    const formattedDate = new Date(form.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return (
        <div className="form-card">
            <div
                className="form-card__thumb"
                style={{ background: `${accent}18` }}
            >
                <div
                    className="form-card__thumb-stripe"
                    style={{ background: stripe }}
                />
            </div>

            <div className="form-card__body">
                <p className="form-card__title" title={form.title}>
                    {form.title}
                </p>
                {form.description && (
                    <p className="form-card__date" style={{ fontStyle: "italic" }}>
                        {form.description}
                    </p>
                )}
                <p className="form-card__date">Opened {formattedDate}</p>
            </div>

            <div className="form-card__actions">
                <Link
                    to={`/forms/${form.id}/fill`}
                    className="btn btn--ghost btn--sm"
                    title="Fill out this form"
                >
                    Fill
                </Link>
                <Link
                    to={`/forms/${form.id}/responses`}
                    className="btn btn--ghost btn--sm"
                    title="View responses"
                >
                    Responses
                </Link>
            </div>
        </div>
    );
}
