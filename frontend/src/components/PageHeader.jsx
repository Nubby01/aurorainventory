export default function PageHeader({ eyebrow, title, lead, actions }) {
  return (
    <div className="page__intro page__intro--row">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
        {lead ? <p className="page__lead">{lead}</p> : null}
      </div>
      {actions ? <div className="page__actions">{actions}</div> : null}
    </div>
  );
}
