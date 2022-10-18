import { Link } from "@remix-run/react";

function Route() {
  return (
    <main>
      <h1 className="sr-only">Documents</h1>

      <Link to="documents/create">Create Document</Link>
    </main>
  );
}

export default Route;
