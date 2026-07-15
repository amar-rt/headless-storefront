export default function ErrorState({ message = "Something went wrong." }: { message?: string }) {
  return (
    <div className="state state-error" role="alert">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5" strokeLinecap="round" />
        <circle cx="12" cy="16" r="0.75" fill="currentColor" stroke="none" />
      </svg>
      <span>{message}</span>
    </div>
  );
}
