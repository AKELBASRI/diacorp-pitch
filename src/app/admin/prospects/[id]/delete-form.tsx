'use client';

export function DeleteForm({
  id,
  action
}: {
  id: number;
  action: (formData: FormData) => void;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm('Supprimer ce prospect définitivement ?')) e.preventDefault();
      }}
    >
      <input type="hidden" name="__id" value={id} />
      <button type="submit" className="btn btn-danger">
        Delete
      </button>
    </form>
  );
}
