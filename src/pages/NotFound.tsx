import { Link } from "../router/Router";

export default function NotFound() {
  return (
    <div className="page container not-found">
      <h1>Page not found</h1>
      <p>
        <Link to="/">Back home</Link>
      </p>
    </div>
  );
}
