'use client';

export default function SkeletonCard() {
  return (
    <div className="skeleton">
      <div className="skel-bar" />
      <div className="skel-body">
        <div className="skel-line w40" />
        <div className="skel-line w100" />
        <div className="skel-line w70" />
        <div className="skel-line h4" />
        <div className="skel-line w100" />
        <div className="skel-line w100" />
      </div>
    </div>
  );
}
