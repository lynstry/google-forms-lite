import { Routes, Route } from "react-router-dom";
import "./index.css";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { FormBuilderPage } from "./pages/FormBuilderPage";
import { FormFillerPage } from "./pages/FormFillerPage";
import { FormResponsesPage } from "./pages/FormResponsesPage";

function App() {
    return (
        <div className="app-layout">
            <Navbar />

            <main>
                <Routes>
                    {/* Homepage — list of all forms */}
                    <Route path="/" element={<HomePage />} />

                    {/* Form Builder — create a new form */}
                    <Route path="/forms/new" element={<FormBuilderPage />} />

                    {/* Form Filler — fill out an existing form */}
                    <Route path="/forms/:id/fill" element={<FormFillerPage />} />

                    {/* Form Responses — view all responses for a form */}
                    <Route path="/forms/:id/responses" element={<FormResponsesPage />} />

                    {/* 404 fallback */}
                    <Route
                        path="*"
                        element={
                            <div className="page-content">
                                <div className="empty-state">
                                    <div className="empty-state__icon">🔍</div>
                                    <p className="empty-state__title">Page not found</p>
                                    <p className="empty-state__subtitle">
                                        The page you're looking for doesn't exist.
                                    </p>
                                    <a href="/" className="btn btn--accent">
                                        ← Back to Forms
                                    </a>
                                </div>
                            </div>
                        }
                    />
                </Routes>
            </main>
        </div>
    );
}

export default App;
