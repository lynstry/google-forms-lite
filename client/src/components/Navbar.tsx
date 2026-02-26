import { Link } from "react-router-dom";

export function Navbar() {
    return (
        <header className="navbar">
            <Link to="/" className="navbar__logo">
                <svg className="navbar__logo-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="48" height="48" rx="4" fill="#7248bd" />
                    <rect x="12" y="13" width="24" height="3" rx="1.5" fill="white" />
                    <rect x="12" y="20" width="20" height="3" rx="1.5" fill="white" />
                    <rect x="12" y="27" width="16" height="3" rx="1.5" fill="white" />
                    <rect x="12" y="34" width="12" height="3" rx="1.5" fill="white" />
                </svg>
                <span className="navbar__logo-text">
                    Forms <span>Lite</span>
                </span>
            </Link>

            <div className="navbar__spacer" />
        </header>
    );
}
