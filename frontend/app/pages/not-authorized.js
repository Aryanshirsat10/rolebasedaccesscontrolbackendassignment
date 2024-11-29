// pages/not-authorized.js
export default function NotAuthorized() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold">Access Denied</h1>
                <p>You must be an admin to view this page.</p>
            </div>
        </div>
    );
}
